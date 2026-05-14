'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCachedImageUrl } from '@/hooks/useCachedImageUrl';

interface ProductGalleryProps {
  images: string[];
  className?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, className }) => {
  const fallbackImages = images.length ? images : ['/placeholder-image.png'];
  const allImages = fallbackImages;
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [thumbnailScrollIndex, setThumbnailScrollIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const mainImageContainerRef = useRef<HTMLDivElement>(null);
  const wasDragRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // Number of thumbnails to show at once (responsive)
  const [thumbnailsToShow, setThumbnailsToShow] = useState(3);
  
  useEffect(() => {
    const updateThumbnailsToShow = () => {
      if (window.innerWidth >= 1024) {
        setThumbnailsToShow(4);
      } else if (window.innerWidth >= 768) {
        setThumbnailsToShow(3);
      } else {
        setThumbnailsToShow(3);
      }
    };
    
    updateThumbnailsToShow();
    window.addEventListener('resize', updateThumbnailsToShow);
    return () => window.removeEventListener('resize', updateThumbnailsToShow);
  }, []);

  // Navigate to next/previous image
  const goToImage = useCallback((direction: 'next' | 'prev' | number) => {
    if (typeof direction === 'number') {
      setMainImageIndex(direction);
    } else if (direction === 'next') {
      setMainImageIndex((prev) => (prev + 1) % allImages.length);
    } else {
      setMainImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  }, [allImages.length]);

  const handleThumbnailClick = (index: number) => {
    if (!wasDragRef.current) {
      setMainImageIndex(index);
      // Auto-scroll thumbnails to show clicked thumbnail
      if (index >= thumbnailScrollIndex + thumbnailsToShow) {
        setThumbnailScrollIndex(Math.max(0, index - thumbnailsToShow + 1));
      } else if (index < thumbnailScrollIndex) {
        setThumbnailScrollIndex(index);
      }
    }
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setThumbnailScrollIndex(Math.max(0, thumbnailScrollIndex - 1));
    } else {
      const maxScroll = Math.max(0, allImages.length - thumbnailsToShow);
      setThumbnailScrollIndex(Math.min(maxScroll, thumbnailScrollIndex + 1));
    }
  };

  const canScrollLeft = thumbnailScrollIndex > 0;
  const canScrollRight = thumbnailScrollIndex < allImages.length - thumbnailsToShow;

  // Auto-scroll thumbnails when main image changes
  useEffect(() => {
    if (mainImageIndex >= thumbnailScrollIndex + thumbnailsToShow) {
      setThumbnailScrollIndex(Math.max(0, mainImageIndex - thumbnailsToShow + 1));
    } else if (mainImageIndex < thumbnailScrollIndex) {
      setThumbnailScrollIndex(mainImageIndex);
    }
  }, [mainImageIndex, thumbnailScrollIndex, thumbnailsToShow]);

  // Touch/Swipe support for main image
  useEffect(() => {
    const container = mainImageContainerRef.current;
    if (!container || allImages.length <= 1) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let dragThreshold = 5;
    let hasMoved = false;

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      setIsTransitioning(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
      const diffX = touchStartX - touchEndX;
      
      if (Math.abs(diffX) > 10) {
        e.preventDefault();
        const containerWidth = container.offsetWidth;
        const translateX = -mainImageIndex * containerWidth - diffX;
        container.style.transform = `translateX(${translateX}px)`;
        container.style.transition = 'none';
      }
    };

    const handleTouchEnd = () => {
      const diffX = touchStartX - touchEndX;
      const swipeThreshold = 50;

      if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
          // Swipe left - next image
          goToImage('next');
        } else {
          // Swipe right - previous image
          goToImage('prev');
        }
      } else {
        // Reset transform if swipe wasn't sufficient
        container.style.transform = '';
        container.style.transition = '';
      }

      setIsTransitioning(true);
      touchStartX = 0;
      touchEndX = 0;
    };

    // Mouse drag events for desktop
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startScrollLeft = mainImageIndex;
      container.style.cursor = 'grabbing';
      setIsTransitioning(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const diffX = e.clientX - startX;
      
      if (Math.abs(diffX) > dragThreshold) {
        hasMoved = true;
        e.preventDefault();
        const containerWidth = container.offsetWidth;
        const translateX = -startScrollLeft * containerWidth + diffX;
        container.style.transform = `translateX(${translateX}px)`;
        container.style.transition = 'none';
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const wasDragging = isDragging && hasMoved;
      wasDragRef.current = wasDragging;
      
      if (wasDragging) {
        const diffX = e.clientX - startX;
        const containerWidth = container.offsetWidth;
        const threshold = containerWidth * 0.2; // 20% of width
        
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            goToImage('prev');
          } else {
            goToImage('next');
          }
        } else {
          // Snap back to current image
          container.style.transform = '';
          container.style.transition = '';
          setIsTransitioning(true);
        }
      }
      
      isDragging = false;
      hasMoved = false;
      container.style.cursor = 'grab';
      
      setTimeout(() => {
        wasDragRef.current = false;
      }, 100);
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsTransitioning(true);
      }
      isDragging = false;
      hasMoved = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    container.style.cursor = 'grab';

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mainImageIndex, allImages.length, goToImage]);

  return (
    <div
      className={`father w-full flex flex-col justify-center items-start gap-6 ${className || ''}`}
      role="region"
      aria-labelledby="product-gallery-heading"
      data-layer="father"
    >
      {/* father = full width product gallery section */}
      <div className="daughter w-full" data-layer="daughter">
        {/* daughter = design holder for entire product gallery section */}
        <div className="layer-1 w-full flex flex-col lg:justify-start lg:items-start justify-start items-start gap-6" role="main" data-layer="1">
          {/* layer-1 = main gallery container */}
          
          {/* Main Image with Navigation and Sliding */}
          <div
            className="layer-2 w-full rounded-[20px] bg-gray-100 relative overflow-hidden aspect-[471/384] max-w-full md:max-w-none lg:mt-0 group"
            data-layer="2"
          >
            {/* layer-2 = main image container */}
            <div 
              ref={mainImageContainerRef}
              className="relative w-full h-full flex"
              style={{
                transform: `translateX(-${mainImageIndex * 100}%)`,
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              }}
            >
              {allImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative w-full h-full flex-shrink-0"
                >
                  <CachedMainImage
                    src={image}
                    alt={`Product image ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons - Only show if more than 1 image */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => goToImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === mainImageIndex
                          ? 'w-8 bg-fuchsia-500'
                          : 'w-2 bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails with Scroll */}
          {allImages.length > 0 && (
            <div className="layer-4 w-full relative" data-layer="4">
              {/* layer-4 = thumbnails container */}
              <div className="flex items-center gap-2">
                {/* Left Scroll Button */}
                {allImages.length > thumbnailsToShow && canScrollLeft && (
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                    aria-label="Scroll thumbnails left"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                )}

                {/* Thumbnails Container */}
                <div
                  ref={thumbnailContainerRef}
                  className="flex-1 overflow-hidden"
                >
                  <div
                    className="flex gap-2 sm:gap-3 md:gap-4 transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${thumbnailScrollIndex * (100 / thumbnailsToShow)}%)`,
                    }}
                  >
                    {allImages.map((image, index) => {
                      const isActive = index === mainImageIndex;
                      return (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          className={`layer-5 rounded-[20px] border-2 transition-all duration-200 flex-shrink-0 ${
                            isActive
                              ? 'border-fuchsia-500 ring-2 ring-fuchsia-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleThumbnailClick(index)}
                          aria-label={`View product image ${index + 1}`}
                          data-layer="5"
                          style={{ width: `calc(${100 / thumbnailsToShow}% - ${(thumbnailsToShow - 1) * 8 / thumbnailsToShow}px)` }}
                        >
                          {/* layer-5 = individual thumbnail container */}
                          <div className="relative w-full aspect-[146/120] rounded-[20px] overflow-hidden">
                            <CachedThumbnailImage
                              src={image}
                              alt={`Product thumbnail ${index + 1}`}
                            />
                          </div>
                          {/* layer-6 = thumbnail image */}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Scroll Button */}
                {allImages.length > thumbnailsToShow && canScrollRight && (
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                    aria-label="Scroll thumbnails right"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for cached main image
function CachedMainImage({
  src,
  alt
}: {
  src: string;
  alt: string;
}) {
  const cachedSrc = useCachedImageUrl(src);
  const isExternalOrBlob =
    cachedSrc.startsWith('http://') ||
    cachedSrc.startsWith('https://') ||
    cachedSrc.startsWith('blob:');
  return (
    <div className="absolute inset-0">
      <Image
        src={cachedSrc}
        alt={alt}
        fill
        unoptimized={isExternalOrBlob}
        className="object-cover rounded-[20px]"
        sizes="(max-width: 768px) 100vw, 471px"
        loading="lazy"
        priority={false}
      />
    </div>
  );
}

// Component for cached thumbnail image
function CachedThumbnailImage({
  src,
  alt
}: {
  src: string;
  alt: string;
}) {
  const cachedSrc = useCachedImageUrl(src);
  const isExternalOrBlob =
    cachedSrc.startsWith('http://') ||
    cachedSrc.startsWith('https://') ||
    cachedSrc.startsWith('blob:');
  return (
    <Image
      src={cachedSrc}
      alt={alt}
      fill
      unoptimized={isExternalOrBlob}
      className="object-cover rounded-[20px]"
      sizes="(max-width: 768px) 25vw, 146px"
      loading="lazy"
    />
  );
}

export default ProductGallery;
