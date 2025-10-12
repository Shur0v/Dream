'use client';

import React from 'react';

/**
 * Browse Categories Component
 * Displays circular category icons for easy navigation
 */
export default function BrowseCategories() {
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
    <section className="w-full pt-10 pb-24 bg-white">
      <div className="w-full max-w-[1320px] mx-auto">
        <div className="text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px] mb-6">
          Browse Categories
        </div>
        <div className="w-full flex justify-between items-start">
          {categories.map((category) => (
            <button 
              key={category.id} 
              className="flex flex-col justify-start items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => console.log(`Clicked: ${category.name}`)}
            >
              {/* Fixed size container for all categories */}
              <div className="w-28 h-28 bg-white rounded-full flex justify-center items-center">
                <img 
                  className="w-20 h-20 object-cover" 
                  src={category.image} 
                  alt={category.name}
                />
              </div>
              <div className="text-center text-neutral-700 text-xl font-medium font-['Poppins'] leading-tight whitespace-nowrap">
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

