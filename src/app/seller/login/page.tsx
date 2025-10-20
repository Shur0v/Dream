/**
 * @fileoverview Seller Login page (aligned with client login design)
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SellerLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Seller login:', formData);
    window.location.href = '/seller/dashboard';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <section className="father w-full py-10 relative overflow-hidden bg-[#F7F7F7] flex items-center justify-center" role="main" data-layer="father">
      <div className="daughter" data-layer="daughter">
        <div className="layer-1 w-[1086px] h-[1122px] p-[100px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-12" data-layer="1">
          {/* Logo */}
          <div className="layer-2 w-[657.83px] h-60 flex flex-col justify-start items-center" data-layer="2">
            <Image 
              className="layer-3 self-stretch h-60" 
              src="/common/logo.svg" 
              alt="DreamShop Logo"
              width={658}
              height={239}
              priority
              data-layer="3"
            />
          </div>

          {/* Header */}
          <div className="layer-5 flex flex-col justify-start items-start gap-4" data-layer="5">
            <div className="layer-6 self-stretch text-center justify-start text-neutral-800 text-6xl font-bold font-['Lato'] leading-[67.20px]" data-layer="6">
              Welcome Back
            </div>
            <div className="layer-7 self-stretch text-center justify-start text-neutral-800 text-base font-medium font-['Lato'] leading-tight" data-layer="7">
              Sign in to your account to continue
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="layer-8 self-stretch flex flex-col justify-start items-start gap-10" data-layer="8">
            <div className="layer-9 self-stretch flex flex-col justify-start items-start gap-6" data-layer="9">
              {/* Email */}
              <div className="layer-10 self-stretch flex flex-col justify-start items-start gap-2" data-layer="10">
                <div className="layer-11 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="11">
                  Email Address
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="layer-12 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                  required
                  data-layer="12"
                />
              </div>

              {/* Password */}
              <div className="layer-13 self-stretch flex flex-col justify-start items-start gap-2" data-layer="13">
                <div className="layer-14 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="14">
                  Password
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="layer-15 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                  required
                  data-layer="15"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="layer-16 flex flex-col justify-start items-start gap-2.5" data-layer="16">
                <div className="layer-17 self-stretch inline-flex justify-between items-center gap-2.5" data-layer="17">
                  <div className="layer-18 inline-flex justify-start items-center gap-2.5" data-layer="18">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="layer-19 w-4 h-4 rounded-full border border-blue-600"
                      data-layer="19"
                    />
                    <div className="layer-20 justify-start text-neutral-600 text-sm font-normal font-['Poppins'] leading-tight" data-layer="20">
                      Remember me
                    </div>
                  </div>
                  <Link href="/seller/forgot-password" className="layer-21 justify-start text-blue-600 text-sm font-normal font-['Poppins'] leading-tight hover:text-blue-700" data-layer="21">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="layer-22 w-[792px] h-14 px-5 py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5" data-layer="22">
              <div className="layer-23 justify-start text-white text-base font-semibold font-['Poppins'] leading-7" data-layer="23">
                Sign In
              </div>
            </button>
          </form>

          {/* Registration Link */}
          <div className="layer-24 text-center" data-layer="24">
            <p className="layer-25 text-sm text-gray-600" data-layer="25">
              Don't have a seller account?{' '}
              <Link href="/seller/register" className="font-semibold text-blue-600 hover:text-blue-700">Register here</Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="layer-31 text-center" data-layer="31">
            <Link href="/" className="layer-32 text-sm text-gray-500 hover:text-gray-700" data-layer="32">← Back to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

