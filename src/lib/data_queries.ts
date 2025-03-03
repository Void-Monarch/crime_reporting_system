import { prisma } from "../prisma/prisma"
import { Report, User } from "@prisma/client"

/* ============================
   User Queries
=============================== */
export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: { id },
    });
};


export async function createReport(data: Report) {
    return await prisma.report.create({
        data: data,
    });
}

export async function getReportByUserId(id: string) {
    return await prisma.report.findMany({
        where: { reporterId: id },
    });
}

export async function updateUser(id: string, data: User) {
    return await prisma.user.update({
        where: { id },
        data: { ...data },
    });
}