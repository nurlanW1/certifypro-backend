import type { Order } from "../db/models/order.model";
import type { PaymentProvider, PaymentTransaction } from "../db/models/payment-transaction.model";

/** Normalized status from any Uzbek payment provider. */
export type NormalizedPaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type NormalizedPaymentResult = {
  provider: PaymentProvider;
  providerTransactionId: string;
  orderId: string;
  status: NormalizedPaymentStatus;
  amount: number;
  currency: string;
  rawPayload: Record<string, unknown>;
};

export type CreatePaymentSessionResult = {
  paymentUrl: string | null;
  instructions: string;
  providerTransactionId: string | null;
  rawResponse: Record<string, unknown>;
};

export type PaymentGatewayContext = {
  order: Order;
  transaction: PaymentTransaction;
  returnUrl?: string;
};

export interface PaymentGatewayAdapter {
  readonly provider: PaymentProvider;
  createPayment(ctx: PaymentGatewayContext): Promise<CreatePaymentSessionResult>;
  handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>
  ): Promise<NormalizedPaymentResult>;
  checkStatus(transaction: PaymentTransaction, order: Order): Promise<NormalizedPaymentResult>;
  cancelPayment?(
    transaction: PaymentTransaction,
    order: Order
  ): Promise<NormalizedPaymentResult>;
}
