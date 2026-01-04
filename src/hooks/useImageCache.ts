/**
 * React Hook for Image Caching with IndexedDB
 * 
 * Provides a hook to load images from IndexedDB cache or fetch from CDN.
 * Integrates seamlessly with Next.js Image component.
 */

import { useState, useEffect, useRef } from 'react';
import { getCachedImageUrl } from '@/lib/indexeddb/imageCache';

interface UseImageCacheOptions {
  /**
   * Original image URL
   */
  src: string;
  /**
   * Fallback URL if image fails to load
   */
  fallback?: string;
  /**
   * Whether to enable caching (default: true)
   */
  enabled?: boolean;
}

interface UseImageCacheResult {
  /**
   * Cached or original image URL
   */
  cachedSrc: string;
  /**
   * Loading state
   */
  isLoading: boolean;
  /**
   * Error state
   */
  error: Error | null;
}

/**
 * Hook to get cached image URL
 * 
 * @example
 * const { cachedSrc, isLoading } = useImageCache({
 *   src: product.images[0],
 *   fallback: '/placeholder-image.png'
 * });
 * 
 * <Image src={cachedSrc} alt="Product" />
 */
export function useImageCache({
  src,
  fallback = '/placeholder-image.png',
  enabled = true,
}: UseImageCacheOptions): UseImageCacheResult {
  const [cachedSrc, setCachedSrc] = useState<string>(src || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if disabled or invalid URL
    if (!enabled || !src || src.startsWith('data:') || src.startsWith('/placeholder')) {
      setCachedSrc(src || fallback);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadImage = async () => {
      try {
        // Check cache first (synchronous check for instant display)
        const { default: imageCacheDB } = await import('@/lib/indexeddb/imageCache');
        const cachedBlob = await imageCacheDB.getImage(src);
        
        if (cachedBlob && isMounted) {
          // Instant display from cache (no loading state)
          if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(blobUrlRef.current);
          }
          blobUrlRef.current = URL.createObjectURL(cachedBlob);
          setCachedSrc(blobUrlRef.current);
          setIsLoading(false);
          setError(null);
          
          // Still fetch in background to update cache if needed
          getCachedImageUrl(src).then((url) => {
            if (isMounted && url !== blobUrlRef.current) {
              if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
                URL.revokeObjectURL(blobUrlRef.current);
              }
              blobUrlRef.current = url;
              setCachedSrc(url);
            }
          }).catch(() => {
            // Ignore background fetch errors
          });
          
          return;
        }

        // Not in cache, fetch from network
        setIsLoading(true);
        setError(null);

        // Get cached image URL (will fetch if not cached)
        const cachedUrl = await getCachedImageUrl(src);

        if (isMounted) {
          // Clean up previous blob URL if exists
          if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(blobUrlRef.current);
          }

          blobUrlRef.current = cachedUrl;
          setCachedSrc(cachedUrl);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Image cache load error:', err);
          setError(err instanceof Error ? err : new Error('Failed to load image'));
          setCachedSrc(src || fallback);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      isMounted = false;
      // Clean up blob URL on unmount
      if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src, fallback, enabled]);

  return { cachedSrc, isLoading, error };
}

/**
 * Hook to preload multiple images
 */
export function useImagePreload(imageUrls: string[]): {
  preloaded: boolean;
  progress: number;
} {
  const [preloaded, setPreloaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setPreloaded(true);
      return;
    }

    let isMounted = true;
    let loadedCount = 0;

    const loadImages = async () => {
      const validUrls = imageUrls.filter(
        (url) => url && !url.startsWith('data:') && !url.startsWith('/placeholder')
      );

      if (validUrls.length === 0) {
        if (isMounted) {
          setPreloaded(true);
          setProgress(100);
        }
        return;
      }

      // Load images in batches
      const batchSize = 3;
      for (let i = 0; i < validUrls.length; i += batchSize) {
        if (!isMounted) break;

        const batch = validUrls.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map(async (url) => {
            try {
              await getCachedImageUrl(url);
              if (isMounted) {
                loadedCount++;
                setProgress(Math.round((loadedCount / validUrls.length) * 100));
              }
            } catch (error) {
              console.warn('Failed to preload image:', url, error);
            }
          })
        );
      }

      if (isMounted) {
        setPreloaded(true);
        setProgress(100);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [imageUrls]);

  return { preloaded, progress };
}

