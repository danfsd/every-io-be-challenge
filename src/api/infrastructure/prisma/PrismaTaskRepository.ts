import { $Enums, PrismaClient, Task, TaskStatus } from "@prisma/client";
import { ITaskRepository } from "../../domain/task/ITaskRepository";

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private db: PrismaClient) {}

  public async create(title: string, description: string, status: TaskStatus) {
    const result = await this.db.task.create({
      data: {
        title,
        description,
        status,
      },
      select: {
        id: true,
      },
    });

    return result.id;
  }

  public async findAll(status?: TaskStatus) {
    return this.db.task.findMany({
      where: {
        ...(status ? { status } : {}),
      },
    });
  }

  public async findOne(id: string) {
    return this.db.task.findUnique({ where: { id } });
  }

  public async patchStatus(
    id: string,
    newStatus: $Enums.TaskStatus
  ): Promise<void> {
    await this.db.task.update({
      data: {
        status: newStatus,
      },
      where: {
        id,
      },
    });
  }
}
