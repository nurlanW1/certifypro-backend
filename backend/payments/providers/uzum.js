const { PAYMENT_STATUS, PAYMENT_PROVIDERS } = require("../payment.types");

function createPayment({ order }) {
  return {
    provider: PAYMENT_PROVIDERS.UZUM,
    providerOrderId: `uzum_${order.id}`,
    paymentUrl: `https://checkout.uzum.uz/pay/${order.id}`,
    instructions: `Open the Uzum payment link to complete the order for ${order.amount} ${order.currency}.`,
    amount: order.amount,
    currency: order.currency,
    status: PAYMENT_STATUS.PENDING,
  };
}

function verifyCallback({ body, headers }) {
  const token = body.signature || headers["x-uzum-signature"];
  const expected = process.env.UZUM_WEBHOOK_SECRET || "uzum_test_secret";

  if (!token || token !== expected) {
    throw new Error("Invalid Uzum webhook signature");
  }

  return {
    status: PAYMENT_STATUS.PAID,
    providerTransactionId: body.transaction_id || body.txn_id || `uzum_tx_${Date.now()}`,
  };
}

module.exports = {
  provider: PAYMENT_PROVIDERS.UZUM,
  createPayment,
  verifyCallback,
};
