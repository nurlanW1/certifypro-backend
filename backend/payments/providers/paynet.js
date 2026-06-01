const { PAYMENT_STATUS, PAYMENT_PROVIDERS } = require("../payment.types");

function createPayment({ order }) {
  return {
    provider: PAYMENT_PROVIDERS.PAYNET,
    providerOrderId: `paynet_${order.id}`,
    paymentUrl: `https://checkout.paynet.uz/pay/${order.id}`,
    instructions: `Open the Paynet payment link to complete the order for ${order.amount} ${order.currency}.`,
    amount: order.amount,
    currency: order.currency,
    status: PAYMENT_STATUS.PENDING,
  };
}

function verifyCallback({ body, headers }) {
  const token = body.signature || headers["x-paynet-signature"];
  const expected = process.env.PAYNET_WEBHOOK_SECRET || "paynet_test_secret";

  if (!token || token !== expected) {
    throw new Error("Invalid Paynet webhook signature");
  }

  return {
    status: PAYMENT_STATUS.PAID,
    providerTransactionId: body.transaction_id || body.txn_id || `paynet_tx_${Date.now()}`,
  };
}

module.exports = {
  provider: PAYMENT_PROVIDERS.PAYNET,
  createPayment,
  verifyCallback,
};
