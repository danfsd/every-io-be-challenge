import { Request, Response } from "express";

export interface IExpressContext {
  request: Request;
  response: Response;
}
