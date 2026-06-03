# Gildia.uz — Frontend Migration Report

## Overview

Migration from **static HTML/CSS/JS** (`/public`) to **Next.js 16 + React 19 + TypeScript + Tailwind 4** (`/frontend`).

Legacy editor and assets remain functional via backend static serving + iframe embed.

---

## Project analysis (before migration)

| Area | Legacy location | Notes |
|------|-----------------|-------|
| Home | `public/index.html`, `home.js`, `modern-home.css` | Marketing landing |
| Templates | `public/templates.html`, `templates.js` | Gallery + filters |
| Editor | `public/editor.html`, `public/editor.js` (~3800 lines) | Konva, bulk, export, QR |
| Auth | `public/login.html`, `register.html`, `auth.js` | Client-side auth |
| Verify | `public/verify.html`, `verify-new.js` | Certificate verification |
| Dashboard | `public/dashboard/*` | Events, bulk |
| Contact/About/Privacy | `public/contact-about-privacy.html` | Combined page |
| Payments | `stripe-integration.js`, backend `payments/` | UZ providers in backend |
| API config | `public/config.js` | `API_BASE_URL` |
| Backend | `backend/server.js` | PDF, payments, workspaces, templates catalog |

**Rebrand:** No active `Profly` / `CertifyPro` user-facing strings in frontend; `editor.js` strips old brand names from exports.

---

## Architecture (`frontend/`)

```
app/                 # Next.js App Router pages
components/
  layout/            # Navbar, Footer
  ui/                # Button, Card, Modal, Tabs, Input, Badge...
  marketing/         # Hero, product strips
  templates/         # TemplateCard, filters
  editor/            # Shell, legacy iframe, upload/export/QR panels
  dashboard/         # Bulk wizard, dashboard cards
  pricing/           # PricingCard
lib/
  api/               # client, auth, templates, uploads, payments, projects, bulk, export, qr, platform
  constants/         # brand, product, env
public/              # site.webmanifest (copy favicons from ../public for production)
```

---

## Route mapping

| Legacy | Next.js |
|--------|---------|
| `index.html` | `/` |
| `templates.html` | `/templates` |
| `editor.html` | `/editor` (legacy iframe + new shell tab) |
| `login.html` | `/login` |
| `register.html` | `/register` |
| `verify.html` | `/verify` |
| `contact-about-privacy.html` | `/contact`, `/about`, `/privacy` |
| `dashboard/index.html` | `/dashboard` |
| `dashboard/events/*` | `/dashboard/events`, `/dashboard/events/[id]` |
| `dashboard/bulk-generate.html` | `/dashboard/bulk-generate` |
| — | `/pricing`, `/admin`, `/account`, `/event-packages` |

---

## What is ready

- Full Next.js app with 20+ routes, build passing
- API layer wired to existing endpoints: `/api/health`, `/api/workspaces`, `/api/templates/catalog`, `/api/payments/*`, `/api/generate-pdf`
- **Legacy editor preserved** via `LegacyEditorFrame` → `NEXT_PUBLIC_LEGACY_EDITOR_URL`
- Backend serves `/public` statically (API routes unchanged)
- Product concept content (Uzbek), event categories, bulk wizard UI, workspace UI
- SEO: metadata, sitemap, robots, manifest
- Env-based URLs (no hardcoded old domains)

---

## Placeholders (TODO backend)

| Feature | Frontend | Backend needed |
|---------|----------|----------------|
| Auth session | Login/register UI | JWT/session API |
| Bulk jobs | 6-step wizard | `/api/bulk/*` |
| QR API | Panels | `/api/qr/generate` |
| Uploads | Asset library UI | `/api/uploads` |
| Unified export | Export modal | Beyond `/api/generate-pdf` |
| Admin CRUD | Forms UI | Admin API + auth |
| Template list | Demo cards + catalog API | Full template CRUD |

---

## Environment variables

Copy `frontend/.env.example` → `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BRAND_NAME=Gildia
NEXT_PUBLIC_LEGACY_EDITOR_URL=http://localhost:4000/editor.html
```

Production (Vercel):

```env
NEXT_PUBLIC_API_URL=https://api.gildia.uz
NEXT_PUBLIC_APP_URL=https://gildia.uz
NEXT_PUBLIC_LEGACY_EDITOR_URL=https://gildia.uz/editor.html
```

Backend:

```env
FRONTEND_URL=https://gildia.uz
PORT=4000
```

---

## Run locally

```bash
# Terminal 1 — backend (serves API + legacy static)
cd backend && npm install && npm start

# Terminal 2 — Next.js
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

Open http://localhost:3000 — Editor tab “To‘liq editor” loads http://localhost:4000/editor.html

---

## Quality checks

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

---

## Deploy to Vercel

1. Import repo with **Root Directory** = `frontend`
2. Set env vars from `.env.example`
3. Build: `npm run build`
4. Point `NEXT_PUBLIC_API_URL` to deployed backend
5. Copy favicon assets from `../public/*.png` into `frontend/public/` (or CDN)
6. Cutover: point `gildia.uz` DNS to Vercel; keep legacy editor URL reachable (same domain `/editor.html` via backend or CDN rewrite)

---

## Manual setup

1. Copy favicons (`favicon.png`, `apple-touch-icon.png`, etc.) from `public/` to `frontend/public/`
2. Configure production payment webhooks on backend only
3. Plan gradual removal of duplicate static pages once Next.js is primary

---

## Files changed in this migration pass

**Created:** `.env.example`, `MIGRATION.md`, `lib/constants/env.ts`, `lib/api/{bulk,export,qr,platform}.ts`, UI/editor/pricing/dashboard components, `about/`, `privacy/`, `legacy-editor-frame`, `public/site.webmanifest`

**Modified:** `backend/server.js` (static `/public`), `backend/config.js`, `app/editor/page.tsx`, `lib/api/client.ts`, `package.json`, `next.config.ts`, `layout.tsx`, `sitemap.ts`, footer links, pricing page

**Unchanged (safe):** `public/*` legacy files, core payment/PDF logic in backend
