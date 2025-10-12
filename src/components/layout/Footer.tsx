/**
 * @fileoverview Footer component with links and company information
 * Provides footer content with links and social media
 * 
 * @description This component includes:
 * - Company information and logo
 * - Navigation links
 * - Social media links
 * - Newsletter subscription
 * - Copyright information
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * Props interface for Footer component
 */
interface FooterProps {
  /**
   * Callback when newsletter is subscribed
   */
  onNewsletterSubscribe?: (email: string) => void;
}

/**
 * Footer component with links and company information
 * 
 * @description Renders the footer with:
 * - Company branding and description
 * - Organized link sections
 * - Social media integration
 * - Newsletter subscription form
 * - Copyright and legal information
 * 
 * @param props - Footer props including newsletter callback
 * @returns JSX footer element
 * 
 * @example
 * ```tsx
 * <Footer onNewsletterSubscribe={handleNewsletterSubscribe} />
 * ```
 */
export const Footer: React.FC<FooterProps> = ({
  onNewsletterSubscribe,
}) => {
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
      await onNewsletterSubscribe?.(newsletterEmail);
      setNewsletterEmail('');
    } finally {
      setIsSubscribing(false);
    }
  };
  
  /**
   * Footer link sections
   */
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'New Arrivals', href: '/products?filter=new' },
        { name: 'Best Sellers', href: '/products?filter=bestsellers' },
        { name: 'Sale', href: '/products?filter=sale' },
        { name: 'Categories', href: '/categories' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Help Center', href: '/help' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Partnerships', href: '/partnerships' },
        { name: 'Sustainability', href: '/sustainability' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' },
        { name: 'Sitemap', href: '/sitemap' },
      ],
    },
  ];
  
  /**
   * Social media links
   */
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  ];
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">Dream Store</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your one-stop destination for quality products at unbeatable prices. 
              We're committed to providing exceptional shopping experiences with 
              fast shipping and excellent customer service.
            </p>
            
            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter for the latest deals and updates.
              </p>
              <form onSubmit={handleNewsletterSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  loading={isSubscribing}
                  disabled={!newsletterEmail}
                  size="sm"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Dream Store. All rights reserved.
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
