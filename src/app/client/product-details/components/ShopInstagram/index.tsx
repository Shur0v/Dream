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
      <div className="pointer-events-none absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out rounded-sm flex items-center justify-center">
        {/* Instagram icon */}
        <svg
          aria-hidden="true"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white drop-shadow-sm"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
        </svg>
      </div>
    </a>
  );

  return (
    <section className="father w-full py-20 bg-sky-50" role="region" aria-labelledby="instagram-heading">
      <div className="daughter w-full max-w-none mx-auto px-2 lg:px-8">
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
