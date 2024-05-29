export enum LogLevelEnum {
  DEBUG = "debug",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

export type LogFn = (message: string) => void;
export default interface ILogger {
  [LogLevelEnum.DEBUG]: LogFn;
  [LogLevelEnum.ERROR]: LogFn;
  [LogLevelEnum.INFO]: LogFn;
  [LogLevelEnum.WARNING]: LogFn;
}
