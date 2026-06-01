import type { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { sendError } from "../core/http";
import { normalizeAssetType, assertMimeForAssetType } from "../services/uploads/asset-types";

/**
 * Validates multer file + multipart `type` field for asset uploads.
 * Run after multer.single('file').
 */
export function validateAssetUpload(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;
  if (!file) {
    sendError(res, 400, "VALIDATION_ERROR", "file is required");
    return;
  }

  if (file.size > config.upload.maxFileBytes) {
    sendError(
      res,
      400,
      "FILE_TOO_LARGE",
      `File exceeds maximum size of ${Math.round(config.upload.maxFileBytes / 1024 / 1024)}MB`
    );
    return;
  }

  const rawType = (req.body?.type as string) || "";
  if (!rawType.trim()) {
    sendError(res, 400, "VALIDATION_ERROR", "type is required");
    return;
  }

  try {
    const assetType = normalizeAssetType(rawType);
    assertMimeForAssetType(assetType, file.mimetype);
    req.body.type = assetType;
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid upload";
    if (message.startsWith("Invalid asset type")) {
      sendError(res, 400, "INVALID_ASSET_TYPE", message);
      return;
    }
    sendError(res, 400, "INVALID_FILE", message);
  }
}
