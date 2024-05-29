import config from "./config";

import { ApiRouter } from "./api/infrastructure/express/router";
import ApplicationRouter from "./shared/infrastructure/Router";
import ApplicationServer from "./shared/infrastructure/Server";
import ServerLogger from "./shared/infrastructure/logger";
import { HealthCheckController } from "./api/infrastructure/express/controllers";
import { HealthCheckService } from "./api/application/healthcheck/HealthCheckService";

// TODO: improve with dependency injection IoC container
const healthCheckService = new HealthCheckService();
const healthCheckController = new HealthCheckController(healthCheckService);

const apiRouter = ApiRouter(healthCheckController);

const logger = new ServerLogger(config);
const server = new ApplicationServer(
  ApplicationRouter(apiRouter),
  logger,
  config
);

server.start().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
