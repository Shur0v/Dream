'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';

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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories`);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Only show active categories
          const activeCategories = result.data.filter((cat: Category) => cat.isActive);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Calculate how many times to loop categories to fill 8000rem
  // Approximate: each card with gap ~15rem on large screen, so ~533 sets needed
  // But we'll loop enough times to ensure smooth scrolling
  const loopedCategories: Category[] = [];
  if (categories.length > 0) {
    const setsNeeded = Math.ceil(8000 / 15); // Approximate calculation
    for (let i = 0; i < setsNeeded; i++) {
      loopedCategories.push(...categories.map(cat => ({ ...cat })));
    }
  }

  // Enable mouse wheel and drag scrolling on large screens
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Mouse wheel scroll
    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scroll
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      
      e.preventDefault();
      container.scrollLeft += e.deltaX;
    };

    // Drag to scroll - works on cards and empty space
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let dragThreshold = 5; // pixels to move before considering it a drag
    let hasMoved = false; // Track if mouse has moved during drag

    const handleMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
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
      
      // If moved enough, it's a drag
      if (Math.abs(diffX) > dragThreshold) {
        hasMoved = true;
        e.preventDefault();
        container.scrollLeft = startScrollLeft - diffX;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Store drag state before resetting
      const wasDragging = isDragging && hasMoved;
      wasDragRef.current = wasDragging;
      
      isDragging = false;
      hasMoved = false;
      container.style.cursor = 'grab';
      
      // Reset drag flag after a short delay to allow click event
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

    // Set initial cursor
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
            
            {/* Horizontal Scrollable Container - 8000rem width with looping cards */}
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
                <div 
                  className="inline-flex justify-start items-center gap-4 md:gap-6 select-none"
                  style={{ width: '8000rem', userSelect: 'none' }}
                >
                  {/* Inner flex container for cards - 8000rem width with looping categories */}
                  
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
                      
                      <div className="layer-6 w-full h-20 md:h-40 rounded-lg overflow-hidden flex-shrink-0" data-layer="6">
                        {/* layer-6 = category image container */}
                        <img 
                          className="w-full h-full object-cover select-none pointer-events-none" 
                          src={category.image || '/categories/image/category1.png'} 
                          alt={`${category.name} category`}
                          loading="lazy"
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                          onError={(e) => {
                            // Fallback to default image if category image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/categories/image/category1.png';
                          }}
                        />
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

