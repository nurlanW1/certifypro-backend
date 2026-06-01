# Phase 5 — Templates

## Public (no auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/templates` | Active templates (`?productType`, `?category`) — list without `defaultCanvasData` |
| GET | `/api/templates/:id` | Full template including `defaultCanvasData` (active only) |

## Admin (`requireAdmin`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/templates` | All templates (including inactive) |
| GET | `/api/admin/templates/:id` | Template details |
| POST | `/api/admin/templates` | Create template |
| PATCH | `/api/admin/templates/:id` | Update template / canvas / metadata |
| POST | `/api/admin/templates/:id/disable` | Set `isActive: false` |
| DELETE | `/api/admin/templates/:id` | Hard delete |
| POST | `/api/admin/templates/:id/preview` | Upload preview image (`multipart` field `file`) |

## Create body example

```json
{
  "productType": "certificate",
  "name": "Classic certificate",
  "category": "Certificates",
  "size": "A4",
  "orientation": "landscape",
  "defaultCanvasData": { "elements": [] },
  "isPremium": false,
  "tags": ["conference", "formal"]
}
```

Preview storage key: `templates/{productType}/previews/{id}-preview-{filename}`
