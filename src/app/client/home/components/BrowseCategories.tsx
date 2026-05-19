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
 * Displays circular category icons for easy navigation
 * Cards loop within 8000rem width container
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
        const { fetchWithCache } = await import('@/lib/indexeddb/apiCache');
        const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000); // 1 hour cache
        const result = await response.json();

        if (active && result.success && result.data) {
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

  // Calculate loop count for long horizontal strip
  const loopedCategories: Category[] = [];
  if (categories.length > 0) {
    const setsNeeded = Math.ceil(8000 / 15);
    for (let i = 0; i < setsNeeded; i++) {
      loopedCategories.push(...categories.map((cat) => ({ ...cat })));
    }
  }

  // Enable mouse wheel and drag scrolling on desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaX;
    };

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    const dragThreshold = 5;
    let hasMoved = false;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const diffX = e.clientX - startX;

      if (Math.abs(diffX) > dragThreshold) {
        hasMoved = true;
        e.preventDefault();
        container.scrollLeft = startScrollLeft - diffX;
      }
    };

    const handleMouseUp = () => {
      const wasDragging = isDragging && hasMoved;
      wasDragRef.current = wasDragging;

      isDragging = false;
      hasMoved = false;
      container.style.cursor = 'grab';

      setTimeout(() => {
        wasDragRef.current = false;
      }, 100);
    };

    const handleMouseLeave = () => {
      isDragging = false;
      hasMoved = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.style.cursor = 'grab';

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="father w-full pt-4 pb-8 sm:pt-6 sm:pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-24 bg-white" role="region" aria-labelledby="browse-categories-heading" data-layer="father">
      <div className="daughter px-2 md:px-0 overflow-x-hidden" data-layer="daughter">
        <div className="layer-1 w-full max-w-[1320px] mx-auto overflow-x-hidden" role="main" data-layer="1">
          <div className="layer-2 self-stretch inline-flex flex-col justify-start items-start gap-2 sm:gap-3 md:gap-5 lg:gap-8" data-layer="2">
            <div
              className="layer-3 self-stretch justify-start text-slate-950 text-2xl md:text-3xl lg:text-5xl font-medium font-['Poppins'] leading-tight md:leading-normal lg:leading-[57.60px]"
              id="browse-categories-heading"
              role="heading"
              aria-level={2}
              data-layer="3"
            >
              Browse Categories
            </div>

            <div
              ref={scrollContainerRef}
              className="layer-4 w-full overflow-x-auto scrollbar-hide horizontal-scroll"
              data-layer="4"
              style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-neutral-500">Loading categories...</div>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-neutral-500">No categories available</div>
                </div>
              ) : (
                <div
                  className="inline-flex justify-start items-center gap-4 md:gap-6 select-none"
                  style={{ width: '8000rem', userSelect: 'none' }}
                >
                  {loopedCategories.map((category, index) => (
                    <button
                      key={`${category.id}-${index}`}
                      className="layer-5 flex-shrink-0 w-[140px] md:w-[220px] h-[140px] md:h-[220px] p-1.5 md:p-3 bg-fuchsia-400/10 rounded-xl inline-flex flex-col justify-start items-center gap-1 md:gap-4 cursor-pointer select-none"
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                      }}
                      onClick={(e) => {
                        if (!wasDragRef.current) {
                          e.preventDefault();
                          handleCategoryClick(category.name, category.slug);
                        }
                      }}
                      aria-label={`Browse ${category.name} category`}
                      data-layer="5"
                    >
                      <div className="layer-6 w-full h-24 md:h-40 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" data-layer="6">
                        {category.image && !imageErrors.has(`${category.id}-${index}`) ? (
                          <CachedCategoryImage
                            src={category.image}
                            alt={`${category.name} category`}
                            onError={() => {
                              setImageErrors((prev) => new Set([...prev, `${category.id}-${index}`]));
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

                      <div className="layer-7 w-full text-center justify-center text-black text-sm md:text-base font-medium font-['Poppins'] leading-tight md:leading-normal select-none pointer-events-none flex-shrink-0 whitespace-nowrap overflow-hidden text-ellipsis pb-0.5 md:pb-0" data-layer="7" title={category.name}>
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
