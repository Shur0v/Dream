'use client';

import React, { useState, useEffect } from 'react';

/**
 * PromoBanners Component
 * Displays promotional banner with countdown timer and product image
 */
export default function PromoBanners() {
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 19,
    minutes: 18,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
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
          // Reset when countdown reaches zero
          days = 18;
          hours = 19;
          minutes = 18;
          seconds = 45;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <section className="w-screen h-[736px] relative overflow-hidden overflow-x-hidden">
      {/* Full Screen Background SVG */}

      
      {/* Gradient Circles - Full Screen */}
      <div className="">
          <div className="absolute inset-0 w-screen max-h-[736px] z-0 bg-cover bg-center bg-no-repeat origin-center left-[8%] rotate-45">
              <div className="w-96 h-96 absolute bg-gradient-to-r from-violet-200/60 to-fuchsia-400/20 rounded-full z-10" style={{left: '50%', top: '620px', transform: 'translateX(-50%)'}} />
              <div className="w-[567px] h-[567px] absolute bg-gradient-to-r from-violet-200/60 to-fuchsia-400/20 rounded-full z-10" style={{left: '50%', top: '80px', transform: 'translateX(-50%)'}} />
              <div className="w-[998px] h-[998px] absolute bg-gradient-to-r from-violet-200/60 to-fuchsia-400/20 rounded-full z-10" style={{left: '50%', top: '-885px', transform: 'translateX(-50%)'}} />
          </div>
      </div>


      
      {/* Content Container - Constrained to 1320px */}
      <div className="relative z-20 w-full max-w-[1320px] mx-auto">
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
                    <div className="self-stretch justify-start text-violet-400 text-5xl font-bold font-['Poppins'] leading-[67.20px]">
                      Flat 30% OFF on Headphones & Accessories
                    </div>
                    <div className="self-stretch justify-start text-zinc-600 text-base font-normal font-['PolySans_Trial'] leading-none">
                      Don't miss out on today's exclusive deal.
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="w-72 h-8 inline-flex justify-start items-center gap-6">
                    <div className="inline-flex flex-col justify-center items-start gap-2">
                      <div className="inline-flex justify-start items-center gap-2">
                        {/* Days */}
                        <div className="text-center justify-start">
                          <span className="text-black text-lg font-semibold font-['PolySans_Trial'] leading-loose">
                            {formatTime(timeLeft.days)}
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
                            {formatTime(timeLeft.hours)}
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
                            {formatTime(timeLeft.minutes)}
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
                  src="/promoslider/img1.png" 
                  alt="Product"
                />
              </div>
            </div>
            
            {/* Pagination Dots */}
            <div className="h-2 inline-flex justify-start items-center gap-2 z-40">
              <div className="w-12 h-2 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-[10px]" />
              <div className="w-5 h-2 bg-neutral-200 rounded-[10px]" />
              <div className="w-3.5 h-2 bg-neutral-200 rounded-[10px]" />
              <div className="w-2.5 h-2 bg-neutral-200 rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}