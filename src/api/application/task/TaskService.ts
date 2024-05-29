import { ITaskRepository } from "../../domain/task/ITaskRepository";
import { CreateTaskDto, PatchTaskStatusDto } from "./TaskDto";

export class TaskService {
  constructor(private repository: ITaskRepository) {}

  public async create(dto: CreateTaskDto) {
    return this.repository.create(dto.title, dto.description, dto.status);
  }

  public async findAll() {
    return this.repository.findAll();
  }

  public async findOne(id: string) {
    return this.repository.findOne(id);
  }

  public async patchStatus(dto: PatchTaskStatusDto) {
    return this.repository.patchStatus(dto.id, dto.status);
  }
}
