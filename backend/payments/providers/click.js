const { PAYMENT_STATUS, PAYMENT_PROVIDERS } = require("../payment.types");

function createPayment({ order }) {
  return {
    provider: PAYMENT_PROVIDERS.CLICK,
    providerOrderId: `click_${order.id}`,
    paymentUrl: `https://checkout.click.uz/pay/${order.id}`,
    instructions: `Open the Click payment link to complete the order for ${order.amount} ${order.currency}.`,
    amount: order.amount,
    currency: order.currency,
    status: PAYMENT_STATUS.PENDING,
  };
}

function verifyCallback({ body, headers }) {
  const token = body.signature || headers["x-click-signature"];
  const expected = process.env.CLICK_WEBHOOK_SECRET || "click_test_secret";

  if (!token || token !== expected) {
    throw new Error("Invalid Click webhook signature");
  }

  return {
    status: PAYMENT_STATUS.PAID,
    providerTransactionId: body.transaction_id || body.txn_id || `click_tx_${Date.now()}`,
  };
}

module.exports = {
  provider: PAYMENT_PROVIDERS.CLICK,
  createPayment,
  verifyCallback,
};
