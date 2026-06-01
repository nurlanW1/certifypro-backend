import type { Request } from "express";
import type { UserPublic } from "../../db/models";

export type JwtPayload = { sub: string; role: string };

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: UserPublic;
}
