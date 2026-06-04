# Gildia — Railway da frontend deploy

Bu qo‘llanma **Next.js ilova** (`frontend/`) ni Railway ga joylash uchun.  
Asosiy domen **gildia.uz** odatda **Vercel** da qoladi; Railway faqat qo‘shimcha hosting yoki sinov uchun ishlatilishi mumkin.

---

## 1. Railway loyihasi

1. [railway.app](https://railway.app) → **New Project** → **GitHub Repo**
2. Repo: `nurlanW1/certifypro-backend`
3. Branch: `main`

---

## 2. Root Directory (muhim)

| Variant | Root Directory | Build | Izoh |
|---------|----------------|-------|------|
| **Tavsiya** | `frontend` | `npm run build` | Eng oddiy, `next` xatosi bo‘lmaydi |
| Root | `/` (bo‘sh) | `railway.toml` dagi buyruq | `npm ci --prefix frontend` avtomatik |

**Settings → Build → Root Directory** = `frontend` qilib qo‘ying.

---

## 3. PostgreSQL

1. Railway → **+ New** → **Database** → **PostgreSQL**
2. `DATABASE_URL` ni **Variables** ga qo‘shing (yoki Railway “Reference” orqali ulang)

Mahalliy / birinchi marta schema:

```bash
cd frontend
npx prisma db push
npm run db:seed
```

---

## 4. Environment Variables (Railway → Variables)

Quyidagilarni **frontend** servisiga kiriting. Production URL ni o‘zingiznikiga almashtiring.

### Majburiy (production)

```env
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/railway

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

NEXT_PUBLIC_APP_URL=https://YOUR-APP.up.railway.app
```

> `NEXT_PUBLIC_APP_URL` — Railway bergan domen (masalan `https://certifypro-backend-production.up.railway.app`).  
> Keyin custom domain ulasangiz, shu o‘zgaruvchini yangilang.

### To‘lovlar (ixtiyoriy)

```env
PAYME_MERCHANT_ID=
PAYME_SECRET_KEY=
PAYME_CHECKOUT_URL=https://checkout.paycom.uz

CLICK_MERCHANT_ID=
CLICK_SERVICE_ID=
CLICK_SECRET_KEY=

PAYMENT_WEBHOOK_SECRET=uzun_random_string
```

Production da mock to‘lov **o‘chirilgan** — Payme yoki Click sozlang.

### Email (taklif + sertifikat)

```env
RESEND_API_KEY=re_...
EMAIL_FROM=Gildia <noreply@gildia.uz>
CERTIFICATE_CLAIM_DAYS=30
```

### Admin va cron

```env
GILDIA_ADMIN_EMAILS=admin@gildia.uz,boshqa@mail.uz
CRON_SECRET=uzun_random_secret
```

Cron URL (tashqi scheduler yoki Railway cron):

```
POST https://YOUR-APP.up.railway.app/api/cron/cleanup-invites
Authorization: Bearer CRON_SECRET
```

### Qolganlari (ixtiyoriy)

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

BLOB_READ_WRITE_TOKEN=

SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

**Production da qo‘ymang:** `PAYMENT_DEV_TOKEN` (faqat mahalliy sinov).

---

## 5. Build va Start

**Root Directory = `frontend` bo‘lsa:**

| Maydon | Qiymat |
|--------|--------|
| Build Command | `npm run build` (default) |
| Start Command | `npm run start` |

**Root = repo root bo‘lsa** — `railway.toml` ishlatiladi:

- Build: `npm ci --prefix frontend && npm run build --prefix frontend`
- Start: `npm run start --prefix frontend`
- Health: `/api/health`

---

## 6. Clerk

[Clerk Dashboard](https://dashboard.clerk.com) → Application → **Paths / Domains**:

- Allowed origins: `https://YOUR-APP.up.railway.app`
- Sign-in / Sign-up redirect URL lar shu domen bilan mos bo‘lsin

---

## 7. Tekshirish

Deploy tugagach:

```bash
curl https://YOUR-APP.up.railway.app/api/health
```

Kutilgan: `{"status":"ok",...}`

Brauzer: `https://YOUR-APP.up.railway.app` — Gildia bosh sahifasi.

---

## 8. Xatoliklar

| Xato | Yechim |
|------|--------|
| `next: not found` | Root Directory = `frontend` yoki oxirgi `main` (prebuild + `railway.toml`) |
| Clerk / 401 | `CLERK_*` va `NEXT_PUBLIC_APP_URL` to‘g‘ri |
| Shablonlar bo‘sh | `npm run db:seed` (DATABASE_URL bilan) |
| Build timeout | Railway plan / build cache tozalash |

---

## 9. gildia.uz bilan

| Xizmat | Vazifa |
|--------|--------|
| **Vercel** (`frontend/`) | Asosiy sayt `gildia.uz` |
| **Railway** | Sinov, API yoki zaxira (ixtiyoriy) |
| **Railway** `backend/` | Eski Express API (alohida servis) |

`gildia.uz` DNS ni Railway ga ulamaslik — Vercel da qoldirish tavsiya etiladi (`DEPLOY.md`).

---

Oxirgi push: `Fix Railway build: install frontend deps before next build` (`4c6cb42`).
