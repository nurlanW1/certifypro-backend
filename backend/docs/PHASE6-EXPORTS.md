# Phase 6 — Exports

Job-based export pipeline (renderer can be plugged in later).

## Formats

`png`, `jpg`, `pdf`, `svg` (aliases: `jpeg` → `jpg`)

## Flow

```
pending → processing → completed
                    ↘ failed
```

1. **Create job** — reserves quota check, validates design ownership  
2. **Complete** — upload rendered file (client or future worker)  
3. **Usage** — plan export count increments on successful `completed` only  

## Endpoints (auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/exports/formats` | Supported formats |
| GET | `/api/exports` | Export history (`?page`, `?limit`, `?designDraftId`) |
| POST | `/api/exports/jobs` | Create job `{ designDraftId, format }` |
| GET | `/api/exports/jobs/:id` | Job status |
| POST | `/api/exports/jobs/:id/process` | Mark `processing` (future renderer) |
| POST | `/api/exports/jobs/:id/complete` | Upload file (`multipart` `file`) |
| POST | `/api/exports/jobs/:id/fail` | Mark failed `{ errorMessage }` |
| POST | `/api/exports` | One-shot create + upload (`file`, `designDraftId`, `format`) |
| DELETE | `/api/exports/:id` | Delete export record + storage file |

## Error codes

| Code | HTTP | Meaning |
|------|------|---------|
| `PLAN_LIMIT_EXPORTS` | 402 | Quota exceeded |
| `EXPORT_INVALID_FORMAT` | 400 | Bad format |
| `EXPORT_MIME_MISMATCH` | 400 | File MIME ≠ format |
| `EXPORT_JOB_ALREADY_COMPLETED` | 400 | Cannot complete twice |
| `EXPORT_JOB_FAILED` | 400 | Job already failed |
| `EXPORT_STORAGE_FAILED` | 500 | Storage write failed |

## Future renderer

Implement a worker that:

1. Polls `pending` jobs (or listens to a queue)  
2. Calls `markExportProcessing(exportId, userId)`  
3. Renders canvas → buffer  
4. Calls `completeExportJob({ exportId, buffer, mimeType, userId })`  
