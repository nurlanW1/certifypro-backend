import multer from "multer";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { requireAdmin } from "../../core/auth";
import { sendList, sendSuccess } from "../../core/http";
import { config } from "../../config";
import { asyncHandler } from "../../middleware/async-handler";
import * as templateService from "../../services/templates/template.service";
import { validateBody, validateQuery } from "../../validation";
import {
  templateCreateSchema,
  templateListQuerySchema,
  templateUpdateSchema,
} from "../../validation/schemas/templates.schema";
import { createModuleRouter } from "../foundation/create-router";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileBytes },
});

export const adminTemplatesRouter = createModuleRouter();
adminTemplatesRouter.use(requireAdmin);

adminTemplatesRouter.get(
  "/",
  validateQuery(templateListQuerySchema),
  asyncHandler(async (req, res) => {
    const query = req.query as { productType?: string };
    sendList(
      res,
      templateService.listTemplatesAdmin({
        productType: query.productType,
        activeOnly: false,
      })
    );
  })
);

adminTemplatesRouter.post(
  "/",
  validateBody(templateCreateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const template = templateService.createTemplate(req.body, req.userId);
    sendSuccess(res, template, 201);
  })
);

adminTemplatesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    sendSuccess(res, templateService.getTemplateAdmin(req.params.id));
  })
);

adminTemplatesRouter.patch(
  "/:id",
  validateBody(templateUpdateSchema),
  asyncHandler(async (req, res) => {
    sendSuccess(res, templateService.updateTemplate(req.params.id, req.body));
  })
);

adminTemplatesRouter.post(
  "/:id/disable",
  asyncHandler(async (req, res) => {
    sendSuccess(res, templateService.disableTemplate(req.params.id));
  })
);

adminTemplatesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    templateService.deleteTemplate(req.params.id);
    sendSuccess(res, { deleted: true });
  })
);

adminTemplatesRouter.post(
  "/:id/preview",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "file is required" },
      });
      return;
    }
    if (!file.mimetype.startsWith("image/")) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_FILE",
          message: "Template preview must be an image",
        },
      });
      return;
    }
    const template = await templateService.uploadTemplatePreview(req.params.id, {
      fileName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    });
    sendSuccess(res, template);
  })
);
