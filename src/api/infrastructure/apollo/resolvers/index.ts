import {
  Task as PrismaTask,
  TaskStatus as PrismaTaskStatus,
} from "@prisma/client";
import {
  Resolvers,
  Task as GqlTask,
  TaskStatus as GqlTaskStatus,
} from "../../../../shared/infrastructure/apollo/graphql-schema";
import { PrismaTaskRepository } from "../../prisma/PrismaTaskRepository";
import { IExpressContext } from "../../../../shared/infrastructure/apollo/IExpressContext";

export default function (taskRepository: PrismaTaskRepository): Resolvers {
  const mapPrismaTaskToGraphQl = (prismaTask: PrismaTask): GqlTask => ({
    id: prismaTask.id,
    title: prismaTask.title,
    description: prismaTask.description,
    status: prismaTask.status as GqlTaskStatus,
  });

  const resolvers: Resolvers<IExpressContext> = {
    Query: {
      tasks: async (_, { status }) => {
        const tasks = await taskRepository.findAll(status as PrismaTaskStatus);

        return tasks.map(mapPrismaTaskToGraphQl);
      },
      taskByPk: async (_, { id }) => {
        const task = await taskRepository.findOne(id);

        return task ? mapPrismaTaskToGraphQl(task) : null;
      },
    },
    Mutation: {
      insertTask: async (_, { input }) => {
        const taskId = await taskRepository.create(
          input.title,
          input.description,
          input.status
        );

        const task = await taskRepository.findOne(taskId);

        return task ? mapPrismaTaskToGraphQl(task) : null;
      },
      updateTaskStatus: async (_, { id, newStatus }) => {
        await taskRepository.patchStatus(id, newStatus);

        const task = await taskRepository.findOne(id);

        return task ? mapPrismaTaskToGraphQl(task) : null;
      },
    },
  };

  return resolvers;
}
