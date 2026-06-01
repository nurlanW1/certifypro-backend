import type { Request } from "express";
import { getDb } from "../db/client";
import { newId, nowIso } from "../utils/id";
import { stringifyJson } from "../utils/json";

export function auditLog(params: {
  userId?: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  req?: Request;
}): void {
  const id = newId("aud");
  getDb()
    .prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, metadata_json, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      params.userId ?? null,
      params.action,
      params.resourceType ?? null,
      params.resourceId ?? null,
      stringifyJson(params.metadata ?? {}),
      params.req?.ip ?? params.req?.socket?.remoteAddress ?? null,
      params.req?.headers["user-agent"] ?? null,
      nowIso()
    );
}
