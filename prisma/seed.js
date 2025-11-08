const { PrismaClient } = require ('../generated/prisma')
const bcrypt = require('bcryptjs'); // Importamos bcryptjs
const prisma = new PrismaClient();

async function main() {
  // Encriptar contraseñas antes de guardarlas
  const hashedAdminPassword = await bcrypt.hash('123456', 10);
  const hashedUserPassword = await bcrypt.hash('abcdef', 10);

   // 1️⃣ Crear usuarios
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      rol: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedUserPassword,
      rol: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '123456',
      rol: 'USER',
    },
  });

  // 2️⃣ Crear bloques de tiempo
  const timeBlock1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-10-28T08:00:00Z'),
      endTime: new Date('2025-10-28T09:00:00Z'),
    },
  });

  const timeBlock2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-10-28T09:00:00Z'),
      endTime: new Date('2025-10-28T10:00:00Z'),
    },
  });

  const timeBlock3 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-10-28T10:00:00Z'),
      endTime: new Date('2025-10-28T11:00:00Z'),
    },
  });

  // 3️⃣ Crear citas (appointments)
  await prisma.appointment.createMany({
    data: [
      {
        date: new Date('2025-10-28'),
        userId: user1.id,
        timeBlockId: timeBlock1.id,
      },
      {
        date: new Date('2025-10-28'),
        userId: user2.id,
        timeBlockId: timeBlock2.id,
      },
      {
        date: new Date('2025-10-29'),
        userId: admin.id,
        timeBlockId: timeBlock3.id,
      },
    ],
  });

  console.log('✅ Seed completed successfully with hashed passwords!');
}

// Manejamos la conexión y los errores
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error in seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

