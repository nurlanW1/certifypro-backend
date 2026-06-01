import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList, sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import { getDb } from "../../db/client";
import { Tables } from "../../db/schema";
import * as activityService from "../../services/activity/activity.service";
import * as billingLimits from "../../services/billing/billing-limits.service";
import { createModuleRouter } from "../foundation/create-router";

export const dashboardRouter = createModuleRouter();
dashboardRouter.use(requireAuth);

dashboardRouter.get(
  "/summary",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.userId!;
    const db = getDb();

    const events = (
      db
        .prepare(
          `SELECT COUNT(*) as c FROM ${Tables.EVENTS} WHERE user_id = ? AND deleted_at IS NULL`
        )
        .get(userId) as { c: number }
    ).c;
    const designs = (
      db
        .prepare(
          `SELECT COUNT(*) as c FROM ${Tables.DESIGN_DRAFTS} WHERE user_id = ? AND deleted_at IS NULL`
        )
        .get(userId) as { c: number }
    ).c;
    const exports = (
      db.prepare(`SELECT COUNT(*) as c FROM ${Tables.EXPORT_FILES} WHERE user_id = ?`).get(userId) as {
        c: number;
      }
    ).c;

    const recentActivity = activityService.listRecentActivity(userId, 10);

    sendSuccess(res, {
      counts: { events, designs, exports },
      billing: billingLimits.getUsageSummary(userId),
      recentActivity,
    });
  })
);

/** GET /api/dashboard/activity — recent activity for dashboard widget */
dashboardRouter.get(
  "/activity",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 15));
    const items = activityService.listRecentActivity(req.userId!, limit);
    sendList(res, items);
  })
);
