'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCachedImageUrl } from '@/hooks/useCachedImageUrl';
import { Category } from '@/types';

// Component for cached category image
function CachedCategoryImage({ 
  src, 
  alt, 
  onError 
}: { 
  src: string; 
  alt: string; 
  onError: () => void;
}) {
  const cachedSrc = useCachedImageUrl(src);
  return (
    <img 
      className="w-full h-full object-cover select-none pointer-events-none" 
      src={cachedSrc}
      alt={alt}
      loading="lazy"
      draggable="false"
      onDragStart={(e) => e.preventDefault()}
      onError={onError}
    />
  );
}

/**
 * Browse Categories Component
 * Displays category cards for easy navigation
 */
export default function BrowseCategories() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wasDragRef = useRef(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  /**
   * Handle category click navigation
   */
  const handleCategoryClick = (categoryName: string, categorySlug?: string) => {
    // Navigate to categories page with category filter
    if (categorySlug) {
      router.push(`/client/categories?category=${categorySlug}`);
    } else {
      router.push('/client/categories');
    }
  };

  // Fetch categories from API with caching for instant loading
  useEffect(() => {
    let active = true;
    
    const fetchCategories = async () => {
      try {
        // Check cache first for instant loading
        const { getCachedResponse } = await import('@/lib/indexeddb/apiCache');
        const cacheKey = '/api/categories?limit=80';
        const cachedData = await getCachedResponse(cacheKey);
        
        if (cachedData && active) {
          // Show cached data instantly (no loading state)
          const activeCategories = (cachedData.data || []).filter((cat: Category) => cat.isActive);
          setCategories(activeCategories);
          setLoading(false);
        } else if (active) {
          setLoading(true);
        }

        // Fetch from network (update cache in background)
        // Note: We use the cache key without forceRefresh for caching
        const { fetchWithCache } = await import('@/lib/indexeddb/apiCache');
        const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000); // 1 hour cache
        const result = await response.json();
        
        if (active && result.success && result.data) {
          // API already filters active categories, but we ensure only active ones
          const activeCategories = result.data.filter((cat: Category) => cat.isActive);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    
    return () => {
      active = false;
    };
  }, []);

  // Keep a small repeated set for smooth horizontal scroll without huge DOM cost.
  const loopedCategories: Category[] = [];
  if (categories.length > 0) {
    const minVisibleCards = 12;
    const setsNeeded = Math.max(3, Math.ceil(minVisibleCards / categories.length) + 1);
    for (let i = 0; i < setsNeeded; i++) {
      loopedCategories.push(...categories.map(cat => ({ ...cat })));
    }
  }

  // Enable wheel and pointer drag scrolling (mouse + touch)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Wheel scroll: map both horizontal and vertical wheel movement to x-scroll.
    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      container.scrollLeft += delta;
    };

    // Pointer drag to scroll - works on cards and empty space.
    let isPointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    const dragThreshold = 5; // pixels to move before considering it a drag
    let hasMoved = false; // Track if pointer has moved during drag

    const handlePointerDown = (e: PointerEvent) => {
      // Keep custom drag only for mouse; let touch use native horizontal scroll.
      if (e.pointerType !== 'mouse') return;
      if (e.button !== 0) return;

      isPointerDown = true;
      hasMoved = false;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
      container.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;

      const diffX = e.clientX - startX;

      // If moved enough, it's a drag
      if (Math.abs(diffX) > dragThreshold) {
        hasMoved = true;
        e.preventDefault();
        container.scrollLeft = startScrollLeft - diffX;
      }
    };

    const endDrag = (pointerId?: number) => {
      // Store drag state before resetting
      const wasDragging = isPointerDown && hasMoved;
      wasDragRef.current = wasDragging;

      isPointerDown = false;
      hasMoved = false;
      container.style.cursor = 'grab';
      if (typeof pointerId === 'number') {
        container.releasePointerCapture?.(pointerId);
      }

      // Reset drag flag after a short delay to allow click event
      setTimeout(() => {
        wasDragRef.current = false;
      }, 100);
    };

    const handlePointerUp = (e: PointerEvent) => endDrag(e.pointerId);
    const handlePointerCancel = (e: PointerEvent) => endDrag(e.pointerId);
    const handlePointerLeave = () => endDrag();

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerCancel);
    container.addEventListener('pointerleave', handlePointerLeave);

    // Set initial cursor
    container.style.cursor = 'grab';

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerCancel);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <section className="father w-full pt-4 pb-8 sm:pt-6 sm:pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-24 bg-white" role="region" aria-labelledby="browse-categories-heading" data-layer="father">
      {/* father = full width browse categories section */}
      
      <div className="daughter px-2 md:px-0 overflow-x-hidden" data-layer="daughter">
        {/* daughter = design holder for entire browse categories section */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto overflow-x-hidden" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 self-stretch inline-flex flex-col justify-start items-start gap-2 sm:gap-3 md:gap-5 lg:gap-8" data-layer="2">
            {/* layer-2 = content wrapper */}
            
            <div 
              className="layer-3 self-stretch justify-start text-slate-950 text-2xl md:text-3xl lg:text-5xl font-medium font-['Poppins'] leading-tight md:leading-normal lg:leading-[57.60px]"
              id="browse-categories-heading"
              role="heading"
              aria-level={2}
              data-layer="3"
            >
              {/* layer-3 = section heading */}
              Browse Categories
            </div>
            
            {/* Horizontal scrollable category row */}
            <div 
              ref={scrollContainerRef}
              className="layer-4 w-full overflow-x-auto scrollbar-hide horizontal-scroll" 
              data-layer="4" 
              style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
            >
              {/* layer-4 = categories scrollable container */}
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-neutral-500">Loading categories...</div>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-neutral-500">No categories available</div>
                </div>
              ) : (
                <div className="inline-flex w-max min-w-max justify-start items-center gap-4 md:gap-6 select-none pr-2 md:pr-4" style={{ userSelect: 'none' }}>
                  {/* Inner flex container for repeated categories */}
                  
                  {loopedCategories.map((category, index) => (
                    <button 
                      key={`${category.id}-${index}`}
                      className="layer-5 flex-shrink-0 w-[140px] md:w-[220px] h-[140px] md:h-[220px] p-1.5 md:p-3 bg-fuchsia-400/10 rounded-xl inline-flex flex-col justify-start items-center gap-1.5 md:gap-4 cursor-pointer select-none"
                      style={{ 
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                      }}
                      onClick={(e) => {
                        // Only navigate if it wasn't a drag
                        if (!wasDragRef.current) {
                          e.preventDefault();
                          handleCategoryClick(category.name, category.slug);
                        }
                      }}
                      aria-label={`Browse ${category.name} category`}
                      data-layer="5"
                    >
                      {/* layer-5 = individual category button */}
                      
                      <div className="layer-6 w-full h-20 md:h-40 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" data-layer="6">
                        {/* layer-6 = category image container */}
                        {category.image && !imageErrors.has(`${category.id}-${index}`) ? (
                          <CachedCategoryImage
                            src={category.image}
                            alt={`${category.name} category`}
                            onError={() => {
                              // If image fails to load, mark it as error to show name instead
                              setImageErrors(prev => new Set([...prev, `${category.id}-${index}`]));
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-fuchsia-100 flex items-center justify-center p-2">
                            <span className="text-fuchsia-600 text-xs md:text-sm font-semibold font-['Poppins'] text-center leading-tight break-words">
                              {category.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="layer-7 w-full text-center justify-center text-black text-sm md:text-base font-medium font-['Poppins'] leading-tight md:leading-normal select-none pointer-events-none flex-shrink-0 whitespace-nowrap overflow-hidden text-ellipsis" data-layer="7" title={category.name}>
                        {/* layer-7 = category name - nowrap to keep full name in one line */}
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

