import crypto from "crypto";
import { paymentConfig } from "../../config";
import { headerRecord } from "../../utils";

export function verifyUzumAuthorization(
  authorization: string | string[] | undefined
): void {
  const header = Array.isArray(authorization) ? authorization[0] : authorization;
  if (!header?.startsWith("Basic ")) {
    throw new Error("WEBHOOK_INVALID_SIGNATURE");
  }

  const secretKey = paymentConfig.providers.uzum.secretKey;
  if (!secretKey) {
    throw new Error("WEBHOOK_INVALID_SIGNATURE");
  }

  let decoded: string;
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    throw new Error("WEBHOOK_INVALID_SIGNATURE");
  }

  const colon = decoded.indexOf(":");
  if (colon < 0) throw new Error("WEBHOOK_INVALID_SIGNATURE");

  const username = decoded.slice(0, colon);
  const password = decoded.slice(colon + 1);
  const merchantId = paymentConfig.providers.uzum.merchantId;
  const serviceId = paymentConfig.providers.uzum.serviceId;

  const validMerchant = Boolean(merchantId) && username === merchantId && password === secretKey;
  const validService = Boolean(serviceId) && username === serviceId && password === secretKey;
  const validUzumLogin = username === "uzum" && password === secretKey;

  if (!validMerchant && !validService && !validUzumLogin) {
    throw new Error("WEBHOOK_INVALID_SIGNATURE");
  }
}

/** Optional HMAC signature when UZUM_WEBHOOK_SECRET is configured. */
export function verifyUzumWebhookSignature(
  body: Record<string, unknown>,
  headers: Record<string, string | string[] | undefined>
): void {
  const webhookSecret = paymentConfig.providers.uzum.webhookSecret;
  if (!webhookSecret) return;

  const hdrs = headerRecord(headers);
  const signature =
    hdrs["x-uzum-signature"] ??
    hdrs["x-signature"] ??
    (typeof body.signature === "string" ? body.signature : undefined);

  if (!signature) return;

  const transId = String(body.transId ?? "");
  const timestamp = String(body.timestamp ?? "");
  const payload = `${timestamp}${transId}${body.amount ?? ""}`;
  const expected = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");

  if (signature !== expected && signature !== expected.toUpperCase()) {
    throw new Error("WEBHOOK_INVALID_SIGNATURE");
  }
}
