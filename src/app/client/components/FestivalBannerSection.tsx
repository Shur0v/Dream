'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FestivalBanner } from '@/types';

const fetchFestivalBanners = async (): Promise<FestivalBanner[]> => {
  // Use cached fetch for instant loading
  const { fetchWithCache } = await import('@/lib/indexeddb/apiCache');
  const response = await fetchWithCache('/api/festival-banners', {}, 60 * 60 * 1000);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result?.error || 'Failed to load festival banners');
  }

  return Array.isArray(result.data) ? result.data : [];
};

export default function FestivalBannerSection() {
  const [banners, setBanners] = useState<FestivalBanner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Check cache first for instant loading
        const { getCachedResponse } = await import('@/lib/indexeddb/apiCache');
        const cachedData = await getCachedResponse('/api/festival-banners');
        
        if (cachedData && mounted) {
          // Show cached data instantly (no loading state)
          const data: FestivalBanner[] = Array.isArray(cachedData.data) ? cachedData.data : [];
          setBanners(data);
          setCurrentSlide(0);
          setError(null);
          setLoading(false);
        } else if (mounted) {
          setLoading(true);
        }

        // Fetch from network (update cache in background)
        const data = await fetchFestivalBanners();
        if (mounted) {
          setBanners(data);
          setCurrentSlide(0);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unable to load festival banners');
          setBanners([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (banners.length === 0) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = useMemo(() => {
    if (!banners.length) return null;
    const index = currentSlide % banners.length;
    return banners[index];
  }, [banners, currentSlide]);

  const shouldHide = !loading && !error && banners.length === 0;
  if (shouldHide) {
    return null;
  }

  const coupons = activeBanner?.coupons ?? [];

  return (
    <section className="w-full bg-white" aria-live="polite">
      <div className="px-2 md:px-0">
        <div className="w-full max-w-[1320px] mx-auto">
          {loading && !activeBanner ? (
            <div className="w-full h-[300px] sm:h-[380px] md:h-[450px] lg:h-[512px] rounded-3xl bg-neutral-100 animate-pulse" />
          ) : (
            <div className="w-full inline-flex flex-col justify-center items-center">
              <div className="relative w-full overflow-hidden self-stretch h-[300px] sm:h-[380px] md:h-[450px] lg:h-[512px] rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl my-6 md:my-8 lg:my-10 bg-black/5">
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${(currentSlide % (banners.length || 1)) * 100}%)` }}
                >
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className="absolute inset-0 w-full h-full"
                      style={{ left: `${index * 100}%` }}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={banner.image}
                        alt={banner.title}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {activeBanner && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white px-3 sm:px-4">
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 text-fuchsia-500">
                        {activeBanner.title}
                      </h1>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">
                        {activeBanner.subtitle}
                      </h2>
                      <div className="px-4 md:px-6 py-3 rounded-xl inline-block mb-8 bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                        <div className="text-base md:text-xl font-semibold text-white/90">
                          UP TO {activeBanner.discount}
                        </div>
                        <div className="text-xs md:text-sm text-white/80">{activeBanner.emi}</div>
                      </div>
                      {coupons.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm md:text-base font-semibold mb-4 text-white/90">
                            APP EXCLUSIVE COUPON
                          </h3>
                          <div className="flex flex-wrap justify-center gap-2">
                            {coupons.map((coupon, index) => (
                              <div
                                key={`${coupon.code}-${index}`}
                                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm text-white/90 bg-white/10 border border-white/20 backdrop-blur-md"
                              >
                                {coupon.code} • save upto {coupon.amount}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {banners.length > 1 && (
                <div className="h-2 inline-flex justify-start items-center gap-2" role="tablist" aria-label="Festival banner navigation">
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
                      aria-label={`Go to festival banner ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-4 text-sm text-red-600 text-center">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

