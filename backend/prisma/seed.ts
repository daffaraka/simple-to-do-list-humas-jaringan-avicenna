import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  // Clear existing data
  await prisma.notification.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.checklist.deleteMany({});
  await prisma.taskLabel.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.kpi.deleteMany({});
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

  // 4. Seed Real KPIs
  const kpiData = [
    // KPI HUMAS
    {
      title: 'Peningkatan Engagement Sosial Media',
      description: 'Meningkatkan interaksi dan pengikut di Instagram, Facebook, dan platform sosial media lainnya sebesar 30%.',
      department: 'humas',
      targetDate: new Date('2026-12-31T00:00:00Z'),
    },
    {
      title: 'Publikasi Layanan & Event Baru',
      description: 'Memastikan setiap layanan baru dan event perusahaan dipublikasikan tepat waktu di semua kanal komunikasi.',
      department: 'humas',
      targetDate: new Date('2026-08-31T00:00:00Z'),
    },
    {
      title: 'Manajemen Komplain & Kepuasan Pelanggan',
      description: 'Menangani komplain dengan SLA di bawah 24 jam dan meningkatkan skor kepuasan pelanggan.',
      department: 'humas',
      targetDate: new Date('2026-10-31T00:00:00Z'),
    },
    {
      title: 'Program CSR (Corporate Social Responsibility)',
      description: 'Menyelenggarakan minimal 3 program CSR berdampak positif bagi lingkungan sekitar pada tahun ini.',
      department: 'humas',
      targetDate: new Date('2026-12-31T00:00:00Z'),
    },
    // KPI JARINGAN
    {
      title: 'Pencapaian SLA Jaringan 99.9%',
      description: 'Memastikan ketersediaan dan uptime jaringan di seluruh cabang (Jagakarsa, Cinere, Pamulang) mencapai 99.9%.',
      department: 'jaringan',
      targetDate: new Date('2026-12-31T00:00:00Z'),
    },
    {
      title: 'Implementasi Sistem Keamanan Jaringan',
      description: 'Penerapan firewall baru dan audit keamanan jaringan secara menyeluruh untuk mencegah peretasan.',
      department: 'jaringan',
      targetDate: new Date('2026-09-30T00:00:00Z'),
    },
    {
      title: 'Upgrade Infrastruktur & Bandwidth',
      description: 'Melakukan peremajaan perangkat router/switch dan peningkatan kapasitas bandwidth di cabang padat.',
      department: 'jaringan',
      targetDate: new Date('2026-07-31T00:00:00Z'),
    },
    {
      title: 'Maintenance Server Rutin',
      description: 'Melakukan pemeliharaan server fisik dan virtual (backup, patching, cleaning) secara berkala tiap bulan.',
      department: 'jaringan',
      targetDate: new Date('2026-12-31T00:00:00Z'),
    }
  ];

  let kpiCount = 0;
  for (const k of kpiData) {
    // Find a random user in that department to assign as PIC for the KPI
    const deptUsers = dbUsers.filter(u => u.departmentId === getDept(k.department));
    if (deptUsers.length === 0) continue;
    
    // Assign to a random user from the department
    const assignedUser = deptUsers[Math.floor(Math.random() * deptUsers.length)];

    await prisma.kpi.create({
      data: {
        title: k.title,
        description: k.description,
        userId: assignedUser.id,
        departmentId: getDept(k.department),
        targetDate: k.targetDate,
      }
    });
    kpiCount++;
  }

  console.log(`Seeded ${kpiCount} realistic KPIs successfully. Tasks and Boards skipped as requested.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
