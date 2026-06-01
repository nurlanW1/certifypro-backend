import type { Order } from "../../../db/models/order.model";
import { PaymentProvider } from "../../../db/models/payment-transaction.model";
import { paymentConfig } from "../../config";
import type {
  CreatePaymentSessionResult,
  NormalizedPaymentResult,
  PaymentGatewayAdapter,
  PaymentGatewayContext,
} from "../../types";
import type { PaynetPlaceholderMeta } from "./paynet.types";

/**
 * Paynet payment gateway — placeholder implementation.
 *
 * Official Paynet merchant API protocol details are not yet available in this project.
 * Do not add guessed signature algorithms, URLs, or webhook payloads here.
 *
 * TODO(paynet): Implement when official documentation is provided:
 * - Payment / checkout URL or deep-link creation
 * - Webhook authentication (signature, Basic auth, or other per Paynet spec)
 * - Webhook methods: check, create, confirm, reverse, status (confirm names with Paynet)
 * - Amount / currency rules (som vs tiyin)
 * - Idempotency and replay protection per Paynet spec
 * - Map terminal states to NormalizedPaymentResult and call applyNormalizedPayment on confirm only
 */
export class PaynetPaymentAdapter implements PaymentGatewayAdapter {
  readonly provider = PaymentProvider.PAYNET;

  /** Flip to true after official protocol is implemented and credentialed in staging. */
  isProtocolImplemented(): boolean {
    return false;
  }

  assertCredentialsPresent(): void {
    const c = paymentConfig.providers.paynet;
    if (!c.merchantId || !c.secretKey) {
      throw new Error("PAYNET_NOT_CONFIGURED");
    }
  }

  getShopReturnUrl(): string {
    return `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/api/payments/paynet/return`;
  }

  getFrontendReturnUrl(): string {
    return (
      paymentConfig.providers.paynet.returnUrl ||
      `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/pricing`
    );
  }

  /**
   * TODO(paynet): Build real checkout URL or payment instructions per Paynet merchant API.
   */
  buildCheckoutUrl(_order: Order, _returnUrl?: string): string | null {
    return null;
  }

  async createPayment(ctx: PaymentGatewayContext): Promise<CreatePaymentSessionResult> {
    if (this.isProtocolImplemented()) {
      this.assertCredentialsPresent();
    }

    const meta: PaynetPlaceholderMeta = {
      integrationStatus: "placeholder",
      protocolVersion: null,
    };

    if (!this.isProtocolImplemented()) {
      return {
        paymentUrl: null,
        instructions:
          "Paynet to'lovi hozircha ulanmagan. Rasmiy Paynet merchant API hujjatlari kutilmoqda.",
        providerTransactionId: ctx.transaction.id,
        rawResponse: {
          ...meta,
          ready: false,
          returnUrl: ctx.returnUrl ?? this.getShopReturnUrl(),
          serviceId: paymentConfig.providers.paynet.serviceId || null,
        },
      };
    }

    // TODO(paynet): delegate to real implementation
    throw new Error("NOT_IMPLEMENTED");
  }

  /**
   * TODO(paynet): Verify webhook auth/signature per official Paynet spec before parsing body.
   */
  async handleWebhook(
    _payload: unknown,
    _headers: Record<string, string | string[] | undefined>
  ): Promise<NormalizedPaymentResult> {
    throw new Error("PAYNET_WEBHOOK_NOT_IMPLEMENTED");
  }

  /**
   * TODO(paynet): Poll or map Paynet transaction status API.
   */
  async checkStatus(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    return {
      provider: PaymentProvider.PAYNET,
      providerTransactionId: transaction.providerTransactionId ?? transaction.id,
      orderId: order.id,
      status:
        transaction.status === "PAID"
          ? "PAID"
          : transaction.status === "FAILED"
            ? "FAILED"
            : transaction.status === "CANCELLED"
              ? "CANCELLED"
              : "PENDING",
      amount: order.amount,
      currency: order.currency,
      rawPayload: { source: "checkStatus", placeholder: true },
    };
  }

  /**
   * TODO(paynet): Implement reverse/cancel per Paynet merchant API if supported.
   */
  async cancelPayment(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    if (!this.isProtocolImplemented()) {
      throw new Error("PAYNET_NOT_READY");
    }
    throw new Error("NOT_IMPLEMENTED");
  }
}

export const paynetPaymentAdapter = new PaynetPaymentAdapter();
