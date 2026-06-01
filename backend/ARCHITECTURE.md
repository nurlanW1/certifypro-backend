# Gildia Backend Architecture

## 1. Current backend structure

```
backend/
  server.js              # Monolithic Express app (PDF, queue, payments, legacy drafts)
  config.js              # PORT, CORS, Redis, URLs
  pdf-helpers.js
  payments/              # Click/Payme/Uzum/Paynet + JSON file store
  fonts/
  package.json           # CommonJS, Node >=18, no TypeScript
  .env.example
  railway.toml
```

**Framework:** Express 4 (JavaScript, CommonJS)  
**Database:** None (in-memory `Map` for design/event drafts and uploads)  
**Auth:** None on server (frontend auth API calls are TODO)  
**Storage:** In-memory upload metadata; PDF generation in-process; Redis optional for Bull queues  
**Existing API routes (keep):**

| Area | Routes |
|------|--------|
| Health | `GET /`, `/api/health`, `/api/health/ready` |
| Platform | `/api/platform/overview`, `/api/workspaces` |
| Legacy drafts | `/api/drafts/design`, `/api/drafts/event` |
| Legacy uploads | `/api/uploads/assets` |
| Templates stub | `/api/templates/catalog` |
| Payments | `/api/payments/*` |
| PDF/queue | `/api/generate-pdf`, `/api/queue/*`, etc. |

## 2. Detected database / auth / storage

| Concern | Status |
|---------|--------|
| Database | Not configured |
| Auth | Not implemented (JWT planned) |
| Object storage | Not configured (in-memory only) |
| Redis | Optional for Bull PDF/email queues |
| Billing | Payment orders in `payments/data-store` (JSON file), no plan catalog |

## 3. Missing backend pieces

- Persistent users, events, event products, design drafts, templates, assets, brand kits, exports
- Auth (register/login/JWT) and per-user authorization
- Admin CRUD for templates
- Storage abstraction (local → S3/R2)
- Request validation and typed services
- Migrations and `DATABASE_PATH` / `DATABASE_URL` strategy

## 4. Implementation plan

1. **TypeScript layer** (`backend/src/`) compiled to `backend/dist/`, loaded from `server.js` without removing legacy routes.
2. **SQLite** default (`backend/data/gildia.db`) via `better-sqlite3`; SQL migrations in `src/db/migrations/`.
3. **Auth:** bcrypt + JWT; `Authorization: Bearer`; optional `X-Dev-User-Id` when `AUTH_ALLOW_DEV_HEADER=true`.
4. **Services** per domain + Zod validators + uniform `{ ok, data?, message?, code? }` responses.
5. **Storage:** `StorageProvider` interface; `LocalStorageProvider` writes under `STORAGE_LOCAL_PATH`.
6. **New routes** (all protected except auth register/login and public template list):
   - Auth, Events, Event products, Designs, Templates, Uploads, Brand kits, Exports, Billing plans, Admin templates
7. **Legacy compatibility:** Existing `/api/drafts/*` and `/api/uploads/assets` unchanged in `server.js`.

## 5. Files created / changed

**Created:** `src/**`, `tsconfig.json`, `ARCHITECTURE.md`, `data/.gitkeep`, `storage/.gitkeep`  
**Changed:** `package.json`, `server.js`, `.env.example`
