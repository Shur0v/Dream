'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  orderId?: string;
}

/**
 * Success Modal Component
 * Displays success message with order confirmation
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'Order Confirmed!',
  message,
  orderId,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [mounted, setMounted] = React.useState(false);

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
        pointerEvents: 'auto'
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
          zIndex: -1
        }}
      />

      {/* Modal - Centered in viewport */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_28px_80px_rgba(15,23,42,0.35),0_10px_30px_rgba(15,23,42,0.2)] transform transition-all duration-300"
        style={{
          position: 'relative',
          zIndex: 1
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
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center text-slate-950 text-xl md:text-2xl font-semibold font-['Poppins'] mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-zinc-600 text-base font-normal font-['Poppins'] mb-2">
            {message}
          </p>

          {/* Order ID (if provided) */}
          {orderId && (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-1">Order ID:</p>
              <p className="text-base font-semibold text-fuchsia-600 font-['Poppins']">
                {orderId}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 font-['Poppins'] mb-6">
            Your order will be processed and you will be contacted soon.
          </p>

          {/* OK Button */}
          <button
            onClick={onClose}
            className="w-full h-12 px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg font-semibold font-['Poppins'] transition-colors duration-200 cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  // Render to document.body to ensure it's at the root level
  return createPortal(modalContent, document.body);
};

export default SuccessModal;

