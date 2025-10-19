/**
 * @fileoverview Customer login page
 * Page for customers to sign in
 * 
 * @description This page includes:
 * - Customer login form with clean design
 * - Logo integration
 * - Minimal, clean implementation
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Customer Login page component
 * 
 * @description Renders the customer login page with:
 * - Clean design matching registration page
 * - Logo integration
 * - Form validation
 * 
 * @returns JSX customer login page element
 */
export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Customer login:', formData);
    // TODO: Implement customer login logic
    // On success, redirect to /client/dashboard
    window.location.href = '/client/dashboard';
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
      {/* father = full width login page section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire login page */}
        
        {/* Main Container - 1086px width with 100px padding */}
        <div className="layer-1 w-[1086px] h-[1122px] p-[100px] bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-12" data-layer="1">
          {/* layer-1 = main container with exact dimensions and padding */}
          
          {/* Logo Section */}
          <div className="layer-2 w-[657.83px] h-60 flex flex-col justify-start items-center" data-layer="2">
            {/* layer-2 = logo container */}
            <Image 
              className="layer-3 self-stretch h-60" 
              src="/common/logo.svg" 
              alt="DreamShop Logo"
              width={658}
              height={239}
              priority
              data-layer="3"
            />
            {/* layer-3 = logo image */}
          </div>

          {/* Form Section */}
          <div className="layer-4 w-[792px] flex flex-col justify-start items-center gap-10" data-layer="4">
            {/* layer-4 = form section container */}
            
            {/* Header Section */}
            <div className="layer-5 flex flex-col justify-start items-start gap-4" data-layer="5">
              {/* layer-5 = header section container */}
              
              <div className="layer-6 self-stretch text-center justify-start text-neutral-800 text-6xl font-bold font-['Lato'] leading-[67.20px]" data-layer="6">
                {/* layer-6 = main title */}
                Welcome Back
              </div>
              <div className="layer-7 self-stretch text-center justify-start text-neutral-800 text-base font-medium font-['Lato'] leading-tight" data-layer="7">
                {/* layer-7 = subtitle */}
                Sign in to your account to continue
              </div>
            </div>

            {/* Form Fields */}
            <div className="layer-8 self-stretch flex flex-col justify-start items-start gap-10" data-layer="8">
              {/* layer-8 = form fields container */}
              
              <div className="layer-9 self-stretch flex flex-col justify-start items-start gap-6" data-layer="9">
                {/* layer-9 = form fields wrapper */}
                
                {/* Email Field */}
                <div className="layer-10 self-stretch flex flex-col justify-start items-start gap-2" data-layer="10">
                  {/* layer-10 = email field container */}
                  
                  <div className="layer-11 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="11">
                    {/* layer-11 = field label */}
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
                  {/* layer-12 = input field */}
                </div>

                {/* Password Field */}
                <div className="layer-13 self-stretch flex flex-col justify-start items-start gap-2" data-layer="13">
                  {/* layer-13 = password field container */}
                  
                  <div className="layer-14 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="14">
                    {/* layer-14 = field label */}
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
                  {/* layer-15 = input field */}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="layer-16 flex flex-col justify-start items-start gap-2.5" data-layer="16">
                  {/* layer-16 = remember me and forgot password container */}
                  
                  <div className="layer-17 self-stretch inline-flex justify-between items-center gap-2.5" data-layer="17">
                    {/* layer-17 = checkbox and link wrapper */}
                    
                    <div className="layer-18 inline-flex justify-start items-center gap-2.5" data-layer="18">
                      {/* layer-18 = checkbox wrapper */}
                      
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="layer-19 w-4 h-4 rounded-full border border-blue-600"
                        data-layer="19"
                      />
                      {/* layer-19 = checkbox input */}
                      
                      <div className="layer-20 justify-start text-neutral-600 text-sm font-normal font-['Poppins'] leading-tight" data-layer="20">
                        {/* layer-20 = checkbox label */}
                        Remember me
                      </div>
                    </div>
                    
                    <Link 
                      href="/client/auth/forgot-password" 
                      className="layer-21 justify-start text-blue-600 text-sm font-normal font-['Poppins'] leading-tight hover:text-blue-700"
                      data-layer="21"
                    >
                      {/* layer-21 = forgot password link */}
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="layer-22 w-[792px] h-14 px-5 py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5"
            data-layer="22"
          >
            {/* layer-22 = sign in button */}
            
            <div className="layer-23 justify-start text-white text-base font-semibold font-['Poppins'] leading-7" data-layer="23">
              {/* layer-23 = button text */}
              Sign In
            </div>
          </button>

          {/* Registration Link */}
          <div className="layer-24 text-center" data-layer="24">
            {/* layer-24 = registration link container */}
            
            <p className="layer-25 text-sm text-gray-600" data-layer="25">
              {/* layer-25 = registration link text */}
              Don't have an account?{' '}
              <Link 
                href="/client/auth/register" 
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* Other Login Options */}
          <div className="layer-26 text-center" data-layer="26">
            {/* layer-26 = other login options container */}
            
            <p className="layer-27 text-sm text-gray-600 mb-4" data-layer="27">
              {/* layer-27 = other login options text */}
              Are you a:
            </p>
            <div className="layer-28 flex flex-col gap-2" data-layer="28">
              {/* layer-28 = other login links wrapper */}
              
              <Link 
                href="/seller/login" 
                className="layer-29 text-sm text-green-600 hover:text-green-700"
                data-layer="29"
              >
                {/* layer-29 = seller login link */}
                Seller? Sign in here →
              </Link>
              <Link 
                href="/reseller/login" 
                className="layer-30 text-sm text-purple-600 hover:text-purple-700"
                data-layer="30"
              >
                {/* layer-30 = reseller login link */}
                Reseller? Sign in here →
              </Link>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="layer-31 text-center" data-layer="31">
            {/* layer-31 = back to home link container */}
            
            <Link 
              href="/" 
              className="layer-32 text-sm text-gray-500 hover:text-gray-700"
              data-layer="32"
            >
              {/* layer-32 = back to home link */}
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
