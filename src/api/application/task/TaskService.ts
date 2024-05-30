import { ITaskRepository } from "../../domain/task/ITaskRepository";
import { CreateTaskDto, PatchTaskStatusDto } from "./TaskDto";

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  public async create(dto: CreateTaskDto) {
    return this.taskRepository.create(dto.title, dto.description, dto.status);
  }

  public async findAll(status?: string) {
    return this.taskRepository.findAll(status);
  }

  public async findOne(id: string) {
    return this.taskRepository.findOne(id);
  }

  public async patchStatus(dto: PatchTaskStatusDto) {
    return this.taskRepository.patchStatus(dto.id, dto.status);
  }
}
