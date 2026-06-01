# Phase 1 — Backend foundation

Structural layer only. Feature handlers return `501 NOT_IMPLEMENTED` except **auth** (register, login, me).

## Layout

```
src/
  core/
    http/response.ts      # sendSuccess, sendList, sendError, sendNotImplemented
    auth/
      guards.ts           # requireAuth, requireAdmin, optionalAuth
      jwt.ts              # signToken, verifyAccessToken
      types.ts            # AuthenticatedRequest
  validation/
    validate.ts           # validateBody, validateQuery, validateParams
    schemas/              # Zod schemas by domain
  db/
    schema/tables.ts      # Table name constants
    models/               # TypeScript domain models
    mappers.ts            # Row → model mappers
    migrations/           # SQL migrations (unchanged)
  services/
    auth/user.service.ts  # Active in Phase 1
    index.ts              # Service barrel exports
    *.service.ts          # Legacy services (Phase 2 wiring)
  routes/
    foundation/           # createModuleRouter, stubHandler
    auth/                 # Implemented
    events|designs|.../   # Stub routes
    index.ts              # registerApiRoutes()
  register.ts             # Boot: migrate, seed, mount API
```

## API (mounted)

| Prefix | Phase 1 |
|--------|---------|
| `/api/auth` | Working |
| `/api/events`, `/api/designs`, … | `501` stubs |

## Response shape

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

Legacy `ok` field included on success/error for existing clients.

## Phase 2

Wire route handlers to `services/*`, replace `stubHandler` with real handlers + `validateBody` schemas.
