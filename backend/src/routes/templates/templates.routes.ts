import { optionalAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { asyncHandler } from "../../middleware/async-handler";
import { sendList, sendSuccess } from "../../core/http";
import * as templateService from "../../services/templates/template.service";
import { validateQuery } from "../../validation";
import { templateListQuerySchema } from "../../validation/schemas/templates.schema";
import { createModuleRouter } from "../foundation/create-router";

/** Public template catalog — optional auth unlocks premium access flags */
export const templatesRouter = createModuleRouter();

templatesRouter.get(
  "/",
  optionalAuth,
  validateQuery(templateListQuerySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const query = req.query as { productType?: string; category?: string };
    sendList(res, templateService.listPublicTemplates(query, req.userId));
  })
);

templatesRouter.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, templateService.getPublicTemplate(req.params.id, req.userId));
  })
);
