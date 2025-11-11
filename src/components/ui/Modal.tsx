'use client';

import React, { useEffect } from 'react';

/**
 * Props interface for Modal component
 */
interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when modal should be closed
   */
  onClose: () => void;
  
  /**
   * Modal content
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes for the modal
   */
  className?: string;
  
  /**
   * Whether to close modal when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
}

/**
 * Reusable Modal component
 * 
 * @description Renders a modal with:
 * - 60vw width and 75vh height as requested
 * - Background overlay with reduced opacity
 * - Close on outside click functionality
 * - Escape key to close
 * - Smooth animations
 * 
 * @param props - Modal props
 * @returns JSX modal element
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  closeOnOutsideClick = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Background overlay with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300" />
      
      {/* Modal content */}
      <div
        className={`
          relative w-full max-w-4xl h-full max-h-[70vh] md:max-h-[90vh]
          bg-white rounded-3xl shadow-2xl
          overflow-hidden transform transition-all duration-300
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        {/* Modal content */}
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
