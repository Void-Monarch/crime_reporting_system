import { prisma } from "../prisma/prisma"


/* ============================
   User Queries
=============================== */
export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            Customer: true,
            Order: true,
            Supplier: true,
            Product: true,
        },
    });
};
