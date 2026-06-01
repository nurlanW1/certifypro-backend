import { PaymentProvider } from "../db/models/payment-transaction.model";
import { OrderStatus } from "../db/models/order.model";
import { PaymentTransactionStatus } from "../db/models/payment-transaction.model";
import type { NormalizedPaymentStatus } from "./types";

export function parseProviderParam(value: string): PaymentProvider {
  const key = value.trim().toUpperCase();
  if (key in PaymentProvider) {
    return PaymentProvider[key as keyof typeof PaymentProvider];
  }
  throw new Error("UNSUPPORTED_PROVIDER");
}

export function mapNormalizedToTransactionStatus(
  status: NormalizedPaymentStatus
): PaymentTransactionStatus {
  switch (status) {
    case "PAID":
      return PaymentTransactionStatus.PAID;
    case "FAILED":
      return PaymentTransactionStatus.FAILED;
    case "CANCELLED":
      return PaymentTransactionStatus.CANCELLED;
    case "REFUNDED":
      return PaymentTransactionStatus.REFUNDED;
    default:
      return PaymentTransactionStatus.PENDING;
  }
}

export function mapNormalizedToOrderStatus(status: NormalizedPaymentStatus): OrderStatus {
  switch (status) {
    case "PAID":
      return OrderStatus.PAID;
    case "FAILED":
      return OrderStatus.FAILED;
    case "CANCELLED":
      return OrderStatus.CANCELLED;
    case "REFUNDED":
      return OrderStatus.CANCELLED;
    default:
      return OrderStatus.PENDING;
  }
}

export function headerRecord(
  headers: Record<string, string | string[] | undefined>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (v === undefined) continue;
    out[k.toLowerCase()] = Array.isArray(v) ? v[0] : v;
  }
  return out;
}
