'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { X, LogIn } from 'lucide-react';
import Image from 'next/image';

interface SignInRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  message?: string;
}

export const SignInRequiredModal: React.FC<SignInRequiredModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  message = 'Please sign in to add items to your cart or wishlist.',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed z-[100] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: '1rem',
        pointerEvents: 'auto',
      }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <Image
              className="h-12 object-contain"
              src="/common/logo.svg"
              alt="Dreamshop Logo"
              width={200}
              height={48}
              priority
            />
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-fuchsia-600" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center text-slate-950 text-xl md:text-2xl font-semibold font-['Poppins'] mb-3">
            Sign In Required
          </h3>

          {/* Message */}
          <p className="text-center text-zinc-600 text-base font-normal font-['Poppins'] mb-6">
            {message}
          </p>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 font-['Poppins'] mb-6">
            Create a new account or sign in to continue.
          </p>

          {/* Sign In Button */}
          <button
            onClick={() => {
              onSignIn();
              onClose();
            }}
            className="w-full h-12 px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg font-semibold font-['Poppins'] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SignInRequiredModal;

