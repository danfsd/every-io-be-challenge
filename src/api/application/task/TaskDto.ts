import { TaskStatus } from "@prisma/client";
import { IsIn, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsIn([
    TaskStatus.TO_DO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
    TaskStatus.ARCHIVED,
  ])
  public status: string;
}

export class PatchTaskStatusDto {
  @IsUUID()
  public id: string;

  @IsString()
  @IsIn([
    TaskStatus.TO_DO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
    TaskStatus.ARCHIVED,
  ])
  public status: string;
}
