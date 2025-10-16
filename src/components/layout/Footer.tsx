'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Footer component with links and company information
 * 
 * @description Renders the footer with:
 * - Company branding and description
 * - Organized link sections
 * - Social media integration
 * - Newsletter subscription form
 * - Copyright and legal information
 */
export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  /**
   * Handle newsletter subscription
   */
  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setIsSubscribing(true);
    try {
      // Handle newsletter subscription logic here
      console.log('Newsletter subscription:', newsletterEmail);
      setNewsletterEmail('');
    } finally {
      setIsSubscribing(false);
    }
  };
  
  return (
    <section className="father w-full bg-neutral-800">
      {/* Content Container - Constrained to 1320px */}
      <div className="children relative w-full max-w-[1320px] mx-auto">
        <div className="w-full pt-14 pb-6 bg-neutral-800 inline-flex flex-col justify-start items-center gap-6">
          <div className="self-stretch inline-flex justify-between items-start gap-8">
            {/* Company Info Section */}
            <div className="w-96 inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                {/* Logo */}
                <div className="w-72 h-24 flex flex-col justify-start items-center">
                  <img className="w-72 h-28" src="/footer/logo.png" alt="DreamShop Logo" />
                </div>
                
                {/* Company Description */}
                <div className="self-stretch h-auto justify-start text-white text-lg font-normal font-['Poppins'] leading-7">
                  DreamShop Ltd. – A trusted e-commerce platform for quality products and secure shopping. We connect customers & vendors.
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="inline-flex justify-start items-center gap-4">
                {/* Facebook */}
                <div className="p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-[39px] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <img className="w-6 h-6" src="/footer/facebook.svg" alt="Facebook" />
                </div>
                
                {/* Instagram */}
                <div className="p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-[38px] flex justify-start items-center gap-2.5 overflow-hidden">
                  <img className="w-6 h-6" src="/footer/instagram.svg" alt="Instagram" />
                </div>
                
                {/* Twitter */}
                <div className="p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-[38px] flex justify-start items-center gap-2.5 overflow-hidden">
                  <img className="w-6 h-6" src="/footer/twitter.svg" alt="Twitter" />
                </div>
                
                {/* LinkedIn */}
                <div className="p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-[50px] flex justify-start items-center gap-2.5 overflow-hidden">
                  <img className="w-6 h-6" src="/footer/linkedin.svg" alt="LinkedIn" />
                </div>
              </div>
            </div>
            
            {/* Quick Links Section */}
            <div className="w-36 inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight">
                Quick link
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <Link href="/about" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  About us
                </Link>
                <Link href="/contact" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Contact Us
                </Link>
                <Link href="/offers" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Offer
                </Link>
                <Link href="/seller" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Become a seller
                </Link>
              </div>
            </div>
            
            {/* Support Section */}
            <div className="w-32 inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight">
                Support
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <Link href="/privacy" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/return" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Return Policy
                </Link>
                <Link href="/support" className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors">
                  Customer Support
                </Link>
              </div>
            </div>
            
            {/* Contact Us Section */}
            <div className="w-96 inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight">
                Contact Us
              </div>
              
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {/* Email */}
                <div className="inline-flex justify-start items-center gap-2">
                  <img className="w-6 h-6" src="/footer/mail.svg" alt="Email" />
                  <div className="justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug">
                    support@dreamshopltd.com
                  </div>
                </div>
                
                {/* Phone Numbers */}
                <div className="inline-flex justify-start items-start gap-5">
                  <div className="flex justify-start items-center gap-2">
                    <img className="w-6 h-6" src="/footer/phone.svg" alt="Phone" />
                    <div className="w-32 justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug">
                      01846-437119
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <img className="w-6 h-6" src="/footer/whatsapp.svg" alt="WhatsApp" />
                    <div className="w-32 justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug">
                      01576-609601
                    </div>
                  </div>
                </div>
                
                {/* Support Number */}
                <div className="inline-flex justify-start items-center gap-2">
                  <img className="w-6 h-6" src="/footer/support.svg" alt="Support" />
                  <div className="w-32 justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug">
                    0964710-1112
                  </div>
                </div>
                
                {/* Address */}
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <img className="w-8 h-8" src="/footer/location.svg" alt="Location" />
                  <div className="flex-1 justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug">
                    DreamShop Limited<br />
                    Kayra Bazar, Ullapara, Sirajgonj
                  </div>
                </div>
              </div>
              
              {/* Newsletter Subscription */}
              <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                <form onSubmit={handleNewsletterSubscribe} className="self-stretch">
                  <div className="self-stretch h-14 px-1.5 py-1.5 bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-fuchsia-500 flex flex-col justify-start items-start gap-2.5">
                    <div className="w-80 inline-flex justify-between items-center">
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 bg-transparent text-neutral-400 text-base font-normal font-['Poppins'] leading-relaxed tracking-tight placeholder-neutral-400 focus:outline-none focus:text-white"
                      />
                      <button
                        type="submit"
                        disabled={isSubscribing || !newsletterEmail}
                        className="w-16 h-11 px-4 py-5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded inline-flex flex-col justify-center items-center gap-2.5 hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors disabled:opacity-50"
                      >
                        <img className="w-8 h-0 border-2 border-zinc-100" src="/footer/Arrow 1.svg" alt="Subscribe" />
                      </button>
                    </div>
                  </div>
                </form>
                
                {/* Privacy Policy Checkbox */}
                <div className="inline-flex justify-start items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-3 h-3 border border-gray-200 bg-transparent"
                  />
                  <div className="justify-start text-gray-200 text-base font-normal font-['PolySans_Trial'] leading-relaxed tracking-tight">
                    I agree to the privacy policy
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Copyright */}
          <div className="self-stretch pt-2 border-t border-neutral-500 inline-flex justify-between items-center">
            <div className="text-center justify-start text-gray-200 text-lg font-normal font-['Poppins'] leading-7">
              © 2025 DreamShop All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

