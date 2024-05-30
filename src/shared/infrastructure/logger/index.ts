import pino from "pino";
import { Configuration } from "../../../../config";
import ILogger from "../../domain/ILogger";

export default class ServerLogger implements ILogger {
  private logger: pino.Logger;

  constructor(private config: Configuration) {
    this.logger = pino({
      level: this.config.logLevel,
      transport: this.getTransport(),
    });
  }

  private getTransport(): pino.TransportTargetOptions | undefined {
    return this.config.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined;
  }

  public debug(message: string) {
    this.logger.debug({ message });
  }

  public error(message: string) {
    this.logger.error({ message });
  }

  public info(message: string) {
    this.logger.info({ message });
  }

  public warning(message: string) {
    this.logger.warn({ message });
  }
}
