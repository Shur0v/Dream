/**
 * @fileoverview Reseller Registration page (client auth design applied)
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResellerRegisterPage() {
  const [formData, setFormData] = useState({
    resellerIdOrNumber: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    acceptAgreement: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reseller registration:', formData);
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
              Create your account
            </div>
            <div className="layer-7 self-stretch text-center justify-start text-neutral-800 text-base font-medium font-['Lato'] leading-tight" data-layer="7">
              Join our platform to start reselling
            </div>
          </div>

          {/* Form */}
          <div className="layer-4 w-[792px] flex flex-col justify-start items-center gap-10" data-layer="4">
            <div className="layer-8 self-stretch flex flex-col justify-start items-start gap-10" data-layer="8">
              <div className="layer-9 self-stretch flex flex-col justify-start items-start gap-6" data-layer="9">
                {/* ID / Number */}
                <div className="layer-10 self-stretch flex flex-col justify-start items-start gap-2" data-layer="10">
                  <div className="layer-11 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="11">
                    Number or Reseller ID
                  </div>
                  <input
                    type="text"
                    name="resellerIdOrNumber"
                    value={formData.resellerIdOrNumber}
                    onChange={handleChange}
                    placeholder="Name"
                    className="layer-12 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                    data-layer="12"
                  />
                </div>

                {/* Contact Number */}
                <div className="layer-13 self-stretch flex flex-col justify-start items-start gap-2" data-layer="13">
                  <div className="layer-14 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="14">
                    Contact number
                  </div>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    className="layer-15 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                    data-layer="15"
                  />
                </div>

                {/* Password */}
                <div className="layer-16 self-stretch flex flex-col justify-start items-start gap-2" data-layer="16">
                  <div className="layer-17 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="17">
                    Password
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="layer-18 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                    data-layer="18"
                  />
                </div>

                {/* Confirm Password */}
                <div className="layer-19 self-stretch inline-flex justify-start items-start gap-4" data-layer="19">
                  <div className="layer-20 flex-1 inline-flex flex-col justify-start items-start gap-2" data-layer="20">
                    <div className="layer-21 justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="21">
                      Confirm Password
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter your confirm password"
                      className="layer-22 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                      required
                      data-layer="22"
                    />
                  </div>
                </div>

                {/* Agreement */}
                <div className="layer-23 flex flex-col justify-start items-start gap-2.5" data-layer="23">
                  <div className="layer-24 self-stretch inline-flex justify-start items-center gap-2.5" data-layer="24">
                    <input
                      type="checkbox"
                      name="acceptAgreement"
                      checked={formData.acceptAgreement}
                      onChange={handleChange}
                      className="layer-25 w-4 h-4 rounded-full border border-blue-600"
                      required
                      data-layer="25"
                    />
                    <div className="layer-26 justify-start text-neutral-600 text-sm font-normal font-['Poppins'] leading-tight" data-layer="26">
                      I accept the Membership Agreement.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up */}
          <button type="submit" onClick={handleSubmit} className="layer-27 w-[792px] h-14 px-5 py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5" data-layer="27">
            <div className="layer-28 justify-start text-white text-base font-semibold font-['Poppins'] leading-7" data-layer="28">Sign up</div>
          </button>

          {/* Login Link */}
          <div className="layer-29 text-center" data-layer="29">
            <p className="layer-30 text-sm text-gray-600" data-layer="30">
              Already have an account?{' '}
              <Link href="/reseller/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in here</Link>
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

