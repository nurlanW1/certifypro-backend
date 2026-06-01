import type { Order } from "../../../db/models/order.model";
import { PaymentProvider } from "../../../db/models/payment-transaction.model";
import { getDb } from "../../../db/client";
import { Tables } from "../../../db/schema";
import { mapOrder } from "../../../db/mappers/payment.mappers";
import { paymentConfig } from "../../config";
import type {
  CreatePaymentSessionResult,
  NormalizedPaymentResult,
  PaymentGatewayAdapter,
  PaymentGatewayContext,
} from "../../types";
import { headerRecord } from "../../utils";
import { clickAmountsMatch, formatClickAmount } from "./click.amount";
import { verifyClickSignString } from "./click.signature";
import {
  ClickAction,
  ClickShopError,
  clickShopResponse,
  parseClickShopBody,
  toClickShopRequest,
  type ClickShopResponse,
} from "./click.types";

export class ClickPaymentAdapter implements PaymentGatewayAdapter {
  readonly provider = PaymentProvider.CLICK;

  assertConfigured(): void {
    const c = paymentConfig.providers.click;
    if (!c.serviceId || !c.merchantId || !c.secretKey) {
      throw new Error("CLICK_NOT_CONFIGURED");
    }
  }

  /** Where Click redirects the user after payment (our backend). */
  getShopReturnUrl(override?: string): string {
    return (
      override || `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/api/payments/click/return`
    );
  }

  /** Final browser redirect target (frontend). */
  getFrontendReturnUrl(): string {
    return (
      paymentConfig.providers.click.returnUrl ||
      `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/pricing`
    );
  }

  buildPaymentUrl(order: Order, returnUrl: string): string {
    this.assertConfigured();
    const c = paymentConfig.providers.click;
    const params = new URLSearchParams({
      service_id: c.serviceId,
      merchant_id: c.merchantId,
      amount: formatClickAmount(order.amount),
      transaction_param: order.id,
      return_url: returnUrl,
    });
    if (c.merchantUserId) {
      params.set("merchant_user_id", c.merchantUserId);
    }
    return `${c.payBaseUrl}?${params.toString()}`;
  }

  async createPayment(ctx: PaymentGatewayContext): Promise<CreatePaymentSessionResult> {
    this.assertConfigured();
    const returnUrl = this.getShopReturnUrl(ctx.returnUrl);
    const paymentUrl = this.buildPaymentUrl(ctx.order, returnUrl);
    const providerTxnId = String(ctx.transaction.id);

    return {
      paymentUrl,
      instructions: `To'lovni Click orqali yakunlang (${formatClickAmount(ctx.order.amount)} ${ctx.order.currency}).`,
      providerTransactionId: providerTxnId,
      rawResponse: {
        paymentUrl,
        returnUrl,
        merchantTransId: ctx.order.id,
        serviceId: paymentConfig.providers.click.serviceId,
      },
    };
  }

  verifySignature(body: Record<string, unknown>): void {
    const secret = paymentConfig.providers.click.secretKey;
    if (!verifyClickSignString(body, secret)) {
      throw new Error("WEBHOOK_INVALID_SIGNATURE");
    }
  }

  mapClickErrorToStatus(error: number): NormalizedPaymentResult["status"] {
    if (error === 0) return "PAID";
    if (error === -1 || error === -9) return "CANCELLED";
    return "FAILED";
  }

  mapWebhookStatus(body: Record<string, unknown>): NormalizedPaymentResult["status"] {
    const action = Number(body.action ?? -1);
    const error = Number(body.error ?? 0);
    if (action === ClickAction.PREPARE) return "PENDING";
    if (action === ClickAction.COMPLETE) return this.mapClickErrorToStatus(error);
    return "PENDING";
  }

  async handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>
  ): Promise<NormalizedPaymentResult> {
    const body = parseClickShopBody(payload);
    const hdrs = headerRecord(headers);
    this.verifySignature(body);

    const orderId = String(body.merchant_trans_id ?? "");
    if (!orderId) throw new Error("WEBHOOK_MISSING_ORDER_ID");

    const action = Number(body.action ?? -1);
    const clickError = Number(body.error ?? 0);
    let status = this.mapWebhookStatus(body);
    if (action === ClickAction.COMPLETE && clickError !== 0) {
      status = this.mapClickErrorToStatus(clickError);
    }

    const order = this.loadOrder(orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (!clickAmountsMatch(order.amount, Number(body.amount ?? 0))) {
      throw new Error("PAYMENT_AMOUNT_MISMATCH");
    }

    const providerTransactionId = String(
      body.click_trans_id ?? body.merchant_prepare_id ?? `click_${orderId}`
    );

    return {
      provider: PaymentProvider.CLICK,
      providerTransactionId,
      orderId,
      status,
      amount: Number(body.amount ?? order.amount),
      currency: order.currency,
      rawPayload: { body, headers: hdrs, action, clickError },
    };
  }

  /**
   * Click SHOP API (Prepare / Complete). Returns Click JSON; applies payment only on confirmed Complete.
   */
  processShopWebhook(payload: unknown): ClickShopResponse {
    const body = parseClickShopBody(payload);
    const req = toClickShopRequest(body);

    if (!verifyClickSignString(body, paymentConfig.providers.click.secretKey)) {
      return clickShopResponse(req, ClickShopError.SIGN_CHECK_FAILED, "Invalid signature");
    }

    const configuredServiceId = Number(paymentConfig.providers.click.serviceId);
    if (configuredServiceId && req.serviceId !== configuredServiceId) {
      return clickShopResponse(req, ClickShopError.SIGN_CHECK_FAILED, "Invalid service_id");
    }

    if (!req.merchantTransId) {
      return clickShopResponse(req, ClickShopError.TRANSACTION_NOT_FOUND, "Missing merchant_trans_id");
    }

    const order = this.loadOrder(req.merchantTransId);
    if (!order) {
      return clickShopResponse(req, ClickShopError.ORDER_NOT_FOUND, "Order not found");
    }

    if (!clickAmountsMatch(order.amount, req.amount)) {
      return clickShopResponse(req, ClickShopError.INCORRECT_AMOUNT, "Incorrect amount");
    }

    if (order.status === "PAID") {
      return clickShopResponse(
        req,
        ClickShopError.ALREADY_PAID,
        "Order already paid",
        { merchantPrepareId: req.merchantPrepareId ?? 0 }
      );
    }

    if (order.status === "CANCELLED" || order.status === "EXPIRED") {
      return clickShopResponse(req, ClickShopError.ORDER_NOT_PAYABLE, "Order not payable");
    }

    if (req.action === ClickAction.PREPARE) {
      const prepareId = this.resolvePrepareId(req.merchantTransId);
      return clickShopResponse(req, ClickShopError.SUCCESS, "Success", {
        merchantPrepareId: prepareId,
      });
    }

    if (req.action === ClickAction.COMPLETE) {
      if (req.error !== 0) {
        return clickShopResponse(req, ClickShopError.SUCCESS, "Cancelled", {
          merchantPrepareId: req.merchantPrepareId ?? 0,
          merchantConfirmId: req.merchantPrepareId ?? 0,
        });
      }

      const prepareId = req.merchantPrepareId ?? this.resolvePrepareId(req.merchantTransId);
      return clickShopResponse(req, ClickShopError.SUCCESS, "Success", {
        merchantPrepareId: prepareId,
        merchantConfirmId: prepareId,
      });
    }

    return clickShopResponse(req, ClickShopError.ACTION_NOT_FOUND, "Unknown action");
  }

  shouldApplyPaymentOnComplete(payload: unknown): boolean {
    const body = parseClickShopBody(payload);
    return Number(body.action) === ClickAction.COMPLETE && Number(body.error) === 0;
  }

  async checkStatus(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    return {
      provider: PaymentProvider.CLICK,
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

  private loadOrder(orderId: string): Order | null {
    const row = getDb().prepare(`SELECT * FROM ${Tables.ORDERS} WHERE id = ?`).get(orderId);
    return row ? mapOrder(row as Record<string, unknown>) : null;
  }

  private resolvePrepareId(orderId: string): number {
    const row = getDb()
      .prepare(
        `SELECT id FROM ${Tables.PAYMENT_TRANSACTIONS}
         WHERE order_id = ? AND provider = 'CLICK'
         ORDER BY created_at DESC LIMIT 1`
      )
      .get(orderId) as { id: string } | undefined;
    const key = row?.id ?? orderId;
    return hashToPrepareId(key);
  }
}

function hashToPrepareId(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  const positive = Math.abs(hash) % 2147483646;
  return positive > 0 ? positive : 1;
}

export const clickPaymentAdapter = new ClickPaymentAdapter();
