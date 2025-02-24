import { prisma } from "../prisma/prisma"


/* ============================
   User Queries
=============================== */
export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: { id },
    });
};
