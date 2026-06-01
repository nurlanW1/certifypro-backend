const { PAYMENT_STATUS, PAYMENT_PROVIDERS } = require("../payment.types");

function createPayment({ order }) {
  return {
    provider: PAYMENT_PROVIDERS.PAYME,
    providerOrderId: `payme_${order.id}`,
    paymentUrl: `https://checkout.payme.uz/pay/${order.id}`,
    instructions: `Open the Payme payment link to complete the order for ${order.amount} ${order.currency}.`,
    amount: order.amount,
    currency: order.currency,
    status: PAYMENT_STATUS.PENDING,
  };
}

function verifyCallback({ body, headers }) {
  const token = body.signature || headers["x-payme-signature"];
  const expected = process.env.PAYME_WEBHOOK_SECRET || "payme_test_secret";

  if (!token || token !== expected) {
    throw new Error("Invalid Payme webhook signature");
  }

  return {
    status: PAYMENT_STATUS.PAID,
    providerTransactionId: body.transaction_id || body.txn_id || `payme_tx_${Date.now()}`,
  };
}

module.exports = {
  provider: PAYMENT_PROVIDERS.PAYME,
  createPayment,
  verifyCallback,
};
