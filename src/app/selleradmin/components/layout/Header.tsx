import React from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import BottomNav from './BottomNav';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface HeaderProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  } | null;
  cartCount?: number;
  wishlistCount?: number;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onUserAction?: (action: string) => void;
  onOpenLoginModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
  onOpenRegisterModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cartCount = 0,
  wishlistCount = 0,
  onSearch,
  onCartClick,
  onWishlistClick,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  const { shouldShowHeader } = useScrollDirection(50, 50);
  const shouldShowTopBar = shouldShowHeader;
  const shouldShowBottomNav = shouldShowHeader;

  return (
    <header className="father sticky top-0 z-50" role="banner" data-layer="father">
      <div className="daughter" data-layer="daughter">
        <div 
          className={`layer-1 transition-all duration-500 ease-in-out overflow-hidden ${
            shouldShowTopBar ? 'translate-y-0 opacity-100 max-h-screen' : '-translate-y-full opacity-0 max-h-0'
          }`} 
          data-layer="1"
        >
          <TopBar />
        </div>
        <div className="layer-2" data-layer="2">
          <MainHeader
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            onSearch={onSearch}
            onCartClick={onCartClick}
            onWishlistClick={onWishlistClick}
            onOpenLoginModal={onOpenLoginModal}
            onOpenRegisterModal={onOpenRegisterModal}
          />
        </div>
        <div 
          className={`layer-3 transition-all duration-500 ease-in-out ${
            shouldShowBottomNav ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`} 
          data-layer="3"
        >
          <BottomNav 
            userRole={user?.role} 
            onOpenLoginModal={onOpenLoginModal}
            onOpenRegisterModal={onOpenRegisterModal}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;


