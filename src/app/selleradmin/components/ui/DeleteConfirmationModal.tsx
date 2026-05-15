'use client';

import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmButtonText?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  itemName,
  confirmButtonText = 'Delete',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_28px_80px_rgba(15,23,42,0.35),0_10px_30px_rgba(15,23,42,0.2)] transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {isLoading ? (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-center text-slate-950 text-xl md:text-2xl font-semibold font-['Poppins'] mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-zinc-600 text-base font-normal font-['Poppins'] mb-2">
            {message}
          </p>

          {/* Item Name (if provided) */}
          {itemName && (
            <p className="text-center text-slate-950 text-lg font-semibold font-['Poppins'] mb-6">
              "{itemName}"
            </p>
          )}

          {!itemName && <div className="mb-6" />}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 h-12 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium font-['Poppins'] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 h-12 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium font-['Poppins'] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

