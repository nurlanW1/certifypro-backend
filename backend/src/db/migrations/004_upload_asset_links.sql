-- Phase 4: link uploads to designs and brand kits
ALTER TABLE uploaded_assets ADD COLUMN design_draft_id TEXT REFERENCES design_drafts(id) ON DELETE SET NULL;
ALTER TABLE uploaded_assets ADD COLUMN brand_kit_id TEXT REFERENCES brand_kits(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_uploaded_assets_event_id ON uploaded_assets(event_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_assets_design_id ON uploaded_assets(design_draft_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_assets_brand_kit_id ON uploaded_assets(brand_kit_id);
