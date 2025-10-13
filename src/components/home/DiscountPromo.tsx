'use client';

import React from 'react';
import { Button } from '../ui/Button';

/**
 * Discount Promo Component
 * Large promotional banner for special offers
 */
export default function DiscountPromo() {
  return (
    <section className="w-full py-12 bg-gradient-to-r from-purple-100 via-purple-50 to-blue-50">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500">
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-12">
            {/* Left Content */}
            <div className="text-white z-10 max-w-xl">
              <h2 className="text-5xl font-bold mb-4">
                Flat 30% OFF on<br />
                Headphones & Accessories
              </h2>
              <p className="text-xl mb-6 text-purple-100">
                Don't miss out on our exclusive summer sale
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Premium Quality Products</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">Free Shipping Over $50</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span className="text-lg">1 Year Warranty</span>
                </li>
              </ul>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                Shop Now
              </Button>
            </div>

            {/* Right Image */}
            <div className="relative w-full md:w-1/2 h-full flex items-center justify-center">
              <div className="relative w-[400px] h-[400px]">
                <img 
                  src="/hero/images/image1.png"
                  alt="Laptop"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}


