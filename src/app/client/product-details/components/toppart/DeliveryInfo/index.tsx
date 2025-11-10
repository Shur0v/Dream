'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface DeliveryInfoProps {
  className?: string;
}

const deliveryOptions = [
  'All Over Bangladesh',
  'Set Your Location',
  'Cash on Delivery Available',
];

const returnOptions = [
  'Change of Mind Not Applicable',
  '7 Day Return',
  'Warranty not available',
];

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ className }) => {
  return (
    <div
      className={`w-full bg-sky-50 rounded-xl flex flex-col gap-6 p-4 sm:p-5 ${className || ''}`}
    >
      <div className="flex flex-col gap-4 border-b border-neutral-400 pb-4">
        <h3 className="text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
          Delivery option
        </h3>
        <div className="flex flex-col gap-4">
          {deliveryOptions.map((option) => (
            <div key={option} className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-800 mt-0.5" />
              <span className="text-neutral-800 text-sm sm:text-base font-medium font-['Poppins'] leading-tight">
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-neutral-800 text-base font-medium font-['Poppins'] leading-tight">
          Return &amp; warranty
        </h3>
        <div className="flex flex-col gap-4">
          {returnOptions.map((option) => (
            <div key={option} className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-800 mt-0.5" />
              <span className="text-neutral-800 text-sm sm:text-base font-medium font-['Poppins'] leading-tight">
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-neutral-400 pt-4">
        <div className="flex flex-col gap-2.5">
          <p className="text-black text-sm font-medium font-['Poppins'] leading-normal">
            Positive Seller Ratings
          </p>
          <p className="text-black text-xl font-medium font-['Poppins'] leading-tight">71%</p>
        </div>
        <div className="flex flex-col gap-2.5 border-y border-black py-4">
          <p className="text-black text-sm font-medium font-['Poppins'] leading-normal">
            Ship On Time
          </p>
          <p className="text-black text-xl font-medium font-['Poppins'] leading-tight">100%</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-black text-base font-medium font-['Poppins'] leading-normal">
            Chat Response Rate
          </p>
          <p className="text-black text-sm font-normal font-['Poppins'] leading-none">
            Not enough data
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
