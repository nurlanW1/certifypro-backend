# Gildia — Shablon ishlab chiqarish zanjiri

## Maqsad

1000+ shablonni qo‘lda emas, **brending to‘plami + kategoriya + o‘zgaruvchilar** orqali yig‘ish.

## Bosqichlar

1. **Uslub (Branding Kit)** — CLASSIC, MODERN, ACADEMIC, CORPORATE tokenlari (`lib/branding/kits.ts`)
2. **Kategoriya andozasi** — CERTIFICATE, BADGE, INVITATION, … (har biri uchun layout qoidasi)
3. **O‘zgaruvchilar** — `{{eventName}}`, `{{participantName}}`, `{{date}}`, …
4. **DB seed** — `npm run db:seed` (asosiy 10 ta); kengaytirish: `prisma/seed.mjs`
5. **QA** — `npm test` (`validate-svg`, `svg-fingerprint`), `npm run db:validate-templates`

## Yangi shablon qo‘shish

```bash
cd frontend
# 1. seed.mjs ga yozuv qo‘shing (id, category, svgContent)
npm run db:seed
```

## Production

- Vercel build dan keyin production DB da `db:seed` bir marta
- Mock katalog faqat `allowDevMocks()` da — production DB to‘ldirilgan bo‘lishi kerak
