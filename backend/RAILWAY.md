# Railway — Backend deploy

## 1. Yangi servis

1. [Railway](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Reponi tanlang: `gildia`
3. **Settings → Root Directory**: `backend`
4. **Settings → Deploy** → Healthcheck: `/api/health`

## 2. Environment variables

| Variable | Qiymat |
|----------|--------|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://gildia.uz` (Vercel frontend) |
| `CORS_ORIGIN` | `https://gildia.uz` |
| `CORS_ORIGINS` | `https://www.gildia.uz` (ixtiyoriy) |

`PORT` va `RAILWAY_PUBLIC_DOMAIN` Railway tomonidan avtomatik beriladi.

## 3. Redis (ixtiyoriy, PDF/email navbatlari uchun)

1. Project → **+ New** → **Database** → **Redis**
2. Redis servisini backend servisiga **Variable Reference** qiling — `REDIS_URL` avtomatik ulanadi

Redis bo‘lmasa ham API ishlaydi; faqat background queue cheklangan bo‘ladi.

## 4. Frontend (Vercel)

Vercel **Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app
NEXT_PUBLIC_APP_URL=https://gildia.uz
```

## 5. Tekshirish

```bash
curl https://<your-backend>.up.railway.app/api/health
# {"ok":true,"service":"gildia-backend",...}
```

