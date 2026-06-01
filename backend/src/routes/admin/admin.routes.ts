import { requireAdmin } from "../../core/auth";
import { sendList, sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as adminService from "../../services/admin/admin.service";
import { createModuleRouter } from "../foundation/create-router";
import { adminTemplatesRouter } from "../templates/admin-templates.routes";
import { adminPaymentsRouter } from "./admin-payments.routes";

export const adminRouter = createModuleRouter();
adminRouter.use(requireAdmin);

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    sendSuccess(res, adminService.getPlatformStats());
  })
);

adminRouter.get(
  "/usage/summary",
  asyncHandler(async (_req, res) => {
    sendSuccess(res, adminService.getAdminUsageSummary());
  })
);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    sendList(res, adminService.listUsersAdmin());
  })
);

adminRouter.get(
  "/events",
  asyncHandler(async (_req, res) => {
    sendList(res, adminService.listEventsAdmin());
  })
);

adminRouter.use("/templates", adminTemplatesRouter);
adminRouter.use("/payments", adminPaymentsRouter);
