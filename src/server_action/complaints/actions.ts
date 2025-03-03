// @ts-nocheck
"use server";

import { z } from "zod";
import { createReport } from "@/lib/data_queries";

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


        const formatedData = {
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
            reportType: crimeType,
            priority: severity,
            incidentDate: incidentDate,
            incidentTime: incidentTime,
            witnesses: witnessDetails,
            suspects: suspectDescription,
            evidence: evidenceDescription,
            anonymous: anonymous,
        };

        const formatedDataWithID = {
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
            reportType: crimeType,
            priority: severity,
            incidentDate: incidentDate,
            incidentTime: incidentTime,
            witnesses: witnessDetails,
            suspects: suspectDescription,
            evidence: evidenceDescription,
            reporterId: userid,
            anonymous: anonymous,
        }

        let report;
        if (anonymous) {
            report = await createReport(formatedData);
        } else {
            report = await createReport(formatedDataWithID);
        }


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