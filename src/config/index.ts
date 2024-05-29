import "dotenv/config";
import { LogLevelEnum } from "../shared/domain/ILogger";

export type NodeEnv = "development" | "production";

export type Configuration = {
  applicationPort: number;
  databaseUrl?: string;
  logLevel: LogLevelEnum;
  nodeEnv: "development" | "production";
};

function isValidLogLevel(value?: string): value is LogLevelEnum {
  switch (value) {
    case LogLevelEnum.DEBUG:
    case LogLevelEnum.ERROR:
    case LogLevelEnum.INFO:
    case LogLevelEnum.WARNING:
      return true;
    default:
      return false;
  }
}

function isValidNodeEnv(value?: string): value is NodeEnv {
  return value === "production" || value === "development";
}

const config: Configuration = {
  applicationPort: process.env.BACKEND_PORT
    ? parseInt(process.env.BACKEND_PORT)
    : 3000,
  databaseUrl: process.env.DATABASE_URL,
  logLevel: isValidLogLevel(process.env.BACKEND_LOG_LEVEL)
    ? process.env.BACKEND_LOG_LEVEL
    : LogLevelEnum.INFO,
  nodeEnv: isValidNodeEnv(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : "development",
};

export default config;
