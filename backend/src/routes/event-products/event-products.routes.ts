import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as eventService from "../../services/events/event.service";
import { validateQuery } from "../../validation";
import { eventProductsQuerySchema } from "../../validation/schemas/events.schema";
import { createModuleRouter } from "../foundation/create-router";

export const eventProductsRouter = createModuleRouter();
eventProductsRouter.use(requireAuth);

/** GET /api/event-products?eventId= — products for one of the user's events */
eventProductsRouter.get(
  "/",
  validateQuery(eventProductsQuerySchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { eventId } = req.query as { eventId: string };
    sendList(res, eventService.listEventProductsForUser(req.userId!, eventId));
  })
);
