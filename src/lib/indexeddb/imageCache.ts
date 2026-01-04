/**
 * IndexedDB Image Cache Utility
 * 
 * Provides persistent image caching in the browser using IndexedDB.
 * Supports images up to 100MB+ and handles cache updates automatically.
 */

const DB_NAME = 'DreamImageCache';
const DB_VERSION = 1;
const STORE_NAME = 'images';

interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  size: number; // in bytes
}

class ImageCacheDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize IndexedDB
   */
  private async init(): Promise<void> {
    if (this.db) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Check if IndexedDB is supported
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
          // Create index for timestamp (for cleanup)
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    try {
      await this.initPromise;
    } catch (error) {
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Get cached image from IndexedDB
   */
  async getImage(url: string): Promise<Blob | null> {
    try {
      await this.init();

      if (!this.db) {
        return null;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(url);

        request.onsuccess = () => {
          const result = request.result as CachedImage | undefined;
          if (result) {
            resolve(result.blob);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          reject(new Error(`Failed to get image from cache: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('IndexedDB getImage error:', error);
      return null;
    }
  }

  /**
   * Store image in IndexedDB
   */
  async setImage(url: string, blob: Blob): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const cachedImage: CachedImage = {
          url,
          blob,
          timestamp: Date.now(),
          size: blob.size,
        };

        const request = store.put(cachedImage);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to store image in cache: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('IndexedDB setImage error:', error);
      // Don't throw - caching is optional
    }
  }

  /**
   * Delete image from cache
   */
  async deleteImage(url: string): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(url);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to delete image from cache: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('IndexedDB deleteImage error:', error);
    }
  }

  /**
   * Get cache size in bytes
   */
  async getCacheSize(): Promise<number> {
    try {
      await this.init();

      if (!this.db) {
        return 0;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const images = request.result as CachedImage[];
          const totalSize = images.reduce((sum, img) => sum + img.size, 0);
          resolve(totalSize);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get cache size: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('IndexedDB getCacheSize error:', error);
      return 0;
    }
  }

  /**
   * Clear all cached images
   */
  async clearCache(): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to clear cache: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('IndexedDB clearCache error:', error);
    }
  }

  /**
   * Cleanup old entries (older than specified days)
   */
  async cleanupOldEntries(daysOld: number = 30): Promise<number> {
    try {
      await this.init();

      if (!this.db) {
        return 0;
      }

      const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
      let deletedCount = 0;

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('timestamp');
        const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };

        request.onerror = () => {
          reject(new Error(`Failed to cleanup old entries: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('IndexedDB cleanupOldEntries error:', error);
      return 0;
    }
  }
}

// Singleton instance
const imageCacheDB = new ImageCacheDB();

/**
 * Get cached image URL or fetch and cache
 */
export async function getCachedImageUrl(imageUrl: string): Promise<string> {
  // Skip caching for data URIs and local placeholders
  if (
    !imageUrl ||
    imageUrl.startsWith('data:') ||
    imageUrl.startsWith('/placeholder') ||
    imageUrl.startsWith('/uploads/')
  ) {
    return imageUrl;
  }

  try {
    // Check if image exists in cache
    const cachedBlob = await imageCacheDB.getImage(imageUrl);

    if (cachedBlob) {
      // Return blob URL for instant loading
      return URL.createObjectURL(cachedBlob);
    }

    // Fetch image from CDN
    const response = await fetch(imageUrl, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Store in IndexedDB (async, don't wait)
    imageCacheDB.setImage(imageUrl, blob).catch((error) => {
      console.warn('Failed to cache image:', error);
    });

    // Return blob URL immediately
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn('Image cache error, using original URL:', error);
    // Fallback to original URL
    return imageUrl;
  }
}

/**
 * Preload and cache multiple images
 */
export async function preloadImages(imageUrls: string[]): Promise<void> {
  const validUrls = imageUrls.filter(
    (url) => url && !url.startsWith('data:') && !url.startsWith('/placeholder')
  );

  // Load images in parallel (limit to 5 concurrent requests)
  const batchSize = 5;
  for (let i = 0; i < validUrls.length; i += batchSize) {
    const batch = validUrls.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map((url) => getCachedImageUrl(url).catch(() => url))
    );
  }
}

/**
 * Clear all cached images
 */
export async function clearImageCache(): Promise<void> {
  return imageCacheDB.clearCache();
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{ size: number; count: number }> {
  const size = await imageCacheDB.getCacheSize();
  // Note: Count would require getAll() which we can add if needed
  return { size, count: 0 };
}

/**
 * Cleanup old cache entries
 */
export async function cleanupImageCache(daysOld: number = 30): Promise<number> {
  return imageCacheDB.cleanupOldEntries(daysOld);
}

export default imageCacheDB;

