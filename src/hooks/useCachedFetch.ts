/**
 * React Hook for Cached API Fetching
 * 
 * Fetches API data with IndexedDB caching for instant loading.
 * Also preloads associated images.
 */

import { useState, useEffect, useRef } from 'react';
import { fetchWithCache, getCachedResponse } from '@/lib/indexeddb/apiCache';

interface UseCachedFetchOptions {
  /**
   * API URL to fetch
   */
  url: string;
  /**
   * Fetch options
   */
  options?: RequestInit;
  /**
   * Cache TTL in milliseconds (default: 1 hour)
   */
  ttl?: number;
  /**
   * Whether to enable caching (default: true)
   */
  enabled?: boolean;
  /**
   * Whether to show loading state from cache (default: false - instant from cache)
   */
  showCacheLoading?: boolean;
}

interface UseCachedFetchResult<T> {
  /**
   * Response data
   */
  data: T | null;
  /**
   * Loading state (only true when fetching from network)
   */
  isLoading: boolean;
  /**
   * Error state
   */
  error: Error | null;
  /**
   * Whether data is from cache
   */
  isFromCache: boolean;
  /**
   * Refetch function
   */
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch API data with caching
 * 
 * @example
 * const { data, isLoading, isFromCache } = useCachedFetch({
 *   url: '/api/featured-products?limit=4'
 * });
 */
export function useCachedFetch<T = any>({
  url,
  options = {},
  ttl = 60 * 60 * 1000, // 1 hour
  enabled = true,
  showCacheLoading = false,
}: UseCachedFetchOptions): UseCachedFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (forceNetwork = false) => {
    if (!enabled || !url) {
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Check cache first (unless forcing network)
      if (!forceNetwork) {
        const cachedData = await getCachedResponse(url);
        if (cachedData) {
          setData(cachedData.data || cachedData);
          setIsFromCache(true);
          setIsLoading(showCacheLoading); // Only show loading if requested
          setError(null);
          
          // Still fetch in background to update cache
          fetchWithCache(url, { ...options, signal: abortControllerRef.current.signal }, ttl)
            .then(async (response) => {
              const newData = await response.json();
              setData(newData.data || newData);
              setIsFromCache(false);
            })
            .catch(() => {
              // Ignore background fetch errors
            });
          
          return;
        }
      }

      // Fetch from network
      setIsLoading(true);
      setIsFromCache(false);
      setError(null);

      const response = await fetchWithCache(
        url,
        { ...options, signal: abortControllerRef.current.signal },
        ttl
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData.data || responseData);
      setIsFromCache(false);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, ignore
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      console.error('useCachedFetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, enabled]);

  const refetch = async () => {
    await fetchData(true); // Force network fetch
  };

  return { data, isLoading, error, isFromCache, refetch };
}

