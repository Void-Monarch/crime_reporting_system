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

/* ============================
   Report Queries
=============================== */
export async function getAllReports() {
    return await prisma.report.findMany({
        include: {
            reporter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export async function getReportById(id: string) {
    return await prisma.report.findUnique({
        where: { id },
        include: {
            reporter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    city: true,
                    state: true,
                }
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            role: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            mediaAttachments: true,
        }
    });
}


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

export async function getAllUsers() {
    return await prisma.user.findMany();
}

export async function updateUser(id: string, data: User) {
    return await prisma.user.update({
        where: { id },
        data: { ...data },
    });
}

export async function updateUserAddhar(id: string, aadhaarNumber: User["aadhaarNumber"]) {
    return await prisma.user.update({
        where: { id },
        data: { aadhaarNumber },
    });
}