-- Gildia core schema v1

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS billing_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'UZS',
  features_json TEXT NOT NULL DEFAULT '[]',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'conference',
  organization_name TEXT,
  date TEXT,
  location TEXT,
  description TEXT,
  language TEXT DEFAULT 'uz',
  participant_estimate INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

CREATE TABLE IF NOT EXISTS event_products (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  form_data_json TEXT NOT NULL DEFAULT '{}',
  template_id TEXT,
  design_draft_id TEXT,
  preview_thumbnail_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_event_products_event_id ON event_products(event_id);

CREATE TABLE IF NOT EXISTS design_drafts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  event_product_id TEXT REFERENCES event_products(id) ON DELETE SET NULL,
  product_type TEXT NOT NULL,
  title TEXT NOT NULL,
  canvas_data_json TEXT NOT NULL DEFAULT '{"elements":[]}',
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'saved', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_design_drafts_user_id ON design_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_design_drafts_event_id ON design_drafts(event_id);

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  product_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  size TEXT,
  orientation TEXT,
  default_canvas_data_json TEXT NOT NULL DEFAULT '{}',
  preview_url TEXT,
  is_premium INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_templates_product_type ON templates(product_type);

CREATE TABLE IF NOT EXISTS uploaded_assets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  storage_key TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_uploaded_assets_user_id ON uploaded_assets(user_id);

CREATE TABLE IF NOT EXISTS brand_kits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  logos_json TEXT NOT NULL DEFAULT '[]',
  colors_json TEXT NOT NULL DEFAULT '[]',
  fonts_json TEXT NOT NULL DEFAULT '[]',
  signatures_json TEXT NOT NULL DEFAULT '[]',
  stamps_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_brand_kits_user_id ON brand_kits(user_id);

CREATE TABLE IF NOT EXISTS export_files (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_draft_id TEXT NOT NULL REFERENCES design_drafts(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  file_url TEXT NOT NULL,
  storage_key TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_export_files_user_id ON export_files(user_id);
CREATE INDEX IF NOT EXISTS idx_export_files_design_draft_id ON export_files(design_draft_id);
