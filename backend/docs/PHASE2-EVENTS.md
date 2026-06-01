# Phase 2 — Events & event products

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | List my events (`?page`, `?limit`, `?includeDeleted=true`) |
| POST | `/api/events` | Create event |
| GET | `/api/events/:id` | Get event (owner only) |
| PATCH | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Soft delete (`deleted_at`, status `archived`) |
| POST | `/api/events/:id/restore` | Restore soft-deleted event |
| GET | `/api/events/:id/progress` | Progress summary + product snapshot |
| PATCH | `/api/events/:id/builder-state` | Save builder state JSON |
| GET | `/api/events/:id/products` | List products for event |
| POST | `/api/events/:id/products` | Add product to event |
| PATCH | `/api/events/:id/products/:productId` | Update product |
| PATCH | `/api/events/:id/products/:productId/form-data` | Update `formData` only |
| POST | `/api/events/:id/products/:productId/enable` | Enable product |
| POST | `/api/events/:id/products/:productId/disable` | Disable product |
| DELETE | `/api/events/:id/products/:productId` | Remove product |
| GET | `/api/event-products?eventId=` | List products (requires `eventId`) |

All routes require `Authorization: Bearer <token>`.

## Migration

`003_events_soft_delete.sql` adds `events.deleted_at`.
