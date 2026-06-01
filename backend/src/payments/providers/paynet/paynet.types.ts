/**
 * Paynet Merchant API — type placeholders.
 *
 * TODO(paynet): Replace with official request/response types from Paynet merchant documentation
 * once credentials and protocol spec are available from Paynet / project stakeholders.
 */

/** Expected webhook lifecycle steps (names TBD — confirm with official Paynet spec). */
export const PaynetWebhookMethod = {
  CHECK: "check",
  CREATE: "create",
  CONFIRM: "confirm",
  REVERSE: "reverse",
  STATUS: "status",
} as const;

export type PaynetWebhookMethodValue =
  (typeof PaynetWebhookMethod)[keyof typeof PaynetWebhookMethod];

export type PaynetPlaceholderMeta = {
  integrationStatus: "placeholder";
  protocolVersion: null;
};

export function parsePaynetBody(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return {};
}
