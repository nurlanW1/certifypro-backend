# Phase 4 — Uploads

## Asset types

| Type | Use | MIME |
|------|-----|------|
| `logo` | Brand / org logo | Images |
| `signature` | Signature image | Images |
| `stamp` | Stamp image | Images |
| `participant_photo` | Participant photo | Images |
| `sponsor_logo` | Sponsor logo | Images |
| `partner_logo` | Partner logo | Images |
| `background_image` | Background | Images |
| `excel` | Participant list / data | XLSX, XLS, CSV |

Aliases: `photo` → `participant_photo`, `sponsor` → `sponsor_logo`, `partner` → `partner_logo`, `background` → `background_image`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/uploads/types` | List allowed types |
| GET | `/api/uploads` | List my assets (`?eventId`, `?designDraftId`, `?brandKitId`, `?type`) |
| GET | `/api/uploads/:id` | Get metadata |
| POST | `/api/uploads` | Multipart: `file`, `type`, optional `eventId`, `designDraftId`, `brandKitId` |
| DELETE | `/api/uploads/:id` | Delete file + metadata |

All routes require JWT.

## Storage

- `STORAGE_DRIVER=local` — files under `STORAGE_LOCAL_PATH`, served via `/api/files/...`
- `STORAGE_DRIVER=s3` — Cloudflare R2 / S3-compatible (`S3_*` env vars), falls back to local if misconfigured

### Key layout

- Event: `users/{userId}/events/{eventId}/assets/{id}-{file}`
- Design: `users/{userId}/designs/{designId}/assets/{id}-{file}`
- Brand kit: `users/{userId}/brand-kits/{brandKitId}/assets/{id}-{file}`
- General: `users/{userId}/uploads/{id}-{file}`

## Limits

`UPLOAD_MAX_BYTES` (default 15MB). Validation runs before save.
