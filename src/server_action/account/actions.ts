// @ts-nocheck

"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateUser } from "../../lib/data_queries";


const updateUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
});

export async function updateUserForm(formData: FormData) {
    try {
        // Validate data
        const validatedData = updateUserSchema.parse(formData);
        const { id, name, phone, state, city, postalCode } = validatedData;
        const data = { name, phone, state, city, postalCode };




        // Update user in database
        const result = await updateUser(id, data);


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
