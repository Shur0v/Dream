'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

const DeliveryInfo: React.FC = () => {
  return (
    <div className="w-64 p-3 bg-sky-50 rounded-xl inline-flex flex-col justify-start items-start gap-8">
      <div className="self-stretch flex flex-col justify-start items-start">
        {/* Delivery Options */}
        <div className="self-stretch pb-4 border-b border-neutral-400 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch py-2.5 inline-flex justify-start items-center gap-2.5">
            <div className="justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
              Delivery option
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="inline-flex justify-start items-start gap-4">
              <div className="w-5 h-5 relative overflow-hidden">
                <MapPin className="w-3.5 h-5 left-[2.61px] top-0 absolute text-neutral-800" />
              </div>
              <div className="justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
                All Over Bangladesh
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-4">
              <div className="w-5 h-5 relative overflow-hidden">
                <MapPin className="w-3.5 h-5 left-[2.61px] top-0 absolute text-neutral-800" />
              </div>
              <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
                  Set Your Location
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="w-5 h-5 relative overflow-hidden">
                <MapPin className="w-3.5 h-5 left-[2.61px] top-0 absolute text-neutral-800" />
              </div>
              <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
                Cash on Delivery Available
              </div>
            </div>
          </div>
        </div>
        
        {/* Return & Warranty */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch py-2.5 inline-flex justify-start items-center gap-2.5">
            <div className="justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
              Return & warranty
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-start gap-4">
              <div className="w-5 h-5 relative overflow-hidden">
                <MapPin className="w-3.5 h-5 left-[2.61px] top-0 absolute text-neutral-800" />
              </div>
              <div className="flex-1 justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
                Change of Mind Not Applicable
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-4">
              <div className="w-5 h-5 relative overflow-hidden">
                <MapPin className="w-3.5 h-5 left-[2.61px] top-0 absolute text-neutral-800" />
              </div>
              <div className="w-48 inline-flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
                  7 Day Return
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="w-5 h-5 relative overflow-hidden">
                <MapPin className="w-3.5 h-5 left-[2.61px] top-0 absolute text-neutral-800" />
              </div>
              <div className="justify-start text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
                Warranty not available
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seller Ratings */}
      <div className="w-60 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-black text-sm font-medium font-['Poppins'] leading-normal">
            Positive Seller Ratings
          </div>
          <div className="self-stretch justify-start text-black text-xl font-medium font-['Poppins'] leading-tight">
            71 %
          </div>
        </div>
        <div className="self-stretch py-4 border-t border-b border-black flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch justify-start text-black text-sm font-medium font-['Poppins'] leading-normal">
            Ship On Time
          </div>
          <div className="self-stretch justify-start text-black text-xl font-medium font-['Poppins'] leading-tight">
            100%
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch justify-start text-black text-base font-medium font-['Poppins'] leading-normal">
            Chat Response Rate
          </div>
          <div className="self-stretch justify-start text-black text-sm font-normal font-['Poppins'] leading-none">
            Not enough data
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
