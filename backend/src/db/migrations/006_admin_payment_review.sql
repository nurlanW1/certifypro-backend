-- Admin payment review & audit trail

ALTER TABLE payment_webhook_logs ADD COLUMN reviewed_at TEXT;
ALTER TABLE payment_webhook_logs ADD COLUMN reviewed_by_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE payment_webhook_logs ADD COLUMN review_note TEXT;

CREATE INDEX IF NOT EXISTS idx_payment_webhook_logs_reviewed_at ON payment_webhook_logs(reviewed_at);

CREATE TABLE IF NOT EXISTS admin_payment_audit_log (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  transaction_id TEXT REFERENCES payment_transactions(id) ON DELETE SET NULL,
  webhook_log_id TEXT REFERENCES payment_webhook_logs(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_payment_audit_admin ON admin_payment_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_payment_audit_order ON admin_payment_audit_log(order_id);
CREATE INDEX IF NOT EXISTS idx_admin_payment_audit_created ON admin_payment_audit_log(created_at);
