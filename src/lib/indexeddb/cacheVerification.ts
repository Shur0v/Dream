/**
 * Cache Verification and Reporting
 * 
 * Provides utilities to verify IndexedDB cache is working correctly
 * and report any issues or statistics.
 */

import { getCacheStats, clearImageCache } from './imageCache';
import { getCacheStatistics } from './cacheManager';

export interface CacheVerificationResult {
  /**
   * Whether IndexedDB is supported
   */
  indexedDBSupported: boolean;
  /**
   * Whether cache is accessible
   */
  cacheAccessible: boolean;
  /**
   * Cache statistics
   */
  stats: {
    sizeMB: number;
    sizeBytes: number;
    count: number;
  };
  /**
   * Any errors encountered
   */
  errors: string[];
  /**
   * Warnings
   */
  warnings: string[];
}

/**
 * Verify IndexedDB cache is working
 */
export async function verifyCache(): Promise<CacheVerificationResult> {
  const result: CacheVerificationResult = {
    indexedDBSupported: typeof window !== 'undefined' && !!window.indexedDB,
    cacheAccessible: false,
    stats: {
      sizeMB: 0,
      sizeBytes: 0,
      count: 0,
    },
    errors: [],
    warnings: [],
  };

  if (!result.indexedDBSupported) {
    result.errors.push('IndexedDB is not supported in this browser');
    return result;
  }

  try {
    // Try to get cache stats
    const stats = await getCacheStatistics();
    result.stats = stats;
    result.cacheAccessible = true;

    // Check for warnings
    if (stats.sizeMB > 500) {
      result.warnings.push(`Cache size is large: ${stats.sizeMB.toFixed(2)}MB. Consider cleanup.`);
    }

    if (stats.count === 0) {
      result.warnings.push('Cache is empty. Images will be cached on first load.');
    }
  } catch (error) {
    result.errors.push(`Failed to access cache: ${error instanceof Error ? error.message : 'Unknown error'}`);
    result.cacheAccessible = false;
  }

  return result;
}

/**
 * Report cache status to console
 */
export async function reportCacheStatus(): Promise<void> {
  console.log('📊 IndexedDB Image Cache Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const verification = await verifyCache();

  if (!verification.indexedDBSupported) {
    console.error('❌ IndexedDB is not supported');
    return;
  }

  if (!verification.cacheAccessible) {
    console.error('❌ Cache is not accessible');
    verification.errors.forEach((error) => console.error(`   ${error}`));
    return;
  }

  console.log('✅ IndexedDB: Supported');
  console.log('✅ Cache: Accessible');
  console.log(`📦 Cache Size: ${verification.stats.sizeMB.toFixed(2)} MB (${verification.stats.sizeBytes.toLocaleString()} bytes)`);
  console.log(`📁 Cached Images: ${verification.stats.count}`);

  if (verification.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    verification.warnings.forEach((warning) => console.warn(`   ${warning}`));
  }

  if (verification.errors.length > 0) {
    console.log('\n❌ Errors:');
    verification.errors.forEach((error) => console.error(`   ${error}`));
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Monitor cache performance
 */
export class CacheMonitor {
  private startTime: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  start() {
    this.startTime = Date.now();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  recordHit() {
    this.cacheHits++;
  }

  recordMiss() {
    this.cacheMisses++;
  }

  getStats() {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? (this.cacheHits / total) * 100 : 0;
    const duration = Date.now() - this.startTime;

    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      total,
      hitRate: hitRate.toFixed(2),
      duration: `${(duration / 1000).toFixed(2)}s`,
    };
  }

  report() {
    const stats = this.getStats();
    console.log('📈 Cache Performance:');
    console.log(`   Hits: ${stats.hits}`);
    console.log(`   Misses: ${stats.misses}`);
    console.log(`   Hit Rate: ${stats.hitRate}%`);
    console.log(`   Duration: ${stats.duration}`);
  }
}

// Global cache monitor instance
export const cacheMonitor = new CacheMonitor();

// Start monitoring on module load
if (typeof window !== 'undefined') {
  cacheMonitor.start();
}

