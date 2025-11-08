'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight, MoveRight } from 'lucide-react';

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

/**
 * Props interface for Footer component
 */
interface FooterProps {
  /**
   * Callback when login modal should be opened
   */
  onOpenLoginModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
  
  /**
   * Callback when register modal should be opened
   */
  onOpenRegisterModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
}

export default function Footer({ onOpenLoginModal, onOpenRegisterModal }: FooterProps = {}) {
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

  /**
   * Footer data objects
   */
  const companyInfo = {
    logo: "/footer/logo.png",
    description: "DreamShop Ltd. – A trusted e-commerce platform for quality products and secure shopping. We connect customers & vendors."
  };

  const socialMediaIcons = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      className: "rounded-[39px]",
      href: "https://facebook.com"
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      className: "rounded-[38px]",
      href: "https://instagram.com"
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      className: "rounded-[38px]",
      href: "https://twitter.com"
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      className: "rounded-[50px]",
      href: "https://linkedin.com"
    }
  ];

  const quickLinks = [
    { name: "About us", href: "/client/about" },
    { name: "Contact Us", href: "/client/contact" },
    { name: "Offer", href: "/client/offers" },
    { name: "Become a seller", href: "#", onClick: () => onOpenRegisterModal?.('seller') }
  ];

  const supportLinks = [
    { name: "Privacy Policy", href: "/client/privacy" },
    { name: "Terms & Conditions", href: "/client/terms" },
    { name: "Return Policy", href: "/client/return" },
    { name: "Customer Support", href: "/client/support" }
  ];

  const contactInfo = [
    { 
      icon: "mail", 
      text: "support@dreamshopltd.com",
      href: "mailto:support@dreamshopltd.com"
    },
    { 
      icon: "phone", 
      text: "01846-437119",
      href: "tel:01846-437119"
    },
    { 
      icon: "whatsapp", 
      text: "01576-609601",
      href: "https://wa.me/01576609601"
    },
    { 
      icon: "support", 
      text: "0964710-1112",
      href: "tel:09647101112"
    },
    { 
      icon: "location", 
      text: "DreamShop Limited\nKayra Bazar, Ullapara, Sirajgonj",
      href: "https://maps.google.com"
    }
  ];
  
  return (
    <section className="father w-full bg-neutral-800" role="contentinfo" data-layer="father">
      {/* father = full width footer section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire footer section */}
        
        {/* Content Container - Constrained to 1320px */}
        <div className="layer-1 relative w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-full pt-8 sm:pt-10 lg:pt-14 pb-4 sm:pb-5 lg:pb-6 bg-neutral-800 inline-flex flex-col justify-start items-center gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 lg:px-0" data-layer="2">
            {/* layer-2 = footer content wrapper */}
            
            <div className="layer-3 self-stretch flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:justify-between items-start gap-6 sm:gap-8 lg:gap-8" data-layer="3">
              {/* layer-3 = footer sections container */}
              
              {/* Company Info Section */}
              <div className="layer-4 w-full sm:w-full md:w-full lg:w-96 inline-flex flex-col justify-start items-start gap-3 sm:gap-4 lg:gap-4" role="complementary" data-layer="4">
                {/* layer-4 = company info section */}
                
                <div className="layer-5 self-stretch flex flex-col justify-start items-start gap-4 sm:gap-6 lg:gap-8" data-layer="5">
                  {/* layer-5 = company branding container */}
                  
                  {/* Logo */}
                  <div className="layer-6 w-full sm:w-64 md:w-72 h-auto sm:h-20 lg:h-24 flex flex-col justify-start items-center sm:items-start lg:items-center" data-layer="6">
                    {/* layer-6 = logo container */}
                    <img 
                      className="w-full max-w-[280px] sm:max-w-[256px] md:max-w-[288px] lg:w-72 h-auto sm:h-20 lg:h-28 object-contain" 
                      src={companyInfo.logo} 
                      alt="DreamShop Logo" 
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Company Description */}
                  <div className="layer-7 self-stretch h-auto justify-start text-white text-sm sm:text-base lg:text-lg font-normal font-['Poppins'] leading-6 sm:leading-7 lg:leading-7" data-layer="7">
                    {/* layer-7 = company description */}
                    {companyInfo.description}
                  </div>
                </div>
                
                {/* Social Media Icons */}
                <div className="layer-8 inline-flex justify-start items-center gap-3 sm:gap-4 lg:gap-4" role="group" aria-label="Social media links" data-layer="8">
                  {/* layer-8 = social media icons container */}
                  {socialMediaIcons.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`layer-9 p-2 sm:p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 ${social.className} inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors`}
                        aria-label={`Visit our ${social.name} page`}
                        data-layer="9"
                      >
                        {/* layer-9 = individual social media icon */}
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
              
              {/* Quick Links Section */}
              <div className="layer-10 w-full sm:w-40 md:w-full lg:w-36 inline-flex flex-col justify-start items-start gap-2 sm:gap-3 lg:gap-3" role="navigation" aria-labelledby="quick-links-heading" data-layer="10">
                {/* layer-10 = quick links navigation section */}
                
                <div 
                  className="layer-11 self-stretch justify-start text-white text-lg sm:text-xl lg:text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight"
                  id="quick-links-heading"
                  role="heading"
                  aria-level={3}
                  data-layer="11"
                >
                  {/* layer-11 = quick links heading */}
                  Quick link
                </div>
                
                <div className="layer-12 self-stretch flex flex-col justify-start items-start gap-2 sm:gap-3 lg:gap-3" data-layer="12">
                  {/* layer-12 = quick links list */}
                  {quickLinks.map((link, index) => {
                    // Check if this link has an onClick handler (modal links)
                    if (link.onClick) {
                      return (
                        <button
                          key={index}
                          onClick={link.onClick}
                          className="layer-13 self-stretch justify-start text-gray-200 text-sm sm:text-base lg:text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors cursor-pointer text-left"
                          data-layer="13"
                        >
                          {/* layer-13 = individual quick link button */}
                          {link.name}
                        </button>
                      );
                    }
                    
                    // Regular navigation links
                    return (
                      <Link 
                        key={index}
                        href={link.href} 
                        className="layer-13 self-stretch justify-start text-gray-200 text-sm sm:text-base lg:text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors cursor-pointer"
                        data-layer="13"
                      >
                        {/* layer-13 = individual quick link */}
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              
              {/* Support Section */}
              <div className="layer-14 w-full sm:w-40 md:w-full lg:w-32 inline-flex flex-col justify-start items-start gap-2 sm:gap-3 lg:gap-3" role="navigation" aria-labelledby="support-heading" data-layer="14">
                {/* layer-14 = support navigation section */}
                
                <div 
                  className="layer-15 self-stretch justify-start text-white text-lg sm:text-xl lg:text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight"
                  id="support-heading"
                  role="heading"
                  aria-level={3}
                  data-layer="15"
                >
                  {/* layer-15 = support heading */}
                  Support
                </div>
                
                <div className="layer-16 self-stretch flex flex-col justify-start items-start gap-2 sm:gap-3 lg:gap-3 whitespace-normal sm:whitespace-nowrap lg:whitespace-nowrap" data-layer="16">
                  {/* layer-16 = support links list */}
                  {supportLinks.map((link, index) => (
                    <Link 
                      key={index}
                      href={link.href} 
                      className="layer-17 self-stretch justify-start text-gray-200 text-sm sm:text-base lg:text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors cursor-pointer"
                      data-layer="17"
                    >
                      {/* layer-17 = individual support link */}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Contact Us Section */}
              <div className="layer-18 w-full sm:w-full md:w-full lg:w-96 inline-flex flex-col justify-start items-start gap-3 sm:gap-4 lg:gap-4 md:col-span-2" role="complementary" aria-labelledby="contact-heading" data-layer="18">
                {/* layer-18 = contact us section */}
                
                <div 
                  className="layer-19 self-stretch justify-start text-white text-lg sm:text-xl lg:text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight"
                  id="contact-heading"
                  role="heading"
                  aria-level={3}
                  data-layer="19"
                >
                  {/* layer-19 = contact us heading */}
                  Contact Us
                </div>
                
                <div className="layer-20 self-stretch flex flex-col justify-start items-start gap-2 sm:gap-3 lg:gap-3" data-layer="20">
                  {/* layer-20 = contact information list */}
                  {contactInfo.map((contact, index) => (
                    <a
                      key={index}
                      href={contact.href}
                      className={`layer-21 ${contact.icon === 'location' ? 'self-stretch' : ''} inline-flex justify-start items-start sm:items-center gap-2 hover:text-white transition-colors cursor-pointer`}
                      aria-label={`Contact us via ${contact.icon}`}
                      data-layer="21"
                    >
                      {/* layer-21 = individual contact item */}
                      <img 
                        className={`${contact.icon === 'location' ? 'w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 flex-shrink-0 mt-0.5 sm:mt-0' : 'w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6 flex-shrink-0'}`} 
                        src={`/footer/${contact.icon}.svg`} 
                        alt={`${contact.icon} icon`}
                        loading="lazy"
                      />
                      <div className={`layer-22 ${contact.icon === 'location' ? 'flex-1' : 'w-auto sm:w-32 lg:w-32'} justify-start text-gray-200 text-sm sm:text-base lg:text-base font-normal font-['Poppins'] leading-snug break-words`} data-layer="22">
                        {/* layer-22 = contact text */}
                        {contact.text.split('\n').map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {line}
                            {lineIndex < contact.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
                
                {/* Newsletter Subscription */}
                <div className="layer-23 self-stretch flex flex-col justify-start items-start gap-2 sm:gap-2.5 lg:gap-2.5" data-layer="23">
                  {/* layer-23 = newsletter subscription container */}
                  
                  <form onSubmit={handleNewsletterSubscribe} className="layer-24 self-stretch" data-layer="24">
                    {/* layer-24 = newsletter form */}
                    
                    <div className="layer-25 self-stretch h-12 sm:h-12 lg:h-14 px-2 sm:px-1.5 lg:px-1.5 py-1.5 bg-neutral-800 rounded-lg outline-1 outline-offset-[-1px] outline-fuchsia-500 flex flex-col justify-center items-center gap-2.5" data-layer="25">
                      {/* layer-25 = form input container */}
                      
                      <div className="layer-26 w-full inline-flex justify-between items-center gap-2" data-layer="26">
                        {/* layer-26 = input and button wrapper */}
                        
                        <input
                          type="email"
                          placeholder="Your email address"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="layer-27 flex-1 bg-transparent text-neutral-400 text-sm sm:text-base lg:text-base font-normal font-['Poppins'] leading-relaxed tracking-tight placeholder-neutral-400 focus:outline-none focus:text-white"
                          aria-label="Email address for newsletter subscription"
                          data-layer="27"
                        />
                        <button
                          type="submit"
                          disabled={isSubscribing || !newsletterEmail}
                          className="layer-28 w-12 h-10 sm:w-14 sm:h-11 lg:w-16 lg:h-11 bg-gradient-to-r from-[#E279E8] to-[#FF10FF] rounded inline-flex justify-center items-center hover:from-[#D269D8] hover:to-[#F200FF] transition-colors disabled:opacity-50 flex-shrink-0"
                          aria-label="Subscribe to newsletter"
                          data-layer="28"
                        >
                          {/* layer-28 = subscribe button */}
                          <MoveRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6 text-white" />
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  {/* Privacy Policy Checkbox */}
                  <div className="layer-29 inline-flex justify-start items-center gap-2" data-layer="29">
                    {/* layer-29 = privacy policy checkbox container */}
                    
                    <input
                      type="checkbox"
                      className="layer-30 w-3 h-3 border border-gray-200 bg-transparent flex-shrink-0"
                      aria-label="Agree to privacy policy"
                      data-layer="30"
                    />
                    <div className="layer-31 justify-start text-gray-200 text-xs sm:text-sm lg:text-base font-normal font-['PolySans_Trial'] leading-relaxed tracking-tight" data-layer="31">
                      {/* layer-31 = privacy policy text */}
                      I agree to the privacy policy
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Section - Copyright */}
            <div className="layer-32 self-stretch pt-3 sm:pt-2 lg:pt-2 border-t border-neutral-500 flex flex-col sm:flex-row lg:inline-flex lg:flex-row justify-center sm:justify-between lg:justify-between items-center gap-2 sm:gap-0 lg:gap-0 px-4 sm:px-0 lg:px-0" data-layer="32">
              {/* layer-32 = copyright section */}
              
              <div className="layer-33 text-center sm:text-left lg:text-center justify-start text-gray-200 text-sm sm:text-base lg:text-lg font-normal font-['Poppins'] leading-6 sm:leading-7 lg:leading-7" data-layer="33">
                {/* layer-33 = copyright text */}
                © 2025 DreamShop All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

