'use client';

import React, { useEffect, useState } from 'react';
import { PromoBanner } from '@/types';
import { fetchWithCache, getCachedResponse, peekCachedResponse } from '@/lib/indexeddb/apiCache';

const getInitialCountdown = (banner?: PromoBanner) => ({
  days: banner?.initialTime?.days ?? 0,
  hours: banner?.initialTime?.hours ?? 0,
  minutes: banner?.initialTime?.minutes ?? 0,
  seconds: banner?.initialTime?.seconds ?? 0,
});

/**
 * PromoBanners Component
 * Displays promotional banner with countdown timer and product image
 */
export default function PromoBanners() {
  const cacheKey = '/api/promo-banners?variant=slider';
  const initialCached = peekCachedResponse(cacheKey);
  const initialBanners: PromoBanner[] = Array.isArray(initialCached?.data) ? initialCached.data : [];
  const [banners, setBanners] = useState<PromoBanner[]>(initialBanners);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLefts, setTimeLefts] = useState<Array<PromoBanner['initialTime']>>(initialBanners.map((banner) => getInitialCountdown(banner)));
  const [loading, setLoading] = useState(initialBanners.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadBanners = async () => {
      try {
        const cachedData = await getCachedResponse(cacheKey);
        
        if (cachedData && active) {
          // Show cached data instantly (no loading state)
          const data: PromoBanner[] = Array.isArray(cachedData.data) ? cachedData.data : [];
          setBanners(data);
          setTimeLefts(data.map((banner) => getInitialCountdown(banner)));
          setCurrentSlide(0);
          setError(null);
          setLoading(false);
        } else if (active && initialBanners.length === 0) {
          setLoading(true);
        }

        // Fetch from network (update cache in background)
        const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load promo banners');
        }
        
        const data: PromoBanner[] = Array.isArray(result.data) ? result.data : [];
        if (active) {
          setBanners(data);
          setTimeLefts(data.map((banner) => getInitialCountdown(banner)));
          setCurrentSlide(0);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load promo banners');
          setBanners([]);
          setTimeLefts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBanners();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!banners.length) {
      return;
    }
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [banners.length]);

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
    if (!banners.length || !timeLefts.length) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLefts(prev => {
        if (!prev.length) return prev;
        const next = [...prev];
        const fallback = getInitialCountdown(banners[currentSlide]);
        next[currentSlide] = decrementTime(prev[currentSlide] || fallback, fallback);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSlide, banners, timeLefts.length]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const activeBanner = banners[currentSlide];
  const activeCountdown = timeLefts[currentSlide] || getInitialCountdown(activeBanner);
  const shouldHideSection = !loading && !error && banners.length === 0;

  if (shouldHideSection) {
    return null;
  }

  return (
    <section className="father w-full bg-white" role="banner" data-layer="father">
      {/* father = full width promotional banner section */}
      
      <div className="daughter px-2 md:px-0" data-layer="daughter">
        {/* daughter = design holder for entire promo banner */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-full inline-flex flex-col justify-center items-center gap-2.5 sm:gap-5 md:gap-12" data-layer="2">
            {loading || !activeBanner ? (
              <div className="w-full max-w-[1320px] p-6 text-center text-zinc-500">
                {loading ? 'Loading promo banners...' : error || 'No promo banners available right now.'}
              </div>
            ) : (
              <>
                {/* layer-2 = main content wrapper */}
                <div className="layer-3 self-stretch min-h-[400px] sm:min-h-[450px] md:h-[529px] px-4 sm:px-5 md:pl-6 md:pr-0 py-6 sm:py-8 md:py-0 bg-fuchsia-50 rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl flex flex-col md:inline-flex md:flex-row md:justify-between items-center gap-4 sm:gap-6 md:gap-0" data-layer="3">
                  {/* layer-3 = main promotional card */}
                  
                  <div className="layer-4 w-full md:w-[550px] inline-flex flex-col justify-start items-start gap-4 sm:gap-5 md:gap-6" data-layer="4">
                    {/* layer-4 = left text content section */}
                    
                    <div className="layer-5 self-stretch flex flex-col justify-start items-start gap-4 sm:gap-5 md:gap-6" data-layer="5">
                      {/* layer-5 = text content wrapper */}
                      
                      <div className="layer-6 self-stretch flex flex-col justify-start items-start gap-2 sm:gap-3 md:gap-4" data-layer="6">
                        {/* layer-6 = headline and subtitle container */}
                        
                        <div className="layer-7 self-stretch justify-start text-xl sm:text-2xl md:text-4xl font-bold font-['Poppins'] leading-tight sm:leading-8 md:leading-[50.40px] bg-gradient-to-r from-violet-400 to-blue-600 bg-clip-text text-transparent" role="heading" aria-level={2} data-layer="7">
                          {/* layer-7 = main promotional headline */}
                          {activeBanner.title || 'Promotional Deal'}
                        </div>
                        <div className="layer-8 self-stretch justify-start text-zinc-600 text-sm sm:text-base md:text-base font-normal font-['PolySans_Trial'] leading-tight sm:leading-snug md:leading-none" data-layer="8">
                          {/* layer-8 = promotional subtitle */}
                          {activeBanner.subtitle || ''}
                        </div>
                      </div>
                      
                      {/* Countdown Timer */}
                      <div className="layer-9 w-full sm:w-80 md:w-72 h-auto sm:h-8 md:h-8 inline-flex justify-start items-center gap-3 sm:gap-4 md:gap-6" role="timer" aria-live="polite" data-layer="9">
                        {/* layer-9 = countdown timer container */}
                        
                        <div className="layer-10 inline-flex flex-col justify-center items-start gap-1.5 sm:gap-2 md:gap-2" data-layer="10">
                          {/* layer-10 = timer display wrapper */}
                          
                          <div className="layer-11 inline-flex justify-start items-center gap-1.5 sm:gap-2 md:gap-2" data-layer="11">
                            {/* layer-11 = timer elements container */}
                            
                            {/* Days */}
                            <div className="layer-12 text-center justify-start" data-layer="12">
                              {/* layer-12 = days display */}
                              <span className="text-black text-sm sm:text-base md:text-lg font-semibold font-['PolySans_Trial'] leading-tight sm:leading-normal md:leading-loose">
                                {formatTime(activeCountdown.days)}
                              </span>
                              <span className="text-neutral-600 text-[10px] sm:text-xs md:text-xs font-normal font-['PolySans_Trial']">
                                /Days
                              </span>
                            </div>
                            <div className="layer-13 inline-flex flex-col justify-start items-start gap-1" data-layer="13">
                              {/* layer-13 = separator dots */}
                              <div className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] md:w-[3px] md:h-[3px] bg-neutral-800 rounded-full" />
                              <div className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] md:w-[3px] md:h-[3px] bg-neutral-800 rounded-full" />
                            </div>
                            
                            {/* Hours */}
                            <div className="layer-14 text-center justify-start" data-layer="14">
                              {/* layer-14 = hours display */}
                              <span className="text-black text-sm sm:text-base md:text-lg font-semibold font-['PolySans_Trial'] leading-tight sm:leading-normal md:leading-loose">
                                {formatTime(activeCountdown.hours)}
                              </span>
                              <span className="text-neutral-600 text-[10px] sm:text-xs md:text-xs font-normal font-['PolySans_Trial']">
                                /Hours
                              </span>
                            </div>
                            <div className="layer-15 inline-flex flex-col justify-start items-start gap-1" data-layer="15">
                              {/* layer-15 = separator dots */}
                              <div className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] md:w-[3px] md:h-[3px] bg-neutral-800 rounded-full" />
                              <div className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] md:w-[3px] md:h-[3px] bg-neutral-800 rounded-full" />
                            </div>
                            
                            {/* Minutes */}
                            <div className="layer-16 text-center justify-start" data-layer="16">
                              {/* layer-16 = minutes display */}
                              <span className="text-black text-sm sm:text-base md:text-lg font-semibold font-['PolySans_Trial'] leading-tight sm:leading-normal md:leading-loose">
                                {formatTime(activeCountdown.minutes)}
                              </span>
                              <span className="text-neutral-600 text-[10px] sm:text-xs md:text-xs font-normal font-['PolySans_Trial']">
                                /Mins
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shop Now Button */}
                    <div className="layer-17 w-full sm:w-56 md:w-56 h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-8 py-2.5 sm:py-2.5 md:py-3 bg-fuchsia-500 hover:bg-fuchsia-600 inline-flex justify-center items-center gap-2.5 cursor-pointer transition-colors duration-300" role="button" aria-label="Shop now for promotional deals" data-layer="17">
                      {/* layer-17 = call-to-action button */}
                      <div className="layer-18 justify-start text-white text-sm sm:text-base md:text-base font-semibold font-['Poppins'] leading-none sm:leading-normal md:leading-10" data-layer="18">
                        {/* layer-18 = button text */}
                        SHOP NOW
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Product Image */}
                  <img
                    className="layer-19 w-full md:w-[655px] h-[300px] sm:h-[350px] md:h-[529px] rounded-xl md:rounded-tr-xl md:rounded-br-xl object-cover" 
                    src={activeBanner.image || '/placeholder-image.png'}
                    alt={`${activeBanner.title || 'Promo banner'} promotional product`}
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
