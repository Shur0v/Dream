"use strict";
/**
 * @fileoverview Shared JSON store helper with Upstash Redis + filesystem fallback
 *
 * This utility provides a resilient persistence layer that reads/writes JSON blobs
 * to Upstash Redis when the credentials are available. When Redis is not configured
 * (local dev, CI, etc.), it gracefully falls back to the filesystem based stores in
 * `backend/database/*.json`, and finally to an in-memory Map so writes never explode
 * even in read-only environments (e.g. preview deployments).
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonStore = readJsonStore;
exports.writeJsonStore = writeJsonStore;
exports.isRedisBacked = isRedisBacked;
exports.clearMemoryStore = clearMemoryStore;
const redis_1 = require("@upstash/redis");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisClient = REDIS_URL && REDIS_TOKEN
    ? new redis_1.Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
    })
    : null;
const memoryStore = new Map();
const DEFAULT_DIRECTORY = path_1.default.join(process.cwd(), 'backend', 'database');
function resolveFilePath(store, options) {
    const dir = options?.directory ?? DEFAULT_DIRECTORY;
    const fileName = options?.fileName ?? store;
    return path_1.default.join(dir, `${fileName}.json`);
}
async function ensureDirectoryExists(filePath) {
    const dir = path_1.default.dirname(filePath);
    await fs_1.promises.mkdir(dir, { recursive: true });
}
async function readFromFile(store, options) {
    const filePath = resolveFilePath(store, options);
    try {
        const contents = await fs_1.promises.readFile(filePath, 'utf-8');
        return JSON.parse(contents);
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn(`[jsonStore] Failed to read ${filePath}. Falling back to memory.`, error);
        }
        return null;
    }
}
async function writeToFile(store, data, options) {
    const filePath = resolveFilePath(store, options);
    await ensureDirectoryExists(filePath);
    await fs_1.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readFromRedis(store) {
    if (!redisClient)
        return null;
    try {
        const payload = await redisClient.get(store);
        if (payload) {
            memoryStore.set(store, payload);
            return JSON.parse(payload);
        }
        return null;
    }
    catch (error) {
        console.warn(`[jsonStore] Failed to read key "${store}" from Redis.`, error);
        return null;
    }
}
async function writeToRedis(store, data, ttlSeconds) {
    if (!redisClient)
        return;
    try {
        const payload = JSON.stringify(data);
        if (ttlSeconds && ttlSeconds > 0) {
            await redisClient.set(store, payload, { ex: ttlSeconds });
        }
        else {
            await redisClient.set(store, payload);
        }
        memoryStore.set(store, payload);
    }
    catch (error) {
        console.warn(`[jsonStore] Failed to write key "${store}" to Redis.`, error);
    }
}
/**
 * Read a JSON blob by key, prioritising Redis, then filesystem, then memory.
 */
async function readJsonStore(store, options) {
    const inMemory = memoryStore.get(store);
    if (inMemory) {
        return JSON.parse(inMemory);
    }
    const fromRedis = await readFromRedis(store);
    if (fromRedis) {
        return fromRedis;
    }
    const fromFile = await readFromFile(store, options);
    if (fromFile) {
        memoryStore.set(store, JSON.stringify(fromFile));
        if (redisClient) {
            // Hydrate Redis for faster subsequent reads.
            await writeToRedis(store, fromFile, options?.ttlSeconds);
        }
        return fromFile;
    }
    // As a last resort, initialise empty object/array.
    const fallback = {};
    memoryStore.set(store, JSON.stringify(fallback));
    return fallback;
}
/**
 * Persist a JSON blob by key to Redis + filesystem (with graceful degradation).
 */
async function writeJsonStore(store, data, options) {
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
        }
        catch (error) {
            console.warn('[jsonStore] Failed to update cache version:', error);
        }
    }
}
/**
 * Helper to determine whether Redis persistence is active.
 */
function isRedisBacked() {
    return Boolean(redisClient);
}
/**
 * Clear in-memory cache (mainly for tests).
 */
function clearMemoryStore() {
    memoryStore.clear();
}
