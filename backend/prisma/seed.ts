import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  // Clear existing data
  await prisma.checklist.deleteMany({});
  await prisma.taskLabel.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.department.deleteMany({});

  // 1. Seed Roles
  const adminRole = await prisma.role.create({ data: { name: 'Admin' } });
  const staffRole = await prisma.role.create({ data: { name: 'Staff' } });

  // 2. Seed Departments
  const deptAdmin = await prisma.department.create({ data: { name: 'Admin' } });
  const deptHumas = await prisma.department.create({ data: { name: 'Humas' } });
  const deptJaringan = await prisma.department.create({ data: { name: 'Jaringan' } });

  const getDept = (name: string) => {
    if (name === 'admin') return deptAdmin.id;
    if (name === 'humas') return deptHumas.id;
    return deptJaringan.id;
  }

  // 3. Seed Users
  const userData = [
    { name: 'Super Admin', email: 'admin@gmail.com', department: 'admin', roleId: adminRole.id },
    { name: 'Tiara Novianti Outri Fadia (Jagakarsa)', email: 'tiara.novianti@gmail.com', department: 'humas', roleId: staffRole.id },
    { name: 'Sinta J. Kartika (Cinere)', email: 'sinta.j@gmail.com', department: 'humas', roleId: staffRole.id },
    { name: 'Rafi Fadillah Rachmat (Jagakarsa)', email: 'rafi.fadillah@gmail.com', department: 'humas', roleId: staffRole.id },
    { name: 'Aisyah Nurjannah (Cinere)', email: 'aisyah.nurjannah@gmail.com', department: 'humas', roleId: staffRole.id },
    { name: 'Fikri Fadlu (Jagakarsa)', email: 'fikri.fadlu@gmail.com', department: 'jaringan', roleId: staffRole.id },
    { name: 'Fathul Umam (Cinere)', email: 'fathul.umam@gmail.com', department: 'jaringan', roleId: staffRole.id },
    { name: 'Reza (Pamulang)', email: 'reza@gmail.com', department: 'jaringan', roleId: staffRole.id },
  ];

  const dbUsers = [];
  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        departmentId: getDept(u.department),
        roleId: u.roleId,
      },
    });
    dbUsers.push(user);
    console.log(`Seeded user: ${user.name}`);
  }

  // Seed Tasks (5 per user)
  const columns = ['new', 'progress', 'done'] as const;
  const priorities = ['low', 'medium', 'high'] as const;

  const startDate = new Date('2026-06-15T00:00:00Z');

  let taskCount = 0;
  for (const user of dbUsers) {
    // Create a default board for this user
    const board = await prisma.board.create({
      data: {
        title: `Proyek Utama ${user.name.split(' ')[0]}`,
        description: `Board default untuk ${user.name}`,
        userId: user.id,
        departmentId: user.departmentId,
      }
    });

    for (let i = 1; i <= 5; i++) {
      const requestDate = randomDate(startDate, new Date('2026-06-25T00:00:00Z'));
      const dueDate = new Date(requestDate);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 2);

      const columnId = columns[Math.floor(Math.random() * columns.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];

      await prisma.task.create({
        data: {
          title: `Tugas ${i} untuk ${user.name.split(' ')[0]}`,
          description: `Ini adalah deskripsi otomatis untuk tugas ${i}. Tolong diselesaikan sebelum tenggat waktu.`,
          picId: user.id,
          departmentId: user.departmentId,
          requestDate,
          dueDate,
          priority,
          columnId,
          boardId: board.id,
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
