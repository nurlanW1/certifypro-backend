import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as activityService from "../../services/activity/activity.service";
import { createModuleRouter } from "../foundation/create-router";

export const activityRouter = createModuleRouter();
activityRouter.use(requireAuth);

/** GET /api/activity — paginated activity feed for current user */
activityRouter.get(
  "/",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = activityService.listActivity(req.userId!, req.query as Record<string, string>);
    if (result.meta) sendList(res, result.items, result.meta);
    else sendList(res, result.items);
  })
);
