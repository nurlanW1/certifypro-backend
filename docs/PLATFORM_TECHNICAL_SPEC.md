# GILDIA.UZ Platform Technical Specification (Execution Version)

## 1) Product Goal

Build Gildia.uz as an event-design operating system for Central Asia: a focused platform for conference/event identity creation, bulk document generation, and print-ready delivery.

## 2) Scope Definition

### Phase 1 (MVP)
- Workspace-based projects (one event = one workspace)
- Template marketplace (certificate, badge, invitation, flyer)
- Drag-and-drop editor essentials (layers, align, lock, group, autosave, undo/redo)
- Bulk generation from XLSX/CSV
- QR code generation and dynamic placement
- Export: PDF print + PNG
- Free vs Premium gating (watermark + limits)
- Basic admin panel for template and user management

### Phase 2
- Team collaboration roles (owner/admin/editor/viewer)
- Advanced asset library and branding kits
- Payment integrations (Click, Payme, Uzum, Paynet)
- Event analytics and project history

### Phase 3
- AI-assisted layout/text generation
- Attendance + badge verification workflows
- API and enterprise integrations

## 3) Recommended System Architecture

### Frontend
- `public/` is current static UI.
- Next step: migrate to SPA app (React + TypeScript) while keeping existing backend endpoints compatible.
- Key modules:
  - Dashboard
  - Workspace
  - Template catalog
  - Editor canvas
  - Bulk generator
  - Export center
  - Billing

### Backend
- Existing `backend/server.js` remains primary API service.
- Add module boundaries:
  - Auth & User
  - Workspace
  - Template
  - Asset
  - Bulk Job
  - Export
  - Billing
  - Admin

### Storage
- Cloudflare R2 for assets, template resources, generated ZIP/PDF outputs.
- Metadata DB (recommended PostgreSQL):
  - users, subscriptions, workspaces, templates, projects, assets, bulk_jobs, exports

### Queue/Background Processing
- Use existing Bull + Redis dependencies for long-running tasks:
  - bulk certificate generation
  - ZIP packaging
  - heavy export rendering

## 4) Data Model (Core Entities)

- `User`
- `Subscription`
- `Workspace`
- `WorkspaceMember`
- `Template`
- `TemplateLayer`
- `Project`
- `Asset`
- `BulkJob`
- `BulkRow`
- `ExportTask`
- `PaymentTransaction`

## 5) API Surface (Initial)

- `POST /api/auth/*`
- `GET /api/templates`
- `POST /api/workspaces`
- `GET /api/workspaces/:id/projects`
- `POST /api/projects/:id/assets`
- `POST /api/projects/:id/bulk/upload`
- `POST /api/projects/:id/bulk/generate`
- `GET /api/bulk-jobs/:id/status`
- `POST /api/projects/:id/export`
- `GET /api/exports/:id/download`
- `POST /api/payments/:provider/webhook`

## 6) Bulk Automation Pipeline

1. Upload XLSX/CSV
2. Map spreadsheet columns to template fields
3. Validate rows and show row-level errors
4. Queue generation job
5. Render outputs in worker
6. Store files in R2
7. Provide previews + ZIP download

## 7) Quality & Non-Functional Requirements

- Multi-tenant isolation per workspace
- Autosave every 3-5 seconds in editor
- Idempotent export and payment webhook handling
- Audit logs for admin actions
- Target response:
  - normal API requests < 500ms
  - bulk jobs async with progress reporting

## 8) Security Baseline

- JWT/session auth with role-based authorization
- Signed URLs for private asset downloads
- Upload scanning + MIME/type checks
- Rate limiting for public endpoints
- Webhook signature verification for payment providers

## 9) Delivery Plan (8-Week Practical Draft)

- Week 1-2: Auth, workspace, template catalog, DB bootstrap
- Week 3-4: Editor persistence, asset upload, QR insertion
- Week 5-6: Bulk upload, row mapping, queue workers, ZIP export
- Week 7: Premium gating + payment integration (1 provider first)
- Week 8: Admin basics, hardening, deployment checklist

## 10) Current Repository Mapping

- `backend/server.js`: keep as API gateway; split handlers into modules incrementally.
- `backend/config.js`: extend for DB, Redis, R2, payment keys.
- `public/`: keep for immediate UI continuity; migrate gradually to componentized frontend.

## 11) Success Metrics

- Time to produce 100 certificates < 5 minutes (async workflow)
- Export failure rate < 1%
- Template-to-export completion rate (activation KPI)
- Paid conversion from active free users
