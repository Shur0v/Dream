/**
 * IndexedDB Image Cache - Main Export
 * 
 * Central export point for all IndexedDB cache utilities
 */

export { default as imageCacheDB } from './imageCache';
export {
  getCachedImageUrl,
  preloadImages,
  clearImageCache,
  getCacheStats,
  cleanupImageCache,
} from './imageCache';

export {
  shouldCleanupCache,
  performCacheCleanup,
  initializeCacheManager,
  updateCachedImage,
  clearAllCache,
  getCacheStatistics,
} from './cacheManager';

export {
  verifyCache,
  reportCacheStatus,
  CacheMonitor,
  cacheMonitor,
} from './cacheVerification';

// Make cache utilities available globally for debugging (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__imageCache = {
    clear: clearImageCache,
    stats: getCacheStats,
    verify: reportCacheStatus,
  };
}

