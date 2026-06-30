import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found");
    return;
  }
  console.log("User:", user.id, user.departmentId);
  
  try {
    const board = await prisma.board.create({
      data: {
        title: "Test Board",
        description: "Test Desc",
        userId: user.id,
        departmentId: user.departmentId,
        kpiId: undefined
      }
    });
    console.log("Board created:", board);
  } catch (err) {
    console.error("Error creating board:", err);
  }
}
main().finally(() => prisma.$disconnect());
