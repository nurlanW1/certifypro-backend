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
import { verifyPaymeAuthorization } from "./payme.auth";
import { paymeAmountsMatch, somToTiyin, tiyinToSom } from "./payme.amount";
import { PaymeRpcError } from "./payme.errors";
import {
  createPaymeTransaction,
  extractOrderIdFromAccount,
  findByPaymeId,
  getPaymeMeta,
  listPaymeStatement,
  loadOrder,
  savePaymeMeta,
  toCheckTransactionResult,
} from "./payme.store";
import {
  parsePaymeRpcRequest,
  PaymeState,
  paymeSuccess,
  type PaymeAccount,
  type PaymeRpcRequest,
  type PaymeRpcResponse,
  type PaymeTxnMeta,
} from "./payme.types";

export class PaymePaymentAdapter implements PaymentGatewayAdapter {
  readonly provider = PaymentProvider.PAYME;

  assertConfigured(): void {
    const c = paymentConfig.providers.payme;
    if (!c.merchantId || !c.secretKey) {
      throw new Error("PAYME_NOT_CONFIGURED");
    }
  }

  getShopReturnUrl(): string {
    return `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/api/payments/payme/return`;
  }

  getFrontendReturnUrl(): string {
    return (
      paymentConfig.providers.payme.returnUrl ||
      `${paymentConfig.callbackBaseUrl.replace(/\/$/, "")}/pricing`
    );
  }

  buildCheckoutUrl(order: Order, returnUrl?: string): string {
    this.assertConfigured();
    const merchantId = paymentConfig.providers.payme.merchantId;
    const params = {
      m: merchantId,
      ac: { order_id: order.id },
      a: somToTiyin(order.amount),
      c: returnUrl ?? this.getShopReturnUrl(),
      l: order.description ?? "Payment",
    };
    const encoded = Buffer.from(JSON.stringify(params)).toString("base64");
    return `${paymentConfig.providers.payme.checkoutBaseUrl}/${encoded}`;
  }

  async createPayment(ctx: PaymentGatewayContext): Promise<CreatePaymentSessionResult> {
    const returnUrl = ctx.returnUrl ?? this.getShopReturnUrl();
    const paymentUrl = this.buildCheckoutUrl(ctx.order, returnUrl);

    return {
      paymentUrl,
      instructions: `To'lovni Payme orqali yakunlang (${ctx.order.amount} ${ctx.order.currency}).`,
      providerTransactionId: ctx.transaction.id,
      rawResponse: { paymentUrl, returnUrl, amountTiyin: somToTiyin(ctx.order.amount) },
    };
  }

  async handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>
  ): Promise<NormalizedPaymentResult> {
    const hdrs = headerRecord(headers);
    verifyPaymeAuthorization(hdrs.authorization);
    const response = this.dispatchJsonRpc(parsePaymeRpcRequest(payload), hdrs.authorization);
    if (response.error) {
      throw new Error("WEBHOOK_INVALID_SIGNATURE");
    }
    const result = response.result ?? {};
    const orderId = String(
      (result.account as PaymeAccount | undefined)?.order_id ??
        extractOrderIdFromAccount(result.account as PaymeAccount) ??
        ""
    );
    return {
      provider: PaymentProvider.PAYME,
      providerTransactionId: String(result.id ?? ""),
      orderId,
      status: Number(result.state) === PaymeState.COMPLETED ? "PAID" : "PENDING",
      amount: tiyinToSom(Number(result.amount ?? 0)),
      currency: paymentConfig.currency,
      rawPayload: { rpc: payload, response },
    };
  }

  dispatchJsonRpc(
    request: PaymeRpcRequest,
    authorization?: string | string[]
  ): PaymeRpcResponse {
    verifyPaymeAuthorization(authorization);

    const method = String(request.method ?? "");
    const params = (request.params ?? {}) as Record<string, unknown>;
    const id = request.id ?? null;

    try {
      let result: Record<string, unknown>;
      switch (method) {
        case "CheckPerformTransaction":
          result = this.checkPerformTransaction(params);
          break;
        case "CreateTransaction":
          result = this.createTransaction(params);
          break;
        case "PerformTransaction":
          result = this.performTransaction(params);
          break;
        case "CancelTransaction":
          result = this.cancelTransaction(params);
          break;
        case "CheckTransaction":
          result = this.checkTransaction(params);
          break;
        case "GetStatement":
          result = this.getStatement(params);
          break;
        default:
          throw PaymeRpcError.methodNotFound();
      }
      return paymeSuccess(id, result);
    } catch (err) {
      if (err instanceof PaymeRpcError) {
        return err.toJsonRpc(id);
      }
      console.error("[payme]", err);
      return PaymeRpcError.systemError().toJsonRpc(id);
    }
  }

  shouldApplyEntitlement(method: string, response: PaymeRpcResponse): boolean {
    return method === "PerformTransaction" && !response.error && response.result?.state === PaymeState.COMPLETED;
  }

  checkPerformTransaction(params: Record<string, unknown>): Record<string, unknown> {
    const order = this.requireValidOrder(params);
    return { allow: true, additional: { order_id: order.id } };
  }

  createTransaction(params: Record<string, unknown>): Record<string, unknown> {
    const order = this.requireValidOrder(params);
    const paymeId = String(params.id ?? "");
    const time = Number(params.time ?? Date.now());

    if (!paymeId) throw PaymeRpcError.systemError();

    const existing = findByPaymeId(paymeId);
    if (existing) {
      const meta = getPaymeMeta(existing);
      return {
        create_time: meta.createTime,
        transaction: existing.id,
        state: meta.paymeState,
      };
    }

    const txn = createPaymeTransaction(order, paymeId, time);
    const meta = getPaymeMeta(txn);
    return {
      create_time: meta.createTime,
      transaction: txn.id,
      state: meta.paymeState,
    };
  }

  performTransaction(params: Record<string, unknown>): Record<string, unknown> {
    const paymeId = String(params.id ?? "");
    const txn = findByPaymeId(paymeId);
    if (!txn) throw PaymeRpcError.transactionNotFound();

    const meta = getPaymeMeta(txn);
    if (meta.paymeState === PaymeState.COMPLETED) {
      return {
        transaction: txn.id,
        perform_time: meta.performTime,
        state: meta.paymeState,
      };
    }

    if (meta.paymeState < 0) {
      throw PaymeRpcError.unableToComplete();
    }

    const order = loadOrder(txn.orderId);
    if (!order) throw PaymeRpcError.orderNotFound("order_id");
    if (order.status === "PAID") {
      return {
        transaction: txn.id,
        perform_time: meta.performTime || Date.now(),
        state: PaymeState.COMPLETED,
      };
    }

    const performTime = Date.now();
    const nextMeta: PaymeTxnMeta = {
      ...meta,
      paymeState: PaymeState.COMPLETED,
      performTime,
    };
    savePaymeMeta(txn.id, nextMeta);

    return {
      transaction: txn.id,
      perform_time: performTime,
      state: PaymeState.COMPLETED,
      _normalized: {
        providerTransactionId: paymeId,
        orderId: order.id,
        amount: order.amount,
      },
    };
  }

  cancelTransaction(params: Record<string, unknown>): Record<string, unknown> {
    const paymeId = String(params.id ?? "");
    const reason = Number(params.reason ?? 0);
    const txn = findByPaymeId(paymeId);
    if (!txn) throw PaymeRpcError.transactionNotFound();

    const meta = getPaymeMeta(txn);
    if (meta.paymeState < 0) {
      return {
        transaction: txn.id,
        cancel_time: meta.cancelTime,
        state: meta.paymeState,
      };
    }

    if (meta.paymeState === PaymeState.COMPLETED) {
      throw PaymeRpcError.cantCancel();
    }

    const cancelTime = Date.now();
    const nextState = PaymeState.CANCELLED;

    const nextMeta: PaymeTxnMeta = {
      ...meta,
      paymeState: nextState,
      cancelTime,
      reason,
    };
    savePaymeMeta(txn.id, nextMeta, { cancelled: true });

    return {
      transaction: txn.id,
      cancel_time: cancelTime,
      state: nextState,
    };
  }

  checkTransaction(params: Record<string, unknown>): Record<string, unknown> {
    const paymeId = String(params.id ?? "");
    const txn = findByPaymeId(paymeId);
    if (!txn) throw PaymeRpcError.transactionNotFound();
    return toCheckTransactionResult(txn);
  }

  getStatement(params: Record<string, unknown>): Record<string, unknown> {
    const from = Number(params.from ?? 0);
    const to = Number(params.to ?? Date.now());
    const txns = listPaymeStatement(from, to);
    const transactions = txns
      .filter((t) => t.providerTransactionId)
      .map((t) => {
        const meta = getPaymeMeta(t);
        return {
          id: t.providerTransactionId,
          time: meta.createTime,
          amount: somToTiyin(t.amount),
          account: { order_id: t.orderId },
          create_time: meta.createTime,
          perform_time: meta.performTime,
          cancel_time: meta.cancelTime,
          transaction: t.id,
          state: meta.paymeState,
          reason: meta.reason,
        };
      });
    return { transactions };
  }

  private requireValidOrder(params: Record<string, unknown>): Order {
    const account = (params.account ?? {}) as PaymeAccount;
    const orderId = extractOrderIdFromAccount(account);
    if (!orderId) throw PaymeRpcError.orderNotFound("order_id");

    const order = loadOrder(orderId);
    if (!order) throw PaymeRpcError.orderNotFound("order_id");

    const amount = Number(params.amount ?? 0);
    if (!paymeAmountsMatch(order.amount, amount)) {
      throw PaymeRpcError.wrongAmount("amount");
    }

    if (order.status === "PAID") {
      throw PaymeRpcError.terminalState();
    }

    if (order.status === "CANCELLED" || order.status === "EXPIRED") {
      throw PaymeRpcError.unableToComplete();
    }

    return order;
  }

  async checkStatus(
    transaction: PaymentGatewayContext["transaction"],
    order: Order
  ): Promise<NormalizedPaymentResult> {
    const meta = getPaymeMeta(transaction);
    return {
      provider: PaymentProvider.PAYME,
      providerTransactionId: transaction.providerTransactionId ?? transaction.id,
      orderId: order.id,
      status:
        meta.paymeState === PaymeState.COMPLETED
          ? "PAID"
          : meta.paymeState < 0
            ? "CANCELLED"
            : "PENDING",
      amount: order.amount,
      currency: order.currency,
      rawPayload: { payme: meta },
    };
  }
}

export const paymePaymentAdapter = new PaymePaymentAdapter();
