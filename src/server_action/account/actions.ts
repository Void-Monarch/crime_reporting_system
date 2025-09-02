"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

const updateUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    aadhaarNumber: z.string().optional(),
    postalCode: z.string().optional(),
});

export type UpdateUserFormType = z.infer<typeof updateUserSchema>;

export async function updateUserForm(formData: UpdateUserFormType) {
    try {
        // Validate data
        const validatedData = updateUserSchema.parse(formData);
        const { id, ...updateData } = validatedData;

        // Filter out undefined values to avoid overwriting with undefined
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([, value]) => value !== undefined)
        );

        // Update user in database
        const result = await prisma.user.update({
            where: { id },
            data: filteredData,
        });

        // Revalidate the users page
        revalidatePath("/account/profile");

        return { success: true, user: result };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors };
        }

        return { success: false, error: `Failed to update user ${error}` };
    }
}
