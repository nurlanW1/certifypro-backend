/** Uzum Merchant API transaction statuses */
export const UzumStatus = {
  OK: "OK",
  CREATED: "CREATED",
  CONFIRMED: "CONFIRMED",
  REVERSED: "REVERSED",
  FAILED: "FAILED",
} as const;

export type UzumStatusValue = (typeof UzumStatus)[keyof typeof UzumStatus];

export type UzumWebhookMethod = "check" | "create" | "confirm" | "reverse" | "status";

export type UzumRequest = {
  serviceId: number;
  timestamp: number;
  transId?: string;
  amount?: number;
  params?: { account?: string | number; [key: string]: unknown };
  paymentSource?: string;
  tariff?: string;
  processingReferenceNumber?: string;
  phone?: string;
  cardType?: number;
};

export type UzumTxnMeta = {
  uzumStatus: UzumStatusValue;
  transTime: number;
  confirmTime: number | null;
  reverseTime: number | null;
  account: string;
  amountTiyin: number;
};

export type UzumWebhookResponse = Record<string, unknown>;

export function parseUzumBody(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return {};
}

export function toUzumRequest(body: Record<string, unknown>): UzumRequest {
  return {
    serviceId: Number(body.serviceId ?? 0),
    timestamp: Number(body.timestamp ?? Date.now()),
    transId: body.transId !== undefined ? String(body.transId) : undefined,
    amount: body.amount !== undefined ? Number(body.amount) : undefined,
    params: (body.params ?? {}) as UzumRequest["params"],
    paymentSource: body.paymentSource !== undefined ? String(body.paymentSource) : undefined,
    tariff: body.tariff !== undefined ? String(body.tariff) : undefined,
    processingReferenceNumber:
      body.processingReferenceNumber !== undefined
        ? String(body.processingReferenceNumber)
        : undefined,
    phone: body.phone !== undefined ? String(body.phone) : undefined,
    cardType: body.cardType !== undefined ? Number(body.cardType) : undefined,
  };
}

export function extractAccount(body: Record<string, unknown>): string {
  const params = (body.params ?? {}) as Record<string, unknown>;
  const account = params.account;
  if (account && typeof account === "object") {
    const obj = account as Record<string, unknown>;
    return String(obj.order_id ?? obj.value ?? obj.account ?? "");
  }
  if (params.order_id !== undefined) return String(params.order_id);
  if (account !== undefined && account !== null) return String(account);
  return "";
}
