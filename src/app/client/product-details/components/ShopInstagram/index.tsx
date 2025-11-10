'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Shop Instagram Component
 * Large screens: original 5-column grid (unchanged)
 * Mobile/Tablet: compact thumbnails with horizontal scroll + auto marquee
 */
export default function ShopInstagram() {
  const instagramImages = [
    { id: 1, image: '/proderails/shopinsta/image.png', alt: 'Instagram post 1' },
    { id: 2, image: '/proderails/shopinsta/image1.png', alt: 'Instagram post 2' },
    { id: 3, image: '/proderails/shopinsta/image2.png', alt: 'Instagram post 3' },
    { id: 4, image: '/proderails/shopinsta/image3.png', alt: 'Instagram post 4' },
    { id: 5, image: '/proderails/shopinsta/image4.png', alt: 'Instagram post 5' },
  ];

  const doubledImages = [...instagramImages, ...instagramImages];

  const renderImageCard = (
    item: typeof instagramImages[0],
    index: number,
    className = ''
  ) => (
    <a
      key={`${item.id}-${index}`}
      href="https://www.instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full relative group cursor-pointer ${className}`}
      aria-label={item.alt}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        className="object-cover rounded-sm"
        sizes="(max-width: 640px) 80vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 20vw"
      />
      {index === 3 && (
        <div className="absolute inset-0 bg-black/50 rounded-sm">
          <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 absolute" />
            <div className="w-2.5 h-2.5 absolute left-[11.69px] top-[11.69px] outline-1 outline-offset-[-0.50px] outline-white" />
            <div className="w-6 h-6 absolute left-[4.25px] top-[4.25px] outline-1 outline-offset-[-0.50px] outline-white" />
            <div className="w-[2.66px] h-[2.66px] absolute left-[22.58px] top-[8.77px] bg-white" />
          </div>
        </div>
      )}
    </a>
  );

  return (
    <section className="father w-full py-20 bg-sky-50" role="region" aria-labelledby="instagram-heading">
      <div className="daughter w-full max-w-[1320px] mx-auto px-2 lg:px-0">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="inline-flex items-center gap-8">
            <div
              className="text-black text-2xl sm:text-3xl lg:text-5xl font-medium font-['Poppins'] leading-tight sm:leading-[48px]"
              id="instagram-heading"
              role="heading"
              aria-level={2}
            >
              Shop Instagram
            </div>
          </div>
        </div>

        {/* Desktop grid (unchanged) */}
        <div className="hidden lg:grid grid-cols-5 gap-6">
          {instagramImages.map((item, index) =>
            renderImageCard(item, index, 'aspect-[240/256]')
          )}
        </div>

        {/* Mobile/Tablet layout */}
        <div className="lg:hidden">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto horizontal-scroll scrollbar-hide snap-x snap-mandatory">
            {doubledImages.map((item, index) => (
              <div
                key={`mobile-${item.id}-${index}`}
                className="flex-shrink-0 w-[220px] sm:w-[260px] snap-center"
              >
                {renderImageCard(item, index, 'aspect-[200/220]')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
