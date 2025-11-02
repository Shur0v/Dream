'use client';

import React from 'react';
import Image from 'next/image';
import { Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  className?: string;
}

/**
 * Dashboard Header Component (Layer 2)
 * 
 * @description Top header bar with search, notifications, and user profile
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  return (
    <div className={cn('w-full h-24 bg-blue-100 flex items-center justify-end px-6 gap-6', className)}>
      {/* Search Bar */}
      <div className="w-52 px-4 py-3 bg-white rounded-lg flex justify-start items-center gap-2">
        <Search className="w-4 h-4 text-neutral-950" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 justify-start text-neutral-950 text-base font-normal font-['Poppins'] leading-5 outline-none bg-transparent"
        />
      </div>

      {/* Notification Icon */}
      <div className="w-9 h-9 p-2.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-neutral-950 flex justify-start items-center gap-2.5 cursor-pointer hover:bg-white/50 transition-colors">
        <Bell className="w-4 h-4 text-neutral-950" />
      </div>

      {/* User Profile */}
      <div className="w-20 h-20 px-2 py-2 bg-white/30 rounded-[37px] flex justify-start items-center gap-2.5">
        <Image
          src="https://images.pexels.com/photos/3236651/pexels-photo-3236651.jpeg"
          alt="User profile"
          width={66}
          height={66}
          className="w-16 h-16 rounded-full border-2 border-blue-100 object-cover"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;

