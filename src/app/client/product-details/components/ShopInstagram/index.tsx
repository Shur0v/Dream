'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Shop Instagram Component
 * Displays Instagram-style grid of images
 */
export default function ShopInstagram() {
  const instagramImages = [
    {
      id: 1,
      image: '/proderails/shopinsta/image.png',
      alt: 'Instagram post 1',
    },
    {
      id: 2,
      image: '/proderails/shopinsta/image1.png',
      alt: 'Instagram post 2',
    },
    {
      id: 3,
      image: '/proderails/shopinsta/image2.png',
      alt: 'Instagram post 3',
    },
    {
      id: 4,
      image: '/proderails/shopinsta/image3.png',
      alt: 'Instagram post 4',
    },
    {
      id: 5,
      image: '/proderails/shopinsta/image4.png',
      alt: 'Instagram post 5',
    },
  ];

  return (
    <section className="father w-full py-20 bg-sky-50" role="region" aria-labelledby="instagram-heading" data-layer="father">
      {/* father = full width shop instagram section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        {/* daughter = design holder for entire shop instagram section */}
        
        {/* Header Section */}
        <div className="layer-1 self-stretch flex flex-col justify-start items-start gap-4 mb-8" data-layer="1">
          {/* layer-1 = header section container */}
          
          <div className="layer-2 self-stretch inline-flex justify-start items-start gap-8" data-layer="2">
            {/* layer-2 = header content wrapper */}
            
            <div className="layer-3 flex justify-start items-center gap-8" data-layer="3">
              {/* layer-3 = title container */}
              
              <div 
                className="layer-4 justify-start text-black text-5xl font-medium font-['Poppins'] leading-[48px]"
                id="instagram-heading"
                role="heading"
                aria-level={2}
                data-layer="4"
              >
                {/* layer-4 = section heading */}
                Shop Instagram
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Grid */}
        <div className="layer-1 self-stretch grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6" data-layer="1">
          {/* layer-1 = instagram grid container */}
          
          {instagramImages.map((item, index) => (
            <div
              key={item.id}
              className="layer-2 aspect-[240/256] relative group cursor-pointer"
              role="img"
              aria-label={item.alt}
              data-layer="2"
            >
              {/* layer-2 = individual instagram image container */}
              
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover rounded-sm"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              
              {/* Instagram Icon Overlay (on 4th image) */}
              {index === 3 && (
                <div className="layer-3 absolute inset-0 bg-black/50 rounded-sm" data-layer="3">
                  {/* layer-3 = instagram icon overlay */}
                  
                  <div className="layer-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 overflow-hidden" data-layer="4">
                    {/* layer-4 = instagram icon container */}
                    
                    <div className="w-8 h-8 absolute" />
                    <div className="w-2.5 h-2.5 absolute left-[11.69px] top-[11.69px] outline-1 outline-offset-[-0.50px] outline-white" />
                    <div className="w-6 h-6 absolute left-[4.25px] top-[4.25px] outline-1 outline-offset-[-0.50px] outline-white" />
                    <div className="w-[2.66px] h-[2.66px] absolute left-[22.58px] top-[8.77px] bg-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
