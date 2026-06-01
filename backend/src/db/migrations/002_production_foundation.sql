-- Phase 1: production foundation extensions

ALTER TABLE events ADD COLUMN builder_state_json TEXT NOT NULL DEFAULT '{}';

ALTER TABLE design_drafts ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE design_drafts ADD COLUMN deleted_at TEXT;
ALTER TABLE design_drafts ADD COLUMN last_edited_at TEXT;

ALTER TABLE export_files ADD COLUMN status TEXT NOT NULL DEFAULT 'completed';
ALTER TABLE export_files ADD COLUMN error_message TEXT;
ALTER TABLE export_files ADD COLUMN updated_at TEXT;

ALTER TABLE templates ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE templates ADD COLUMN created_by TEXT;

ALTER TABLE billing_plans ADD COLUMN limits_json TEXT NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS design_draft_versions (
  id TEXT PRIMARY KEY,
  design_draft_id TEXT NOT NULL REFERENCES design_drafts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  canvas_data_json TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_design_draft_versions_draft ON design_draft_versions(design_draft_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  title TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

CREATE TABLE IF NOT EXISTS user_usage (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  designs_count INTEGER NOT NULL DEFAULT 0,
  exports_count INTEGER NOT NULL DEFAULT 0,
  events_count INTEGER NOT NULL DEFAULT 0,
  period_start TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  plan_id TEXT,
  provider TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'UZS',
  status TEXT NOT NULL DEFAULT 'pending',
  provider_transaction_id TEXT,
  description TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  paid_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Backfill last_edited_at from updated_at
UPDATE design_drafts SET last_edited_at = updated_at WHERE last_edited_at IS NULL;
UPDATE export_files SET updated_at = created_at WHERE updated_at IS NULL;
