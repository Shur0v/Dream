'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  Link as LinkIcon, 
  ArrowDownToLine, 
  ArrowRightLeft, 
  BarChart3, 
  Settings, 
  Headset, 
  LogOut,
  Gift
} from 'lucide-react';

/**
 * Layout for reseller pages
 * Wraps reseller pages with reseller-specific layout and navigation
 */
export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide sidebar for auth pages
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || pathname === '/reseller';
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        {children}
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/reseller/dashboard' },
    { icon: ShoppingBag, label: 'My Orders', href: '/reseller/orders' },
    { icon: Wallet, label: 'Earnings', href: '/reseller/earnings' },
    { icon: LinkIcon, label: 'Referral Link', href: '/reseller/referrals' },
    { icon: ArrowDownToLine, label: 'Withdraw', href: '/reseller/withdraw' },
    { icon: ArrowRightLeft, label: 'Transactions', href: '/reseller/transactions' },
    { icon: BarChart3, label: 'Reports', href: '/reseller/reports' },
    { icon: Settings, label: 'Settings', href: '/reseller/settings' },
    { icon: Headset, label: 'Support', href: '/reseller/support' },
    { icon: LogOut, label: 'Logout', href: '/reseller/logout' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans flex">
      {/* Sidebar Navigation */}
      <div className="w-[280px] bg-[#302293] min-h-screen flex-col text-white fixed left-0 top-0 h-full overflow-y-auto hidden md:flex rounded-r-[32px] shadow-xl z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl">
             <ShoppingBag className="w-6 h-6 text-[#302293]" />
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight">DreamShop</h2>
            <p className="text-[11px] text-white/70 font-medium">Reseller Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={index}
                href={item.href} 
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Increase your sales banner */}
        <div className="m-6 p-5 bg-gradient-to-br from-[#8C52FF] to-[#6E36E5] rounded-2xl text-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="flex justify-center mb-3 relative z-10">
            <Gift className="w-10 h-10 text-white opacity-90" />
          </div>
          <h4 className="text-white font-bold text-lg mb-1 relative z-10">Increase Your Sales</h4>
          <p className="text-white/80 text-xs mb-4 relative z-10">Share your referral link and earn more</p>
          <button className="w-full bg-white text-[#302293] py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors relative z-10 shadow-md">
            View Referral Link
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-[280px] min-h-screen">
        {children}
      </div>
    </div>
  );
}
