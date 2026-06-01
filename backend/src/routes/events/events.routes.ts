import { requireAuth } from "../../core/auth";
import type { AuthenticatedRequest } from "../../core/auth/types";
import { sendList, sendSuccess } from "../../core/http";
import { asyncHandler } from "../../middleware/async-handler";
import * as eventService from "../../services/events/event.service";
import { validateBody, validateQuery } from "../../validation";
import {
  eventBuilderStateSchema,
  eventCreateSchema,
  eventProductCreateSchema,
  eventProductFormDataSchema,
  eventProductUpdateSchema,
  eventUpdateSchema,
} from "../../validation/schemas/events.schema";
import { createModuleRouter } from "../foundation/create-router";

export const eventsRouter = createModuleRouter();
eventsRouter.use(requireAuth);

eventsRouter.get(
  "/",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = eventService.listEvents(req.userId!, req.query as Record<string, string>);
    if (result.meta) sendList(res, result.items, result.meta);
    else sendList(res, result.items);
  })
);

eventsRouter.post(
  "/",
  validateBody(eventCreateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const event = eventService.createEvent(req.userId!, req.body);
    sendSuccess(res, event, 201);
  })
);

eventsRouter.get(
  "/:id/progress",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, eventService.getEventProgress(req.params.id, req.userId!));
  })
);

eventsRouter.get(
  "/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, eventService.getEvent(req.params.id, req.userId!));
  })
);

eventsRouter.patch(
  "/:id/builder-state",
  validateBody(eventBuilderStateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { builderState } = req.body as { builderState: Record<string, unknown> };
    sendSuccess(
      res,
      eventService.saveEventBuilderState(req.params.id, req.userId!, builderState)
    );
  })
);

eventsRouter.patch(
  "/:id",
  validateBody(eventUpdateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, eventService.updateEvent(req.params.id, req.userId!, req.body));
  })
);

eventsRouter.delete(
  "/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const event = eventService.softDeleteEvent(req.params.id, req.userId!);
    sendSuccess(res, { deleted: true, soft: true, event });
  })
);

eventsRouter.post(
  "/:id/restore",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(res, eventService.restoreEvent(req.params.id, req.userId!));
  })
);

eventsRouter.get(
  "/:id/products",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendList(res, eventService.listEventProducts(req.params.id, req.userId!));
  })
);

eventsRouter.post(
  "/:id/products",
  validateBody(eventProductCreateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const product = eventService.createEventProduct(req.params.id, req.userId!, req.body);
    sendSuccess(res, product, 201);
  })
);

eventsRouter.patch(
  "/:id/products/:productId",
  validateBody(eventProductUpdateSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const product = eventService.updateEventProduct(
      req.params.id,
      req.params.productId,
      req.userId!,
      req.body
    );
    sendSuccess(res, product);
  })
);

eventsRouter.patch(
  "/:id/products/:productId/form-data",
  validateBody(eventProductFormDataSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { formData } = req.body as { formData: Record<string, unknown> };
    sendSuccess(
      res,
      eventService.updateEventProductFormData(
        req.params.id,
        req.params.productId,
        req.userId!,
        formData
      )
    );
  })
);

eventsRouter.post(
  "/:id/products/:productId/enable",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(
      res,
      eventService.setEventProductEnabled(req.params.id, req.params.productId, req.userId!, true)
    );
  })
);

eventsRouter.post(
  "/:id/products/:productId/disable",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    sendSuccess(
      res,
      eventService.setEventProductEnabled(req.params.id, req.params.productId, req.userId!, false)
    );
  })
);

eventsRouter.delete(
  "/:id/products/:productId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    eventService.deleteEventProduct(req.params.id, req.params.productId, req.userId!);
    sendSuccess(res, { deleted: true });
  })
);
