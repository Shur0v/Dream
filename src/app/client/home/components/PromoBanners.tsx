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
      image: '/promoslider/slider1.png',
      title: 'Flat 30% OFF on Headphones & Accessories',
      subtitle: "Don't miss out on today's exclusive deal.",
      initialTime: { days: 18, hours: 19, minutes: 18, seconds: 45 }
    },
    {
      id: 2,
      image: '/promoslider/slider2.png',
      title: 'Save 40% on Smart Watches',
      subtitle: 'Limited time offer ends soon.',
      initialTime: { days: 5, hours: 12, minutes: 0, seconds: 0 }
    },
    {
      id: 3,
      image: '/promoslider/slider3.png',
      title: 'Mega Sale: Bluetooth Speakers',
      subtitle: 'Grab premium sound at low prices.',
      initialTime: { days: 2, hours: 6, minutes: 30, seconds: 10 }
    },
    {
      id: 4,
      image: '/promoslider/slider4.png',
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
    <section className="father w-full bg-white" role="banner" data-layer="father">
      {/* father = full width promotional banner section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire promo banner */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-[1320px] inline-flex flex-col justify-center items-center gap-12" data-layer="2">
            {/* layer-2 = main content wrapper */}
            
            <div className="layer-3 self-stretch h-[529px] pl-6 bg-fuchsia-50 rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl inline-flex justify-between items-center" data-layer="3">
              {/* layer-3 = main promotional card */}
              
              <div className="layer-4 w-[550px] inline-flex flex-col justify-start items-start gap-6" data-layer="4">
                {/* layer-4 = left text content section */}
                
                <div className="layer-5 self-stretch flex flex-col justify-start items-start gap-6" data-layer="5">
                  {/* layer-5 = text content wrapper */}
                  
                  <div className="layer-6 self-stretch flex flex-col justify-start items-start gap-4" data-layer="6">
                    {/* layer-6 = headline and subtitle container */}
                    
                    <div className="layer-7 self-stretch justify-start text-4xl font-bold font-['Poppins'] leading-[50.40px] bg-gradient-to-r from-violet-400 to-blue-600 bg-clip-text text-transparent" role="heading" aria-level={2} data-layer="7">
                      {/* layer-7 = main promotional headline */}
                      {banners[currentSlide].title}
                    </div>
                    <div className="layer-8 self-stretch justify-start text-zinc-600 text-base font-normal font-['PolySans_Trial'] leading-none" data-layer="8">
                      {/* layer-8 = promotional subtitle */}
                      {banners[currentSlide].subtitle}
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="layer-9 w-72 h-8 inline-flex justify-start items-center gap-6" role="timer" aria-live="polite" data-layer="9">
                    {/* layer-9 = countdown timer container */}
                    
                    <div className="layer-10 inline-flex flex-col justify-center items-start gap-2" data-layer="10">
                      {/* layer-10 = timer display wrapper */}
                      
                      <div className="layer-11 inline-flex justify-start items-center gap-2" data-layer="11">
                        {/* layer-11 = timer elements container */}
                        
                        {/* Days */}
                        <div className="layer-12 text-center justify-start" data-layer="12">
                          {/* layer-12 = days display */}
                          <span className="text-black text-lg font-semibold font-['PolySans_Trial'] leading-loose">
                            {formatTime(timeLefts[currentSlide].days)}
                          </span>
                          <span className="text-neutral-600 text-xs font-normal font-['PolySans_Trial']">
                            /Days
                          </span>
                        </div>
                        <div className="layer-13 inline-flex flex-col justify-start items-start gap-1" data-layer="13">
                          {/* layer-13 = separator dots */}
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                        </div>
                        
                        {/* Hours */}
                        <div className="layer-14 text-center justify-start" data-layer="14">
                          {/* layer-14 = hours display */}
                          <span className="text-black text-lg font-semibold font-['PolySans_Trial'] leading-loose">
                            {formatTime(timeLefts[currentSlide].hours)}
                          </span>
                          <span className="text-neutral-600 text-xs font-normal font-['PolySans_Trial']">
                            /Hours
                          </span>
                        </div>
                        <div className="layer-15 inline-flex flex-col justify-start items-start gap-1" data-layer="15">
                          {/* layer-15 = separator dots */}
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                          <div className="w-[3px] h-[3px] bg-neutral-800 rounded-full" />
                        </div>
                        
                        {/* Minutes */}
                        <div className="layer-16 text-center justify-start" data-layer="16">
                          {/* layer-16 = minutes display */}
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
                <div className="layer-17 w-56 h-12 px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 inline-flex justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300" role="button" aria-label="Shop now for promotional deals" data-layer="17">
                  {/* layer-17 = call-to-action button */}
                  <div className="layer-18 justify-start text-white text-base font-semibold font-['Poppins'] leading-10" data-layer="18">
                    {/* layer-18 = button text */}
                    SHOP NOW
                  </div>
                </div>
              </div>
              
              {/* Right Side - Product Image */}
              <img 
                className="layer-19 w-[655px] self-stretch rounded-tr-xl rounded-br-xl object-cover " 
                src={banners[currentSlide].image}
                alt={`${banners[currentSlide].title} promotional product`}
                loading="lazy"
                data-layer="19"
              />
              {/* layer-19 = product image */}
            </div>
            
            {/* Pagination Dots */}
            <div className="layer-20 h-2 inline-flex justify-start items-center gap-2" role="tablist" aria-label="Promotional banner navigation" data-layer="20">
              {/* layer-20 = pagination dots container */}
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-[10px] transition-all duration-300 ease-in-out ${
                    currentSlide === index
                      ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500'
                      : index === 1
                      ? 'w-5 bg-neutral-200'
                      : index === 2
                      ? 'w-3.5 bg-neutral-200'
                      : 'w-2.5 bg-neutral-200'
                  }`}
                  role="tab"
                  aria-selected={currentSlide === index}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-controls={`promo-slide-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}