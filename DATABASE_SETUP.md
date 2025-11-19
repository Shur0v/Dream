## Database Connectivity Guide

This project uses a layered JSON store so the app works the same way in local dev, preview deployments, and production. At the core, we always interact with `backend/database/database.json`, but we now mirror that data through Upstash Redis for true remote persistence.

### 1. Upstash Redis (preferred in cloud)
- Create a free Redis database at [https://upstash.com](https://upstash.com).
- Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Upstash console.
- Add them to your environment (e.g. Vercel Project Settings → Environment Variables or a local `.env` file):
  ```
  UPSTASH_REDIS_REST_URL=...
  UPSTASH_REDIS_REST_TOKEN=...
  ```
- The helper `backend/lib/jsonStore.ts` will detect these variables automatically. Reads/writes now hit Redis first, giving you low-latency access from every serverless function.

### 2. Filesystem fallback (local dev)
- If the Redis env vars are missing, we automatically fall back to `backend/database/database.json`.
- No extra configuration is needed—just run `pnpm dev` and the JSON file will be used for persistence.

### 3. In-memory fallback (read-only environments)
- On platforms where the filesystem is read-only (certain preview/edge environments), the helper gracefully falls back to an in-memory Map.
- Writes will survive for the life of the serverless instance, ensuring forms aren’t broken even when storage is unavailable.

### 4. Validating data before SSR
- `backend/schemas/database.ts` uses **zod** to validate the JSON payload each time it is loaded.
- Invalid data won’t make it to React Server Components—errors will point to the field that failed validation so you can correct the JSON blob or fix the upstream form.

### 5. Uploads and media
- Product media is uploaded via `POST /api/upload-image`.
- When `BLOB_READ_WRITE_TOKEN` (or `BLOB_READ_WRITE_URL`) is configured, files are streamed to **@vercel/blob** and instantly available via HTTPS.
- Without those env vars, uploads are stored under `public/uploads` so the experience still works offline.

With this setup you can:
1. Develop locally with zero dependencies.
2. Flip on Upstash + Blob env vars when deploying.
3. Trust that every API route shares the same persistence layer without code changes.

