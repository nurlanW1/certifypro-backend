import type { Response } from "express";
import { sendNotImplemented } from "../../core/http/response";
import { asyncHandler } from "../../middleware/async-handler";

/** Phase 1 placeholder until feature handlers are implemented. */
export function stubHandler(feature: string) {
  return asyncHandler(async (_req, res: Response) => {
    sendNotImplemented(res, feature);
  });
}
