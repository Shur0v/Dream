/**
 * @fileoverview Shared JSON store helper with Upstash Redis + filesystem fallback
 *
 * This utility provides a resilient persistence layer that reads/writes JSON blobs
 * to Upstash Redis when the credentials are available. When Redis is not configured
 * (local dev, CI, etc.), it gracefully falls back to the filesystem based stores in
 * `src/backend/database/*.json`, and finally to an in-memory Map so writes never explode
 * even in read-only environments (e.g. preview deployments).
 */

import { Redis } from '@upstash/redis';
import { promises as fs } from 'fs';
import path from 'path';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

interface JsonStoreOptions {
  /**
   * Custom file name (without extension). Defaults to the store key itself.
   */
  fileName?: string;
  /**
   * Directory for filesystem persistence. Defaults to src/backend/database.
   */
  directory?: string;
  /**
   * Optional TTL (seconds) when persisting to Redis.
   */
  ttlSeconds?: number;
}

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisClient =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
      })
    : null;

const memoryStore = new Map<string, string>();
const DEFAULT_DIRECTORY = path.join(process.cwd(), 'src', 'backend', 'database');

function resolveFilePath(store: string, options?: JsonStoreOptions): string {
  const dir = options?.directory ?? DEFAULT_DIRECTORY;
  const fileName = options?.fileName ?? store;
  return path.join(dir, `${fileName}.json`);
}

async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function readFromFile<T>(store: string, options?: JsonStoreOptions): Promise<T | null> {
  const filePath = resolveFilePath(store, options);
  try {
    const contents = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(contents) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(`[jsonStore] Failed to read ${filePath}. Falling back to memory.`, error);
    }
    return null;
  }
}

async function writeToFile<T>(store: string, data: T, options?: JsonStoreOptions): Promise<void> {
  const filePath = resolveFilePath(store, options);
  await ensureDirectoryExists(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readFromRedis<T>(store: string): Promise<T | null> {
  if (!redisClient) return null;
  try {
    const payload = await redisClient.get<string>(store);
    if (payload) {
      memoryStore.set(store, payload);
      return JSON.parse(payload) as T;
    }
    return null;
  } catch (error) {
    console.warn(`[jsonStore] Failed to read key "${store}" from Redis.`, error);
    return null;
  }
}

async function writeToRedis<T>(store: string, data: T, ttlSeconds?: number): Promise<void> {
  if (!redisClient) return;
  try {
    const payload = JSON.stringify(data);
    if (ttlSeconds && ttlSeconds > 0) {
      await redisClient.set(store, payload, { ex: ttlSeconds });
    } else {
      await redisClient.set(store, payload);
    }
    memoryStore.set(store, payload);
  } catch (error) {
    console.warn(`[jsonStore] Failed to write key "${store}" to Redis.`, error);
  }
}

/**
 * Read a JSON blob by key, prioritising Redis, then filesystem, then memory.
 */
export async function readJsonStore<T = JsonValue>(
  store: string,
  options?: JsonStoreOptions
): Promise<T> {
  const inMemory = memoryStore.get(store);
  if (inMemory) {
    return JSON.parse(inMemory) as T;
  }

  const fromRedis = await readFromRedis<T>(store);
  if (fromRedis) {
    return fromRedis;
  }

  const fromFile = await readFromFile<T>(store, options);
  if (fromFile) {
    memoryStore.set(store, JSON.stringify(fromFile));
    if (redisClient) {
      // Hydrate Redis for faster subsequent reads.
      await writeToRedis(store, fromFile, options?.ttlSeconds);
    }
    return fromFile;
  }

  // As a last resort, initialise empty object/array.
  const fallback = {} as T;
  memoryStore.set(store, JSON.stringify(fallback));
  return fallback;
}

/**
 * Persist a JSON blob by key to Redis + filesystem (with graceful degradation).
 */
export async function writeJsonStore<T = JsonValue>(
  store: string,
  data: T,
  options?: JsonStoreOptions
): Promise<void> {
  memoryStore.set(store, JSON.stringify(data));
  const results = await Promise.allSettled([
    writeToFile(store, data, options),
    writeToRedis(store, data, options?.ttlSeconds),
  ]);
  
  // Log any failures but don't throw (graceful degradation)
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const source = index === 0 ? 'filesystem' : 'Redis';
      console.error(`[jsonStore] Failed to write to ${source}:`, result.reason);
    }
  });
  
  // Update cache version timestamp for client-side cache invalidation
  if (store === 'database') {
    try {
      const cacheVersion = Date.now().toString();
      if (redisClient) {
        await redisClient.set('database_cache_version', cacheVersion);
      }
    } catch (error) {
      console.warn('[jsonStore] Failed to update cache version:', error);
    }
  }
}

/**
 * Helper to determine whether Redis persistence is active.
 */
export function isRedisBacked(): boolean {
  return Boolean(redisClient);
}

/**
 * Clear in-memory cache (mainly for tests).
 */
export function clearMemoryStore(): void {
  memoryStore.clear();
}

