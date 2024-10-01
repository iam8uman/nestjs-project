import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash the passwords
  const hashedPassword1 = await bcrypt.hash('Mutton@Curry.com', 10);
  const hashedPassword2 = await bcrypt.hash('Chicken@Curry.com', 10);
  const hashedAdminPassword = await bcrypt.hash('Admin@Curry.com', 10);

  // Create two dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'Mutton@Curry.com' },
    update: {},
    create: {
      email: 'Mutton@Curry.com',
      password: hashedPassword1,
      name: 'Mutton Lover',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'Chicken@Curry.com' },
    update: {},
    create: {
      email: 'Chicken@Curry.com',
      password: hashedPassword2,
      name: 'Chicken Lover',
    },
  });

  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@curry.com' },
    update: {},
    create: {
      email: 'admin@curry.com',
      password: hashedAdminPassword,
      name: 'Admin User',
    },
  });

  console.log({ user1, user2, admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
