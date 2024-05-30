import { Request, Response } from "express";
import { VerifiedJwt } from "../../application/auth/AuthService";

export interface IExpressContext {
  verifiedJwt: VerifiedJwt | null;
  request: Request;
  response: Response;
}
