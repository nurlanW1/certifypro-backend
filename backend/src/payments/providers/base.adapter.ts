import type { Order } from "../../db/models/order.model";
import type { PaymentProvider } from "../../db/models/payment-transaction.model";
import { paymentConfig } from "../config";
import type {
  CreatePaymentSessionResult,
  NormalizedPaymentResult,
  PaymentGatewayAdapter,
  PaymentGatewayContext,
} from "../types";
import { headerRecord } from "../utils";

export abstract class BaseProviderAdapter implements PaymentGatewayAdapter {
  abstract readonly provider: PaymentProvider;

  protected abstract checkoutPath: string;
  protected abstract webhookHeader: string;

  async createPayment(ctx: PaymentGatewayContext): Promise<CreatePaymentSessionResult> {
    const providerTxnId = `${this.provider.toLowerCase()}_${ctx.transaction.id}`;
    const paymentUrl = `${this.checkoutBase()}/${ctx.order.id}?txn=${ctx.transaction.id}`;
    return {
      paymentUrl,
      instructions: `Complete payment via ${this.provider} for ${ctx.order.amount} ${ctx.order.currency}.`,
      providerTransactionId: providerTxnId,
      rawResponse: { mode: "sandbox", paymentUrl },
    };
  }

  async handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>
  ): Promise<NormalizedPaymentResult> {
    const body = (payload ?? {}) as Record<string, unknown>;
    const hdrs = headerRecord(headers);
    this.verifyWebhookSecret(body, hdrs);

    const orderId = String(body.order_id ?? body.orderId ?? body.merchant_order_id ?? "");
    if (!orderId) throw new Error("WEBHOOK_MISSING_ORDER_ID");

    const status = this.parseWebhookStatus(body);
    const providerTransactionId = String(
      body.transaction_id ??
        body.provider_transaction_id ??
        body.txn_id ??
        `${this.provider.toLowerCase()}_tx_${Date.now()}`
    );

    return {
      provider: this.provider,
      providerTransactionId,
      orderId,
      status,
      amount: Number(body.amount ?? 0),
      currency: String(body.currency ?? paymentConfig.currency),
      rawPayload: { body, headers: hdrs },
    };
  }

  async checkStatus(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    return {
      provider: this.provider,
      providerTransactionId: transaction.providerTransactionId ?? transaction.id,
      orderId: order.id,
      status:
        transaction.status === "PAID"
          ? "PAID"
          : transaction.status === "FAILED"
            ? "FAILED"
            : "PENDING",
      amount: order.amount,
      currency: order.currency,
      rawPayload: { source: "checkStatus", transactionStatus: transaction.status },
    };
  }

  async cancelPayment(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    return {
      provider: this.provider,
      providerTransactionId: transaction.providerTransactionId ?? transaction.id,
      orderId: order.id,
      status: "CANCELLED",
      amount: order.amount,
      currency: order.currency,
      rawPayload: { cancelled: true },
    };
  }

  protected checkoutBase(): string {
    return `https://checkout.${this.provider.toLowerCase()}.uz/pay`;
  }

  protected verifyWebhookSecret(
    body: Record<string, unknown>,
    headers: Record<string, string>
  ): void {
    const secret = this.getWebhookSecret();
    const token =
      (body.signature as string) ??
      headers[this.webhookHeader] ??
      headers["x-signature"];
    if (!token || token !== secret) {
      throw new Error("WEBHOOK_INVALID_SIGNATURE");
    }
  }

  protected abstract getWebhookSecret(): string;

  protected parseWebhookStatus(body: Record<string, unknown>): NormalizedPaymentResult["status"] {
    const raw = String(body.status ?? body.state ?? "paid").toLowerCase();
    if (raw === "paid" || raw === "success" || raw === "completed") return "PAID";
    if (raw === "failed" || raw === "error") return "FAILED";
    if (raw === "cancelled" || raw === "canceled") return "CANCELLED";
    if (raw === "refunded") return "REFUNDED";
    return "PENDING";
  }
}
