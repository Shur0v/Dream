/**
 * IndexedDB API Cache Utility
 * 
 * Caches API responses along with images for instant loading.
 * Stores both JSON data and associated image URLs.
 */

const DB_NAME = 'DreamAPICache';
const DB_VERSION = 1;
const API_STORE = 'apiResponses';
const IMAGE_STORE = 'images'; // Reuse existing image store
const DISABLE_CLIENT_CACHE = false;
const inFlightRequests = new Map<string, Promise<Response>>();

interface CachedAPIResponse {
  url: string;
  data: any;
  timestamp: number;
  expiresAt: number;
  imageUrls: string[]; // Associated image URLs
}

class APICacheDB {
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
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported'));
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

        // Create API responses store
        if (!db.objectStoreNames.contains(API_STORE)) {
          const apiStore = db.createObjectStore(API_STORE, { keyPath: 'url' });
          apiStore.createIndex('timestamp', 'timestamp', { unique: false });
          apiStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Create image store (if not exists)
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          const imageStore = db.createObjectStore(IMAGE_STORE, { keyPath: 'url' });
          imageStore.createIndex('timestamp', 'timestamp', { unique: false });
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
   * Get cached API response
   */
  async getResponse(url: string): Promise<any | null> {
    try {
      await this.init();

      if (!this.db) {
        return null;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([API_STORE], 'readonly');
        const store = transaction.objectStore(API_STORE);
        const request = store.get(url);

        request.onsuccess = () => {
          const result = request.result as CachedAPIResponse | undefined;
          
          if (!result) {
            resolve(null);
            return;
          }

          // Check if expired
          if (result.expiresAt && Date.now() > result.expiresAt) {
            // Delete expired entry
            this.deleteResponse(url).catch(() => {});
            resolve(null);
            return;
          }

          resolve(result.data);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get API response: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('APICache getResponse error:', error);
      return null;
    }
  }

  /**
   * Store API response
   */
  async setResponse(
    url: string,
    data: any,
    imageUrls: string[] = [],
    ttl: number = 60 * 60 * 1000 // 1 hour default
  ): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([API_STORE], 'readwrite');
        const store = transaction.objectStore(API_STORE);

        const cachedResponse: CachedAPIResponse = {
          url,
          data,
          timestamp: Date.now(),
          expiresAt: Date.now() + ttl,
          imageUrls,
        };

        const request = store.put(cachedResponse);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to store API response: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('APICache setResponse error:', error);
    }
  }

  /**
   * Delete cached response
   */
  async deleteResponse(url: string): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([API_STORE], 'readwrite');
        const store = transaction.objectStore(API_STORE);
        const request = store.delete(url);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to delete API response: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('APICache deleteResponse error:', error);
    }
  }

  /**
   * Clear all cached responses
   */
  async clearAll(): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([API_STORE], 'readwrite');
        const store = transaction.objectStore(API_STORE);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to clear cache: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('APICache clearAll error:', error);
    }
  }

  /**
   * Cleanup expired entries
   */
  async cleanupExpired(): Promise<number> {
    try {
      await this.init();

      if (!this.db) {
        return 0;
      }

      let deletedCount = 0;

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([API_STORE], 'readwrite');
        const store = transaction.objectStore(API_STORE);
        const index = store.index('expiresAt');
        const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));

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
          reject(new Error(`Failed to cleanup: ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.warn('APICache cleanupExpired error:', error);
      return 0;
    }
  }
}

// Singleton instance
const apiCacheDB = new APICacheDB();

/**
 * Extract image URLs from API response
 */
function extractImageUrls(data: any): string[] {
  const urls: string[] = [];

  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.images && Array.isArray(item.images)) {
        urls.push(...item.images);
      }
      if (item.image) {
        urls.push(item.image);
      }
      if (item.backgroundImage) {
        urls.push(item.backgroundImage);
      }
      if (item.sliderImages && Array.isArray(item.sliderImages)) {
        urls.push(...item.sliderImages);
      }
      if (item.rightBanners && Array.isArray(item.rightBanners)) {
        urls.push(...item.rightBanners);
      }
    });
  } else if (data && typeof data === 'object') {
    if (data.images && Array.isArray(data.images)) {
      urls.push(...data.images);
    }
    if (data.image) {
      urls.push(data.image);
    }
    if (data.backgroundImage) {
      urls.push(data.backgroundImage);
    }
    if (data.sliderImages && Array.isArray(data.sliderImages)) {
      urls.push(...data.sliderImages);
    }
    if (data.rightBanners && Array.isArray(data.rightBanners)) {
      urls.push(...data.rightBanners);
    }
  }

  // Filter out invalid URLs
  return urls.filter(
    (url) =>
      url &&
      typeof url === 'string' &&
      !url.startsWith('data:') &&
      !url.startsWith('/placeholder')
  );
}

/**
 * Fetch API with caching
 * Client-side URLs are NOT cached (always fetch fresh)
 */
export async function fetchWithCache(
  url: string,
  options: RequestInit = {},
  ttl: number = 60 * 60 * 1000 // 1 hour
): Promise<Response> {
  if (DISABLE_CLIENT_CACHE) {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    return response;
  }

  const isClientSide = isClientSideURL(url);
  const effectiveTtl = isClientSide ? Math.min(ttl, 2 * 60 * 1000) : ttl;
  const method = (options.method || 'GET').toUpperCase();
  const cacheableMethod = method === 'GET';
  const requestKey = `${method}:${url}`;

  if (cacheableMethod) {
    const cachedData = await apiCacheDB.getResponse(url);
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (cacheableMethod) {
    const existing = inFlightRequests.get(requestKey);
    if (existing) {
      return existing.then((response) => response.clone());
    }
  }

  // Fetch from network (always fresh for client-side)
  const networkPromise = (async () => {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      if (response.status === 429 && cacheableMethod) {
        const staleData = await apiCacheDB.getResponse(url);
        if (staleData) {
          return new Response(JSON.stringify(staleData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
      return response;
    }

    // Parse response
    const data = await response.json();

    // Extract image URLs
    const imageUrls = extractImageUrls(data.data || data);

    if (cacheableMethod) {
      await apiCacheDB.setResponse(url, data, imageUrls, effectiveTtl);
    }

    // Preload images in background (for both client and admin)
    if (imageUrls.length > 0) {
      import('@/lib/indexeddb/imageCache').then(({ preloadImages }) => {
        preloadImages(imageUrls).catch(() => {});
      });
    }

    // Return response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  })();

  if (cacheableMethod) {
    inFlightRequests.set(requestKey, networkPromise);
  }

  try {
    const response = await networkPromise;
    return response;
  } finally {
    if (cacheableMethod) {
      inFlightRequests.delete(requestKey);
    }
  }
}

/**
 * Check if URL is client-side (should not be cached)
 */
function isClientSideURL(url: string): boolean {
  // Client-side URLs that should not be cached
  const clientSidePatterns = [
    '/api/products',
    '/api/featured-products',
    '/api/best-selling-products',
    '/api/promo-banners',
    '/api/hero-banners',
    '/api/festival-banners',
    '/api/categories',
  ];
  
  // Admin URLs should be cached
  if (url.includes('/admin/') || url.includes('/selleradmin/')) {
    return false;
  }
  
  // Check if URL matches client-side patterns
  return clientSidePatterns.some(pattern => url.includes(pattern));
}

/**
 * Get cached API response (synchronous check)
 */
export async function getCachedResponse(url: string): Promise<any | null> {
  if (DISABLE_CLIENT_CACHE) {
    return null;
  }
  
  return apiCacheDB.getResponse(url);
}

/**
 * Clear API cache
 */
export async function clearAPICache(): Promise<void> {
  if (DISABLE_CLIENT_CACHE) {
    return;
  }
  return apiCacheDB.clearAll();
}

/**
 * Clear client-side API cache only (keep admin cache)
 */
export async function clearClientAPICache(): Promise<void> {
  if (DISABLE_CLIENT_CACHE) {
    return;
  }
  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const transaction = db.transaction([API_STORE], 'readonly');
    const store = transaction.objectStore(API_STORE);
    const getAllRequest = store.getAll();

    await new Promise<void>((resolve, reject) => {
      getAllRequest.onsuccess = async () => {
        const allEntries = getAllRequest.result;
        
        // Filter client-side cache entries (delete these)
        const clientCacheKeys = allEntries
          .filter((entry: any) => {
            const url = entry.url || '';
            // Delete client-side cache, keep admin cache
            return isClientSideURL(url);
          })
          .map((entry: any) => entry.url);

        // Delete client cache entries
        const deleteTransaction = db.transaction([API_STORE], 'readwrite');
        const deleteStore = deleteTransaction.objectStore(API_STORE);
        
        let deletedCount = 0;
        for (const key of clientCacheKeys) {
          deleteStore.delete(key);
          deletedCount++;
        }

        deleteTransaction.oncomplete = () => {
          console.log(`[APICache] Cleared ${deletedCount} client-side cache entries`);
          resolve();
        };
        deleteTransaction.onerror = () => reject(deleteTransaction.error);
      };
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });

    db.close();
  } catch (error) {
    console.warn('[APICache] Error clearing client cache:', error);
  }
}

export default apiCacheDB;

