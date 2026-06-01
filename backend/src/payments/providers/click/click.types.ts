/** Click SHOP API action codes */
export const ClickAction = {
  PREPARE: 0,
  COMPLETE: 1,
} as const;

/** Standard Click SHOP API error codes (merchant response). */
export const ClickShopError = {
  SUCCESS: 0,
  SIGN_CHECK_FAILED: -1,
  INCORRECT_AMOUNT: -2,
  ACTION_NOT_FOUND: -3,
  ALREADY_PAID: -4,
  USER_NOT_FOUND: -5,
  TRANSACTION_NOT_FOUND: -6,
  FAILED_TO_UPDATE: -7,
  ORDER_NOT_FOUND: -8,
  ORDER_NOT_PAYABLE: -9,
} as const;

export type ClickShopRequest = {
  clickTransId: number;
  serviceId: number;
  merchantTransId: string;
  merchantPrepareId?: number;
  amount: number;
  action: number;
  error: number;
  errorNote?: string;
  signTime: string;
  signString: string;
};

export type ClickShopResponse = {
  click_trans_id: number;
  merchant_trans_id: string;
  merchant_prepare_id: number;
  merchant_confirm_id?: number;
  error: number;
  error_note: string;
};

export function parseClickShopBody(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return {};
}

export function toClickShopRequest(body: Record<string, unknown>): ClickShopRequest {
  return {
    clickTransId: Number(body.click_trans_id ?? 0),
    serviceId: Number(body.service_id ?? 0),
    merchantTransId: String(body.merchant_trans_id ?? ""),
    merchantPrepareId:
      body.merchant_prepare_id !== undefined ? Number(body.merchant_prepare_id) : undefined,
    amount: Number(body.amount ?? 0),
    action: Number(body.action ?? -1),
    error: Number(body.error ?? 0),
    errorNote: body.error_note !== undefined ? String(body.error_note) : undefined,
    signTime: String(body.sign_time ?? ""),
    signString: String(body.sign_string ?? ""),
  };
}

export function clickShopResponse(
  req: ClickShopRequest,
  error: number,
  errorNote: string,
  ids?: { merchantPrepareId?: number; merchantConfirmId?: number }
): ClickShopResponse {
  const prepareId = ids?.merchantPrepareId ?? req.merchantPrepareId ?? 0;
  const out: ClickShopResponse = {
    click_trans_id: req.clickTransId,
    merchant_trans_id: req.merchantTransId,
    merchant_prepare_id: prepareId,
    error,
    error_note: errorNote,
  };
  if (ids?.merchantConfirmId !== undefined) {
    out.merchant_confirm_id = ids.merchantConfirmId;
  }
  return out;
}
