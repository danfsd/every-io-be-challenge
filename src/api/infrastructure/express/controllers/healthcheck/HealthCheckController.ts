import { Request, Response } from "express";
import { HealthCheckService } from "../../../../application/healthcheck/HealthCheckService";

export class HealthCheckController {
  constructor(private service: HealthCheckService) {}

  public async invoke(_: Request, res: Response) {
    const result = await this.service.invoke();
    res.json(result);
  }
}
