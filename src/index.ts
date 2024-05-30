import { ApplicationServer } from "./shared/infrastructure/Server";
import { Container } from "./shared/infrastructure/Container";
import { PrismaClient } from "@prisma/client";

// import config, { Configuration } from "./config";
// import { ApiRouter } from "./api/infrastructure/express/router";
// import ApplicationRouter from "./shared/infrastructure/Router";
// import ServerLogger from "./shared/infrastructure/logger";
// import {
//   HealthCheckController,
//   TaskController,
// } from "./api/infrastructure/express/controllers";
// import { HealthCheckService } from "./api/application/healthcheck/HealthCheckService";
// import { createPrismaClient } from "./shared/infrastructure/prisma";
// import { TaskService } from "./api/application/task/TaskService";
// import { PrismaTaskRepository } from "./api/infrastructure/prisma/PrismaTaskRepository";

const container = new Container();
const server = container.invoke().resolve<ApplicationServer>("server");
const prismaClient = container.invoke().resolve<PrismaClient>("db");

// const logger = new ServerLogger(config);
// const prismaClient = createPrismaClient();

// const healthCheckService = new HealthCheckService();
// const healthCheckController = new HealthCheckController(healthCheckService);

// const taskRepository = new PrismaTaskRepository(prismaClient);
// const taskService = new TaskService(taskRepository);
// const taskController = new TaskController(taskService, logger);

// const apiRouter = ApiRouter(healthCheckController, taskController);

// const server = new ApplicationServer(
//   ApplicationRouter(apiRouter),
//   logger,
//   config
// );

server.start().catch(async (err: Error) => {
  await prismaClient.$disconnect();
  console.error(err);
  process.exit(1);
});
