'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
}

/**
 * SafeImage component that handles missing images gracefully
 * For local /uploads/ paths, uses regular img tag with error handling
 * For other images, uses optimized Next.js Image component
 */
export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
  quality,
  placeholder = '/placeholder-image.png',
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || placeholder);
  const [hasError, setHasError] = useState(false);

  // Check if image is a local upload path
  const isLocalUpload = imgSrc.startsWith('/uploads/');

  // Handle error - fallback to placeholder
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(placeholder);
    }
  };

  // For local uploads that might not exist, use regular img tag with error handling
  if (isLocalUpload) {
    if (fill) {
      return (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hasError ? placeholder : imgSrc}
            alt={alt}
            className={className}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>
      );
    }

    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={hasError ? placeholder : imgSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={{
          objectFit: 'cover',
        }}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  // For other images, use optimized Next.js Image
  if (hasError) {
    return (
      <Image
        src={placeholder}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        unoptimized
        priority={priority}
        sizes={sizes}
        quality={quality}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
    />
  );
}

