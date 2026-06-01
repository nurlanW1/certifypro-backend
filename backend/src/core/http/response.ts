import type { Response } from "express";

export type ApiSuccess<T> = {
  success: true;
  ok: true;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  ok: false;
  error: { code: string; message: string };
  message: string;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiList<T> = {
  success: true;
  ok: true;
  data: { items: T[] };
  items: T[];
  meta?: PaginatedMeta;
};

export function sendSuccess<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, ok: true, data } satisfies ApiSuccess<T>);
}

export function sendList<T>(res: Response, items: T[], meta?: PaginatedMeta): Response {
  return res.json({
    success: true,
    ok: true,
    data: { items },
    items,
    meta,
  } satisfies ApiList<T>);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string
): Response {
  return res.status(status).json({
    success: false,
    ok: false,
    error: { code, message },
    message,
  } satisfies ApiErrorBody);
}

export function sendNotImplemented(res: Response, feature: string): Response {
  return sendError(res, 501, "NOT_IMPLEMENTED", `${feature} is not available yet`);
}
