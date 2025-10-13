'use client';

import React, { useState } from 'react';
import Image from 'next/image';

/**
 * Featured Products Component
 * Displays featured products with category filters
 */
export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('Man');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filters = ['Man', 'Woman', 'Kids'];

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
    <section className="w-full pb-7 bg-white flex flex-col justify-start items-center gap-8">
      <div className="w-full max-w-[1320px] mx-auto">
        {/* Header Section */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch inline-flex justify-start items-start gap-8">
            <div className="flex justify-start items-center gap-8">
              <div className="justify-start text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px]">
                Featured Product
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="inline-flex justify-start items-center gap-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="p-2.5 rounded border border-stone-300 flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="justify-start text-neutral-400 text-base font-normal font-['PolySans_Trial'] leading-tight">
                  {filter}
                </div>
                <div className="w-6 h-6 relative overflow-hidden">
                  <svg
                    className="absolute left-[6.25px] top-[9.25px]"
                    width="12"
                    height="6"
                    viewBox="0 0 12 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L6 5L11 1" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="self-stretch h-[532px] flex justify-between items-center my-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[312px] p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Header */}
              <div className="self-stretch inline-flex justify-between items-center mb-2">
                <div className="flex justify-start items-center gap-2">
                  <div className="w-6 h-6 relative transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/card/icon/tick.svg"
                      alt="Verified"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="justify-start text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-relaxed">
                    Verified Seller
                  </div>
                </div>
                <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Image
                    src="/card/icon/butterfly.svg"
                    alt="Wishlist"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Product Image */}
              <div className="self-stretch h-72 relative mb-4 overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch pt-4 pb-5 flex flex-col justify-center items-start gap-3">
                  {/* Product Name and Price */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-loose group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full" title={product.name}>
                      {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                    </div>
                    <div className="inline-flex justify-start items-center gap-1.5">
                      <div className="flex justify-start items-center">
                        <div className="justify-start text-black text-2xl font-semibold font-['Poppins'] leading-9">
                          {product.currency}{product.price}
                        </div>
                      </div>
                      <div className="justify-start">
                        <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">(</span>
                        <span className="text-red-500 text-base font-normal font-['Poppins'] line-through leading-normal">
                          ${product.originalPrice}
                        </span>
                        <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">)</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="inline-flex justify-start items-center gap-1.5">
                    <div className="flex justify-start items-center">
                      {[...Array(product.rating)].map((_, i) => (
                        <svg
                          key={i}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="#FFC107"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transform group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-center justify-start text-neutral-400 text-sm font-normal font-['Poppins'] leading-relaxed">
                      ( {product.reviews} Reviews)
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button - Hidden by default, shown on hover */}
                <div className="self-stretch overflow-hidden">
                  <button className="w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 group-hover:h-14 group-hover:py-3 group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-5 h-5 relative">
                      <Image
                        src="/card/icon/cart.svg"
                        alt="Cart"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap">
                      Add to Cart
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="h-2 flex justify-center items-center gap-2 mt-8">
          {[1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className={`h-2 rounded-[10px] transition-all duration-300 ease-in-out transform origin-center ${
                hoveredCard === index
                  ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500'
                  : 'w-5 bg-neutral-200'
              }`}
              style={{
                transformOrigin: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


