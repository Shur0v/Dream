'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminLogin, isAdminAuthenticated } from '@/lib/adminAuth';

export default function SellerAdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.push('/selleradmin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate credentials
    if (adminLogin(formData.id, formData.password)) {
      // Success - redirect to dashboard
      router.push('/selleradmin');
    } else {
      // Failed - show error
      setError('Invalid ID or password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <section className="w-full py-10 relative overflow-hidden bg-[#F7F7F7] flex items-center justify-center">
      <div>
        <div className="w-[1086px] h-[1122px] p-[100px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-12">
          <div className="w-[657.83px] h-60 flex flex-col justify-start items-center">
            <Image 
              className="self-stretch h-60" 
              src="/common/logo.svg" 
              alt="DreamShop Logo"
              width={658}
              height={239}
              priority
            />
          </div>

          <div className="flex flex-col justify-start items-start gap-4">
            <div className="self-stretch text-center justify-start text-neutral-800 text-6xl font-bold leading-[67.20px]">
              Seller Admin Access
            </div>
            <div className="self-stretch text-center justify-start text-neutral-800 text-base font-medium leading-tight">
              Sign in to manage landing sections. Default ID: admin, password: admin
            </div>
          </div>

          <form onSubmit={handleSubmit} className="self-stretch flex flex-col justify-start items-start gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-neutral-600 text-base font-medium leading-none">
                  Admin ID
                </div>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="admin"
                  className="self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal leading-none"
                  required
                />
              </div>

              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch justify-start text-neutral-600 text-base font-medium leading-none">
                  Password
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="admin"
                  className="self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal leading-none"
                  required
                />
              </div>

              <div className="flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch inline-flex justify-between items-center gap-2.5">
                  <div className="inline-flex justify-start items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded-full border border-blue-600"
                    />
                    <div className="justify-start text-neutral-600 text-sm font-normal leading-tight">
                      Remember me
                    </div>
                  </div>
                  <Link href="/selleradmin/login" className="justify-start text-blue-600 text-sm font-normal leading-tight hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            {error && (
              <div className="self-stretch bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-[792px] h-14 px-5 py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5 hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="justify-start text-white text-base font-semibold leading-7">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </div>
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


