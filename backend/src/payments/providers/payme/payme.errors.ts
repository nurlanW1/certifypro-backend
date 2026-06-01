import type { PaymeRpcErrorBody, PaymeRpcResponse } from "./payme.types";

export const PaymeErrorCode = {
  INVALID_JSON: -32700,
  METHOD_NOT_FOUND: -32601,
  ACCESS_DENIED: -32504,
  SYSTEM_ERROR: -32400,
  WRONG_AMOUNT: -31001,
  TRANSACTION_NOT_FOUND: -31003,
  CANT_CANCEL: -31007,
  UNABLE_TO_COMPLETE: -31008,
  ORDER_NOT_FOUND: -31050,
  IN_PROGRESS: -31088,
  TERMINAL_STATE: -31098,
  PENDING: -31099,
} as const;

type PaymeMessage = { ru: string; uz: string; en: string };

const messages = {
  accessDenied: {
    ru: "Ошибка аутентификации",
    uz: "Autentifikatsiya xatosi",
    en: "Authentication failed",
  },
  orderNotFound: {
    ru: "Заказ не найден",
    uz: "Buyurtma topilmadi",
    en: "Order not found",
  },
  wrongAmount: {
    ru: "Неверная сумма",
    uz: "Noto'g'ri summa",
    en: "Incorrect amount",
  },
  unableToComplete: {
    ru: "Невозможно выполнить операцию",
    uz: "Amalni bajarib bo'lmadi",
    en: "Unable to complete operation",
  },
  transactionNotFound: {
    ru: "Транзакция не найдена",
    uz: "Tranzaksiya topilmadi",
    en: "Transaction not found",
  },
  cantCancel: {
    ru: "Невозможно отменить транзакцию",
    uz: "Tranzaksiyani bekor qilib bo'lmadi",
    en: "Cannot cancel transaction",
  },
  orderAlreadyPaid: {
    ru: "Заказ уже оплачен",
    uz: "Buyurtma allaqachon to'langan",
    en: "Order already paid",
  },
  orderNotPayable: {
    ru: "Заказ недоступен для оплаты",
    uz: "Buyurtma uchun to'lov mumkin emas",
    en: "Order is not payable",
  },
  methodNotFound: {
    ru: "Метод не найден",
    uz: "Metod topilmadi",
    en: "Method not found",
  },
  systemError: {
    ru: "Системная ошибка",
    uz: "Tizim xatosi",
    en: "System error",
  },
} as const satisfies Record<string, PaymeMessage>;

export class PaymeRpcError extends Error {
  readonly code: number;
  readonly rpcMessage: PaymeMessage;
  readonly data?: string;

  constructor(code: number, rpcMessage: PaymeMessage, data?: string) {
    super(rpcMessage.en);
    this.code = code;
    this.rpcMessage = rpcMessage;
    this.data = data;
  }

  toJsonRpc(id: number | string | null): PaymeRpcResponse {
    const body: PaymeRpcErrorBody = {
      code: this.code,
      message: this.rpcMessage,
    };
    if (this.data) body.data = this.data;
    return { error: body, id };
  }

  static accessDenied(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.ACCESS_DENIED, messages.accessDenied);
  }

  static orderNotFound(data?: string): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.ORDER_NOT_FOUND, messages.orderNotFound, data);
  }

  static wrongAmount(data?: string): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.WRONG_AMOUNT, messages.wrongAmount, data);
  }

  static transactionNotFound(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.TRANSACTION_NOT_FOUND, messages.transactionNotFound);
  }

  static unableToComplete(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.UNABLE_TO_COMPLETE, messages.unableToComplete);
  }

  static cantCancel(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.CANT_CANCEL, messages.cantCancel);
  }

  static terminalState(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.TERMINAL_STATE, messages.orderAlreadyPaid);
  }

  static methodNotFound(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.METHOD_NOT_FOUND, messages.methodNotFound);
  }

  static systemError(): PaymeRpcError {
    return new PaymeRpcError(PaymeErrorCode.SYSTEM_ERROR, messages.systemError);
  }
}
