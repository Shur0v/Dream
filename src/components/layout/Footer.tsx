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
    { name: "About us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Offer", href: "/offers" },
    { name: "Become a seller", href: "/seller" }
  ];

  const supportLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Return Policy", href: "/return" },
    { name: "Customer Support", href: "/support" }
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
                  <img className="w-72 h-28" src={companyInfo.logo} alt="DreamShop Logo" />
                </div>
                
                {/* Company Description */}
                <div className="self-stretch h-auto justify-start text-white text-lg font-normal font-['Poppins'] leading-7">
                  {companyInfo.description}
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="inline-flex justify-start items-center gap-4">
                {socialMediaIcons.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 ${social.className} inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            {/* Quick Links Section */}
            <div className="w-36 inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight">
                Quick link
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {quickLinks.map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Support Section */}
            <div className="w-32 inline-flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight">
                Support
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3 whitespace-nowrap">
                {supportLinks.map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Contact Us Section */}
            <div className="w-96 inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight">
                Contact Us
              </div>
              
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {contactInfo.map((contact, index) => (
                  <div 
                    key={index}
                    className={`${contact.icon === 'location' ? 'self-stretch' : ''} inline-flex justify-start items-center gap-2`}
                  >
                    <img 
                      className={`${contact.icon === 'location' ? 'w-8 h-8' : 'w-6 h-6'}`} 
                      src={`/footer/${contact.icon}.svg`} 
                      alt={contact.icon} 
                    />
                    <div className={`${contact.icon === 'location' ? 'flex-1' : 'w-32'} justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug`}>
                      {contact.text.split('\n').map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex < contact.text.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Newsletter Subscription */}
              <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                 <form onSubmit={handleNewsletterSubscribe} className="self-stretch">
                    <div className="self-stretch h-14 px-1.5 py-1.5 bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-fuchsia-500 flex flex-col justify-center items-center gap-2.5">
                      <div className="w-full inline-flex justify-between items-center">
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
                          className="w-16 h-11 bg-gradient-to-r from-[#E279E8] to-[#FF10FF] rounded inline-flex justify-center items-center hover:from-[#D269D8] hover:to-[#F200FF] transition-colors disabled:opacity-50 ml-2"
                        >
                          <MoveRight className="w-6 h-6 text-white" />
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

