'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getForYouProducts } from '@/lib/productData';

/**
 * For You Component
 * Same UI as BestSelling but pulls from a different data set
 */
export default function ForYou() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Get "For You" products from unified dataset
  const products = getForYouProducts();

  return (
    <section className="father w-full py-20 bg-white flex flex-col justify-start items-center gap-8" role="region" aria-labelledby="for-you-heading" data-layer="father">
      {/* father = full width for you section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        {/* daughter = design holder for entire for you section */}
        
        {/* Header Section */}
        <div className="layer-1 self-stretch flex flex-col justify-start items-start gap-4" data-layer="1">
          {/* layer-1 = header section container */}
          
          <div className="layer-2 self-stretch inline-flex justify-start items-start gap-8" data-layer="2">
            {/* layer-2 = header content wrapper */}
            
            <div className="layer-3 flex justify-start items-center gap-8" data-layer="3">
              {/* layer-3 = title container */}
              
              <div 
                className="layer-4 justify-start text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px]"
                id="for-you-heading"
                role="heading"
                aria-level={2}
                data-layer="4"
              >
                {/* layer-4 = section heading */}
                For You
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid (same layout as BestSelling) */}
        <div className="layer-5 self-stretch h-[532px] flex justify-between items-center my-12" data-layer="5">
          {/* layer-5 = products grid container */}
          
          {products.map((product, index) => (
             <Link key={product.id} href={`/client/product-details/${product.id}`} className="block">
               <div
                 className="layer-6 w-[312px] p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                 onMouseEnter={() => setHoveredCard(index)}
                 onMouseLeave={() => setHoveredCard(null)}
                 style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                 role="article"
                 aria-labelledby={`product-title-${product.id}`}
                 data-layer="6"
               >
              {/* layer-6 = individual product card */}
              
              {/* Card Header */}
              <div className="layer-7 self-stretch inline-flex justify-between items-center mb-2" data-layer="7">
                {/* layer-7 = card header container */}
                
                <div className="layer-8 flex justify-start items-center gap-2" data-layer="8">
                  {/* layer-8 = verified seller indicator */}
                  
                  <div className="layer-9 w-6 h-6 relative transform group-hover:scale-110 transition-transform duration-300" data-layer="9">
                    {/* layer-9 = verified icon container */}
                    <Image
                      src="/card/icon/tick.svg"
                      alt="Verified seller"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="layer-10 justify-start text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-relaxed" data-layer="10">
                    {/* layer-10 = verified seller text */}
                    Verified Seller
                  </div>
                </div>
                
                <div className="layer-11 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" data-layer="11">
                  {/* layer-11 = wishlist button container */}
                  <Image
                    src="/card/icon/butterfly.svg"
                    alt="Add to wishlist"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Product Image */}
              <div className="layer-12 self-stretch h-72 relative mb-4 overflow-hidden rounded-lg" data-layer="12">
                {/* layer-12 = product image container */}
                
                <Image
                  src={product.image}
                  alt={`${product.name} product image`}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="layer-13 self-stretch flex flex-col justify-start items-start" data-layer="13">
                {/* layer-13 = product info container */}
                
                <div className="layer-14 self-stretch pt-4 pb-5 flex flex-col justify-center items-start gap-3" data-layer="14">
                  {/* layer-14 = product details wrapper */}
                  
                  {/* Product Name and Price */}
                  <div className="layer-15 self-stretch flex flex-col justify-start items-start gap-1" data-layer="15">
                    {/* layer-15 = product name and price container */}
                    
                    <div 
                      className="layer-16 justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-loose group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full" 
                      title={product.name}
                      id={`product-title-${product.id}`}
                      role="heading"
                      aria-level={3}
                      data-layer="16"
                    >
                      {/* layer-16 = product name */}
                      {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                    </div>
                    
                    <div className="layer-17 inline-flex justify-start items-center gap-1.5" data-layer="17">
                      {/* layer-17 = price container */}
                      
                      <div className="layer-18 flex justify-start items-center" data-layer="18">
                        {/* layer-18 = current price */}
                        <div className="layer-19 justify-start text-black text-2xl font-semibold font-['Poppins'] leading-9" data-layer="19">
                          {/* layer-19 = current price display */}
                          {product.currency}{product.price}
                        </div>
                      </div>
                      
                      <div className="layer-20 justify-start" data-layer="20">
                        {/* layer-20 = original price */}
                        <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">(</span>
                        <span className="text-red-500 text-base font-normal font-['Poppins'] line-through leading-normal">
                          ${product.originalPrice}
                        </span>
                        <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">)</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="layer-21 inline-flex justify-start items-center gap-1.5" data-layer="21">
                    {/* layer-21 = rating and reviews container */}
                    
                    <div className="layer-22 flex justify-start items-center" role="img" aria-label={`${product.rating} out of 5 stars`} data-layer="22">
                      {/* layer-22 = star rating */}
                      
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
                          aria-hidden="true"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    
                    <div className="layer-23 text-center justify-start text-neutral-400 text-sm font-normal font-['Poppins'] leading-relaxed" data-layer="23">
                      {/* layer-23 = reviews count */}
                      ( {product.reviews} Reviews)
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button - Hidden by default, shown on hover */}
                <div className="layer-24 self-stretch overflow-hidden h-0 group-hover:h-14 transition-all duration-500 ease-out" data-layer="24">
                  {/* layer-24 = add to cart button container */}
                  
                  <button 
                    className="layer-25 w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 group-hover:h-14 group-hover:py-3 group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0"
                    aria-label={`Add ${product.name} to cart`}
                    data-layer="25"
                  >
                    {/* layer-25 = add to cart button */}
                    
                    <div className="layer-26 w-5 h-5 relative" data-layer="26">
                      {/* layer-26 = cart icon container */}
                      <Image
                        src="/card/icon/cart.svg"
                        alt="Cart icon"
                        width={20}
                        height={20}
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="layer-27 justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap" data-layer="27">
                      {/* layer-27 = button text */}
                      Add to Cart
                    </div>
                  </button>
                </div>
              </div>
               </div>
             </Link>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="layer-28 h-2 flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Product pagination" data-layer="28">
          {/* layer-28 = pagination dots container */}
          
          {[1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className={`layer-29 h-2 rounded-[10px] transition-all duration-300 ease-in-out transform origin-center ${
                hoveredCard === index
                  ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500'
                  : 'w-5 bg-neutral-200'
              }`}
              style={{
                transformOrigin: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              role="tab"
              aria-selected={hoveredCard === index}
              aria-label={`Go to product ${index + 1}`}
              data-layer="29"
            />
          ))}
        </div>
      </div>
    </section>
  );
}





