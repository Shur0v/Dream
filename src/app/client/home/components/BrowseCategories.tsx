'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Browse Categories Component
 * Displays circular category icons for easy navigation
 * Cards loop within 8000rem width container
 */
export default function BrowseCategories() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wasDragRef = useRef(false);
  
  /**
   * Handle category click navigation
   */
  const handleCategoryClick = (categoryName: string) => {
    // Navigate to categories page
    router.push('/client/categories');
  };
  
  const categories = [
    { 
      id: 1, 
      name: 'Jacket', 
      image: '/categories/image/category1.png'
    },
    { 
      id: 2, 
      name: 'Trousers', 
      image: '/categories/image/category2.png'
    },
    { 
      id: 3, 
      name: 'Hoodie', 
      image: '/categories/image/category3.png'
    },
    { 
      id: 4, 
      name: 'Muffler', 
      image: '/categories/image/category4.png'
    },
    { 
      id: 5, 
      name: 'Combo', 
      image: '/categories/image/category5.png'
    },
    { 
      id: 6, 
      name: 'Shoe', 
      image: '/categories/image/category6.png'
    },
  ];

  // Calculate how many times to loop categories to fill 8000rem
  // Approximate: each card with gap ~15rem on large screen, so ~533 sets needed
  // But we'll loop enough times to ensure smooth scrolling
  const loopedCategories: typeof categories = [];
  const setsNeeded = Math.ceil(8000 / 15); // Approximate calculation
  for (let i = 0; i < setsNeeded; i++) {
    loopedCategories.push(...categories.map(cat => ({ ...cat })));
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
              
              <div 
                className="inline-flex justify-start items-center gap-4 md:gap-6 select-none"
                style={{ width: '8000rem', userSelect: 'none' }}
              >
                {/* Inner flex container for cards - 8000rem width with looping categories */}
                
                {loopedCategories.map((category, index) => (
                  <button 
                    key={`${category.id}-${index}`}
                    className="layer-5 flex-shrink-0 w-auto md:w-auto md:flex-1 self-stretch p-3 bg-fuchsia-400/10 rounded-xl inline-flex flex-col justify-start items-center gap-6 cursor-pointer select-none"
                    style={{ 
                      width: 'auto',
                      minWidth: 'fit-content',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none'
                    }}
                    onClick={(e) => {
                      // Only navigate if it wasn't a drag
                      if (!wasDragRef.current) {
                        e.preventDefault();
                        handleCategoryClick(category.name);
                      }
                    }}
                    aria-label={`Browse ${category.name} category`}
                    data-layer="5"
                  >
                    {/* layer-5 = individual category button */}
                    
                    <img 
                      className="layer-6 self-stretch h-40 rounded-lg object-cover select-none pointer-events-none" 
                      src={category.image} 
                      alt={`${category.name} category`}
                      loading="lazy"
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                      data-layer="6"
                    />
                    {/* layer-6 = category image */}
                    
                    <div className="layer-7 self-stretch text-center justify-start text-black text-3xl font-medium font-['Poppins'] leading-loose select-none pointer-events-none" data-layer="7">
                      {/* layer-7 = category name */}
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

