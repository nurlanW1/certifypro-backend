import jwt from "jsonwebtoken";
import { config } from "../../config";
import type { JwtPayload } from "./types";

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role } satisfies JwtPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
