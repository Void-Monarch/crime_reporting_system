"use server";

import { z } from "zod";
import { prisma } from "@/prisma/prisma";
import { ReportType, Priority } from "@prisma/client";

const crimeReportSchema = z.object({
    // Reporter information
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    anonymous: z.boolean().default(false).optional(),

    // Incident details
    incidentDate: z.date(),
    incidentTime: z.string().optional(),
    incidentLocationState: z.string(),
    incidentLocationCity: z.string(),
    incidentLocationPostalCode: z.string(),
    incidentLocationAddress: z.string(),
    currentLocation: z.boolean().default(false),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    crimeType: z.string(),
    incidentDescription: z.string(),
    incidentTitle: z.string(),
    severity: z.string(),

    // Suspect information
    suspectDescription: z.string().optional(),

    // Witness information
    witnessPresent: z.boolean().default(false),
    witnessDetails: z.string().optional(),

    // Evidence
    hasEvidence: z.boolean().default(false),
    evidenceDescription: z.string().optional(),

    // Consent
    consent: z.boolean(),
});

export type CrimeReportType = z.infer<typeof crimeReportSchema>;

export async function submitCrimeReport(userid: string, formData: CrimeReportType) {
    try {
        // Validate the form data
        const validatedData = crimeReportSchema.parse(formData);
        const {
            anonymous,
            incidentDate,
            incidentTime,
            incidentLocationState,
            incidentLocationCity,
            incidentLocationPostalCode,
            incidentLocationAddress,

            latitude,
            longitude,
            crimeType,
            incidentDescription,
            incidentTitle,
            severity,

            // Suspect information
            suspectDescription,

            witnessDetails,

            evidenceDescription,

        } = validatedData;


        const reportData = {
            title: incidentTitle,
            description: incidentDescription,
            location: {
                state: incidentLocationState,
                city: incidentLocationCity,
                postalCode: incidentLocationPostalCode,
                address: incidentLocationAddress,
                coordinates: {
                    coordinates: [Number?.parseFloat(latitude!), Number?.parseFloat(longitude!)]
                }
            },
            reportType: crimeType as ReportType,
            priority: severity as Priority,
            incidentDate: incidentDate,
            incidentTime: incidentTime,
            witnesses: witnessDetails,
            suspects: suspectDescription,
            evidence: evidenceDescription,
            reporterId: anonymous ? null : userid,
            anonymous: anonymous,
        };

        const report = await prisma.report.create({
            data: reportData
        });


        // 2. Send notifications if necessary
        // 3. Generate a report ID or reference number

        // Mock a successful response
        return {
            success: true,
            message: "Crime report submitted successfully",
            reportId: `${report.id}`,
        };
    } catch (error) {
        console.error(`Error submitting crime report: ${error}`);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to submit report",
        };
    }
}

// Get report by ID for user (only their own reports)
export async function getReportByIdForUser(reportId: string, userId: string) {
    try {
        const report = await prisma.report.findFirst({
            where: {
                id: reportId,
                reporterId: userId
            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                mediaAttachments: true
            }
        });

        return report;
    } catch (error) {
        console.error("Error fetching report:", error);
        return null;
    }
}

// Withdraw report (set status to REJECTED)
export async function withdrawReport(reportId: string, userId: string) {
    try {
        // First check if the user owns this report and it's not already closed/resolved/rejected
        const report = await prisma.report.findFirst({
            where: {
                id: reportId,
                reporterId: userId,
                status: {
                    notIn: ['RESOLVED', 'CLOSED', 'REJECTED']
                }
            }
        });

        if (!report) {
            return {
                success: false,
                error: "Report not found or cannot be withdrawn"
            };
        }

        // Update the report status to REJECTED
        await prisma.report.update({
            where: {
                id: reportId
            },
            data: {
                status: 'REJECTED',
                updatedAt: new Date()
            }
        });

        return {
            success: true,
            message: "Report withdrawn successfully"
        };
    } catch (error) {
        console.error("Error withdrawing report:", error);
        return {
            success: false,
            error: "Failed to withdraw report"
        };
    }
}