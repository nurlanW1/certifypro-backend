# Phase 8 — Activity logs & admin stats

## Activity model

`db/models/activity.model.ts` — `ActivityLog`, `ActivityAction` constants.

## Logged actions (automatic)

| Action | Trigger |
|--------|---------|
| `event.created` | `createEvent` |
| `product.enabled` | `createEventProduct` |
| `template.used` | Product assigned `templateId` |
| `design.created` | `createDesign` |
| `design.saved` | `updateDesign` (canvas/title/thumbnail) |
| `asset.uploaded` | `createUpload` |
| `export.created` | `createExportJob` |
| `export.completed` | `completeExportJob` |

## User endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/activity` | Paginated user activity |
| GET | `/api/dashboard/activity` | Recent activity (`?limit=15`) |
| GET | `/api/dashboard/summary` | Counts + billing + `recentActivity` |

## Admin endpoints (`requireAdmin`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | Platform counts |
| GET | `/api/admin/usage/summary` | Stats + users by plan + exports by status + activity breakdown + global recent feed |
