/**
 * Verify IndexedDB Cache Status
 * 
 * Utility to check if images and API data are being cached properly
 */

import imageCacheDB from './imageCache';
import apiCacheDB from './apiCache';

export interface CacheVerificationResult {
  imageCache: {
    working: boolean;
    sampleUrls: string[];
    error?: string;
  };
  apiCache: {
    working: boolean;
    sampleUrls: string[];
    error?: string;
  };
}

/**
 * Verify both image and API cache are working
 */
export async function verifyAllCaches(): Promise<CacheVerificationResult> {
  const result: CacheVerificationResult = {
    imageCache: {
      working: false,
      sampleUrls: [],
    },
    apiCache: {
      working: false,
      sampleUrls: [],
    },
  };

  // Test image cache
  try {
    // Try to get cache size (this will initialize DB)
    const testUrl = 'https://res.cloudinary.com/test/image/test.jpg';
    await imageCacheDB.getImage(testUrl);
    result.imageCache.working = true;
  } catch (error) {
    result.imageCache.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Test API cache
  try {
    const testUrl = '/api/test';
    await apiCacheDB.getResponse(testUrl);
    result.apiCache.working = true;
  } catch (error) {
    result.apiCache.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

/**
 * Log cache status to console
 */
export async function logCacheStatus(): Promise<void> {
  console.log('🔍 IndexedDB Cache Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const verification = await verifyAllCaches();

    console.log('📦 Image Cache:');
    if (verification.imageCache.working) {
      console.log('   ✅ Working');
    } else {
      console.log('   ❌ Not working:', verification.imageCache.error);
    }

    console.log('📡 API Cache:');
    if (verification.apiCache.working) {
      console.log('   ✅ Working');
    } else {
      console.log('   ❌ Not working:', verification.apiCache.error);
    }

    // Check browser support
    if (typeof window !== 'undefined' && window.indexedDB) {
      console.log('✅ IndexedDB: Supported');
    } else {
      console.log('❌ IndexedDB: Not supported');
    }
  } catch (error) {
    console.error('❌ Cache verification failed:', error);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).__verifyCache = logCacheStatus;
}

