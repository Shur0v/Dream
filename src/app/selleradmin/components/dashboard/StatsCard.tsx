'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  iconBg?: string;
  icon?: React.ReactNode;
  iconImage?: string;
  className?: string;
}

/**
 * Stats Card Component (Layer 3)
 * 
 * @description Displays a single statistics card with icon and value
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconBg = 'bg-fuchsia-100',
  icon,
  iconImage,
  className,
}) => {
  return (
    <div className={cn('flex-1 h-48 px-3.5 py-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex flex-col justify-start items-start gap-2.5', className)}>
      <div className="self-stretch inline-flex justify-start items-center gap-4">
        <div className={cn('w-32 h-40 rounded-lg flex items-center justify-center', iconBg)}>
          {iconImage ? (
            <Image
              src={iconImage}
              alt={title}
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
          ) : (
            icon
          )}
        </div>
        <div className="inline-flex flex-col justify-start items-start gap-3">
          <div className="justify-start text-neutral-950 text-2xl font-medium font-['Poppins'] leading-7">
            {title}
          </div>
          <div className="self-stretch justify-start text-black text-xl font-semibold font-['Poppins'] leading-7">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

