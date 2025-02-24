import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Function API GET Method call to fetch all users
  try {
    const users = await prisma.user.findMany();
    await new Promise(resolve => setTimeout(resolve, 5000));
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}