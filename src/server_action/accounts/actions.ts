"use server";

import { z } from "zod";

// Define the schema for crime reports
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
    incidentLocationPostalCode: z.number().int(),
    incidentLocationAddress: z.string(),
    currentLocation: z.boolean().default(false),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    crimeType: z.string(),
    incidentDescription: z.string(),
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

export async function submitCrimeReport(formData: CrimeReportType) {
    try {
        // Validate the form data
        const validatedData = crimeReportSchema.parse(formData);

        // Here you would typically:
        // 1. Store the data in a database
        // 2. Send notifications if necessary
        // 3. Generate a report ID or reference number

        console.log("Crime report received:", validatedData);

        // Mock a successful response
        return {
            success: true,
            message: "Crime report submitted successfully",
            reportId: `CR-${Date.now().toString().slice(-6)}`,
        };
    } catch (error) {
        console.error("Error submitting crime report:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to submit report",
        };
    }
}

