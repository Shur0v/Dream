'use client';

import React, { useEffect, useState } from 'react';
import LoginModal from '@/components/modals/LoginModal';
import RegisterModal from '@/components/modals/RegisterModal';

type UserType = 'client' | 'seller' | 'reseller';

export default function GlobalAuthModals() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<UserType>('client');

  useEffect(() => {
    const handleOpenLoginModalEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ userType?: UserType }>;
      const userType = customEvent.detail?.userType || 'client';
      setCurrentUserType(userType);
      setIsRegisterModalOpen(false);
      setIsLoginModalOpen(true);
    };

    const handleOpenRegisterModalEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ userType?: UserType }>;
      const userType = customEvent.detail?.userType || 'client';
      setCurrentUserType(userType);
      setIsLoginModalOpen(false);
      setIsRegisterModalOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModalEvent as EventListener);
    window.addEventListener('openRegisterModal', handleOpenRegisterModalEvent as EventListener);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModalEvent as EventListener);
      window.removeEventListener('openRegisterModal', handleOpenRegisterModalEvent as EventListener);
    };
  }, []);

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userType={currentUserType}
        onLoginSuccess={() => {}}
        onSwitchUserType={setCurrentUserType}
        onOpenRegisterModal={(userType) => {
          setCurrentUserType(userType);
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        userType={currentUserType}
        onRegisterSuccess={() => {}}
        onSwitchUserType={setCurrentUserType}
        onOpenLoginModal={(userType) => {
          setCurrentUserType(userType);
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}
