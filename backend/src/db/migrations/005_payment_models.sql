-- Phase: payment gateway models (additive — does not modify legacy `payments` table)

-- Extend existing plan catalog (billing_plans) with subscription duration + description
ALTER TABLE billing_plans ADD COLUMN description TEXT;
ALTER TABLE billing_plans ADD COLUMN duration_days INTEGER;

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('PLAN', 'EVENT_PACKAGE', 'EXPORT', 'TEMPLATE_PURCHASE')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED')
  ),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UZS',
  description TEXT,
  plan_id TEXT REFERENCES billing_plans(id) ON DELETE SET NULL,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  design_draft_id TEXT REFERENCES design_drafts(id) ON DELETE SET NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_plan_id ON orders(plan_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('CLICK', 'PAYME', 'UZUM', 'PAYNET')),
  provider_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (
    status IN ('CREATED', 'PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED')
  ),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UZS',
  request_payload_json TEXT NOT NULL DEFAULT '{}',
  response_payload_json TEXT NOT NULL DEFAULT '{}',
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider ON payment_transactions(provider);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_transactions_provider_txn
  ON payment_transactions(provider, provider_transaction_id)
  WHERE provider_transaction_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS user_entitlements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES billing_plans(id) ON DELETE SET NULL,
  source_order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
  features_json TEXT NOT NULL DEFAULT '[]',
  limits_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id ON user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_status ON user_entitlements(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_source_order ON user_entitlements(source_order_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_ends_at ON user_entitlements(ends_at);

CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('CLICK', 'PAYME', 'UZUM', 'PAYNET')),
  transaction_id TEXT REFERENCES payment_transactions(id) ON DELETE SET NULL,
  raw_payload_json TEXT NOT NULL DEFAULT '{}',
  headers_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'received',
  error_message TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_provider ON payment_webhook_logs(provider);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_transaction_id ON payment_webhook_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_status ON payment_webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_created_at ON payment_webhook_logs(created_at);
