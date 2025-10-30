'use client';

import React from 'react';
import { useModal } from '@/contexts/ModalContext';

/**
 * Test component to verify global modal state
 * This component can be added to any page to test modal functionality
 */
export const ModalTestComponent: React.FC = () => {
  const {
    isLoginModalOpen,
    isRegisterModalOpen,
    currentUserType,
    openLoginModal,
    openRegisterModal,
    closeLoginModal,
    closeRegisterModal,
  } = useModal();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-semibold text-sm mb-2">Modal State Test</h3>
      
      <div className="text-xs space-y-1 mb-3">
        <div>Login Modal: {isLoginModalOpen ? 'Open' : 'Closed'}</div>
        <div>Register Modal: {isRegisterModalOpen ? 'Open' : 'Closed'}</div>
        <div>User Type: {currentUserType}</div>
      </div>
      
      <div className="flex flex-col gap-2">
        <button
          onClick={() => openLoginModal('client')}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Open Client Login
        </button>
        
        <button
          onClick={() => openLoginModal('seller')}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Open Seller Login
        </button>
        
        <button
          onClick={() => openRegisterModal('client')}
          className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
        >
          Open Client Register
        </button>
        
        {(isLoginModalOpen || isRegisterModalOpen) && (
          <button
            onClick={() => {
              if (isLoginModalOpen) closeLoginModal();
              if (isRegisterModalOpen) closeRegisterModal();
            }}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Close All Modals
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalTestComponent;






