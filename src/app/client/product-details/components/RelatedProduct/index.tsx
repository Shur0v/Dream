'use client';

import React, { useState } from 'react';
import Image from 'next/image';

/**
 * Related Product Component
 * Displays related products in a horizontal scrollable carousel
 */
export default function RelatedProduct() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      name: 'MacBook Pro 16-inch M3 Max',
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
      name: 'iPhone 15 Pro Max 256GB',
      price: 1399.99,
      originalPrice: 1599,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 42,
      isVerifiedSeller: true,
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Headphones',
      price: 389.99,
      originalPrice: 499,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 156,
      isVerifiedSeller: true,
    },
    {
      id: 4,
      name: 'Apple Watch Ultra 2',
      price: 779.99,
      originalPrice: 899,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 4,
      reviews: 88,
      isVerifiedSeller: true,
    },
    {
      id: 5,
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
      id: 6,
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
    <section className="father w-full py-20 bg-white" role="region" aria-labelledby="related-heading" data-layer="father">
      {/* father = full width related product section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        {/* daughter = design holder for entire related product section */}
        
        {/* Header Section */}
        <div className="layer-1 self-stretch flex flex-col justify-start items-start gap-4 mb-8" data-layer="1">
          {/* layer-1 = header section container */}
          
          <div className="layer-2 self-stretch inline-flex justify-start items-start gap-8" data-layer="2">
            {/* layer-2 = header content wrapper */}
            
            <div className="layer-3 flex justify-start items-center gap-8" data-layer="3">
              {/* layer-3 = title container */}
              
              <div 
                className="layer-4 justify-start text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px]"
                id="related-heading"
                role="heading"
                aria-level={2}
                data-layer="4"
              >
                {/* layer-4 = section heading */}
                Related Product
              </div>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="layer-5 self-stretch h-[532px] flex justify-between items-center my-12" data-layer="5">
          {/* layer-5 = products carousel container */}
          
          <div className="layer-6 w-full h-full overflow-x-auto scrollbar-thin scrollbar-thumb-fuchsia-500 scrollbar-track-gray-200" data-layer="6">
            {/* layer-6 = scrollable products container */}
            
            <div className="layer-7 flex gap-6 pb-4" data-layer="7">
              {/* layer-7 = products flex container */}
              
              {products.map((product) => (
                <div
                  key={product.id}
                  className="layer-8 w-[312px] h-[532px] p-6 bg-white rounded-xl border border-gray-200 flex-shrink-0 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow duration-300"
                  role="article"
                  aria-labelledby={`product-title-${product.id}`}
                  data-layer="8"
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* layer-8 = individual product card */}
                  
                  {/* Verified Seller Badge */}
                  <div className="layer-9 self-stretch flex justify-start items-start" data-layer="9">
                    {/* layer-9 = verified seller badge container */}
                    
                    {product.isVerifiedSeller && (
                      <div className="layer-10 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full" data-layer="10">
                        {/* layer-10 = verified seller badge */}
                        Verified Seller
                      </div>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="layer-11 w-full h-[200px] relative overflow-hidden rounded-lg" data-layer="11">
                    {/* layer-11 = product image container */}
                    
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="layer-12 self-stretch flex flex-col justify-start items-start gap-3" data-layer="12">
                    {/* layer-12 = product info container */}
                    
                    <div 
                      className="layer-13 self-stretch text-slate-950 text-lg font-semibold font-['Poppins'] leading-6"
                      id={`product-title-${product.id}`}
                      role="heading"
                      aria-level={3}
                      data-layer="13"
                    >
                      {/* layer-13 = product name */}
                      {product.name}
                    </div>

                    {/* Price */}
                    <div className="layer-14 self-stretch flex justify-start items-center gap-2" data-layer="14">
                      {/* layer-14 = price container */}
                      
                      <div className="layer-15 text-fuchsia-500 text-xl font-bold font-['Poppins']" data-layer="15">
                        {/* layer-15 = current price */}
                        {product.currency}{product.price}
                      </div>
                      <div className="layer-16 text-gray-500 text-lg font-medium font-['Poppins'] line-through" data-layer="16">
                        {/* layer-16 = original price */}
                        {product.currency}{product.originalPrice}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="layer-17 self-stretch flex justify-start items-center gap-2" data-layer="17">
                      {/* layer-17 = rating container */}
                      
                      <div className="layer-18 flex text-yellow-400" data-layer="18">
                        {/* layer-18 = stars container */}
                        
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="layer-19 text-gray-600 text-sm font-medium font-['Poppins']" data-layer="19">
                        {/* layer-19 = rating text */}
                        ({product.reviews} reviews)
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="layer-20 self-stretch mt-4" data-layer="20">
                      {/* layer-20 = button container */}
                      
                      <button 
                        className="layer-21 w-full py-3 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors font-medium font-['Poppins']"
                        data-layer="21"
                      >
                        {/* layer-21 = add to cart button */}
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
