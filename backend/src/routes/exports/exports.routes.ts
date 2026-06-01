import multer from "multer";
import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList, sendSuccess } from "../../core/http";
import { config } from "../../config";
import { uploadValidationMiddleware } from "../../middleware/upload-validation";
import { asyncHandler } from "../../middleware/async-handler";
import * as exportService from "../../services/exports/export.service";
import { EXPORT_FORMATS } from "../../services/exports/export-formats";
import { validateBody, validateQuery } from "../../validation";
import {
  exportFailBodySchema,
  exportHistoryQuerySchema,
  exportJobCreateSchema,
} from "../../validation/schemas/exports.schema";
import { createModuleRouter } from "../foundation/create-router";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxExportBytes },
});

export const exportsRouter = createModuleRouter();
exportsRouter.use(requireAuth);

exportsRouter.get(
  "/formats",
  asyncHandler(async (_req, res) => {
    sendSuccess(res, { formats: EXPORT_FORMATS });
  })
);

/** Export history for current user */
exportsRouter.get(
  "/",
  validateQuery(exportHistoryQuerySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = exportService.listExportHistory(
      req.userId!,
      req.query as Record<string, string>
    );
    if (result.meta) sendList(res, result.items, result.meta);
    else sendList(res, result.items);
  })
);

/** Create pending export job (await renderer or client complete). */
exportsRouter.post(
  "/jobs",
  validateBody(exportJobCreateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const body = req.body as { designDraftId: string; format: string };
    const job = exportService.createExportJob(req.userId!, body.designDraftId, body.format);
    sendSuccess(res, { job: exportService.toJobStatus(job) }, 201);
  })
);

exportsRouter.get(
  "/jobs/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, exportService.getExportStatus(req.params.id, req.userId!));
  })
);

/** Mark processing (optional — for future server-side renderer). */
exportsRouter.post(
  "/jobs/:id/process",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, exportService.markExportProcessing(req.params.id, req.userId!));
  })
);

/** Report failure without file upload. */
exportsRouter.post(
  "/jobs/:id/fail",
  validateBody(exportFailBodySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { errorMessage } = req.body as { errorMessage: string };
    sendSuccess(
      res,
      exportService.failExportJob(req.params.id, req.userId!, errorMessage)
    );
  })
);

/** Complete job with rendered file (client-side or worker upload). */
exportsRouter.post(
  "/jobs/:id/complete",
  upload.single("file"),
  uploadValidationMiddleware("export"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const file = req.file!;
    const record = await exportService.completeExportJob({
      userId: req.userId!,
      exportId: req.params.id,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
    sendSuccess(res, record);
  })
);

/** One-shot: create job + upload file (editor export flow). */
exportsRouter.post(
  "/",
  upload.single("file"),
  uploadValidationMiddleware("export"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const file = req.file;
    const designDraftId = req.body.designDraftId as string;
    const format = (req.body.format as string) || "png";
    if (!file || !designDraftId) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "file and designDraftId are required",
        },
      });
      return;
    }
    const record = await exportService.createExportWithFile({
      userId: req.userId!,
      designDraftId,
      format,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
    sendSuccess(res, record, 201);
  })
);

exportsRouter.delete(
  "/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await exportService.deleteExport(req.params.id, req.userId!);
    sendSuccess(res, { deleted: true });
  })
);
