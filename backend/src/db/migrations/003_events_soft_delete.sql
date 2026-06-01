-- Phase 2: event soft delete
ALTER TABLE events ADD COLUMN deleted_at TEXT;

CREATE INDEX IF NOT EXISTS idx_events_user_deleted ON events(user_id, deleted_at);
