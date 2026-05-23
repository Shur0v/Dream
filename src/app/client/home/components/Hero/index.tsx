'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCachedImageUrl } from '@/hooks/useCachedImageUrl';
import { fetchWithCache, getCachedResponse, peekCachedResponse } from '@/lib/indexeddb/apiCache';
import { HeroBanner } from '@/types';

/**
 * Hero section component with image slider and static banner grid
 * 
 * @description Features:
 * - Auto-playing image slider with navigation controls
 * - Static banner grid on the right side
 * - Responsive design for mobile and desktop
 * - Smooth transitions and hover effects
 */
// Component for cached slider image
function CachedSliderImage({ 
  src, 
  alt, 
  isActive 
}: { 
  src: string; 
  alt: string; 
  isActive: boolean;
}) {
  const cachedSrc = useCachedImageUrl(src);
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img 
        className="w-full h-full object-cover rounded-xl" 
        src={cachedSrc}
        alt={alt}
      />
    </div>
  );
}

// Component for cached right banner
function CachedBannerImage({ 
  src, 
  alt, 
  className 
}: { 
  src: string; 
  alt: string; 
  className: string;
}) {
  const cachedSrc = useCachedImageUrl(src);
  return (
    <img 
      className={className}
      src={cachedSrc}
      alt={alt}
    />
  );
}

export default function Hero() {
  const cacheKey = '/api/hero-banners';
  const initialCached = peekCachedResponse(cacheKey);
  const initialBanner: HeroBanner | null = initialCached ? (initialCached.data || initialCached) : null;

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState<string[]>(initialBanner?.sliderImages || []);
  const [rightBanners, setRightBanners] = useState<string[]>(initialBanner?.rightBanners || []);
  const [loading, setLoading] = useState(!initialBanner);

  // Fetch hero banner from API with caching
  useEffect(() => {
    let active = true;
    
    const fetchHeroBanner = async () => {
      try {
        // Check IndexedDB cache first (no loading flash if initial memory cache already exists)
        const cachedData = await getCachedResponse(cacheKey);
        
        if (cachedData && active) {
          const banner: HeroBanner = cachedData.data || cachedData;
          setSliderImages(banner.sliderImages || []);
          setRightBanners(banner.rightBanners || []);
          setLoading(false);
        } else if (active && !initialBanner) {
          setLoading(true);
        }

        // Fetch from network (update cache in background)
        const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000);
        const result = await response.json();
        
        if (active && result.success && result.data) {
          const banner: HeroBanner = result.data;
          setSliderImages(banner.sliderImages || []);
          setRightBanners(banner.rightBanners || []);
        }
      } catch (error) {
        console.error('Error fetching hero banner:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHeroBanner();
    
    return () => {
      active = false;
    };
  }, []);

  /**
   * Auto-play slider - changes slide every 5 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  /**
   * Go to next slide
   */
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  /**
   * Go to previous slide
   */
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  /**
   * Go to specific slide
   */
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="w-full py-2.5 sm:py-4 md:py-5 lg:py-8 bg-white">
        <div className="w-full max-w-[1320px] mx-auto px-2 md:px-0">
          <div className="flex items-center justify-center py-12">
            <div className="text-neutral-500">Loading hero banners...</div>
          </div>
        </div>
      </section>
    );
  }

  if (sliderImages.length === 0 && rightBanners.length === 0) {
    return null; // Don't show hero section if no banners
  }

  return (
    <section className="w-full py-2.5 sm:py-4 md:py-5 lg:py-8 bg-white">
      <div className="w-full max-w-[1320px] mx-auto px-2 md:px-0">
        <div className="flex flex-col md:flex-row justify-start items-start gap-2.5 sm:gap-4 md:gap-6">
          {/* Left Side - Main Slider with Auto-play - Maintains 804/513 aspect ratio */}
          {sliderImages.length > 0 && (
            <div className="w-full md:w-[804px] md:flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-100 group" style={{ aspectRatio: '804/513' }}>
              {/* Slider Images */}
              <div className="relative w-full h-full">
                {sliderImages.map((image, index) => (
                  <CachedSliderImage
                    key={index}
                    src={image}
                    alt={`Banner ${index + 1}`}
                    isActive={index === currentSlide}
                  />
                ))}
              </div>

              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slider Indicators */}
              {sliderImages.length > 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-10 flex justify-center items-center gap-2 z-10">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-[10px] ${
                        index === currentSlide 
                          ? 'w-12 h-2 bg-gradient-to-r from-blue-400 to-sky-700' 
                          : index === currentSlide - 1 || (currentSlide === 0 && index === sliderImages.length - 1)
                          ? 'w-5 h-2 bg-white'
                          : index === currentSlide - 2 || (currentSlide <= 1 && index === sliderImages.length + currentSlide - 2)
                          ? 'w-3.5 h-2 bg-white'
                          : 'w-2.5 h-2 bg-white'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Side - Banners Grid (Static) - Hidden on mobile, visible from tab and above */}
          {rightBanners.length > 0 && rightBanners.some(banner => banner && banner.trim() !== '') && (
            <div className="hidden md:flex w-full md:w-[492px] md:flex-shrink-0 flex-col justify-start items-start gap-6">
              {/* Top Image - Full Width Header (rightBanners[0]) */}
              {rightBanners[0] && rightBanners[0].trim() !== '' && (
                <CachedBannerImage
                  src={rightBanners[0]}
                  alt="Header Banner"
                  className="w-full h-[229px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
              )}
              {/* Bottom Images - Two side by side (rightBanners[1] and rightBanners[2]) */}
              {((rightBanners[1] && rightBanners[1].trim() !== '') || (rightBanners[2] && rightBanners[2].trim() !== '')) && (
                <div className="w-full flex justify-start items-center gap-6">
                  {rightBanners[1] && rightBanners[1].trim() !== '' && (
                    <CachedBannerImage
                      src={rightBanners[1]}
                      alt="Banner 1"
                      className="w-[234px] h-[260px] rounded-xl object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-cover bg-center"
                    />
                  )}
                  {rightBanners[2] && rightBanners[2].trim() !== '' && (
                    <CachedBannerImage
                      src={rightBanners[2]}
                      alt="Banner 2"
                      className="w-[234px] h-[260px] rounded-xl object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-cover bg-center"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
