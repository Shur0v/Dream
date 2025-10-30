'use client';

import React, { useState, useEffect } from 'react';

export default function PromoBanners() {
  const [timeLeft1, setTimeLeft1] = useState({ days: 118, hours: 8, minutes: 18, seconds: 58 });
  const [timeLeft2, setTimeLeft2] = useState({ days: 45, hours: 12, minutes: 30, seconds: 15 });

  useEffect(() => {
    const timer1 = setInterval(() => {
      setTimeLeft1(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        if (seconds > 0) seconds--; else if (minutes > 0) { minutes--; seconds = 59; } else if (hours > 0) { hours--; minutes = 59; seconds = 59; } else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; } else { days = 118; hours = 8; minutes = 18; seconds = 58; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    const timer2 = setInterval(() => {
      setTimeLeft2(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        if (seconds > 0) seconds--; else if (minutes > 0) { minutes--; seconds = 59; } else if (hours > 0) { hours--; minutes = 59; seconds = 59; } else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; } else { days = 45; hours = 12; minutes = 30; seconds = 15; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => { clearInterval(timer1); clearInterval(timer2); };
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const promoBanners = [
    { id: 1, title: 'Apple Powerbank Aluminum Case', startingBid: 'Starting bid:', price: '$849.00', backgroundImage: '/promobanner/img1.png', alt: 'Powerbank', timeLeft: timeLeft1 },
    { id: 2, title: 'Samsung Galaxy S24 Ultra Pro', startingBid: 'Starting bid:', price: '$1,299.00', backgroundImage: '/promobanner/img2.png', alt: 'Smartphone', timeLeft: timeLeft2 }
  ];

  return (
    <section className="father w-full py-8 bg-white" role="region" aria-labelledby="discount-promo-heading" data-layer="father">
      <div className="daughter" data-layer="daughter">
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          <div className="layer-2 w-[1320px] inline-flex justify-start items-center gap-6" data-layer="2">
            {promoBanners.map((banner, index) => (
              <div key={banner.id} className={`layer-3 ${index === 0 ? 'w-[648px]' : 'flex-1'} ${index === 1 ? 'self-stretch' : ''} ${index === 0 ? 'px-9 py-10' : ''} bg-black/30 rounded-xl ${index === 0 ? 'inline-flex flex-col justify-center items-center gap-2.5' : ''} relative overflow-hidden`} role="article" aria-labelledby={`promo-title-${banner.id}`} data-layer="3">
                <div className={`layer-4 absolute inset-0 z-0 ${index === 1 ? 'rounded-xl overflow-hidden' : ''}`} data-layer="4">
                  <img src={banner.backgroundImage} alt={`${banner.title} promotional product`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className={`layer-5 ${index === 0 ? 'relative z-10 self-stretch flex flex-col justify-center items-start gap-6' : 'w-[572px] left-[38.41px] top-[40.50px] absolute inline-flex flex-col justify-center items-start gap-6 z-10'}`} data-layer="5">
                  <div className="layer-6 self-stretch flex flex-col justify-start items-start gap-3" data-layer="6">
                    <div className="layer-7 w-96 justify-start text-white text-3xl font-semibold font-['Poppins'] leading-10" id={`promo-title-${banner.id}`} role="heading" aria-level={3} data-layer="7">{banner.title}</div>
                    <div className="layer-8 self-stretch flex flex-col justify-start items-start" data-layer="8">
                      <div className="layer-9 self-stretch justify-start text-red-500 text-base font-semibold font-['Poppins'] leading-7" data-layer="9">{banner.startingBid}</div>
                      <div className="layer-10 self-stretch justify-start text-white text-3xl font-semibold font-['Poppins']" data-layer="10">{banner.price}</div>
                    </div>
                    <div className="layer-11 self-stretch flex flex-col justify-start items-start gap-4" role="timer" aria-live="polite" data-layer="11">
                      <div className="layer-12 flex flex-col justify-start items-center gap-2" data-layer="12">
                        <div className="layer-13 inline-flex justify-start items-start gap-2" data-layer="13">
                          <div className="layer-14 inline-flex flex-col justify-start items-center gap-1.5" data-layer="14">
                            <div className="layer-15 w-14 inline-flex justify-start items-center gap-1.5" data-layer="15">
                              <div className="layer-16 w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5" data-layer="16"><div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">{formatTime(banner.timeLeft.days)}</div></div>
                              <div className="layer-17 inline-flex flex-col justify-start items-start gap-1.5" data-layer="17"><div className="w-1 h-1 bg-neutral-800 rounded-full" /><div className="w-1 h-1 bg-neutral-800 rounded-full" /></div>
                            </div>
                            <div className="layer-18 justify-start text-white text-xs font-medium font-['Poppins']" data-layer="18">DAYS</div>
                          </div>
                          <div className="layer-19 inline-flex flex-col justify-start items-center gap-1.5" data-layer="19">
                            <div className="layer-20 w-14 inline-flex justify-start items-center gap-1.5" data-layer="20">
                              <div className="layer-21 w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5" data-layer="21"><div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">{formatTime(banner.timeLeft.hours)}</div></div>
                              <div className="layer-22 inline-flex flex-col justify-start items-start gap-1.5" data-layer="22"><div className="w-1 h-1 bg-neutral-800 rounded-full" /><div className="w-1 h-1 bg-neutral-800 rounded-full" /></div>
                            </div>
                            <div className="layer-23 justify-start text-white text-xs font-medium font-['Poppins']" data-layer="23">HOURS</div>
                          </div>
                          <div className="layer-24 inline-flex flex-col justify-start items-center gap-1.5" data-layer="24">
                            <div className="layer-25 w-14 inline-flex justify-start items-center gap-1.5" data-layer="25">
                              <div className="layer-26 w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5" data-layer="26"><div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">{formatTime(banner.timeLeft.minutes)}</div></div>
                              <div className="layer-27 inline-flex flex-col justify-start items-start gap-1.5" data-layer="27"><div className="w-1 h-1 bg-neutral-800 rounded-full" /><div className="w-1 h-1 bg-neutral-800 rounded-full" /></div>
                            </div>
                            <div className="layer-28 justify-start text-white text-xs font-medium font-['Poppins']" data-layer="28">MINS</div>
                          </div>
                          <div className="layer-29 inline-flex flex-col justify-start items-center gap-1.5" data-layer="29">
                            <div className="layer-30 w-14 inline-flex justify-start items-center gap-1.5" data-layer="30">
                              <div className="layer-31 w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5" data-layer="31"><div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">{formatTime(banner.timeLeft.seconds)}</div></div>
                            </div>
                            <div className="layer-32 justify-start text-white text-xs font-medium font-['Poppins']" data-layer="32">SECS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="layer-33 h-11 px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-xl inline-flex justify-center items-center gap-1.5 cursor-pointer transition-colors duration-300" role="button" aria-label={`Buy now for ${banner.title}`} data-layer="33"><div className="layer-34 justify-start text-white text-base font-semibold font-['Poppins'] leading-none" data-layer="34">Buy Now</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



