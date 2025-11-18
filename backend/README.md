# Backend Folder Overview

This directory isolates all server-side logic so the Next.js `app` frontend now only contains thin route adapters that re-export handlers from here. The goal is to make it easy to migrate to a dedicated backend service later without rewriting the core business logic.

## Structure

```
backend/
├─ README.md                 # This file
├─ database/
│  └─ database.json          # JSON datastore used by helper methods
├─ lib/
│  └─ db.ts                  # Database helpers for products, orders, etc.
└─ routes/
   ├─ admin/
   │  ├─ dashboard.ts
   │  └─ orders/
   │     ├─ approve.ts
   │     ├─ cancel.ts
   │     ├─ index.ts
   │     ├─ recent.ts
   │     └─ reject.ts
   ├─ auth/
   │  ├─ login.ts
   │  └─ register.ts
   ├─ cart/
   │  └─ index.ts
   ├─ categories/
   │  ├─ id.ts
   │  └─ index.ts
   ├─ colors/
   │  ├─ id.ts
   │  └─ index.ts
   └─ products/
      ├─ id.ts
      ├─ images.ts
      └─ index.ts
```

## How the Frontend Uses These Handlers

- Each file in `src/app/api/**/route.ts` simply re-exports the exported handler functions (`GET`, `POST`, etc.) from this folder.
- `tsconfig.json` defines the `@backend/*` alias so both the frontend and backend code share consistent import paths.
- Database utilities (`@backend/lib/db`) now live here and point to `backend/database/database.json`.

## Migrating to a Dedicated Backend Later

1. **Choose a server framework** (e.g. Express, Fastify, Nest). Each handler already uses native `NextRequest`/`NextResponse`; for another framework, wrap the logic in adapters that translate to/from Express `req/res`.
2. **Reuse the route files** as controller logic:
   - Replace the `NextRequest`/`NextResponse` types with the equivalents from your backend framework.
   - Keep the same handler signatures to minimise changes.
3. **Keep using `lib/db.ts`** for the JSON datastore or replace it with your real database layer. All handlers call helpers like `getProducts`, `saveProduct`, etc., so swapping the implementation is straightforward.
4. **Update the frontend** to call the new backend URL instead of `/api/...` once the backend is deployed. Until then, the Next.js API routes keep everything working locally.
5. **Authentication hooks** are still TODOs inside the handlers. When migrating, wire them to your real auth middleware instead of the placeholder comments.

## Notes for Future Developers

- If you add a new API route, create the logic under `backend/routes/**` and let the corresponding Next.js route simply re-export the handler.
- Keep server-only utilities (DB clients, third-party SDK usage, etc.) inside this directory.
- Run `npm run build` to ensure the type checker sees the `@backend/*` alias and that import paths are correct.

