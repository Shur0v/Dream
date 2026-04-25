import { ensureDatabaseReady } from '../lib/neon';

export async function connectToDatabase(): Promise<void> {
  await ensureDatabaseReady();
}

export async function ensureConnection(): Promise<void> {
  await ensureDatabaseReady();
}

export async function disconnectFromDatabase(): Promise<void> {
  // Neon serverless HTTP connection is stateless; no explicit disconnect required.
}

export default {
  connectToDatabase,
  ensureConnection,
  disconnectFromDatabase,
};

