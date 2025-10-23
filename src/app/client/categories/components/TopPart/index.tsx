'use client';

import React from 'react';

/**
 * TopPart Component for Categories Page
 * Displays a single full-width promotional banner
 */
export default function TopPart() {
  return (
    <section className="w-full h-[400px] bg-gradient-to-r from-red-500 via-red-600 to-pink-500 relative overflow-hidden">
      {/* Full width banner with promotional content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-6xl font-bold mb-4 text-yellow-300">
            শারদায় ফেস্ট
          </h1>
          <h2 className="text-4xl font-semibold mb-6">
            ELECTRONIC & APPLIANCES
          </h2>
          
          {/* Promotional Badge */}
          <div className="bg-yellow-400 text-black px-8 py-4 rounded-lg inline-block mb-8">
            <div className="text-2xl font-bold">UP TO 50% OFF</div>
            <div className="text-lg">0% EMI AVAILABLE</div>
          </div>

          {/* App Exclusive Coupons */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold mb-4">APP EXCLUSIVE COUPON</h3>
            <div className="flex justify-center gap-4">
              <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium">
                puja5 save upto 1000TK*
              </div>
              <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium">
                puja7 save upto 2500TK*
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <img 
          src="/categories/image/smartphone.png" 
          alt="Decorative" 
          className="w-20 h-20"
        />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <img 
          src="/categories/image/lighting.png" 
          alt="Decorative" 
          className="w-20 h-20"
        />
      </div>
      <div className="absolute top-1/2 left-20 opacity-20">
        <img 
          src="/categories/image/grocery.png" 
          alt="Decorative" 
          className="w-16 h-16"
        />
      </div>
      <div className="absolute top-1/3 right-20 opacity-20">
        <img 
          src="/categories/image/beauty.png" 
          alt="Decorative" 
          className="w-16 h-16"
        />
      </div>
    </section>
  );
}
