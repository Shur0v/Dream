'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '../ui/Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'client' | 'seller' | 'reseller';
  onLoginSuccess?: () => void;
  onSwitchUserType?: (userType: 'client' | 'seller' | 'reseller') => void;
  onOpenRegisterModal?: (userType: 'client' | 'seller' | 'reseller') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  userType,
  onLoginSuccess,
  onSwitchUserType,
  onOpenRegisterModal,
}) => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess?.();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const getUserTypeTitle = () => userType === 'client' ? 'Customer' : userType === 'seller' ? 'Seller' : 'Reseller';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full py-6 relative overflow-hidden bg-white flex items-center justify-center">
        <div className="w-full max-w-4xl h-full max-h-full p-4 sm:p-6 lg:p-8 xl:p-[100px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full max-w-[400px] h-20 sm:h-24 lg:h-28 flex flex-col justify-start items-center">
            <Image className="self-stretch h-20 sm:h-24 lg:h-28 object-contain" src="/common/logo.svg" alt="DreamShop Logo" width={400} height={120} priority />
          </div>
          <div className="w-full max-w-[792px] flex flex-col justify-start items-center gap-6 sm:gap-8 lg:gap-10">
            <div className="flex flex-col justify-start items-start gap-2 sm:gap-4">
              <div className="self-stretch text-center justify-start text-neutral-800 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-['Lato'] leading-tight">Welcome Back</div>
              <div className="self-stretch text-center justify-start text-neutral-800 text-sm sm:text-base font-medium font-['Lato'] leading-tight">Sign in to your {getUserTypeTitle().toLowerCase()} account to continue</div>
            </div>
            <form onSubmit={handleSubmit} className="self-stretch flex flex-col justify-start items-start gap-6 sm:gap-8 lg:gap-10">
              <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">Email Address</div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="self-stretch h-10 sm:h-11 px-4 sm:px-5 py-3 sm:py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none" required />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-neutral-600 text-sm sm:text-base font-medium font-['Poppins'] leading-none">Password</div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="self-stretch h-10 sm:h-11 px-4 sm:px-5 py-3 sm:py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none" required />
                </div>
                <div className="flex flex-col justify-start items-start gap-2 sm:gap-2.5">
                  <div className="self-stretch inline-flex justify-between items-center gap-2 sm:gap-2.5">
                    <div className="inline-flex justify-start items-center gap-2 sm:gap-2.5">
                      <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 rounded-full border border-blue-600" />
                      <div className="justify-start text-neutral-600 text-xs sm:text-sm font-normal font-['Poppins'] leading-tight">Remember me</div>
                    </div>
                    <button type="button" className="justify-start text-blue-600 text-xs sm:text-sm font-normal font-['Poppins'] leading-tight hover:text-blue-700">Forgot password?</button>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full max-w-[792px] h-12 sm:h-14 px-4 sm:px-5 py-3 sm:py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5">
                <div className="justify-start text-white text-sm sm:text-base font-semibold font-['Poppins'] leading-7">Sign In</div>
              </button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Don't have a {getUserTypeTitle().toLowerCase()} account?{' '}<button type="button" className="font-semibold text-blue-600 hover:text-blue-700" onClick={() => { onClose(); onOpenRegisterModal?.(userType); }}>Register here</button></p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">Are you a:</p>
            <div className="flex flex-col gap-1 sm:gap-2">
              {userType !== 'seller' && (<button type="button" className="text-xs sm:text-sm text-green-600 hover:text-green-700" onClick={() => onSwitchUserType?.('seller')}>Seller? Sign in here →</button>)}
              {userType !== 'reseller' && (<button type="button" className="text-xs sm:text-sm text-purple-600 hover:text-purple-700" onClick={() => onSwitchUserType?.('reseller')}>Reseller? Sign in here →</button>)}
              {userType !== 'client' && (<button type="button" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700" onClick={() => onSwitchUserType?.('client')}>Customer? Sign in here →</button>)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;


