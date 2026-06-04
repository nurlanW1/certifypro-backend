# Gildia — Deploy (Vercel + Railway)

## gildia.uz da eski sayt chiqsa

Eski dizayn (`Gildia.uz`, `Legacy + Studio editor`) — **frontend-legacy** (Next 16).  
Yangi dizayn (`Gildia`, dashboard, wizard) — **frontend/** (Next 14).

| Tekshirish | To‘g‘ri |
|------------|--------|
| Vercel → Settings → **Root Directory** | **`frontend`** (frontend-legacy emas!) |
| Production deployment | Oxirgi **muvaffaqiyatli** build (Redeploy + Clear cache) |
| Domains | `gildia.uz` shu loyihada |
| DNS | Vercel ga (Railway emas) |

---

## 1. Vercel

1. [Vercel Dashboard](https://vercel.com) → loyiha
2. **Root Directory:** `frontend`
3. **Git:** `nurlanW1/certifypro-backend`, branch `main`
4. **Environment Variables:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_APP_URL=https://gildia.uz
   ```
5. **Deployments → Redeploy** → **Clear build cache**

Build logida: `Next.js 14.2.5`, route `/dashboard`, `/events/new`.

Agar Root Directory **bo‘sh (root)** bo‘lsa — root `vercel.json` `cd frontend && ...` ishlatadi.

---

## 2. Railway

### Next.js (`frontend/`) — repo root dan deploy

Agar Railway **repo root** (`certifypro-backend`) dan build qilsa, `next: not found` xatosini oldini olish uchun root `package.json` avval `npm ci --prefix frontend` ishga tushiradi (`railway.toml` ham shu buyruqni ishlatadi).

| Sozlama | Qiymat |
|---------|--------|
| Root Directory | `/` (root) yoki **`frontend`** (tavsiya) |
| Build | `npm ci --prefix frontend && npm run build --prefix frontend` |
| Start | `npm run start --prefix frontend` |

**Tavsiya:** Root Directory = **`frontend`** — oddiyroq (`npm run build` to‘g‘ridan-to‘g‘ri ishlaydi).

### Eski Express API (`backend/`)

- **Root Directory:** `backend`
- **gildia.uz** DNS Railway ga bo‘lmasin (eski `public/` HTML chiqadi)

---

## 3. Maʼlumotlar bazasi (PostgreSQL)

Schema o‘zgarganda (`EventMaterial`, `Participant`, `ExportLog`):

```bash
cd frontend
npx prisma db push
npm run db:seed
```

P2: billing `/api/billing/me`, ishtirokchilar CSV, Pro da ZIP eksport.

P3: watermark (FREE), ommaviy sertifikat ZIP, AI matn takliflari, `ActivityLog`, checkout stub.

P4: `Organization`, `PaymentOrder`, Payme/Click checkout, webhooks, SVG shablon, LLM, `/api/health`, `/agency`.

P5: Payme JSON-RPC (`/api/webhooks/payme`), Click SHOP (`/api/webhooks/click`), `OrgInvite`, jamoa UI, shablon QA, ixtiyoriy Sentry.

P6: Resend email takliflari, `/settings/billing`, admin Payme statement, cron taklif tozalash, SVG fingerprint CI.

P7: Ishtirokchiga sertifikat email (`/claim?token=`), shablon SVG preview API, API rate limit.

**Sertifikat email:** Ishtirokchilar → «Email orqali yuborish» (CSV da email bo‘lishi kerak). **Preview:** `/api/templates/{id}/preview`.

P8: PDF eksport (claim + ZIP PDF), Vercel Blob preview cache, ishtirokchi QR kod.

**Blob:** Vercel → Storage → `BLOB_READ_WRITE_TOKEN`. Birinchi preview so‘rovida SVG blob ga yoziladi.

P9: Analytics (`/api/analytics/me`), tadbir statistikasi, ommaviy nishonlar (ZIP), ishtirokchilar CSV hisoboti.

P10: Birlashtirilgan `/bulk-materials`, ism tag (NAME_TAG) ZIP, platform `/admin` (GILDIA_ADMIN_EMAILS).

**Email:** `RESEND_API_KEY`, `EMAIL_FROM`. **Admin:** `GILDIA_ADMIN_EMAILS`. **Cron:** `POST /api/cron/cleanup-invites` + `Authorization: Bearer CRON_SECRET`.

**Payme kabinet:** webhook URL = `https://gildia.uz/api/webhooks/payme` (Basic auth: `Paycom` + `PAYME_SECRET_KEY`).

**Click:** prepare/complete = `https://gildia.uz/api/webhooks/click`.

```bash
cd frontend
npx prisma db push
npm run db:seed
```

Vercel production uchun `DATABASE_URL` bir xil Postgres instance ga ulangan bo‘lishi kerak.

---

## 4. Lokal

```bash
cd frontend
npm install
cp ../.env.local.example .env.local
npm run dev
```

Yoki repo root: `npm run dev`

---

Repo: [github.com/nurlanW1/certifypro-backend](https://github.com/nurlanW1/certifypro-backend)
