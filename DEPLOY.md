# Gildia — Deploy (Vercel + Railway)

Yangi platforma **repo root** dagi Next.js 14 ilovasi (`app/`, `components/`).  
Eski sayt ikkita joydan chiqishi mumkin — ikkalasini ham to‘g‘rilang.

## Muammo sabablari

| Joy | Nima chiqadi | Sabab |
|-----|----------------|-------|
| **Vercel** `Root Directory = frontend` | Eski Next 16 / boshqa UI | Noto‘g‘ri papka build qilinadi |
| **Vercel** avtomatik deploy yo‘q | Git ulanishi uzilgan yoki noto‘g‘ri branch | Dashboard sozlamasi |
| **Railway** (backend) + domen shu yerga | Eski HTML (`public/`) | `backend/server.js` legacy static serve qiladi |
| **gildia.uz** DNS | Railway yoki eski Vercel project | DNS noto‘g‘ri target |

GitHub repoda yangi kod: [nurlanW1/certifypro-backend](https://github.com/nurlanW1/certifypro-backend) — branch **`main`**.

---

## 1. Vercel (asosiy sayt — yangi Gildia)

1. [Vercel Dashboard](https://vercel.com) → loyiha (masalan `certifypro-puce` yoki `gildia`)
2. **Settings → General → Root Directory**
   - **`frontend` emas**
   - Bo‘sh qoldiring yoki **`.`** (repository root)
3. **Settings → Git**
   - Repository: `nurlanW1/certifypro-backend`
   - Production Branch: **`main`**
   - **Auto Deploy**: yoqilgan
   - Agar deploy bo‘lmasa: **Disconnect** → qayta **Connect** qiling
4. **Settings → Environment Variables** (Production + Preview):

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... yoki pk_test_...
   CLERK_SECRET_KEY=sk_live_... yoki sk_test_...
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_APP_URL=https://gildia.uz
   ```

5. **Deployments → Redeploy** → **Clear build cache** bilan qayta build
6. **Settings → Domains** → `gildia.uz` shu Vercel loyihasiga ulangan bo‘lsin

Build buyruqi (root `vercel.json`):

```bash
npx prisma generate && npm run build
```

---

## 2. Railway (faqat API — eski frontend emas)

Railway **faqat backend API** uchun. Sayt UI Vercelda.

1. Railway → service → **Root Directory**: `backend`
2. O‘zgaruvchilar:
   ```
   FRONTEND_URL=https://gildia.uz
   CORS_ORIGIN=https://gildia.uz
   ```
3. **gildia.uz** DNS Railway URL ga emas, **Vercel** ga yo‘naltirilsin

Agar domen to‘g‘ridan-to‘g‘ri Railway ga ulangan bo‘lsa, foydalanuvchi `public/` dagi **eski HTML** ni ko‘radi.

---

## 3. DNS (gildia.uz)

| Type | Name | Qiymat |
|------|------|--------|
| A / CNAME | `@` | Vercel (dashboard ko‘rsatadi) |
| CNAME | `www` | Vercel yoki redirect |

Railway URL faqat `api.gildia.uz` kabi subdomain uchun ishlatiladi (ixtiyoriy).

---

## 4. Lokal tekshiruv

```bash
cd D:\Gildia
rm -rf .next
npm install
npm run build
npm run dev
```

http://localhost:3000

---

## 5. Qaysi papkani deploy qilmaslik kerak

| Papka | Holat |
|-------|--------|
| `frontend/` | Eski alohida Next loyiha — **production deploy qilmang** |
| `public/` | Legacy HTML — faqat backend orqali, asosiy UI emas |
| `certifypro-backend/` | Keraksiz nested qoldiq — o‘chirilgan |

Yangi UI: root `app/`, `components/`, `package.json` (`name: gildia`).
