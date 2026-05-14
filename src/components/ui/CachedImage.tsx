/**
 * CachedImage Component
 * 
 * Next.js Image component with IndexedDB caching for instant loading.
 * Automatically caches images and loads from cache on subsequent visits.
 */

'use client';

import Image, { ImageProps } from 'next/image';
import { useImageCache } from '@/hooks/useImageCache';
import { useState } from 'react';

interface CachedImageProps extends Omit<ImageProps, 'src'> {
  /**
   * Original image URL (will be cached)
   */
  src: string;
  /**
   * Fallback image URL if original fails
   */
  fallback?: string;
  /**
   * Whether to enable caching (default: true)
   */
  enableCache?: boolean;
}

/**
 * Image component with IndexedDB caching
 * 
 * @example
 * <CachedImage
 *   src={product.images[0]}
 *   alt="Product"
 *   fill
 *   className="object-cover"
 * />
 */
export default function CachedImage({
  src,
  fallback = '/placeholder-image.png',
  enableCache = true,
  alt,
  onError,
  ...props
}: CachedImageProps) {
  // Check if src is Base64 data URL - Next.js Image doesn't support Base64
  const isBase64 = src?.startsWith('data:image/') || false;
  const isPlaceholder = src?.startsWith('/placeholder') || false;

  const { cachedSrc, isLoading } = useImageCache({
    src: src || fallback,
    fallback,
    enabled: enableCache && !!src && !isBase64 && !isPlaceholder,
  });

  const [hasError, setHasError] = useState(false);
  // Use fallback if error occurred
  const imageSrc = hasError ? fallback : (isBase64 ? src : cachedSrc);
  const isExternalOrBlob =
    imageSrc?.startsWith('http://') ||
    imageSrc?.startsWith('https://') ||
    imageSrc?.startsWith('blob:');

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  // For Base64 images, use regular img tag (Next.js Image doesn't support Base64)
  if (isBase64) {
    // Extract width/height from props if available
    const { width, height, fill, ...imgProps } = props;
    
    if (fill) {
      return (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={alt || ''}
            className={props.className}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...props.style,
            }}
            onError={handleError}
            loading={props.loading || 'lazy'}
          />
        </div>
      );
    }

    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={imageSrc}
        alt={alt || ''}
        width={width}
        height={height}
        className={props.className}
        style={props.style}
        onError={handleError}
        loading={props.loading || 'lazy'}
        {...imgProps}
      />
    );
  }

  // For regular URLs, use Next.js Image component
  // Only use blur placeholder if blurDataURL is provided
  const shouldUseBlur = props.placeholder === 'blur' && props.blurDataURL;
  
  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt || ''}
      unoptimized={isExternalOrBlob}
      onError={handleError}
      // Only set placeholder if blurDataURL is provided
      placeholder={shouldUseBlur ? 'blur' : props.placeholder || undefined}
      blurDataURL={shouldUseBlur ? props.blurDataURL : undefined}
    />
  );
}

