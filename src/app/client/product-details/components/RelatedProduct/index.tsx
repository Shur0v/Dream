'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Related Product Component
 * Mirrors the responsive behavior of the homepage BestSelling section
 */
export default function RelatedProduct() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      name: 'MacBook Pro 16-inch M3',
      price: 809.99,
      originalPrice: 1000,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 7,
      isVerifiedSeller: true,
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: 1299.99,
      originalPrice: 1500,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 4,
      reviews: 23,
      isVerifiedSeller: true,
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5',
      price: 399.99,
      originalPrice: 499,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 156,
      isVerifiedSeller: true,
    },
    {
      id: 4,
      name: 'Apple AirPods Pro 2nd',
      price: 249.99,
      originalPrice: 299,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 4,
      reviews: 89,
      isVerifiedSeller: true,
    },
  ];

  return (
    <section
      className="father w-full py-6 sm:py-10 md:py-14 lg:py-20 bg-white flex flex-col justify-start items-center gap-2.5 sm:gap-5 md:gap-6 lg:gap-8"
      role="region"
      aria-labelledby="related-heading"
      data-layer="father"
    >
      <div className="daughter w-full max-w-[1320px] mx-auto px-2" data-layer="daughter">
        {/* Header Section */}
        <div className="layer-1 self-stretch flex flex-col justify-start items-start gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4">
          <div className="layer-2 self-stretch inline-flex justify-start items-start gap-8">
            <div className="layer-3 flex justify-start items-center gap-8">
              <div
                className="layer-4 justify-start text-slate-950 text-2xl md:text-3xl lg:text-5xl font-medium font-['Poppins'] leading-tight md:leading-normal lg:leading-[57.60px]"
                id="related-heading"
                role="heading"
                aria-level={2}
              >
                Related Product
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="layer-5 self-stretch grid grid-cols-2 md:flex md:justify-center md:items-center md:h-[582px] gap-4 md:gap-6 my-6 md:my-2">
          {products.map((product, index) => (
            <Link key={product.id} href={`/client/product-details/${product.id}`} className="block h-full md:flex md:items-center">
              <article
                className="layer-6 w-full md:w-[312px] h-full md:h-auto p-3 md:p-4 bg-sky-50 rounded-xl border border-black/10 flex flex-col justify-start items-start group md:hover:shadow-md md:hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                style={{ transformOrigin: 'center', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                role="article"
                aria-labelledby={`product-title-${product.id}`}
              >
                {/* Card Header */}
                <div className="layer-7 self-stretch inline-flex justify-between items-center mb-2">
                  <div className="layer-8 flex justify-start items-center gap-2">
                    <div className="layer-9 w-6 h-6 relative transform md:group-hover:scale-110 transition-transform duration-300">
                      <Image src="/card/icon/tick.svg" alt="Verified seller" width={24} height={24} loading="lazy" />
                    </div>
                    <div className="layer-10 justify-start text-neutral-600 text-xs md:text-sm font-semibold font-['PolySans_Trial'] leading-snug md:leading-relaxed whitespace-nowrap">
                      Verified Seller
                    </div>
                  </div>
                  <div className="layer-11 transform md:group-hover:scale-110 md:group-hover:rotate-12 transition-all duration-300 cursor-pointer">
                    <Image src="/card/icon/butterfly.svg" alt="Wishlist icon" width={24} height={24} loading="lazy" />
                  </div>
                </div>

                {/* Product Image */}
                <div className="layer-12 self-stretch h-48 md:h-72 relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transform md:group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none"
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="layer-13 self-stretch flex flex-col justify-start items-start gap-2">
                  <div
                    className="layer-14 justify-start text-slate-950 text-sm md:text-lg font-semibold font-['Poppins'] leading-tight md:leading-loose md:group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full"
                    title={product.name}
                    id={`product-title-${product.id}`}
                    role="heading"
                    aria-level={3}
                  >
                    {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                  </div>

                  <div className="layer-15 inline-flex justify-start items-center gap-1 md:gap-1.5">
                    <div className="layer-16 flex flex-col">
                      <div className="layer-17 justify-start text-black text-lg md:text-2xl font-semibold font-['Poppins'] leading-6 md:leading-9">
                        {product.currency}
                        {product.price}
                      </div>
                    </div>
                    <div className="layer-18 justify-start">
                      <span className="text-red-500 text-xs md:text-base font-normal font-['Poppins'] leading-normal">(</span>
                      <span className="text-red-500 text-xs md:text-base font-normal font-['Poppins'] line-through leading-normal">
                        {product.currency}
                        {product.originalPrice}
                      </span>
                      <span className="text-red-500 text-xs md:text-base font-normal font-['Poppins'] leading-normal">)</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="layer-19 flex flex-col md:flex-row md:inline-flex justify-start items-start md:items-center gap-1 md:gap-1.5">
                    <div className="layer-20 flex justify-start items-center gap-0.5 md:gap-0" role="img" aria-label={`${product.rating} out of 5 stars`}>
                      {[...Array(product.rating)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="#FFC107"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-6 md:h-6 transform md:group-hover:scale-110 transition-transform duration-300"
                          aria-hidden="true"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <div className="layer-21 hidden md:block text-center justify-start text-neutral-400 text-xs md:text-sm font-normal font-['Poppins'] leading-snug md:leading-relaxed whitespace-nowrap">
                      ({product.reviews} Reviews)
                    </div>
                    <div className="layer-21-mobile md:hidden self-stretch px-2 py-1 bg-neutral-100 rounded-md text-center justify-start text-neutral-400 text-xs font-normal font-['Poppins'] leading-snug">
                      ({product.reviews} Reviews)
                    </div>
                  </div>
                </div>

                {/* Add to Cart Hover CTA */}
                <div className="layer-22 self-stretch overflow-hidden h-0 md:group-hover:h-14 transition-all duration-500 ease-out">
                  <button
                    className="layer-23 w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 md:group-hover:h-14 md:group-hover:py-3 md:group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 md:group-hover:translate-y-0 cursor-pointer"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <div className="layer-24 w-5 h-5 relative">
                      <Image src="/card/icon/cart.svg" alt="Cart icon" width={20} height={20} loading="lazy" />
                    </div>
                    <div className="layer-25 justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap">
                      Add to Cart
                    </div>
                  </button>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
