import multer from "multer";
import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList, sendSuccess } from "../../core/http";
import { config } from "../../config";
import { validateAssetUpload } from "../../middleware/asset-upload-validation";
import { asyncHandler } from "../../middleware/async-handler";
import * as uploadService from "../../services/uploads/upload.service";
import { ASSET_TYPES } from "../../services/uploads/asset-types";
import { validateQuery } from "../../validation";
import { uploadListQuerySchema } from "../../validation/schemas/uploads.schema";
import { createModuleRouter } from "../foundation/create-router";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileBytes },
});

export const uploadsRouter = createModuleRouter();
uploadsRouter.use(requireAuth);

uploadsRouter.get(
  "/types",
  asyncHandler(async (_req, res) => {
    sendSuccess(res, { types: ASSET_TYPES });
  })
);

uploadsRouter.get(
  "/",
  validateQuery(uploadListQuerySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const query = req.query as {
      eventId?: string;
      designDraftId?: string;
      brandKitId?: string;
      type?: string;
    };
    sendList(res, uploadService.listUploads(req.userId!, query));
  })
);

uploadsRouter.get(
  "/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, uploadService.getUpload(req.params.id, req.userId!));
  })
);

uploadsRouter.post(
  "/",
  upload.single("file"),
  validateAssetUpload,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const file = req.file!;
    const body = req.body as {
      type: string;
      eventId?: string;
      designDraftId?: string;
      brandKitId?: string;
    };
    const asset = await uploadService.createUpload({
      userId: req.userId!,
      type: body.type,
      fileName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
      eventId: body.eventId,
      designDraftId: body.designDraftId,
      brandKitId: body.brandKitId,
    });
    sendSuccess(res, asset, 201);
  })
);

uploadsRouter.delete(
  "/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await uploadService.deleteUpload(req.params.id, req.userId!);
    sendSuccess(res, { deleted: true });
  })
);
