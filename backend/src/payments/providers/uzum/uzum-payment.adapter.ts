import type { Order } from "../../../db/models/order.model";
import { PaymentProvider } from "../../../db/models/payment-transaction.model";
import { paymentConfig } from "../../config";
import type {
  CreatePaymentSessionResult,
  NormalizedPaymentResult,
  PaymentGatewayAdapter,
  PaymentGatewayContext,
} from "../../types";
import { headerRecord } from "../../utils";
import { uzumAmountsMatch, somToTiyin, tiyinToSom } from "./uzum.amount";
import { verifyUzumAuthorization, verifyUzumWebhookSignature } from "./uzum.auth";
import {
  accountData,
  createUzumTransaction,
  findByUzumTransId,
  getUzumMeta,
  loadOrder,
  markUzumFailedIfExpired,
  saveUzumMeta,
} from "./uzum.store";
import {
  extractAccount,
  parseUzumBody,
  toUzumRequest,
  UzumStatus,
  type UzumTxnMeta,
  type UzumWebhookMethod,
  type UzumWebhookResponse,
} from "./uzum.types";

export class UzumPaymentAdapter implements PaymentGatewayAdapter {
  readonly provider = PaymentProvider.UZUM;

  assertConfigured(): void {
    const c = paymentConfig.providers.uzum;
    if (!c.secretKey || (!c.merchantId && !c.serviceId)) {
      throw new Error("UZUM_NOT_CONFIGURED");
    }
  }

  getShopReturnUrl(): string {
    return `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/api/payments/uzum/return`;
  }

  getFrontendReturnUrl(): string {
    return (
      paymentConfig.providers.uzum.returnUrl ||
      `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/pricing`
    );
  }

  buildCheckoutUrl(order: Order, returnUrl?: string): string {
    this.assertConfigured();
    const serviceId = Number(paymentConfig.providers.uzum.serviceId || paymentConfig.providers.uzum.merchantId);
    const params = {
      serviceId,
      account: order.id,
      amount: somToTiyin(order.amount),
      returnUrl: returnUrl ?? this.getShopReturnUrl(),
    };
    const encoded = Buffer.from(JSON.stringify(params)).toString("base64");
    const base = paymentConfig.providers.uzum.checkoutBaseUrl.replace(/\/$/, "");
    return `${base}/${encoded}`;
  }

  async createPayment(ctx: PaymentGatewayContext): Promise<CreatePaymentSessionResult> {
    const returnUrl = ctx.returnUrl ?? this.getShopReturnUrl();
    const paymentUrl = this.buildCheckoutUrl(ctx.order, returnUrl);

    return {
      paymentUrl,
      instructions: `Uzum Bank ilovasida to'lovni yakunlang (buyurtma: ${ctx.order.id}, ${ctx.order.amount} ${ctx.order.currency}).`,
      providerTransactionId: ctx.transaction.id,
      rawResponse: {
        paymentUrl,
        returnUrl,
        account: ctx.order.id,
        amountTiyin: somToTiyin(ctx.order.amount),
      },
    };
  }

  dispatchWebhook(
    method: UzumWebhookMethod,
    payload: unknown,
    headers: Record<string, string | string[] | undefined>
  ): UzumWebhookResponse {
    const body = parseUzumBody(payload);
    const hdrs = headerRecord(headers);
    verifyUzumAuthorization(hdrs.authorization);
    verifyUzumWebhookSignature(body, headers);
    this.assertServiceId(body);

    switch (method) {
      case "check":
        return this.handleCheck(body);
      case "create":
        return this.handleCreate(body);
      case "confirm":
        return this.handleConfirm(body);
      case "reverse":
        return this.handleReverse(body);
      case "status":
        return this.handleStatus(body);
      default:
        throw new Error("UNSUPPORTED_PROVIDER");
    }
  }

  normalizeFromMethod(
    method: UzumWebhookMethod,
    body: Record<string, unknown>,
    response: UzumWebhookResponse
  ): NormalizedPaymentResult | null {
    const transId = String(body.transId ?? "");
    const orderId = extractAccount(body) || extractAccount(response);
    const status = String(response.status ?? "");

    if (method === "confirm" && status === UzumStatus.CONFIRMED) {
      const txn = findByUzumTransId(transId);
      const order = txn ? loadOrder(txn.orderId) : loadOrder(orderId);
      return {
        provider: PaymentProvider.UZUM,
        providerTransactionId: transId,
        orderId: order?.id ?? orderId,
        status: "PAID",
        amount: order?.amount ?? tiyinToSom(Number(response.amount ?? 0)),
        currency: order?.currency ?? paymentConfig.currency,
        rawPayload: { method, body, response },
      };
    }

    if (method === "reverse" && status === UzumStatus.REVERSED) {
      const txn = findByUzumTransId(transId);
      return {
        provider: PaymentProvider.UZUM,
        providerTransactionId: transId,
        orderId: txn?.orderId ?? orderId,
        status: "CANCELLED",
        amount: txn?.amount ?? 0,
        currency: txn?.currency ?? paymentConfig.currency,
        rawPayload: { method, body, response },
      };
    }

    return null;
  }

  async handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>
  ): Promise<NormalizedPaymentResult> {
    const body = parseUzumBody(payload);
    const method = String(body.method ?? "status").toLowerCase() as UzumWebhookMethod;
    const response = this.dispatchWebhook(method, payload, headers);
    const normalized = this.normalizeFromMethod(method, body, response);
    if (!normalized) {
      throw new Error("ORDER_NOT_PAYABLE");
    }
    return normalized;
  }

  async checkStatus(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    const meta = getUzumMeta(transaction);
    return {
      provider: PaymentProvider.UZUM,
      providerTransactionId: transaction.providerTransactionId ?? transaction.id,
      orderId: order.id,
      status:
        meta.uzumStatus === UzumStatus.CONFIRMED
          ? "PAID"
          : meta.uzumStatus === UzumStatus.REVERSED || meta.uzumStatus === UzumStatus.FAILED
            ? "CANCELLED"
            : "PENDING",
      amount: order.amount,
      currency: order.currency,
      rawPayload: { uzum: meta },
    };
  }

  async cancelPayment(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    const meta = getUzumMeta(transaction);
    const cancelTime = Date.now();
    const nextMeta: UzumTxnMeta = {
      ...meta,
      uzumStatus: UzumStatus.REVERSED,
      reverseTime: cancelTime,
    };
    saveUzumMeta(transaction.id, nextMeta);

    return {
      provider: PaymentProvider.UZUM,
      providerTransactionId: transaction.providerTransactionId ?? transaction.id,
      orderId: order.id,
      status: "CANCELLED",
      amount: order.amount,
      currency: order.currency,
      rawPayload: { reversed: true, uzum: nextMeta },
    };
  }

  private assertServiceId(body: Record<string, unknown>): void {
    const configured = paymentConfig.providers.uzum.serviceId;
    if (!configured) return;
    const incoming = Number(body.serviceId ?? 0);
    if (incoming && incoming !== Number(configured)) {
      throw new Error("WEBHOOK_INVALID_SIGNATURE");
    }
  }

  private requireOrder(body: Record<string, unknown>, requireAmount = false): Order {
    const orderId = extractAccount(body);
    if (!orderId) throw new Error("ORDER_NOT_FOUND");

    const order = loadOrder(orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");

    if (requireAmount && body.amount !== undefined) {
      if (!uzumAmountsMatch(order.amount, Number(body.amount))) {
        throw new Error("PAYMENT_AMOUNT_MISMATCH");
      }
    }

    if (order.status === "PAID") {
      throw new Error("ORDER_ALREADY_PAID");
    }

    if (order.status === "CANCELLED" || order.status === "EXPIRED") {
      throw new Error("ORDER_NOT_PAYABLE");
    }

    return order;
  }

  private baseResponse(body: Record<string, unknown>, extra: Record<string, unknown>): UzumWebhookResponse {
    return {
      serviceId: Number(body.serviceId ?? paymentConfig.providers.uzum.serviceId ?? 0),
      timestamp: Number(body.timestamp ?? Date.now()),
      ...extra,
    };
  }

  private handleCheck(body: Record<string, unknown>): UzumWebhookResponse {
    const req = toUzumRequest(body);
    const order = this.requireOrder(body, Boolean(req.amount));
    const account = extractAccount(body);

    return this.baseResponse(body, {
      status: UzumStatus.OK,
      data: accountData(account || order.id),
    });
  }

  private handleCreate(body: Record<string, unknown>): UzumWebhookResponse {
    const req = toUzumRequest(body);
    const transId = req.transId;
    if (!transId) throw new Error("TRANSACTION_NOT_FOUND");

    const existing = findByUzumTransId(transId);
    if (existing) {
      const meta = getUzumMeta(existing);
      return this.baseResponse(body, {
        transId,
        status: meta.uzumStatus === UzumStatus.FAILED ? UzumStatus.FAILED : UzumStatus.CREATED,
        transTime: meta.transTime,
        data: accountData(meta.account),
        amount: meta.amountTiyin,
      });
    }

    const order = this.requireOrder(body, true);
    const account = extractAccount(body) || order.id;
    const amountTiyin = somToTiyin(order.amount);
    const transTime = req.timestamp;

    createUzumTransaction(order, transId, amountTiyin, transTime, account);

    return this.baseResponse(body, {
      transId,
      status: UzumStatus.CREATED,
      transTime,
      data: accountData(account),
      amount: amountTiyin,
    });
  }

  private handleConfirm(body: Record<string, unknown>): UzumWebhookResponse {
    const req = toUzumRequest(body);
    const transId = req.transId;
    if (!transId) throw new Error("TRANSACTION_NOT_FOUND");

    const txn = findByUzumTransId(transId);
    if (!txn) throw new Error("TRANSACTION_NOT_FOUND");

    const meta = getUzumMeta(txn);
    const order = loadOrder(txn.orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");

    if (meta.uzumStatus === UzumStatus.CONFIRMED) {
      return this.baseResponse(body, {
        transId,
        status: UzumStatus.CONFIRMED,
        confirmTime: meta.confirmTime ?? Date.now(),
        data: accountData(meta.account),
        amount: meta.amountTiyin,
        _applyPayment: false,
      });
    }

    if (meta.uzumStatus === UzumStatus.REVERSED || meta.uzumStatus === UzumStatus.FAILED) {
      throw new Error("ORDER_NOT_PAYABLE");
    }

    if (order.status === "PAID") {
      return this.baseResponse(body, {
        transId,
        status: UzumStatus.CONFIRMED,
        confirmTime: meta.confirmTime ?? Date.now(),
        data: accountData(meta.account),
        amount: meta.amountTiyin,
        _applyPayment: false,
      });
    }

    const confirmTime = Date.now();
    const nextMeta: UzumTxnMeta = {
      ...meta,
      uzumStatus: UzumStatus.CONFIRMED,
      confirmTime,
    };
    saveUzumMeta(txn.id, nextMeta);

    return this.baseResponse(body, {
      transId,
      status: UzumStatus.CONFIRMED,
      confirmTime,
      data: accountData(meta.account),
      amount: meta.amountTiyin,
      _applyPayment: true,
      _normalized: {
        providerTransactionId: transId,
        orderId: order.id,
        amount: order.amount,
      },
    });
  }

  private handleReverse(body: Record<string, unknown>): UzumWebhookResponse {
    const req = toUzumRequest(body);
    const transId = req.transId;
    if (!transId) throw new Error("TRANSACTION_NOT_FOUND");

    const txn = findByUzumTransId(transId);
    if (!txn) throw new Error("TRANSACTION_NOT_FOUND");

    const meta = getUzumMeta(txn);

    if (meta.uzumStatus === UzumStatus.REVERSED) {
      return this.baseResponse(body, {
        transId,
        status: UzumStatus.REVERSED,
        reverseTime: meta.reverseTime ?? Date.now(),
        data: accountData(meta.account),
        amount: meta.amountTiyin,
        _applyPayment: false,
      });
    }

    if (meta.uzumStatus !== UzumStatus.CONFIRMED && meta.uzumStatus !== UzumStatus.CREATED) {
      throw new Error("ORDER_NOT_PAYABLE");
    }

    const reverseTime = Date.now();
    const nextMeta: UzumTxnMeta = {
      ...meta,
      uzumStatus: UzumStatus.REVERSED,
      reverseTime,
    };
    saveUzumMeta(txn.id, nextMeta);

    return this.baseResponse(body, {
      transId,
      status: UzumStatus.REVERSED,
      reverseTime,
      data: accountData(meta.account),
      amount: meta.amountTiyin,
      _applyPayment: true,
    });
  }

  private handleStatus(body: Record<string, unknown>): UzumWebhookResponse {
    const req = toUzumRequest(body);
    const transId = req.transId;
    if (!transId) throw new Error("TRANSACTION_NOT_FOUND");

    const txn = findByUzumTransId(transId);
    if (!txn) throw new Error("TRANSACTION_NOT_FOUND");

    let meta = markUzumFailedIfExpired(txn);

    return this.baseResponse(body, {
      transId,
      status: meta.uzumStatus,
      transTime: meta.transTime,
      confirmTime: meta.confirmTime,
      reverseTime: meta.reverseTime,
      data: accountData(meta.account),
      amount: meta.amountTiyin,
    });
  }
}

export const uzumPaymentAdapter = new UzumPaymentAdapter();
