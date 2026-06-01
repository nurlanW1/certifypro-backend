const { randomUUID } = require("crypto");
const { readStore, writeStore } = require("./data-store");
const { PAYMENT_STATUS, PAYMENT_PROVIDERS, CURRENCY } = require("./payment.types");

const providers = {
  [PAYMENT_PROVIDERS.CLICK]: require("./providers/click"),
  [PAYMENT_PROVIDERS.PAYME]: require("./providers/payme"),
  [PAYMENT_PROVIDERS.UZUM]: require("./providers/uzum"),
  [PAYMENT_PROVIDERS.PAYNET]: require("./providers/paynet"),
};

function normalizeAmount(amount) {
  const parsed = Number(amount);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error("Amount must be a positive number");
  }
  return Math.round(parsed);
}

async function listOrders() {
  return await readStore();
}

async function getOrderById(orderId) {
  const orders = await readStore();
  return orders.find((order) => order.id === orderId) || null;
}

async function saveOrder(order) {
  const orders = await readStore();
  const index = orders.findIndex((item) => item.id === order.id);
  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.push(order);
  }
  await writeStore(orders);
  return order;
}

async function createOrder({ userId, planId, productId, provider, amount, description }) {
  if (!provider || !providers[provider]) {
    throw new Error(`Unsupported payment provider: ${provider}`);
  }

  const normalizedAmount = normalizeAmount(amount);
  const orderId = `order_${randomUUID()}`;
  const order = {
    id: orderId,
    userId: userId || null,
    planId: planId || null,
    productId: productId || null,
    provider,
    amount: normalizedAmount,
    currency: CURRENCY,
    status: PAYMENT_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    paidAt: null,
    providerTransactionId: null,
    description: description || "Gildia payment order",
    paymentUrl: null,
  };

  await saveOrder(order);

  const providerModule = providers[provider];
  const paymentDetails = await providerModule.createPayment({ order });

  order.paymentUrl = paymentDetails.paymentUrl || null;
  order.providerTransactionId = paymentDetails.providerOrderId || order.providerTransactionId;
  await saveOrder(order);

  return {
    order,
    paymentDetails,
  };
}

async function updateOrderStatus(orderId, status, updates = {}) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  order.status = status;
  if (status === PAYMENT_STATUS.PAID) {
    order.paidAt = new Date().toISOString();
  }
  if (updates.providerTransactionId) {
    order.providerTransactionId = updates.providerTransactionId;
  }
  if (updates.notes) {
    order.notes = updates.notes;
  }

  await saveOrder(order);
  return order;
}

async function getProvider(providerName) {
  return providers[providerName] || null;
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getProvider,
  PAYMENT_STATUS,
  PAYMENT_PROVIDERS,
};
