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

  return (
    <section className="father w-full pt-10 pb-24 bg-white" role="region" aria-labelledby="browse-categories-heading" data-layer="father">
      {/* father = full width browse categories section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire browse categories section */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 self-stretch inline-flex flex-col justify-start items-start gap-8" data-layer="2">
            {/* layer-2 = content wrapper */}
            
            <div 
              className="layer-3 self-stretch justify-start text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px]"
              id="browse-categories-heading"
              role="heading"
              aria-level={2}
              data-layer="3"
            >
              {/* layer-3 = section heading */}
              Browse Categories
            </div>
            
            <div className="layer-4 w-[1320px] inline-flex justify-start items-center gap-6" data-layer="4">
              {/* layer-4 = categories grid container */}
              
              {categories.map((category, index) => (
                <button 
                  key={category.id} 
                  className={`layer-5 flex-1 self-stretch p-3 bg-fuchsia-400/10 rounded-xl inline-flex flex-col justify-start items-center gap-6 cursor-pointer hover:shadow-[5px_11px_22.100000381469727px_0px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                    index === 5 ? 'bg-fuchsia-400/10' : ''
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                  aria-label={`Browse ${category.name} category`}
                  data-layer="5"
                >
                  {/* layer-5 = individual category button */}
                  
                  <img 
                    className="layer-6 self-stretch h-40 rounded-lg" 
                    src={category.image} 
                    alt={`${category.name} category`}
                    loading="lazy"
                    data-layer="6"
                  />
                  {/* layer-6 = category image */}
                  
                  <div className="layer-7 self-stretch text-center justify-start text-black text-3xl font-medium font-['Poppins'] leading-loose" data-layer="7">
                    {/* layer-7 = category name */}
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

