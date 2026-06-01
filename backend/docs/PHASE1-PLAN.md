# Gildia Backend — Production Upgrade Plan

## 1. Current backend audit

| Area | Status |
|------|--------|
| Framework | Express 4 + TypeScript (`src/` → `dist/`), mounted from `server.js` |
| Database | SQLite (`better-sqlite3`), migration `001_initial.sql` |
| Auth | JWT + bcrypt; dev `X-Dev-User-Id` header |
| Legacy APIs | In-memory drafts/uploads in `server.js` (preserved) |
| Payments | JS module + JSON file store (preserved) |
| Storage | Local filesystem only |
| Response shape | `{ ok, data }` — not yet SaaS-standard |
| Rate limiting | None |
| Audit/activity | None |
| Plan limits | Plans seeded, no enforcement |
| Pagination | None on lists |
| Design versions / soft delete | None |
| Export jobs | Immediate upload, no status workflow |
| Admin | Templates CRUD only |

## 2. Missing backend systems

- Unified `{ success, error }` API contract
- Rate limiting & upload hardening
- S3/R2 storage driver + path conventions
- `audit_logs` + `activity_logs`
- Usage quotas + `billingService` capabilities
- Design draft versioning, soft delete, list without `canvasData`
- Export job states (`pending` → `completed` / `failed`)
- Event builder progress + `builder_state_json`
- Admin dashboard APIs (users, events, stats)
- `payments` table sync (Phase 2 bridge to existing payment.service)
- Organizations/teams (Phase 3)

## 3. Proposed database schema (Phase 1 adds migration `002`)

**Extended:** `design_drafts` (version, deleted_at, last_edited_at), `export_files` (status, error_message, updated_at), `templates` (tags_json, created_by), `billing_plans` (limits_json), `events` (builder_state_json)

**New:** `design_draft_versions`, `audit_logs`, `activity_logs`, `user_usage`, `payments` (core mirror)

## 4. API map (Phase 1)

| Module | Routes |
|--------|--------|
| Auth | Existing `/api/auth/*` |
| Events | + `GET /:id/progress`, builder state in PATCH |
| Event products | Existing nested + `GET /api/event-products?eventId=` |
| Designs | + pagination, soft delete, versions on save |
| Templates | Existing public list |
| Uploads | + validation middleware, R2 paths |
| Exports | + job status fields |
| Brand kits | Existing |
| Billing | + `GET /me` capabilities & usage |
| Admin | `/api/admin/stats`, `/users`, `/events`, `/templates/*` |
| Activity | `GET /api/activity` |

## 5. Service layer plan

| Service | Phase 1 responsibility |
|---------|------------------------|
| eventService | Progress summary, builder state |
| designService | Soft delete, version bump, list summaries |
| templateService | Tags, createdBy |
| uploadService | Validated paths, storage driver |
| exportService | Job lifecycle placeholder |
| brandKitService | Unchanged |
| billingService | Limits, usage, `getCapabilities()` |
| adminService | Stats, list users/events |
| activityService | Log + list feed |
| auditService | Security audit trail |

## 6. Storage plan

- `STORAGE_DRIVER=local|s3`
- S3-compatible (Cloudflare R2): `@aws-sdk/client-s3`
- Keys: `users/{userId}/events/{eventId}/assets/{file}`, `users/{userId}/designs/{designId}/exports/{file}`, `templates/{productType}/previews/{file}`
- Dev: local mirror of same key structure
- Phase 2: presigned PUT URLs

## 7. Security plan

- `requireAuth` on all private routes; `requireAdmin` on `/api/admin/*`
- Owner checks in services (unchanged pattern)
- `express-rate-limit` on auth + uploads
- Multer limits + MIME allowlist
- Strip `password_hash` from all responses
- Rate limit JSON body size (existing 1mb in server.js)

## Phase 1 implementation scope (this commit)

Migration 002, response helpers, rate limit, upload validation, S3 storage driver, activity/audit/billing-limits/admin services, route updates, pagination, event progress, billing `/me`, admin stats, design soft-delete + versions, export job status.

**Not in Phase 1:** Presigned URLs, full render pipeline, payment.service DB sync, organizations UI, reported issues.

---

## Phase 1 status: complete

- Migration `002_production_foundation.sql` applied on startup
- `npm run build` + `npm run typecheck` pass
- New routers: `/api/event-products`, `/api/admin`, `/api/activity`, `/api/dashboard`
- Rate limits on auth, API, uploads
- See `backend/ARCHITECTURE.md` for mount order with legacy `server.js` routes
