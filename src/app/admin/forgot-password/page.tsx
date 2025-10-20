/**
 * @fileoverview Admin Forgot Password page (aligned with client auth design)
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin forgot password:', formData);
    setIsSubmitted(true);
    // TODO: Implement forgot password logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
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

            {/* Success Message */}
            <div className="layer-5 flex flex-col justify-start items-center gap-6" data-layer="5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold font-['Lato'] text-neutral-800 mb-4">
                  Check Your Email
                </h1>
                <p className="text-lg text-neutral-600 font-['Poppins'] mb-6">
                  We've sent password reset instructions to your email address.
                </p>
                <p className="text-sm text-gray-500 font-['Poppins']">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>

            {/* Back to Login */}
            <div className="layer-31 text-center" data-layer="31">
              <Link href="/admin/login" className="layer-32 text-sm text-blue-600 hover:text-blue-700" data-layer="32">← Back to Login</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
              Forgot Password?
            </div>
            <div className="layer-7 self-stretch text-center justify-start text-neutral-800 text-base font-medium font-['Lato'] leading-tight" data-layer="7">
              Enter your email address and we'll send you reset instructions
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
                  placeholder="admin@dreamshop.com"
                  className="layer-12 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                  required
                  data-layer="12"
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="layer-22 w-[792px] h-14 px-5 py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5" data-layer="22">
              <div className="layer-23 justify-start text-white text-base font-semibold font-['Poppins'] leading-7" data-layer="23">
                Send Reset Instructions
              </div>
            </button>
          </form>

          {/* Back to Login */}
          <div className="layer-31 text-center" data-layer="31">
            <Link href="/admin/login" className="layer-32 text-sm text-blue-600 hover:text-blue-700" data-layer="32">← Back to Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
