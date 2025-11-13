'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus, FolderPlus, TrendingUp, Star, LogOut, Palette, Image as ImageIcon, Megaphone, Tag, Sparkles, MessageSquare, Package } from 'lucide-react';
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
      label: 'All Products', 
      href: '/selleradmin/all-products',
      icon: <Package className="w-6 h-6" />
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
      label: 'Featured', 
      href: '/selleradmin/featured',
      icon: <Star className="w-6 h-6" />
    },
    { 
      label: 'Best selling', 
      href: '/selleradmin/best-selling',
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      label: 'Fake Review', 
      href: '/selleradmin/fake-review',
      icon: <MessageSquare className="w-6 h-6" />
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
  ];

  const isActive = (href: string) => {
    if (href === '/selleradmin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className={cn('w-80 h-screen bg-gradient-to-b from-blue-50 to-blue-100/80 backdrop-blur-sm flex justify-end items-start gap-2.5 overflow-hidden fixed left-0 top-0 border-r border-blue-200/50 shadow-xl', className)}>
      <div className="w-72 h-full flex flex-col py-6 px-3 overflow-hidden">
        {/* Logo Section - Top */}
        <Link href="/selleradmin" className="flex-shrink-0 mb-6 px-2 py-2 rounded-xl transition-all duration-200 group">
          <Image
            src="/common/logo.svg"
            alt="DreamShop logo"
            width={180}
            height={65}
            className="w-44 h-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Navigation Section - Middle (scrollable) */}
        <div className="flex-1 flex flex-col justify-start items-start gap-2 overflow-y-auto overflow-x-hidden min-h-0 w-full pr-2 sidebar-scrollbar">
          <div className="w-full flex flex-col gap-1.5 pb-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'w-full px-4 py-3.5 flex items-center gap-3.5 transition-all duration-200 flex-shrink-0 rounded-xl relative group',
                    active
                      ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30 scale-[1.02]'
                      : 'text-fuchsia-900 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'
                  )}
                >
                  {/* Active indicator line */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  
                  <div className={cn(
                    'flex-shrink-0 transition-transform duration-200',
                    active ? 'text-white' : 'text-fuchsia-700 group-hover:text-fuchsia-600',
                    !active && 'group-hover:scale-110'
                  )}>
                    {item.icon}
                  </div>
                  <div
                    className={cn(
                      'flex-1 text-sm font-semibold font-["Manrope"] leading-5 transition-colors duration-200',
                      active ? 'text-white' : 'text-fuchsia-900 group-hover:text-fuchsia-800'
                    )}
                  >
                    {item.label}
                  </div>
                  
                  {/* Hover arrow indicator */}
                  {!active && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout Section - Bottom (fixed) */}
        <div className="flex-shrink-0 w-full mt-4 pt-4 border-t border-blue-200/50">
          <div className="w-full px-4 py-3.5 flex items-center gap-3.5 cursor-pointer rounded-xl hover:bg-red-50/80 hover:shadow-md transition-all duration-200 group">
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200" />
            <div className="flex-1 text-sm font-semibold text-red-600 group-hover:text-red-700 font-['Manrope'] leading-5 transition-colors duration-200">
              Log Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
