import { Request, Response } from "express";
import { HealthCheckService } from "../../../../application/healthcheck/HealthCheckService";

export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  public async invoke(_: Request, res: Response) {
    const result = await this.healthCheckService.invoke();
    res.json(result);
  }
}
