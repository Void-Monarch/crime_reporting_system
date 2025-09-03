"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

const updateUserByAdminSchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    role: z.enum(["ADMIN", "POLICE_OFFICER", "INVESTIGATOR", "CITIZEN"]),
});

const updateReportByAdminSchema = z.object({
    title: z.string(),
    description: z.string(),
    reportType: z.enum(["THEFT", "ASSAULT", "VANDALISM", "FRAUD", "BURGLARY", "MISSING_PERSON", "DOMESTIC_VIOLENCE", "ACCIDENT", "DRUG_RELATED", "OTHER"]),
    status: z.enum(["SUBMITTED", "UNDER_REVIEW", "INVESTIGATING", "RESOLVED", "CLOSED", "REJECTED"]),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]),
    location: z.object({
        address: z.string().optional(),
        city: z.string(),
        state: z.string(),
        country: z.string().default("India"),
        postalCode: z.string().optional(),
        landmark: z.string().optional(),
        coordinates: z.object({
            type: z.string().default("Point"),
            coordinates: z.array(z.number()).length(2), // [longitude, latitude]
        }).optional().nullable(),
    }),
});

const addCommentSchema = z.object({
    reportId: z.string(),
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
    isInternal: z.boolean().default(false),
});

export type UpdateUserByAdminType = z.infer<typeof updateUserByAdminSchema>;
export type UpdateReportByAdminType = z.infer<typeof updateReportByAdminSchema>;
export type AddCommentType = z.infer<typeof addCommentSchema>;

export async function updateUserByAdmin(formData: UpdateUserByAdminType) {
    try {
        // Validate data
        const validatedData = updateUserByAdminSchema.parse(formData);
        const { id, ...updateData } = validatedData;

        // Filter out undefined values to avoid overwriting with undefined
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([, value]) => value !== undefined)
        );

        // Update user in database using direct Prisma call
        const result = await prisma.user.update({
            where: { id },
            data: filteredData,
        });

        // Revalidate the users page
        revalidatePath("/menu/admin");
        revalidatePath(`/menu/admin/users/${id}`);

        return { success: true, user: result };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors };
        }

        console.error("Update user error:", error);
        return { success: false, error: `Failed to update user: ${error}` };
    }
}

export async function updateReportByAdmin(reportId: string, formData: UpdateReportByAdminType) {
    try {
        // Validate data
        const validatedData = updateReportByAdminSchema.parse(formData);

        // Update report in database using direct Prisma call
        const result = await prisma.report.update({
            where: { id: reportId },
            data: validatedData,
        });

        // Revalidate the reports pages
        revalidatePath("/menu/admin/reports");
        revalidatePath(`/menu/admin/reports/${reportId}`);

        return { success: true, report: result };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors };
        }

        console.error("Update report error:", error);
        return { success: false, error: `Failed to update report: ${error}` };
    }
}

export async function addCommentToReport(userId: string, formData: AddCommentType) {
    try {
        // Validate data
        const validatedData = addCommentSchema.parse(formData);
        const { reportId, content, isInternal } = validatedData;

        // Check if report exists
        const report = await prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            return { success: false, error: "Report not found" };
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                content,
                reportId,
                userId,
                isInternal,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            }
        });

        // Revalidate the report page
        revalidatePath(`/menu/admin/reports/${reportId}`);

        return { success: true, comment };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors };
        }

        console.error("Add comment error:", error);
        return { success: false, error: `Failed to add comment: ${error}` };
    }
}