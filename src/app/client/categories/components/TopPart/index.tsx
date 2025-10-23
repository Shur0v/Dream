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
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-[1320px] inline-flex flex-col justify-center items-center" data-layer="2">
            {/* layer-2 = main content wrapper */}
            
            <div className="layer-3 self-stretch h-[512px] relative overflow-hidden rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl my-10" data-layer="3">
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
                <div className="text-center text-white">
                  <h1 className="text-6xl font-bold mb-4 text-yellow-300">
                    {banners[currentSlide].title}
                  </h1>
                  <h2 className="text-4xl font-semibold mb-6">
                    {banners[currentSlide].subtitle}
                  </h2>
                  
                  {/* Promotional Badge */}
                  <div className="bg-yellow-400 text-black px-8 py-4 rounded-lg inline-block mb-8">
                    <div className="text-2xl font-bold">UP TO {banners[currentSlide].discount}</div>
                    <div className="text-lg">{banners[currentSlide].emi}</div>
                  </div>

                  {/* App Exclusive Coupons */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold mb-4">APP EXCLUSIVE COUPON</h3>
                    <div className="flex justify-center gap-4">
                      {banners[currentSlide].coupons.map((coupon, index) => (
                        <div key={index} className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium">
                          {coupon.code} save upto {coupon.amount}
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
