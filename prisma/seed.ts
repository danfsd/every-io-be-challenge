import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@every.io" },
    update: {},
    create: {
      email: "admin@every.io",
      password: bcrypt.hashSync("123456", 10),
      permission: "READ_WRITE",
    },
    select: { id: true },
  });

  console.log(`Created admin`, admin);

  console.log("Seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: Error) => {
    console.error(error.message);
    await prisma.$disconnect();
    process.exit(1);
  });
