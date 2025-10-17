const { PrismaClient } = require ('../generated/prisma')
const bcrypt = require('bcryptjs'); // Importamos bcryptjs
const prisma = new PrismaClient();

async function main() {
  // Encriptar contraseñas antes de guardarlas
  const hashedAdminPassword = await bcrypt.hash('123456', 10);
  const hashedUserPassword = await bcrypt.hash('abcdef', 10);

  // Crear o actualizar usuario ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedAdminPassword, // Guardamos la contraseña encriptada
      rol: 'ADMIN',
    },
  });

  // Crear o actualizar usuario normal
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedUserPassword,
      rol: 'USER',
    },
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