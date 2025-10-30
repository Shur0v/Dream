import React from 'react';
import Link from 'next/link';

interface BottomNavProps {
  userRole?: string;
  className?: string;
  onOpenLoginModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
  onOpenRegisterModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  userRole = 'client',
  className = '',
  onOpenRegisterModal
}) => {
  const navigationLinks = [
    { text: "Home", active: true, href: "/selleradmin" },
    { text: "All Products", active: false, href: "/client/categories" },
    { text: "Become a Seller", active: false, href: "#", onClick: () => onOpenRegisterModal?.('seller') },
    { text: "Re seller", active: false, href: "#", onClick: () => onOpenRegisterModal?.('reseller') },
  ];

  return (
    <nav className={`father w-full bg-gradient-to-r from-[rgba(210,105,216,1)] to-[rgba(242,0,255,1)] py-3 ${className}`} role="navigation" aria-label="Main navigation" data-layer="father">
      <div className="daughter w-full max-w-[1320px] mx-auto flex items-center justify-center" data-layer="daughter">
        <div className="layer-1 inline-flex items-center gap-4 sm:gap-8 lg:gap-12" data-layer="1">
          {navigationLinks.map((link, index) => {
            if (link.onClick) {
              return (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="layer-2 inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity font-bold"
                  aria-label={`Open ${link.text} modal`}
                  data-layer="2"
                >
                  <div className={`layer-3 font-bold text-white text-sm text-center tracking-[-0.28px] leading-[25.2px] whitespace-nowrap ${link.active ? 'font-bold' : 'font-bold'}`} data-layer="3">
                    {link.text}
                  </div>
                </button>
              );
            }
            return (
              <Link key={index} href={link.href} className="layer-2 inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity font-bold" aria-label={`Navigate to ${link.text}`} data-layer="2">
                <div className={`layer-3 font-bold text-white text-sm text-center tracking-[-0.28px] leading-[25.2px] whitespace-nowrap ${link.active ? 'font-bold' : 'font-bold'}`} data-layer="3">
                  {link.text}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;


