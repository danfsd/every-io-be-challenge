import { Task, TaskStatus } from "@prisma/client";

export interface ITaskRepository {
  create(title: string, description: string, status: string): Promise<string>;
  findAll(): Promise<Task[]>;
  findOne(id: string): Promise<Task | null>;
  patchStatus(id: string, newStatus: string): Promise<void>;
}
