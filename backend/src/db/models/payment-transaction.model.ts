export const PaymentProvider = {
  CLICK: "CLICK",
  PAYME: "PAYME",
  UZUM: "UZUM",
  PAYNET: "PAYNET",
} as const;

export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider];

export const PaymentTransactionStatus = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentTransactionStatus =
  (typeof PaymentTransactionStatus)[keyof typeof PaymentTransactionStatus];

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  provider: PaymentProvider;
  providerTransactionId: string | null;
  status: PaymentTransactionStatus;
  amount: number;
  currency: string;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}
