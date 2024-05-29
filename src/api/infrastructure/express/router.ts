import { Router } from "express";
import * as controllers from "./controllers";

export const ApiRouter = (
  healthCheckController: controllers.HealthCheckController
): Router => {
  const apiRouter = Router();

  apiRouter.get(
    "/healthcheck",
    healthCheckController.invoke.bind(healthCheckController)
  );

  return apiRouter;
};
