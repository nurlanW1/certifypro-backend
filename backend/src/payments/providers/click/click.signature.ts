import crypto from "crypto";

export type ClickSignInput = {
  clickTransId: string;
  serviceId: string;
  secretKey: string;
  merchantTransId: string;
  amount: string;
  action: string;
  signTime: string;
};

/** Click SHOP API: MD5(click_trans_id + service_id + secret_key + merchant_trans_id + amount + action + sign_time) */
export function buildClickSignString(input: ClickSignInput): string {
  const digest =
    input.clickTransId +
    input.serviceId +
    input.secretKey +
    input.merchantTransId +
    input.amount +
    input.action +
    input.signTime;
  return crypto.createHash("md5").update(digest).digest("hex");
}

export function verifyClickSignString(
  body: Record<string, unknown>,
  secretKey: string
): boolean {
  const signString = String(body.sign_string ?? "");
  if (!secretKey || !signString) return false;

  const expected = buildClickSignString({
    clickTransId: String(body.click_trans_id ?? ""),
    serviceId: String(body.service_id ?? ""),
    secretKey,
    merchantTransId: String(body.merchant_trans_id ?? ""),
    amount: String(body.amount ?? ""),
    action: String(body.action ?? ""),
    signTime: String(body.sign_time ?? ""),
  });

  return expected === signString;
}
