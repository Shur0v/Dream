'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

/**
 * Props interface for LoginModal component
 */
interface LoginModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when modal should be closed
   */
  onClose: () => void;
  
  /**
   * User type for login (client, seller, reseller)
   */
  userType: 'client' | 'seller' | 'reseller';
  
  /**
   * Callback when login is successful
   */
  onLoginSuccess?: () => void;
  
  /**
   * Callback to switch to different user type login
   */
  onSwitchUserType?: (userType: 'client' | 'seller' | 'reseller') => void;
  
  /**
   * Callback to open registration modal
   */
  onOpenRegisterModal?: (userType: 'client' | 'seller' | 'reseller') => void;
}

/**
 * Login Modal component
 * 
 * @description Simple login form with username, mobile number, and email
 * Stores user data in localStorage
 * 
 * @param props - LoginModal props
 * @returns JSX login modal element
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  userType,
  onLoginSuccess,
  onSwitchUserType,
  onOpenRegisterModal,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user data in localStorage
    const userData = {
      username: formData.username,
      mobile: formData.mobile,
      email: formData.email,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Store in users list (for admin dashboard)
    const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userExists = existingUsers.find((u: any) => u.email === formData.email);
    
    if (!userExists) {
      existingUsers.push(userData);
      localStorage.setItem('allUsers', JSON.stringify(existingUsers));
    }
    
    // Call success callback and close modal
    onLoginSuccess?.();
    onClose();
    
    // Trigger storage event to update header (works across components)
    window.dispatchEvent(new Event('storage'));
    
    // Small delay then reload to ensure localStorage is updated
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Modal content - compact and centered */}
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <Image 
            className="h-12 object-contain" 
            src="/common/logo.svg" 
            alt="DreamShop Logo"
            width={150}
            height={48}
            priority
          />
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sign In</h2>
          <p className="text-xs text-gray-600">Enter your details to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              required
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full h-11 bg-fuchsia-500 text-white rounded-md font-semibold hover:bg-fuchsia-600 transition-colors cursor-pointer mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );

  /* ============================================
   * OLD DESIGN - COMMENTED OUT FOR LATER USE
   * ============================================
   * 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${userType} login:`, formData);
    
    // TODO: Implement actual login logic
    // On success, call onLoginSuccess and close modal
    onLoginSuccess?.();
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

  const getUserTypeColor = () => {
    switch (userType) {
      case 'client':
        return 'text-blue-600 hover:text-blue-700';
      case 'seller':
        return 'text-green-600 hover:text-green-700';
      case 'reseller':
        return 'text-purple-600 hover:text-purple-700';
      default:
        return 'text-blue-600 hover:text-blue-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full py-6 sm:py-8 lg:py-10 relative overflow-y-auto bg-white flex items-center justify-center">
        <div className="w-full max-w-4xl min-h-full p-4 sm:p-6 lg:p-8 xl:p-[100px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8">
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
          <div className="w-full max-w-[792px] flex flex-col justify-start items-center gap-6 sm:gap-8 lg:gap-10">
            <div className="flex flex-col justify-start items-start gap-2 sm:gap-4">
              <div className="self-stretch text-center justify-start text-neutral-800 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-['Lato'] leading-tight">
                Welcome Back
              </div>
              <div className="self-stretch text-center justify-start text-neutral-800 text-sm sm:text-base font-medium font-['Lato'] leading-tight">
                Sign in to your {getUserTypeTitle().toLowerCase()} account to continue
              </div>
            </div>
            <form onSubmit={handleSubmit} className="self-stretch flex flex-col justify-start items-start gap-6 sm:gap-8 lg:gap-10">
              <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">
                    Email Address
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="self-stretch h-10 sm:h-11 px-4 sm:px-5 py-3 sm:py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                  />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">
                    Password
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="self-stretch h-10 sm:h-11 px-4 sm:px-5 py-3 sm:py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2 sm:gap-2.5">
                  <div className="self-stretch inline-flex justify-between items-center gap-2 sm:gap-2.5">
                    <div className="inline-flex justify-start items-center gap-2 sm:gap-2.5">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 rounded-full border border-blue-600"
                      />
                      <div className="justify-start text-neutral-600 text-xs sm:text-sm font-normal font-['Poppins'] leading-tight">
                        Remember me
                      </div>
                    </div>
                    <button
                      type="button"
                      className="justify-start text-blue-600 text-xs sm:text-sm font-normal font-['Poppins'] leading-tight hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full max-w-[792px] h-12 sm:h-14 px-4 sm:px-5 py-3 sm:py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-start text-white text-sm sm:text-base font-semibold font-['Poppins'] leading-7">
                  Sign In
                </div>
              </button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have a {getUserTypeTitle().toLowerCase()} account?{' '}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => {
                  onClose();
                  onOpenRegisterModal?.(userType);
                }}
              >
                Register here
              </button>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
              Are you a:
            </p>
            <div className="flex flex-col gap-1 sm:gap-2">
              {userType !== 'seller' && (
                <button
                  type="button"
                  className="text-xs sm:text-sm text-green-600 hover:text-green-700"
                  onClick={() => onSwitchUserType?.('seller')}
                >
                  Seller? Sign in here →
                </button>
              )}
              {userType !== 'reseller' && (
                <button
                  type="button"
                  className="text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                  onClick={() => onSwitchUserType?.('reseller')}
                >
                  Reseller? Sign in here →
                </button>
              )}
              {userType !== 'client' && (
                <button
                  type="button"
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => onSwitchUserType?.('client')}
                >
                  Customer? Sign in here →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
  */
};

export default LoginModal;
