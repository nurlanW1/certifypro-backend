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

## 2. Railway (faqat API)

- **Root Directory:** `backend`
- **gildia.uz** DNS Railway ga bo‘lmasin (eski `public/` HTML chiqadi)

---

## 3. Lokal

```bash
cd frontend
npm install
cp ../.env.local.example .env.local
npm run dev
```

Yoki repo root: `npm run dev`

---

Repo: [github.com/nurlanW1/certifypro-backend](https://github.com/nurlanW1/certifypro-backend)
