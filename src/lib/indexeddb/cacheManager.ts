/**
 * Cache Management Utilities
 * 
 * Provides utilities for managing IndexedDB image cache:
 * - Cleanup old entries
 * - Monitor cache size
 * - Clear cache
 * - Update cache when images change
 */

import imageCacheDB, { getCacheStats, cleanupImageCache, clearImageCache } from './imageCache';

/**
 * Cache cleanup configuration
 */
export interface CacheConfig {
  /**
   * Maximum cache size in MB (default: 500MB)
   */
  maxSizeMB?: number;
  /**
   * Days to keep cached images (default: 30)
   */
  maxAgeDays?: number;
  /**
   * Enable automatic cleanup (default: true)
   */
  autoCleanup?: boolean;
}

const DEFAULT_CONFIG: Required<CacheConfig> = {
  maxSizeMB: 500,
  maxAgeDays: 30,
  autoCleanup: true,
};

/**
 * Check if cache needs cleanup
 */
export async function shouldCleanupCache(config: CacheConfig = {}): Promise<{
  needsCleanup: boolean;
  reason: string;
  currentSizeMB: number;
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const stats = await getCacheStats();
  const currentSizeMB = stats.size / (1024 * 1024);

  // Check size limit
  if (currentSizeMB > finalConfig.maxSizeMB) {
    return {
      needsCleanup: true,
      reason: `Cache size (${currentSizeMB.toFixed(2)}MB) exceeds limit (${finalConfig.maxSizeMB}MB)`,
      currentSizeMB,
    };
  }

  return {
    needsCleanup: false,
    reason: 'Cache is within limits',
    currentSizeMB,
  };
}

/**
 * Perform cache cleanup
 */
export async function performCacheCleanup(config: CacheConfig = {}): Promise<{
  deletedCount: number;
  freedSpaceMB: number;
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Cleanup old entries
  const deletedCount = await cleanupImageCache(finalConfig.maxAgeDays);
  
  // Get stats after cleanup
  const stats = await getCacheStats();
  const freedSpaceMB = stats.size / (1024 * 1024);

  return {
    deletedCount,
    freedSpaceMB,
  };
}

/**
 * Initialize cache management
 * Sets up automatic cleanup if enabled
 */
export async function initializeCacheManager(config: CacheConfig = {}): Promise<void> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (!finalConfig.autoCleanup) {
    return;
  }

  // Check if cleanup is needed on initialization
  const shouldCleanup = await shouldCleanupCache(finalConfig);
  
  if (shouldCleanup.needsCleanup) {
    console.log('🔄 Performing automatic cache cleanup...', shouldCleanup.reason);
    await performCacheCleanup(finalConfig);
  }

  // Set up periodic cleanup (every 24 hours)
  if (typeof window !== 'undefined') {
    setInterval(async () => {
      const check = await shouldCleanupCache(finalConfig);
      if (check.needsCleanup) {
        console.log('🔄 Periodic cache cleanup...', check.reason);
        await performCacheCleanup(finalConfig);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
  }
}

/**
 * Update cache when image URL changes
 * Deletes old entry and caches new one
 */
export async function updateCachedImage(
  oldUrl: string | null,
  newUrl: string
): Promise<void> {
  // Delete old entry if exists
  if (oldUrl && oldUrl !== newUrl) {
    await imageCacheDB.deleteImage(oldUrl);
  }

  // New image will be cached automatically on next load
}

/**
 * Clear all cached images
 */
export async function clearAllCache(): Promise<void> {
  return clearImageCache();
}

/**
 * Get cache statistics
 */
export async function getCacheStatistics(): Promise<{
  sizeMB: number;
  sizeBytes: number;
  count: number;
}> {
  const stats = await getCacheStats();
  return {
    sizeMB: stats.size / (1024 * 1024),
    sizeBytes: stats.size,
    count: stats.count,
  };
}

// Initialize cache manager on module load (client-side only)
if (typeof window !== 'undefined') {
  initializeCacheManager().catch((error) => {
    console.warn('Failed to initialize cache manager:', error);
  });
}

