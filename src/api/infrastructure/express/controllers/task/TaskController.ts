import { Request, Response } from "express";
import { TaskService } from "../../../../application/task/TaskService";
import {
  CreateTaskDto,
  PatchTaskStatusDto,
} from "../../../../application/task/TaskDto";
import {
  ValidationError,
  isUUID,
  validate,
  validateOrReject,
  validateSync,
} from "class-validator";
import { error } from "console";
import ILogger from "../../../../../shared/domain/ILogger";

export class TaskController {
  constructor(private service: TaskService, private logger: ILogger) {}

  public async create(req: Request, res: Response) {
    const createTaskDto = new CreateTaskDto();
    createTaskDto.title = req.body["title"];
    createTaskDto.description = req.body["description"];
    createTaskDto.status = req.body["status"];
    try {
      validate(createTaskDto);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: (error as ValidationError).value });
    }

    const taskId = await this.service.create(createTaskDto);

    res.status(201).json({ success: true, data: { id: taskId } });
  }

  public async findAll(_: Request, res: Response) {
    const tasks = await this.service.findAll();

    res.status(200).json({ success: true, data: tasks });
  }

  public async findOne(req: Request, res: Response) {
    const taskId = req.params["id"];

    this.logger.debug(`Task ID ${taskId}`);

    if (!isUUID(taskId, 4))
      return res.status(400).json({
        success: false,
        error: `Param ':id' needs to be a valid UUID v4`,
      });

    this.logger.info(`Finding task with ID ${taskId}`);

    const task = await this.service.findOne(taskId);

    if (!task)
      return res.status(404).json({
        success: false,
        error: `Could not find Task with ID "${taskId}"`,
      });

    res.status(200).json({ success: true, data: task });
  }

  public async patchStatus(req: Request, res: Response) {
    const taskId = req.params["id"];

    const patchStatusDto = new PatchTaskStatusDto();
    patchStatusDto.id = taskId;
    patchStatusDto.status = req.body["status"];

    try {
      this.logger.info("validating...");
      await validateOrReject(patchStatusDto);
      this.logger.info("validated");
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: error as ValidationError });
    }

    await this.service.patchStatus(patchStatusDto);

    return res.status(200).json({ success: true });
  }
}
