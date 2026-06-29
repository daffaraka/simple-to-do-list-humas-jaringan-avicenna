import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);
  
  // Clear existing tasks and non-admin users
  await prisma.checklist.deleteMany({});
  await prisma.taskLabel.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        not: 'admin@gmail.com'
      }
    }
  });

  // Seed Admin
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Super Admin',
      password: hashedPassword,
      department: 'admin',
    },
  });

  const userData = [
    { name: 'Tiara Novianti Outri Fadia (Jagakarsa)', email: 'tiara.novianti@gmail.com', department: 'humas' },
    { name: 'Sinta J. Kartika (Cinere)', email: 'sinta.j@gmail.com', department: 'humas' },
    { name: 'Rafi Fadillah Rachmat (Jagakarsa)', email: 'rafi.fadillah@gmail.com', department: 'humas' },
    { name: 'Aisyah Nurjannah (Cinere)', email: 'aisyah.nurjannah@gmail.com', department: 'humas' },
    { name: 'Fikri Fadlu (Jagakarsa)', email: 'fikri.fadlu@gmail.com', department: 'jaringan' },
    { name: 'Fathul Umam (Cinere)', email: 'fathul.umam@gmail.com', department: 'jaringan' },
    { name: 'Reza (Pamulang)', email: 'reza@gmail.com', department: 'jaringan' },
  ];

  const dbUsers = [];
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        department: u.department as any,
      },
    });
    dbUsers.push(user);
    console.log(`Seeded user: ${user.name}`);
  }

  // Seed Tasks (5 per user)
  const columns = ['new', 'progress', 'done'] as const;
  const priorities = ['low', 'medium', 'high'] as const;
  
  const startDate = new Date('2026-06-15T00:00:00Z');
  const endDate = new Date('2026-07-20T00:00:00Z');

  let taskCount = 0;
  for (const user of dbUsers) {
    for (let i = 1; i <= 5; i++) {
      const requestDate = randomDate(startDate, new Date('2026-06-25T00:00:00Z'));
      const dueDate = new Date(requestDate);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 2); // 2 to 15 days later

      const columnId = columns[Math.floor(Math.random() * columns.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];

      await prisma.task.create({
        data: {
          title: `Tugas ${i} untuk ${user.name.split(' ')[0]}`,
          description: `Ini adalah deskripsi otomatis untuk tugas ${i}. Tolong diselesaikan sebelum tenggat waktu.`,
          picId: user.id,
          department: user.department,
          requestDate,
          dueDate,
          priority,
          columnId,
          position: i,
          checklists: {
            create: [
              { text: 'Langkah pertama', completed: Math.random() > 0.5 },
              { text: 'Langkah kedua', completed: Math.random() > 0.5 },
            ]
          }
        }
      });
      taskCount++;
    }
  }

  console.log(`Seeded ${taskCount} tasks successfully`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
