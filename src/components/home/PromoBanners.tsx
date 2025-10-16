'use client';

import React, { useState, useEffect } from 'react';

/**
 * PromoBanners Component
 * Displays promotional banner with countdown timer and product image
 */
export default function PromoBanners() {
  const banners = [
    {
      id: 1,
      image: '/promoslider/img1.png',
      title: 'Flat 30% OFF on Headphones & Accessories',
      subtitle: "Don't miss out on today's exclusive deal.",
      initialTime: { days: 18, hours: 19, minutes: 18, seconds: 45 }
    },
    {
      id: 2,
      image: '/promoslider/img2.png',
      title: 'Save 40% on Smart Watches',
      subtitle: 'Limited time offer ends soon.',
      initialTime: { days: 5, hours: 12, minutes: 0, seconds: 0 }
    },
    {
      id: 3,
      image: '/promoslider/img3.png',
      title: 'Mega Sale: Bluetooth Speakers',
      subtitle: 'Grab premium sound at low prices.',
      initialTime: { days: 2, hours: 6, minutes: 30, seconds: 10 }
    },
    {
      id: 4,
      image: '/promoslider/img4.png',
      title: 'Exclusive Deals on Gaming Gear',
      subtitle: 'Upgrade your setup today.',
      initialTime: { days: 10, hours: 0, minutes: 45, seconds: 20 }
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLefts, setTimeLefts] = useState(
    banners.map(b => ({ ...b.initialTime }))
  );

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  const decrementTime = (
    value: { days: number; hours: number; minutes: number; seconds: number },
    initial: { days: number; hours: number; minutes: number; seconds: number }
  ) => {
    let { days, hours, minutes, seconds } = value;
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else if (hours > 0) {
      hours--;
      minutes = 59;
      seconds = 59;
    } else if (days > 0) {
      days--;
      hours = 23;
      minutes = 59;
      seconds = 59;
    } else {
      // Reset to the banner's initial time once it reaches zero
      return { ...initial };
    }
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLefts(prev => {
        const next = [...prev];
        next[currentSlide] = decrementTime(prev[currentSlide], banners[currentSlide].initialTime);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <section className="father w-full h-[736px] relative overflow-hidden">
      {/* Full Screen Background SVG */}

      {/* Background image wrapper */}
      <div
        className="mother absolute inset-0 bg-[url('/promoslider/shape.svg')] bg-no-repeat bg-[length:100%_100%] bg-left"
        style={{ left: "28.27%" }}
      />


      
      {/* Content Container - Constrained to 1320px */}
      <div className="children relative z-20 w-full max-w-[1320px] mx-auto">
        <div className="h-[736px] relative rounded-[30px] overflow-hidden">
          {/* Main Content Container */}
          <div className="w-full h-full px-2.5 pt-20 pb-20 overflow-hidden absolute inline-flex flex-col justify-end items-center gap-12 z-20">
            {/* Shadow Effect */}
            <div className="w-[490px] h-6 absolute bg-neutral-400 blur-xl z-30" style={{left: '50%', top: '573.52px', transform: 'translateX(-50%)'}} />
            
            {/* Main Content */}
            <div className="self-stretch inline-flex justify-center items-center gap-24 z-40">
              {/* Left Side - Text Content */}
              <div className="w-[695px] inline-flex flex-col justify-start items-start gap-6">
                <div className="w-[700px] flex flex-col justify-start items-start gap-6">
                  {/* Headline and Subtitle */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch justify-start text-5xl font-bold font-['Poppins'] leading-[67.20px] bg-gradient-to-r from-[#9B77E7] to-[#1600A0] bg-clip-text text-transparent">
                      {banners[currentSlide].title}
                    </div>
                    <div className="self-stretch justify-start text-zinc-600 text-base font-normal font-['PolySans_Trial'] leading-none">
                      {banners[currentSlide].subtitle}
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="w-72 h-8 inline-flex justify-start items-center gap-6">
                    <div className="inline-flex flex-col justify-center items-start gap-2">
                      <div className="inline-flex justify-start items-center gap-2">
                        {/* Days */}
                        <div className="text-center justify-start">
                          <span className="text-black text-lg font-semibold font-['PolySans_Trial'] leading-loose">
                            {formatTime(timeLefts[currentSlide].days)}
                          </span>
                          <span className="text-neutral-600 text-xs font-normal font-['PolySans_Trial']">
                            /Days
                          </span>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start gap-1">
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                        </div>
                        
                        {/* Hours */}
                        <div className="text-center justify-start">
                          <span className="text-black text-lg font-semibold font-['PolySans_Trial'] leading-loose">
                            {formatTime(timeLefts[currentSlide].hours)}
                          </span>
                          <span className="text-neutral-600 text-xs font-normal font-['PolySans_Trial']">
                            /Hours
                          </span>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start gap-1">
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                        </div>
                        
                        {/* Minutes */}
                        <div className="text-center justify-start">
                          <span className="text-black text-lg font-semibold font-['PolySans_Trial'] leading-loose">
                            {formatTime(timeLefts[currentSlide].minutes)}
                          </span>
                          <span className="text-neutral-600 text-xs font-normal font-['PolySans_Trial']">
                            /Mins
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Shop Now Button */}
                <div className="w-56 h-12 px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-xl inline-flex justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300">
                  <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-10">
                    SHOP NOW
                  </div>
                </div>
              </div>
              
              {/* Right Side - Product Image */}
              <div className="relative">
                <img 
                  className="w-[518px] h-96 object-contain" 
                  src={banners[currentSlide].image}
                  alt="Product"
                />
              </div>
            </div>
            
            {/* Pagination Dots */}
            <div className="h-2 flex justify-center items-center gap-2 z-40">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-[10px] transition-all duration-300 ease-in-out ${
                    currentSlide === index
                      ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500'
                      : 'w-5 bg-neutral-200'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}