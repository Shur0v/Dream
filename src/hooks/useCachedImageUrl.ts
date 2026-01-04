/**
 * Hook to get cached image URL for use with regular img tags
 * (For components that don't use Next.js Image)
 */

import { useState, useEffect } from 'react';
import { getCachedImageUrl } from '@/lib/indexeddb/imageCache';

/**
 * Get cached image URL for regular img tags
 * 
 * @example
 * const cachedSrc = useCachedImageUrl(imageUrl);
 * <img src={cachedSrc} alt="Image" />
 */
export function useCachedImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = '/placeholder-image.png'
): string {
  const [cachedSrc, setCachedSrc] = useState<string>(imageUrl || fallback);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('/placeholder')) {
      setCachedSrc(imageUrl || fallback);
      return;
    }

    let isMounted = true;

    const loadImage = async () => {
      try {
        const cachedUrl = await getCachedImageUrl(imageUrl);
        if (isMounted) {
          // Clean up previous blob URL
          if (blobUrl && blobUrl.startsWith('blob:')) {
            URL.revokeObjectURL(blobUrl);
          }
          setBlobUrl(cachedUrl);
          setCachedSrc(cachedUrl);
        }
      } catch (error) {
        console.warn('Failed to load cached image:', error);
        if (isMounted) {
          setCachedSrc(imageUrl || fallback);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imageUrl, fallback]);

  return cachedSrc;
}

