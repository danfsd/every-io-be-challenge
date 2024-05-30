import { Task } from "@prisma/client";

export interface ITaskRepository {
  create(title: string, description: string, status: string): Promise<string>;
  findAll(status?: string): Promise<Task[]>;
  findOne(id: string): Promise<Task | null>;
  patchStatus(id: string, newStatus: string): Promise<void>;
}
