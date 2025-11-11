'use client';

import React, { useState, useEffect } from 'react';

/**
 * TopPart Component for Categories Page
 * Displays promotional banner slider with full-width images
 */
export default function TopPart() {
  const banners = [
    {
      id: 1,
      image: '/promoslider/slider1.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '50% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    },
    {
      id: 2,
      image: '/promoslider/slider2.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '40% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    },
    {
      id: 3,
      image: '/promoslider/slider3.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '60% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    },
    {
      id: 4,
      image: '/promoslider/slider4.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '35% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  return (
    <section className="father w-full bg-white" role="banner" data-layer="father">
      {/* father = full width promotional banner section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire promo banner */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto px-2 md:px-0" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-full inline-flex flex-col justify-center items-center" data-layer="2">
            {/* layer-2 = main content wrapper */}
            
            <div className="layer-3 self-stretch h-[300px] sm:h-[380px] md:h-[450px] lg:h-[512px] relative overflow-hidden rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl my-6 md:my-8 lg:my-10" data-layer="3">
              {/* layer-3 = main promotional card with slider */}
              
              {/* Full-width sliding image */}
              <div className="absolute inset-0 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {banners.map((banner, index) => (
                  <div key={banner.id} className="absolute inset-0 w-full h-full" style={{ left: `${index * 100}%` }}>
                    <img 
                      className="w-full h-full object-cover"
                      src={banner.image}
                      alt={`${banner.title} promotional banner`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              {/* Overlay content */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-white px-3 sm:px-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-yellow-300">
                    {banners[currentSlide].title}
                  </h1>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-6">
                    {banners[currentSlide].subtitle}
                  </h2>
                  
                  {/* Promotional Badge - glassmorphism */}
                  <div className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl inline-block mb-6 md:mb-8 bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                    <div className="text-base md:text-xl font-semibold text-white/90">UP TO {banners[currentSlide].discount}</div>
                    <div className="text-xs md:text-sm text-white/80">{banners[currentSlide].emi}</div>
                  </div>

                  {/* App Exclusive Coupons */}
                  <div className="space-y-3">
                    <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-white/90">APP EXCLUSIVE COUPON</h3>
                    <div className="flex justify-center gap-2 md:gap-3">
                      {banners[currentSlide].coupons.map((coupon, index) => (
                        <div
                          key={index}
                          className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm text-white/90 bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
                        >
                          {coupon.code} • save upto {coupon.amount}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
                      </div>
        </div>
      </div>
    </section>
  );
}
