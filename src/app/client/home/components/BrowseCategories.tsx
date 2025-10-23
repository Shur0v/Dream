'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Browse Categories Component
 * Displays circular category icons for easy navigation
 */
export default function BrowseCategories() {
  const router = useRouter();
  
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
      name: 'Global Find', 
      image: '/categories/image/globalfind.png'
    },
    { 
        id: 2, 
        name: 'Man', 
        image: '/categories/image/man.png'
    },
    { 
      id: 3, 
      name: 'Smartphone', 
      image: '/categories/image/smartphone.png'
    },

    { 
      id: 4, 
      name: 'Grocery', 
      image: '/categories/image/grocery.png'
    },
    { 
      id: 5, 
      name: 'Woman', 
      image: '/categories/image/woman.png'
    },
    { 
      id: 6, 
      name: 'Beauty', 
      image: '/categories/image/beauty.png'
    },
    { 
      id: 7, 
      name: 'Baby Care', 
      image: '/categories/image/babycare.png'
    },
    { 
      id: 8, 
      name: 'Toys', 
      image: '/categories/image/toys.png'
    },
    { 
      id: 9, 
      name: 'Gift', 
      image: '/categories/image/gift.png'
    },
    { 
      id: 10, 
      name: 'Lighting', 
      image: '/categories/image/lighting.png'
    },
  ];

  return (
    <section className="father w-full pt-10 pb-24 bg-white" role="region" aria-labelledby="browse-categories-heading" data-layer="father">
      {/* father = full width browse categories section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire browse categories section */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div 
            className="layer-2 text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px] mb-6"
            id="browse-categories-heading"
            role="heading"
            aria-level={2}
            data-layer="2"
          >
            {/* layer-2 = section heading */}
            Browse Categories
          </div>
          
          <div className="layer-3 w-full flex justify-between items-start" data-layer="3">
            {/* layer-3 = categories grid container */}
            
            {categories.map((category) => (
              <button 
                key={category.id} 
                className="layer-4 flex flex-col justify-start items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleCategoryClick(category.name)}
                aria-label={`Browse ${category.name} category`}
                data-layer="4"
              >
                {/* layer-4 = individual category button */}
                
                {/* Fixed size container for all categories */}
                <div className="layer-5 w-28 h-28 bg-white rounded-full flex justify-center items-center" data-layer="5">
                  {/* layer-5 = category icon container */}
                  <img 
                    className="w-20 h-20 object-cover" 
                    src={category.image} 
                    alt={`${category.name} category icon`}
                    loading="lazy"
                  />
                </div>
                
                <div className="layer-6 text-center text-neutral-700 text-xl font-medium font-['Poppins'] leading-tight whitespace-nowrap" data-layer="6">
                  {/* layer-6 = category name */}
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

