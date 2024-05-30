import { ApplicationServer } from "./shared/infrastructure/Server";
import { Container } from "./shared/infrastructure/Container";
import { PrismaClient } from "@prisma/client";

const container = new Container();
const server = container.invoke().resolve<ApplicationServer>("server");
const prismaClient = container.invoke().resolve<PrismaClient>("db");

server.start().catch(async (err: Error) => {
  await prismaClient.$disconnect();
  console.error(err);
  process.exit(1);
});
