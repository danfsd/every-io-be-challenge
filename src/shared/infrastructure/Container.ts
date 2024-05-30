import {
  AwilixContainer,
  InjectionMode,
  asClass,
  asFunction,
  asValue,
  createContainer,
} from "awilix";
import { ApplicationServer } from "./Server";
import config from "../../../config";
import Router from "./Router";
import ServerLogger from "./logger";
import { createPrismaClient } from "./prisma";
import { ApiRouter } from "../../api/infrastructure/express/router";
import {
  HealthCheckController,
  TaskController,
} from "../../api/infrastructure/express/controllers";
import { HealthCheckService } from "../../api/application/healthcheck/HealthCheckService";
import { TaskService } from "../../api/application/task/TaskService";
import { PrismaTaskRepository } from "../../api/infrastructure/prisma/PrismaTaskRepository";
import apolloResolvers from "../../api/infrastructure/apollo/resolvers";
import { UserService } from "../application/user/UserService";
import { AuthService } from "../application/auth/AuthService";
import { PrismaUserRepository } from "../../api/infrastructure/prisma/PrismaUserRepository";

export class Container {
  private readonly container: AwilixContainer;

  constructor() {
    this.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });

    this.register();
  }

  public register() {
    this.container
      .register({
        server: asClass(ApplicationServer).singleton(),
        config: asValue(config),
        router: asFunction(Router).singleton(),
        logger: asClass(ServerLogger).singleton(),
        db: asFunction(createPrismaClient).singleton(),
      })
      .register({
        apiRouter: asFunction(ApiRouter).singleton(),
      })
      .register({
        resolvers: asFunction(apolloResolvers).singleton(),
      })
      .register({
        healthCheckController: asClass(HealthCheckController).singleton(),
        healthCheckService: asClass(HealthCheckService).singleton(),
      })
      .register({
        userService: asClass(UserService).singleton(),
        authService: asClass(AuthService).singleton(),
        userRepository: asClass(PrismaUserRepository).singleton(),
      })
      .register({
        taskController: asClass(TaskController).singleton(),
        taskService: asClass(TaskService).singleton(),
        taskRepository: asClass(PrismaTaskRepository).singleton(),
      });
  }

  public invoke(): AwilixContainer {
    return this.container;
  }
}
