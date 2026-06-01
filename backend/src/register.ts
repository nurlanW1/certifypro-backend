import type { Express } from "express";
import fs from "fs";
import { runMigrations } from "./db/migrate";
import { seedDefaults } from "./db/seed";
import { errorHandler } from "./middleware/error-handler";
import { registerApiRoutes } from "./routes";
import { sendError } from "./core/http";
import { getStorage } from "./storage";

export function registerGildiaCoreApi(app: Express): void {
  runMigrations();
  seedDefaults();
  registerApiRoutes(app);

  app.use("/api/files", (req, res, next) => {
    if (req.method !== "GET") return next();
    const storageKey = decodeURIComponent(req.path.replace(/^\//, ""));
    if (!storageKey || storageKey.includes("..")) {
      sendError(res, 400, "INVALID_PATH", "Invalid path");
      return;
    }
    const abs = getStorage().getAbsolutePath(storageKey);
    if (!abs || !fs.existsSync(abs)) {
      sendError(res, 404, "NOT_FOUND", "File not found");
      return;
    }
    res.sendFile(abs);
  });

  console.log("[gildia] Core API foundation registered");
}

export function registerGildiaErrorHandler(app: Express): void {
  app.use(errorHandler);
}
