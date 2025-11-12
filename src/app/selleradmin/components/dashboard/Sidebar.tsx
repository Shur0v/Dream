'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus, FolderPlus, TrendingUp, Star, LogOut, Palette, Image as ImageIcon, Megaphone, Tag, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  className?: string;
}

/**
 * Dashboard Sidebar Component (Layer 2)
 * 
 * @description Provides navigation sidebar for seller admin dashboard
 * with active state management and logout functionality
 */
export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      href: '/selleradmin',
      icon: <LayoutDashboard className="w-6 h-6" />
    },
    { 
      label: 'Add Product', 
      href: '/selleradmin/add-product',
      icon: <Plus className="w-6 h-6" />
    },
    { 
      label: 'Add Category', 
      href: '/selleradmin/add-category',
      icon: <FolderPlus className="w-6 h-6" />
    },
    { 
      label: 'Add Color', 
      href: '/selleradmin/add-color',
      icon: <Palette className="w-6 h-6" />
    },
    { 
      label: 'Add Banner', 
      href: '/selleradmin/add-banner',
      icon: <ImageIcon className="w-6 h-6" />
    },
    { 
      label: 'Promo Banners', 
      href: '/selleradmin/promo-banners',
      icon: <Megaphone className="w-6 h-6" />
    },
    { 
      label: 'Discount Promo', 
      href: '/selleradmin/discount-promo',
      icon: <Tag className="w-6 h-6" />
    },
    { 
      label: 'Festival Offer', 
      href: '/selleradmin/festival-offer',
      icon: <Sparkles className="w-6 h-6" />
    },
    { 
      label: 'Fake Review', 
      href: '/selleradmin/fake-review',
      icon: <MessageSquare className="w-6 h-6" />
    },
    { 
      label: 'Best selling', 
      href: '/selleradmin/best-selling',
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      label: 'Featured', 
      href: '/selleradmin/featured',
      icon: <Star className="w-6 h-6" />
    },
  ];

  const isActive = (href: string) => {
    if (href === '/selleradmin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className={cn('w-80 h-screen bg-blue-100 flex justify-end items-start gap-2.5 overflow-hidden fixed left-0 top-0', className)}>
      <div className="w-72 h-full flex flex-col py-5 overflow-hidden">
        {/* Logo Section - Top */}
        <Link href="/selleradmin" className="flex-shrink-0 mb-11">
          <Image
            src="/common/logo.svg"
            alt="DreamShop logo"
            width={137}
            height={50}
            className="w-36 h-12 object-contain"
            priority
          />
        </Link>

        {/* Navigation Section - Middle (scrollable) */}
        <div className="flex-1 flex flex-col justify-start items-start gap-6 overflow-y-auto overflow-x-hidden min-h-0 w-full">
          <div className="w-full flex flex-col gap-6 pb-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'w-full p-2.5 flex justify-center items-center gap-2.5 transition-colors flex-shrink-0',
                    active
                      ? 'bg-fuchsia-500'
                      : 'bg-fuchsia-500/5 hover:bg-fuchsia-500/10'
                  )}
                >
                  <div className={cn('flex-shrink-0', active ? 'text-white' : 'text-fuchsia-900')}>
                    {item.icon}
                  </div>
                  <div
                    className={cn(
                      'flex-1 justify-start text-base font-semibold font-["Manrope"] leading-6',
                      active ? 'text-neutral-200' : 'text-fuchsia-900'
                    )}
                  >
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout Section - Bottom (fixed) */}
        <div className="flex-shrink-0 w-full p-2.5 flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <LogOut className="w-6 h-6 text-red-600" />
          <div className="flex-1 justify-start text-red-600 text-base font-normal font-['Manrope'] leading-6">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
