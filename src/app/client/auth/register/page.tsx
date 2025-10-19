/**
 * @fileoverview Customer Registration page
 * Page for customers to create an account
 * 
 * @description This page includes:
 * - Customer registration form with exact design match
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
 * Customer Registration page component
 * 
 * @description Renders the customer registration page with:
 * - Exact design match from Figma
 * - Logo integration
 * - Form validation
 * 
 * @returns JSX customer registration page element
 */
export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    acceptAgreement: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Customer registration:', formData);
    // TODO: Implement customer registration logic
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
      {/* father = full width registration page section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire registration page */}
        
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
                Create your account
              </div>
              <div className="layer-7 self-stretch text-center justify-start text-neutral-800 text-base font-medium font-['Lato'] leading-tight" data-layer="7">
                {/* layer-7 = subtitle */}
                Join our platform to start shopping or transporting vehicles
              </div>
            </div>

            {/* Form Fields */}
            <div className="layer-8 self-stretch flex flex-col justify-start items-start gap-10" data-layer="8">
              {/* layer-8 = form fields container */}
              
              <div className="layer-9 self-stretch flex flex-col justify-start items-start gap-6" data-layer="9">
                {/* layer-9 = form fields wrapper */}
                
                {/* Full Name Field */}
                <div className="layer-10 self-stretch flex flex-col justify-start items-start gap-2" data-layer="10">
                  {/* layer-10 = full name field container */}
                  
                  <div className="layer-11 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="11">
                    {/* layer-11 = field label */}
                    Full Name
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="layer-12 self-stretch h-11 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2.5 text-zinc-500 text-sm font-normal font-['Poppins'] leading-none"
                    required
                    data-layer="12"
                  />
                  {/* layer-12 = input field */}
                </div>

                {/* Contact Number Field */}
                <div className="layer-13 self-stretch flex flex-col justify-start items-start gap-2" data-layer="13">
                  {/* layer-13 = contact number field container */}
                  
                  <div className="layer-14 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="14">
                    {/* layer-14 = field label */}
                    Contact Number
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
                  {/* layer-15 = input field */}
                </div>

                {/* Set Password Field */}
                <div className="layer-16 self-stretch flex flex-col justify-start items-start gap-2" data-layer="16">
                  {/* layer-16 = password field container */}
                  
                  <div className="layer-17 self-stretch justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="17">
                    {/* layer-17 = field label */}
                    Set Password
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
                  {/* layer-18 = input field */}
                </div>

                {/* Confirm Password Field */}
                <div className="layer-19 self-stretch inline-flex justify-start items-start gap-4" data-layer="19">
                  {/* layer-19 = confirm password field container */}
                  
                  <div className="layer-20 flex-1 inline-flex flex-col justify-start items-start gap-2" data-layer="20">
                    {/* layer-20 = confirm password wrapper */}
                    
                    <div className="layer-21 justify-start text-neutral-600 text-base font-medium font-['Poppins'] leading-none" data-layer="21">
                      {/* layer-21 = field label */}
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
                    {/* layer-22 = input field */}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="layer-23 flex flex-col justify-start items-start gap-2.5" data-layer="23">
                  {/* layer-23 = agreement checkbox container */}
                  
                  <div className="layer-24 self-stretch inline-flex justify-start items-center gap-2.5" data-layer="24">
                    {/* layer-24 = checkbox wrapper */}
                    
                    <input
                      type="checkbox"
                      name="acceptAgreement"
                      checked={formData.acceptAgreement}
                      onChange={handleChange}
                      className="layer-25 w-4 h-4 rounded-full border border-blue-600"
                      required
                      data-layer="25"
                    />
                    {/* layer-25 = checkbox input */}
                    
                    <div className="layer-26 justify-start text-neutral-600 text-sm font-normal font-['Poppins'] leading-tight" data-layer="26">
                      {/* layer-26 = checkbox label */}
                      I accept the Membership Agreement.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="layer-27 w-[792px] h-14 px-5 py-3.5 bg-fuchsia-500 rounded-md inline-flex justify-center items-center gap-2.5"
            data-layer="27"
          >
            {/* layer-27 = sign up button */}
            
            <div className="layer-28 justify-start text-white text-base font-semibold font-['Poppins'] leading-7" data-layer="28">
              {/* layer-28 = button text */}
              Sign up
            </div>
          </button>

          {/* Login Link */}
          <div className="layer-29 text-center" data-layer="29">
            {/* layer-29 = login link container */}
            
            <p className="layer-30 text-sm text-gray-600" data-layer="30">
              {/* layer-30 = login link text */}
              Already have an account?{' '}
              <Link 
                href="/client/auth/login" 
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in here
              </Link>
            </p>
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
