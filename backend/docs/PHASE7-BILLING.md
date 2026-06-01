# Phase 7 — Billing limits & usage

No new payment provider integration. Plan comes from `users.plan` (default `free`). Legacy JS payments remain at `/api/payments/*` in `server.js`.

## Plans (`config.PLAN_LIMITS` + DB `limits_json`)

| Slug | Designs | Exports | Events | Watermark | Premium templates |
|------|---------|---------|--------|-----------|-------------------|
| `free` | 5 | 10 | 3 | yes | no |
| `pro` | 200 | 500 | 50 | no | yes |
| `event_package` | 500 | 2000 | 200 | no | yes |

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/billing/plans` | — | List plans with limits |
| GET | `/api/billing/me` | yes | Full `PlanCapabilities` |
| GET | `/api/billing/usage` | yes | `UsageDashboardSummary` |
| GET | `/api/billing/capabilities` | yes | Compact capability flags + `exportCheck` |
| GET | `/api/dashboard/summary` | yes | Counts + billing usage + recent activity |

## Capability flags

- `canCreateDesign` / `canCreateEvent` / `canExport`
- `canAccessPremiumTemplates` (premium catalog)
- `requiresWatermark` (export/editor watermark)
- `remaining.*` — quota left
- `usage.*` — live counts from DB (`user_usage` synced on read)

## Enforcement

- Designs, events, exports: `assertCan*` in services (402 on limit)
- Premium templates: `GET /api/templates/:id` with `optionalAuth`; 403 `PLAN_PREMIUM_REQUIRED` if premium and plan lacks access
- Public template list includes `locked` / `canUse` per item when authenticated

## `/api/billing/me` response shape

```json
{
  "success": true,
  "data": {
    "plan": "free",
    "planName": "Free",
    "limits": { "maxDesigns": 5, "maxExports": 10, "maxEvents": 3, "watermark": true, "premiumTemplates": false },
    "usage": { "designsCount": 2, "exportsCount": 1, "eventsCount": 1, "periodStart": "..." },
    "remaining": { "designs": 3, "exports": 9, "events": 2 },
    "canCreateDesign": true,
    "canCreateEvent": true,
    "canExport": true,
    "canAccessPremiumTemplates": false,
    "requiresWatermark": true
  }
}
```
