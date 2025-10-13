'use client';

import React from 'react';

/**
 * Discount Promo Component
 * Displays promotional offers and discounts with countdown timer
 */
export default function DiscountPromo() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="w-full max-w-[1320px] mx-auto">
        <div className="w-[1320px] flex justify-start items-center gap-6">
          {/* Left Card */}
          <div className="w-[648px] px-9 py-10 bg-black/30 rounded-xl inline-flex flex-col justify-center items-center gap-2.5 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/promobanner/img1.png" 
                alt="Powerbank" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Content Overlay */}
            <div className="relative z-10 self-stretch flex flex-col justify-center items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="w-96 justify-start text-white text-3xl font-semibold font-['Poppins'] leading-10">
                  Apple Powerbank Aluminum Case
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-red-500 text-base font-semibold font-['Poppins'] leading-7">
                    Starting bid:
                  </div>
                  <div className="self-stretch justify-start text-white text-3xl font-semibold font-['Poppins']">
                    $849.00
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
                              118
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
                              08
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
                              19
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
                              54
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
              <div className="h-11 px-8 py-3 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5">
                <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-none">
                  Buy Now
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="flex-1 self-stretch relative overflow-hidden">
            <div className="w-[648px] h-96 left-0 top-0 absolute bg-black/30 rounded-xl" />
            {/* Background Image */}
            <div className="w-[648px] h-96 left-0 top-0 absolute">
              <img 
                src="/promobanner/img2.png" 
                alt="Smartphone" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Content Overlay */}
            <div className="w-[572px] left-[38.41px] top-[40.50px] absolute inline-flex flex-col justify-center items-start gap-6 z-10">
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="w-96 justify-start text-white text-3xl font-semibold font-['Poppins'] leading-10">
                  Apple Powerbank Aluminum Case
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-red-500 text-base font-semibold font-['Poppins'] leading-7">
                    Starting bid:
                  </div>
                  <div className="self-stretch justify-start text-white text-3xl font-semibold font-['Poppins']">
                    $849.00
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="flex flex-col justify-start items-center gap-2">
                    <div className="inline-flex justify-start items-start gap-2">
                      {/* Days */}
                      <div className="inline-flex flex-col justify-start items-center gap-1.5">
                        <div className="w-14 inline-flex justify-start items-center gap-1.5">
                          <div className="w-12 h-10 p-2.5 bg-white rounded flex justify-center items-center gap-2.5">
                            <div className="text-center justify-start text-blue-700 text-base font-medium font-['Poppins']">
                              118
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
                            <div className="text-center justify-start text-blue-700 text-base font-medium font-['Poppins']">
                              08
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
                            <div className="text-center justify-start text-blue-700 text-base font-medium font-['Poppins']">
                              19
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
                            <div className="text-center justify-start text-blue-700 text-base font-medium font-['Poppins']">
                              54
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
              <div className="h-11 px-8 py-3 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5">
                <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-none">
                  Buy Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}