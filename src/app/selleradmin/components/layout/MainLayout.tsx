import React, { useState } from 'react';

import Footer from './Footer';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';

interface MainLayoutProps {
  children: React.ReactNode;
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
  onNewsletterSubscribe?: (email: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  cartCount = 0,
  wishlistCount = 0,
  onSearch,
  onCartClick,
  onWishlistClick,
  onUserAction,
  onNewsletterSubscribe,
  showHeader = true,
  showFooter = true,
  className,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<'client' | 'seller' | 'reseller'>('client');

  const handleOpenLoginModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    setCurrentUserType(userType);
    setIsLoginModalOpen(true);
  };
  const handleOpenRegisterModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    setCurrentUserType(userType);
    setIsRegisterModalOpen(true);
  };
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
  const handleSwitchUserType = (userType: 'client' | 'seller' | 'reseller') => setCurrentUserType(userType);
  const handleOpenRegisterFromLogin = (userType: 'client' | 'seller' | 'reseller') => { setIsLoginModalOpen(false); setCurrentUserType(userType); setIsRegisterModalOpen(true); };
  const handleOpenLoginFromRegister = (userType: 'client' | 'seller' | 'reseller') => { setIsRegisterModalOpen(false); setCurrentUserType(userType); setIsLoginModalOpen(true); };
  const handleLoginSuccess = () => { console.log('Login successful'); };
  const handleRegisterSuccess = () => { console.log('Registration successful'); };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <main className={`flex-1 ${className || ''}`}>{children}</main>
      {showFooter && (
        <Footer onOpenRegisterModal={handleOpenRegisterModal} />
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} userType={currentUserType} onLoginSuccess={handleLoginSuccess} onSwitchUserType={handleSwitchUserType} onOpenRegisterModal={handleOpenRegisterFromLogin} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal} userType={currentUserType} onRegisterSuccess={handleRegisterSuccess} onSwitchUserType={handleSwitchUserType} onOpenLoginModal={handleOpenLoginFromRegister} />
    </div>
  );
};

export default MainLayout;


