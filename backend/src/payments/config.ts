import { config } from "../config";

export const paymentConfig = {
  callbackBaseUrl:
    process.env.PAYMENT_CALLBACK_BASE_URL ||
    config.storagePublicBaseUrl.replace(/\/$/, ""),
  currency: "UZS" as const,
  providers: {
    click: {
      serviceId: process.env.CLICK_SERVICE_ID || "",
      merchantId: process.env.CLICK_MERCHANT_ID || "",
      secretKey: process.env.CLICK_SECRET_KEY || "",
      merchantUserId: process.env.CLICK_MERCHANT_USER_ID || "",
      returnUrl: process.env.CLICK_RETURN_URL || "",
      webhookSecret: process.env.CLICK_WEBHOOK_SECRET || "",
      payBaseUrl: process.env.CLICK_PAY_BASE_URL || "https://my.click.uz/services/pay",
    },
    payme: {
      merchantId: process.env.PAYME_MERCHANT_ID || "",
      secretKey: process.env.PAYME_SECRET_KEY || "",
      returnUrl: process.env.PAYME_RETURN_URL || "",
      checkoutBaseUrl: process.env.PAYME_CHECKOUT_BASE_URL || "https://checkout.paycom.uz",
    },
    uzum: {
      merchantId: process.env.UZUM_MERCHANT_ID || "",
      secretKey: process.env.UZUM_SECRET_KEY || "",
      serviceId: process.env.UZUM_SERVICE_ID || "",
      returnUrl: process.env.UZUM_RETURN_URL || "",
      webhookSecret: process.env.UZUM_WEBHOOK_SECRET || "",
      checkoutBaseUrl: process.env.UZUM_CHECKOUT_BASE_URL || "https://checkout.uzum.uz",
    },
    paynet: {
      merchantId: process.env.PAYNET_MERCHANT_ID || "",
      secretKey: process.env.PAYNET_SECRET_KEY || "",
      serviceId: process.env.PAYNET_SERVICE_ID || "",
      returnUrl: process.env.PAYNET_RETURN_URL || "",
    },
  },
};
