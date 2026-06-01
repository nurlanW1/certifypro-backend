import type { NextFunction, Response } from "express";
import { getDb } from "../../db/client";
import { mapUser, mapUserPublic } from "../../db/mappers";
import { sendError } from "../http/response";
import { config } from "../../config";
import type { AuthenticatedRequest } from "./types";
import { verifyAccessToken } from "./jwt";

function attachUser(req: AuthenticatedRequest, userId: string): boolean {
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!row) return false;
  const user = mapUser(row as never);
  req.userId = user.id;
  req.user = mapUserPublic(user);
  return true;
}

/** Requires a valid JWT (or dev header in non-production). */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const payload = verifyAccessToken(header.slice(7));
      if (!attachUser(req, payload.sub)) {
        sendError(res, 401, "AUTH_USER_NOT_FOUND", "User not found");
        return;
      }
      next();
      return;
    } catch {
      sendError(res, 401, "AUTH_INVALID_TOKEN", "Invalid or expired token");
      return;
    }
  }

  if (config.authAllowDevHeader && config.nodeEnv !== "production") {
    const devId = req.headers["x-dev-user-id"];
    if (typeof devId === "string" && devId && attachUser(req, devId)) {
      next();
      return;
    }
  }

  sendError(res, 401, "AUTH_REQUIRED", "Authentication required");
}

/** Must run after requireAuth. */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      sendError(res, 403, "FORBIDDEN", "Admin access required");
      return;
    }
    next();
  });
}

/** Optional auth — attaches user when token present. */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const payload = verifyAccessToken(header.slice(7));
      attachUser(req, payload.sub);
    } catch {
      // ignore invalid optional token
    }
  }
  next();
}
