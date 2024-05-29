import express, { Router } from "express";
import * as controllers from "./controllers";

export const ApiRouter = (
  healthCheckController: controllers.HealthCheckController,
  taskController: controllers.TaskController
): Router => {
  const apiRouter = Router();

  apiRouter.use(express.json());
  apiRouter.get(
    "/healthcheck",
    healthCheckController.invoke.bind(healthCheckController)
  );
  apiRouter.get("/tasks", taskController.findAll.bind(taskController));
  apiRouter.get("/tasks/:id", taskController.findOne.bind(taskController));
  apiRouter.post("/tasks", taskController.create.bind(taskController));
  apiRouter.patch(
    "/tasks/:id/status",
    taskController.patchStatus.bind(taskController)
  );

  return apiRouter;
};
