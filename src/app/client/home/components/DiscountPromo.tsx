'use client';

import React, { useState, useEffect } from 'react';

/**
 * Discount Promo Component
 * Displays promotional banners with slider functionality and countdown timers
 */
export default function DiscountPromo() {
  const banners = [
    {
      id: 1,
      title: "Apple Powerbank Aluminum Case",
      startingBid: "Starting bid:",
      price: "$849.00",
      backgroundImage: "/promobanner/img1.png",
      alt: "Powerbank",
      initialTime: { days: 118, hours: 8, minutes: 18, seconds: 58 }
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra Pro",
      startingBid: "Starting bid:",
      price: "$1,299.00",
      backgroundImage: "/promobanner/img2.png",
      alt: "Smartphone",
      initialTime: { days: 45, hours: 12, minutes: 30, seconds: 15 }
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

  const currentBanner = banners[currentSlide];
  const currentTimeLeft = timeLefts[currentSlide];

  return (
    <section className="father w-full py-8 bg-white" role="region" aria-labelledby="discount-promo-heading" data-layer="father">
      {/* father = full width discount promo section */}
      
      <div className="daughter px-2" data-layer="daughter">
        {/* daughter = design holder for entire discount promo section */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-full flex flex-col justify-center items-center gap-6 lg:gap-12" data-layer="2">
            {/* layer-2 = promo banner container */}
            
            {/* Promo Banner Card - 648/400 ratio maintained */}
            <div 
              className="layer-3 w-full aspect-[648/400] bg-black/30 rounded-xl relative overflow-hidden" 
              role="article"
              aria-labelledby={`promo-title-${currentBanner.id}`}
              data-layer="3"
            >
              {/* layer-3 = individual promo banner */}
              
              {/* Background Image */}
              <div className="layer-4 absolute inset-0 z-0 rounded-xl overflow-hidden" data-layer="4">
                {/* layer-4 = background image container */}
                <img 
                  src={currentBanner.backgroundImage} 
                  alt={`${currentBanner.title} promotional product`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Content Overlay - Vertically Centered */}
              <div className="layer-5 absolute inset-0 z-10 flex flex-col justify-center items-start px-4 sm:px-6 lg:px-9 py-4 sm:py-6 lg:py-10 gap-2.5 sm:gap-3.5 lg:gap-6" data-layer="5">
                {/* layer-5 = content overlay container */}
                
                <div className="layer-6 w-full max-w-[572px] flex flex-col justify-start items-start gap-2 sm:gap-2.5 lg:gap-3" data-layer="6">
                  {/* layer-6 = banner content wrapper */}
                  
                  <div 
                    className="layer-7 w-full justify-start text-white text-base sm:text-xl lg:text-3xl font-semibold font-['Poppins'] leading-tight sm:leading-7 lg:leading-10"
                    id={`promo-title-${currentBanner.id}`}
                    role="heading"
                    aria-level={3}
                    data-layer="7"
                  >
                    {/* layer-7 = banner title */}
                    {currentBanner.title}
                  </div>
                  
                  <div className="layer-8 self-stretch flex flex-col justify-start items-start gap-0.5 sm:gap-1 lg:gap-1" data-layer="8">
                    {/* layer-8 = price information container */}
                    
                    <div className="layer-9 self-stretch justify-start text-red-500 text-xs sm:text-sm lg:text-base font-semibold font-['Poppins'] leading-5 sm:leading-6 lg:leading-7" data-layer="9">
                      {/* layer-9 = starting bid label */}
                      {currentBanner.startingBid}
                    </div>
                    
                    <div className="layer-10 self-stretch justify-start text-white text-lg sm:text-2xl lg:text-3xl font-semibold font-['Poppins']" data-layer="10">
                      {/* layer-10 = price display */}
                      {currentBanner.price}
                    </div>
                  </div>
                  
                  <div className="layer-11 self-stretch flex flex-col justify-start items-start gap-2 sm:gap-2.5 lg:gap-4" role="timer" aria-live="polite" data-layer="11">
                    {/* layer-11 = countdown timer container */}
                    
                    <div className="layer-12 flex flex-col justify-start items-center gap-1 sm:gap-1.5 lg:gap-2" data-layer="12">
                      {/* layer-12 = timer display wrapper */}
                      
                      <div className="layer-13 inline-flex justify-start items-start gap-1 sm:gap-1.5 lg:gap-2" data-layer="13">
                        {/* layer-13 = timer elements container */}
                        
                        {/* Days */}
                        <div className="layer-14 inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 lg:gap-1.5" data-layer="14">
                          {/* layer-14 = days timer unit */}
                          
                          <div className="layer-15 w-10 sm:w-12 lg:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="15">
                            {/* layer-15 = days display container */}
                            
                            <div className="layer-16 w-9 h-7 sm:w-10 sm:h-8 lg:w-12 lg:h-10 p-1 sm:p-1.5 lg:p-2.5 bg-white rounded flex justify-center items-center" data-layer="16">
                              {/* layer-16 = days value box */}
                              <div className="text-center justify-start text-blue-700 text-xs sm:text-sm lg:text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(currentTimeLeft.days)}
                              </div>
                            </div>
                            
                            <div className="layer-17 inline-flex flex-col justify-start items-start gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="17">
                              {/* layer-17 = separator dots */}
                              <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-neutral-800 rounded-full" />
                              <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-neutral-800 rounded-full" />
                            </div>
                          </div>
                          
                          <div className="layer-18 justify-start text-white text-[9px] sm:text-[10px] lg:text-xs font-medium font-['Poppins']" data-layer="18">
                            {/* layer-18 = days label */}
                            DAYS
                          </div>
                        </div>
                        
                        {/* Hours */}
                        <div className="layer-19 inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 lg:gap-1.5" data-layer="19">
                          {/* layer-19 = hours timer unit */}
                          
                          <div className="layer-20 w-10 sm:w-12 lg:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="20">
                            {/* layer-20 = hours display container */}
                            
                            <div className="layer-21 w-9 h-7 sm:w-10 sm:h-8 lg:w-12 lg:h-10 p-1 sm:p-1.5 lg:p-2.5 bg-white rounded flex justify-center items-center" data-layer="21">
                              {/* layer-21 = hours value box */}
                              <div className="text-center justify-start text-blue-700 text-xs sm:text-sm lg:text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(currentTimeLeft.hours)}
                              </div>
                            </div>
                            
                            <div className="layer-22 inline-flex flex-col justify-start items-start gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="22">
                              {/* layer-22 = separator dots */}
                              <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-neutral-800 rounded-full" />
                              <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-neutral-800 rounded-full" />
                            </div>
                          </div>
                          
                          <div className="layer-23 justify-start text-white text-[9px] sm:text-[10px] lg:text-xs font-medium font-['Poppins']" data-layer="23">
                            {/* layer-23 = hours label */}
                            HOURS
                          </div>
                        </div>
                        
                        {/* Minutes */}
                        <div className="layer-24 inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 lg:gap-1.5" data-layer="24">
                          {/* layer-24 = minutes timer unit */}
                          
                          <div className="layer-25 w-10 sm:w-12 lg:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="25">
                            {/* layer-25 = minutes display container */}
                            
                            <div className="layer-26 w-9 h-7 sm:w-10 sm:h-8 lg:w-12 lg:h-10 p-1 sm:p-1.5 lg:p-2.5 bg-white rounded flex justify-center items-center" data-layer="26">
                              {/* layer-26 = minutes value box */}
                              <div className="text-center justify-start text-blue-700 text-xs sm:text-sm lg:text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(currentTimeLeft.minutes)}
                              </div>
                            </div>
                            
                            <div className="layer-27 inline-flex flex-col justify-start items-start gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="27">
                              {/* layer-27 = separator dots */}
                              <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-neutral-800 rounded-full" />
                              <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-neutral-800 rounded-full" />
                            </div>
                          </div>
                          
                          <div className="layer-28 justify-start text-white text-[9px] sm:text-[10px] lg:text-xs font-medium font-['Poppins']" data-layer="28">
                            {/* layer-28 = minutes label */}
                            MINS
                          </div>
                        </div>
                        
                        {/* Seconds */}
                        <div className="layer-29 inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 lg:gap-1.5" data-layer="29">
                          {/* layer-29 = seconds timer unit */}
                          
                          <div className="layer-30 w-10 sm:w-12 lg:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 lg:gap-1.5" data-layer="30">
                            {/* layer-30 = seconds display container */}
                            
                            <div className="layer-31 w-9 h-7 sm:w-10 sm:h-8 lg:w-12 lg:h-10 p-1 sm:p-1.5 lg:p-2.5 bg-white rounded flex justify-center items-center" data-layer="31">
                              {/* layer-31 = seconds value box */}
                              <div className="text-center justify-start text-blue-700 text-xs sm:text-sm lg:text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(currentTimeLeft.seconds)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="layer-32 justify-start text-white text-[9px] sm:text-[10px] lg:text-xs font-medium font-['Poppins']" data-layer="32">
                            {/* layer-32 = seconds label */}
                            SECS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="layer-33 h-8 sm:h-9 lg:h-11 px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-xl inline-flex justify-center items-center cursor-pointer transition-colors duration-300" role="button" aria-label={`Buy now for ${currentBanner.title}`} data-layer="33">
                    {/* layer-33 = buy now button */}
                    <div className="layer-34 justify-start text-white text-xs sm:text-sm lg:text-base font-semibold font-['Poppins'] leading-none" data-layer="34">
                      {/* layer-34 = button text */}
                      Buy Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pagination Dots - Like PromoBanners */}
            <div className="layer-20 h-2 inline-flex justify-start items-center gap-2" role="tablist" aria-label="Discount promo navigation" data-layer="20">
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
                  aria-controls={`discount-promo-slide-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


