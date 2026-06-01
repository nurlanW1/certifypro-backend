import type { Express } from "express";
import { authRateLimiter, apiRateLimiter, uploadRateLimiter } from "../middleware/rate-limit";
import { authRouter } from "./auth/auth.routes";
import { eventsRouter } from "./events/events.routes";
import { eventProductsRouter } from "./event-products/event-products.routes";
import { designsRouter } from "./designs/designs.routes";
import { templatesRouter } from "./templates/templates.routes";
import { adminRouter } from "./admin/admin.routes";
import { uploadsRouter } from "./uploads/uploads.routes";
import { brandKitsRouter } from "./brand-kits/brand-kits.routes";
import { exportsRouter } from "./exports/exports.routes";
import { billingRouter } from "./billing/billing.routes";
import { clickPaymentsRouter } from "./payments/click.routes";
import { paymePaymentsRouter } from "./payments/payme.routes";
import { uzumPaymentsRouter } from "./payments/uzum.routes";
import { paynetPaymentsRouter } from "./payments/paynet.routes";
import { activityRouter } from "./activity/activity.routes";
import { dashboardRouter } from "./dashboard/dashboard.routes";

/** Mount all API module routers (Phase 1 foundation). */
export function registerApiRoutes(app: Express): void {
  app.use("/api/auth", authRateLimiter, authRouter);
  app.use("/api", apiRateLimiter);

  app.use("/api/events", eventsRouter);
  app.use("/api/event-products", eventProductsRouter);
  app.use("/api/designs", designsRouter);
  app.use("/api/templates", templatesRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/uploads", uploadRateLimiter, uploadsRouter);
  app.use("/api/brand-kits", brandKitsRouter);
  app.use("/api/exports", exportsRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/payments/click", clickPaymentsRouter);
  app.use("/api/payments/payme", paymePaymentsRouter);
  app.use("/api/payments/uzum", uzumPaymentsRouter);
  app.use("/api/payments/paynet", paynetPaymentsRouter);
  app.use("/api/activity", activityRouter);
  app.use("/api/dashboard", dashboardRouter);
}

export { authRouter } from "./auth/auth.routes";
export { adminTemplatesRouter } from "./templates/admin-templates.routes";
