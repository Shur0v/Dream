'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface WelcomeSectionProps {
  className?: string;
}

/**
 * Welcome Section Component (Layer 3)
 * 
 * @description Displays welcome message on dashboard
 */
export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ className }) => {
  return (
    <div className={cn('self-stretch p-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col justify-start items-start gap-3', className)}>
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-blue-600 text-3xl font-semibold font-['Poppins'] leading-10">
          Welcome to your dashboard
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;

