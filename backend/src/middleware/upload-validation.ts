import type { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { sendError } from "../core/http";

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const DOCUMENT_MIMES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
]);

const EXPORT_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "application/pdf",
  "image/svg+xml",
]);

export function validateUploadFile(
  file: Express.Multer.File | undefined,
  opts: { kind: "asset" | "export" }
): string | null {
  if (!file) return "file is required";
  const max =
    opts.kind === "export" ? config.upload.maxExportBytes : config.upload.maxFileBytes;
  if (file.size > max) {
    return `File exceeds maximum size of ${Math.round(max / 1024 / 1024)}MB`;
  }
  const allowed = opts.kind === "export" ? EXPORT_MIMES : new Set([...IMAGE_MIMES, ...DOCUMENT_MIMES]);
  if (!allowed.has(file.mimetype)) {
    return `File type not allowed: ${file.mimetype}`;
  }
  return null;
}

export function uploadValidationMiddleware(kind: "asset" | "export") {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const err = validateUploadFile(file, { kind });
    if (err) {
      sendError(res, 400, "INVALID_FILE", err);
      return;
    }
    next();
  };
}
