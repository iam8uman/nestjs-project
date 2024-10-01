// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy recipes
  const user1 = await prisma.user.upsert({
    where: { email: 'Mutton@Curry.com' },
    update: {},
    create: {
      email: 'Mutton@Curry.com',
      password: 'Mutton@Curry.com',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'Chicken@Curry.com' },
    update: {},
    create: {
      email: 'Chicken@Curry.com',
      password: 'Chicken@Curry.com',
    },
  });

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
