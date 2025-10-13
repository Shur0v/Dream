'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { Clock } from 'lucide-react';

/**
 * Promotional Banners Component
 * Displays promotional banners with countdown timers
 */
export default function PromoBanners() {
  return (
    <section className="w-full py-8 bg-white">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Apple PowerCoat Banner */}
          <div className="relative h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-white text-3xl font-bold mb-2">
                  Apple PowerCoat<br />Aluminum Case
                </h3>
                <p className="text-2xl font-bold text-white mb-4">$949.00</p>
              </div>
              
              {/* Countdown Timer */}
              <div className="flex gap-2 items-center mb-4">
                <Clock className="w-5 h-5 text-white" />
                <div className="flex gap-2">
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">02</div>
                  <span className="text-white font-bold">:</span>
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">45</div>
                  <span className="text-white font-bold">:</span>
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">30</div>
                  <span className="text-white font-bold">:</span>
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">15</div>
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700 w-fit">
                Shop Now
              </Button>
            </div>
            <img 
              src="/hero/images/image3.png" 
              alt="PowerCoat Case"
              className="absolute right-0 bottom-0 w-1/2 h-full object-contain opacity-30"
            />
          </div>

          {/* Apple Powerbank Banner */}
          <div className="relative h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-900 text-3xl font-bold mb-2">
                  Apple Powerbank<br />Aluminum Case
                </h3>
                <p className="text-2xl font-bold text-gray-900 mb-4">$949.00</p>
              </div>
              
              {/* Countdown Timer */}
              <div className="flex gap-2 items-center mb-4">
                <Clock className="w-5 h-5 text-gray-900" />
                <div className="flex gap-2">
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">02</div>
                  <span className="text-gray-900 font-bold">:</span>
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">45</div>
                  <span className="text-gray-900 font-bold">:</span>
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">30</div>
                  <span className="text-gray-900 font-bold">:</span>
                  <div className="bg-white text-gray-900 px-3 py-2 rounded font-bold">15</div>
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700 w-fit">
                Shop Now
              </Button>
            </div>
            <img 
              src="/hero/images/image4.png" 
              alt="Powerbank"
              className="absolute right-0 bottom-0 w-1/2 h-full object-contain opacity-40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


