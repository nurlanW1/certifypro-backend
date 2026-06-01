## Gildia Frontend (Next.js Migration)

This frontend is the new SaaS migration layer for `Gildia.uz`, built with:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Legacy static frontend under `../public` remains untouched for safe incremental migration.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4000`)
- `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_BRAND_NAME=Gildia`

## Run Locally

1) Start backend (from `../backend`):

```bash
npm install
npm start
```

2) Start frontend (from this folder):

```bash
npm run dev
```

3) Open [http://localhost:3000](http://localhost:3000)

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Main Routes

- `/`
- `/templates`
- `/editor`
- `/dashboard`
- `/pricing`
- `/login`
- `/register`
- `/verify`
- `/account`
- `/admin`
- `/contact`
- `/workspaces`

## API Layer

API helpers are in:
- `lib/api/client.ts`
- `lib/api/auth.ts`
- `lib/api/templates.ts`
- `lib/api/uploads.ts`
- `lib/api/payments.ts`
- `lib/api/projects.ts`

## Deploy on Vercel

1) Import `frontend` folder as Vercel project root.
2) Set env vars from `.env.example`.
3) Build command: `npm run build`
4) Output: Next.js default (`.next` managed by Vercel)
5) Ensure backend URL in `NEXT_PUBLIC_API_URL` points to deployed API.

## Notes

- Payment secrets must stay backend-side.
- Auth endpoints are marked TODO in frontend and require backend auth implementation.
