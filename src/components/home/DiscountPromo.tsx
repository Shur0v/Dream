'use client';

import React, { useState, useEffect } from 'react';

/**
 * Promotional Banners Component
 * Displays promotional banners with working countdown timers
 */
export default function PromoBanners() {
  const [timeLeft1, setTimeLeft1] = useState({
    days: 118,
    hours: 8,
    minutes: 18,
    seconds: 58
  });

  const [timeLeft2, setTimeLeft2] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 15
  });

  useEffect(() => {
    const timer1 = setInterval(() => {
      setTimeLeft1(prevTime => {
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
          days = 118;
          hours = 8;
          minutes = 18;
          seconds = 58;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    const timer2 = setInterval(() => {
      setTimeLeft2(prevTime => {
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
          days = 45;
          hours = 12;
          minutes = 30;
          seconds = 15;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const promoBanners = [
    {
      id: 1,
      title: "Apple Powerbank Aluminum Case",
      startingBid: "Starting bid:",
      price: "$849.00",
      backgroundImage: "/promobanner/img1.png",
      alt: "Powerbank",
      timeLeft: timeLeft1
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra Pro",
      startingBid: "Starting bid:",
      price: "$1,299.00",
      backgroundImage: "/promobanner/img2.png",
      alt: "Smartphone",
      timeLeft: timeLeft2
    }
  ];

  return (
    <section className="w-full py-8 bg-white">
      <div className="w-full max-w-[1320px] mx-auto">
        <div className="w-[1320px] inline-flex justify-start items-center gap-6">
          {promoBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${index === 0 ? 'w-[648px]' : 'flex-1'} ${index === 1 ? 'self-stretch' : ''} ${index === 0 ? 'px-9 py-10' : ''} bg-black/30 rounded-xl ${index === 0 ? 'inline-flex flex-col justify-center items-center gap-2.5' : ''} relative overflow-hidden`}
            >
              {/* Background Image */}
              <div className={`absolute inset-0 z-0 ${index === 1 ? 'rounded-xl overflow-hidden' : ''}`}>
                <img 
                  src={banner.backgroundImage} 
                  alt={banner.alt} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content Overlay */}
              <div className={`${index === 0 ? 'relative z-10 self-stretch flex flex-col justify-center items-start gap-6' : 'w-[572px] left-[38.41px] top-[40.50px] absolute inline-flex flex-col justify-center items-start gap-6 z-10'}`}>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="w-96 justify-start text-white text-3xl font-semibold font-['Poppins'] leading-10">
                    {banner.title}
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch justify-start text-red-500 text-base font-semibold font-['Poppins'] leading-7">
                      {banner.startingBid}
                    </div>
                    <div className="self-stretch justify-start text-white text-3xl font-semibold font-['Poppins']">
                      {banner.price}
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="flex flex-col justify-start items-center gap-2">
                      <div className="inline-flex justify-start items-start gap-2">
                        {/* Days */}
                        <div className="inline-flex flex-col justify-start items-center gap-1.5">
                          <div className="w-14 inline-flex justify-start items-center gap-1.5">
                            <div className="w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5">
                              <div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(banner.timeLeft.days)}
                              </div>
                            </div>
                            <div className="inline-flex flex-col justify-start items-start gap-1.5">
                              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                            </div>
                          </div>
                          <div className="justify-start text-white text-xs font-medium font-['Poppins']">
                            DAYS
                          </div>
                        </div>
                        {/* Hours */}
                        <div className="inline-flex flex-col justify-start items-center gap-1.5">
                          <div className="w-14 inline-flex justify-start items-center gap-1.5">
                            <div className="w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5">
                              <div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(banner.timeLeft.hours)}
                              </div>
                            </div>
                            <div className="inline-flex flex-col justify-start items-start gap-1.5">
                              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                            </div>
                          </div>
                          <div className="justify-start text-white text-xs font-medium font-['Poppins']">
                            HOURS
                          </div>
                        </div>
                        {/* Minutes */}
                        <div className="inline-flex flex-col justify-start items-center gap-1.5">
                          <div className="w-14 inline-flex justify-start items-center gap-1.5">
                            <div className="w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5">
                              <div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(banner.timeLeft.minutes)}
                              </div>
                            </div>
                            <div className="inline-flex flex-col justify-start items-start gap-1.5">
                              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                            </div>
                          </div>
                          <div className="justify-start text-white text-xs font-medium font-['Poppins']">
                            MINS
                          </div>
                        </div>
                        {/* Seconds */}
                        <div className="inline-flex flex-col justify-start items-center gap-1.5">
                          <div className="w-14 inline-flex justify-start items-center gap-1.5">
                            <div className="w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5">
                              <div className="text-center justify-start text-blue-700 text-lg font-semibold font-['PolySans_Trial']">
                                {formatTime(banner.timeLeft.seconds)}
                              </div>
                            </div>
                          </div>
                          <div className="justify-start text-white text-xs font-medium font-['Poppins']">
                            SECS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-11 px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-xl inline-flex justify-center items-center gap-1.5 cursor-pointer transition-colors duration-300">
                  <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-none">
                    Buy Now
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


