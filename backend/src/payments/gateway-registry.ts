import type { PaymentProvider } from "../db/models/payment-transaction.model";
import type { PaymentGatewayAdapter } from "./types";
import { ClickPaymentAdapter } from "./providers/click/click-payment.adapter";
import { PaymePaymentAdapter } from "./providers/payme/payme-payment.adapter";
import { UzumPaymentAdapter } from "./providers/uzum/uzum-payment.adapter";
import { PaynetPaymentAdapter } from "./providers/paynet/paynet-payment.adapter";

const adapters: Record<PaymentProvider, PaymentGatewayAdapter> = {
  CLICK: new ClickPaymentAdapter(),
  PAYME: new PaymePaymentAdapter(),
  UZUM: new UzumPaymentAdapter(),
  PAYNET: new PaynetPaymentAdapter(),
};

export function getPaymentGateway(provider: PaymentProvider): PaymentGatewayAdapter {
  const gateway = adapters[provider];
  if (!gateway) throw new Error("UNSUPPORTED_PROVIDER");
  return gateway;
}

export function listPaymentProviders(): PaymentProvider[] {
  return Object.keys(adapters) as PaymentProvider[];
}
