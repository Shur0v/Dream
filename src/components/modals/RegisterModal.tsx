'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

/**
 * Props interface for RegisterModal component
 */
interface RegisterModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when modal should be closed
   */
  onClose: () => void;
  
  /**
   * User type for registration (client, seller, reseller)
   */
  userType: 'client' | 'seller' | 'reseller';
  
  /**
   * Callback when registration is successful
   */
  onRegisterSuccess?: () => void;
  
  /**
   * Callback to switch to different user type registration
   */
  onSwitchUserType?: (userType: 'client' | 'seller' | 'reseller') => void;
  
  /**
   * Callback to open login modal
   */
  onOpenLoginModal?: (userType: 'client' | 'seller' | 'reseller') => void;
}

/**
 * Register Modal component
 * 
 * @description Renders a modal with registration form for different user types:
 * - Client registration
 * - Seller registration  
 * - Reseller registration
 * 
 * @param props - RegisterModal props
 * @returns JSX registration modal element
 */
export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  userType,
  onRegisterSuccess,
  onSwitchUserType,
  onOpenLoginModal,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    acceptAgreement: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${userType} registration:`, formData);
    
    // TODO: Implement actual registration logic
    // On success, call onRegisterSuccess and close modal
    onRegisterSuccess?.();
    onClose();
    
    // Redirect based on user type
    switch (userType) {
      case 'client':
        window.location.href = '/client/dashboard';
        break;
      case 'seller':
        window.location.href = '/seller/dashboard';
        break;
      case 'reseller':
        window.location.href = '/reseller/dashboard';
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'client':
        return 'Customer';
      case 'seller':
        return 'Seller';
      case 'reseller':
        return 'Reseller';
      default:
        return 'User';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full py-4 sm:py-6 lg:py-8 relative overflow-hidden bg-white flex items-center justify-center">
        <div className="w-full max-w-3xl h-full max-h-full p-4 sm:p-6 lg:p-8 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Logo Section */}
          <div className="w-full max-w-[400px] h-20 sm:h-24 lg:h-28 flex flex-col justify-start items-center">
            <Image 
              className="self-stretch h-20 sm:h-24 lg:h-28 object-contain" 
              src="/common/logo.svg" 
              alt="DreamShop Logo"
              width={400}
              height={120}
              priority
            />
          </div>

          {/* Form Section */}
          <div className="w-full max-w-[600px] flex flex-col justify-start items-center gap-4 sm:gap-6 lg:gap-8 px-4">
            {/* Header Section */}
            <div className="flex flex-col justify-start items-start gap-2 sm:gap-3">
              <div className="self-stretch text-center justify-start text-neutral-800 text-2xl sm:text-3xl lg:text-4xl font-bold font-['Lato'] leading-tight">
                Create your account
              </div>
              <div className="self-stretch text-center justify-start text-neutral-800 text-sm sm:text-base font-medium font-['Lato'] leading-tight">
                Join our platform as a {getUserTypeTitle().toLowerCase()} to start your journey
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-6 lg:gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-3 sm:gap-4">
                {/* Full Name Field */}
                <div className="self-stretch flex flex-col justify-start items-start gap-1 sm:gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">
                    Full Name
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="self-stretch h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                  />
                </div>

                {/* Contact Number Field */}
                <div className="self-stretch flex flex-col justify-start items-start gap-1 sm:gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">
                    Contact Number
                  </div>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    className="self-stretch h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                  />
                </div>

                {/* Set Password Field */}
                <div className="self-stretch flex flex-col justify-start items-start gap-1 sm:gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">
                    Set Password
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="self-stretch h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1 sm:gap-2">
                    <div className="justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">
                      Confirm Password
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter your confirm password"
                      className="self-stretch h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                      required
                    />
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex flex-col justify-start items-start gap-1 sm:gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-2 sm:gap-2.5">
                    <input
                      type="checkbox"
                      name="acceptAgreement"
                      checked={formData.acceptAgreement}
                      onChange={handleChange}
                      className="w-4 h-4 rounded-full border border-blue-600"
                      required
                    />
                    <div className="justify-start text-neutral-600 text-xs sm:text-sm font-normal font-['Poppins'] leading-tight">
                      I accept the Membership Agreement.
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full max-w-[600px] h-10 sm:h-12 lg:h-14 px-4 sm:px-5 py-2 sm:py-3 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-start text-white text-sm sm:text-base font-semibold font-['Poppins'] leading-7">
                  Sign up
                </div>
              </button>
            </form>
          </div>

          {/* Login Link */}
          <div className="text-center px-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have a {getUserTypeTitle().toLowerCase()} account?{' '}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => {
                  onClose();
                  onOpenLoginModal?.(userType);
                }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
