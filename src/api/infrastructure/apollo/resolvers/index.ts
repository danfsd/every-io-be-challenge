import {
  Task as PrismaTask,
  TaskStatus as PrismaTaskStatus,
  User as PrismaUser,
  UserPermission as PrismaUserPermission,
  UserPermission,
} from "@prisma/client";
import {
  Resolvers,
  Task as GqlTask,
  TaskStatus as GqlTaskStatus,
  User as GqlUser,
  UserPermission as GqlUserPermission,
} from "../../../../shared/infrastructure/apollo/graphql-schema";
import { IExpressContext } from "../../../../shared/infrastructure/apollo/IExpressContext";
import { TaskService } from "../../../application/task/TaskService";
import { UserService } from "../../../../shared/application/user/UserService";
import {
  CreateTaskDto,
  PatchTaskStatusDto,
} from "../../../application/task/TaskDto";
import { AuthService } from "../../../../shared/application/auth/AuthService";
import ILogger from "../../../../shared/domain/ILogger";
import { GraphQLError } from "graphql";

export default function (
  logger: ILogger,
  taskService: TaskService,
  userService: UserService,
  authService: AuthService
): Resolvers {
  const mapPrismaTaskToGraphQl = (prismaTask: PrismaTask): GqlTask => ({
    id: prismaTask.id,
    title: prismaTask.title,
    description: prismaTask.description,
    status: prismaTask.status as GqlTaskStatus,
  });

  const mapPrismaUserToGraphQL = (
    prismaUser: Omit<PrismaUser, "password">
  ): GqlUser => ({
    id: prismaUser.id,
    email: prismaUser.email,
    permission: prismaUser.permission as GqlUserPermission,
  });

  const guardResolver = (
    context: IExpressContext,
    allowedPermissions?: UserPermission[]
  ) => {
    if (!context.verifiedJwt)
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });

    if (allowedPermissions) {
      if (
        !allowedPermissions.includes(
          context.verifiedJwt.permission as UserPermission
        )
      ) {
        throw new GraphQLError("User is not authorized", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 403 },
          },
        });
      }
    }
  };

  const resolvers: Resolvers<IExpressContext> = {
    Query: {
      tasks: async (_, { status }, context) => {
        guardResolver(context, [
          UserPermission.READ,
          UserPermission.READ_WRITE,
        ]);

        const tasks = await taskService.findAll(status as PrismaTaskStatus);

        return tasks.map(mapPrismaTaskToGraphQl);
      },
      taskByPk: async (_, { id }, context) => {
        guardResolver(context, [
          UserPermission.READ,
          UserPermission.READ_WRITE,
        ]);

        const task = await taskService.findOne(id);

        return task ? mapPrismaTaskToGraphQl(task) : null;
      },
    },
    Mutation: {
      insertTask: async (_, { input }, context) => {
        guardResolver(context, [UserPermission.READ_WRITE]);

        const createTaskDto = new CreateTaskDto();
        createTaskDto.title = input.title;
        createTaskDto.description = input.description;
        createTaskDto.status = input.status;

        const taskId = await taskService.create(createTaskDto);

        const task = await taskService.findOne(taskId);

        return task ? mapPrismaTaskToGraphQl(task) : null;
      },
      updateTaskStatus: async (_, { id, newStatus }, context) => {
        guardResolver(context, [UserPermission.READ_WRITE]);

        const patchStatusDto = new PatchTaskStatusDto();
        patchStatusDto.id = id;
        patchStatusDto.status = newStatus;

        await taskService.patchStatus(patchStatusDto);

        const task = await taskService.findOne(id);

        return task ? mapPrismaTaskToGraphQl(task) : null;
      },
      insertUser: async (_, { input }, context) => {
        guardResolver(context, [UserPermission.READ_WRITE]);

        const user = await userService.createUser(
          input.email,
          input.password,
          input.permission
        );

        return user ? mapPrismaUserToGraphQL(user) : null;
      },
      authenticateUser: async (_, { email, password }, { response }) => {
        const jwtOrNull = await authService.authenticate(email, password);

        if (!jwtOrNull) return null;

        response.setHeader("Authorization", jwtOrNull);

        return { jwt: jwtOrNull };
      },
    },
  };

  return resolvers;
}
