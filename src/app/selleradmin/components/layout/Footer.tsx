'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

interface FooterProps {
  onOpenLoginModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
  onOpenRegisterModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
}

export default function Footer({ onOpenRegisterModal }: FooterProps = {}) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribing(true);
    try { console.log('Newsletter subscription:', newsletterEmail); setNewsletterEmail(''); }
    finally { setIsSubscribing(false); }
  };

  const companyInfo = {
    logo: "/footer/logo.png",
    description: "DreamShop Ltd. – A trusted e-commerce platform for quality products and secure shopping. We connect customers & vendors."
  };

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
    { icon: "mail", text: "support@dreamshopltd.com", href: "mailto:support@dreamshopltd.com" },
    { icon: "phone", text: "01846-437119", href: "tel:01846-437119" },
    { icon: "whatsapp", text: "01576-609601", href: "https://wa.me/01576609601" },
    { icon: "support", text: "0964710-1112", href: "tel:09647101112" },
    { icon: "location", text: "DreamShop Limited\nKayra Bazar, Ullapara, Sirajgonj", href: "https://maps.google.com" }
  ];

  return (
    <section className="father w-full bg-neutral-800" role="contentinfo" data-layer="father">
      <div className="daughter" data-layer="daughter">
        <div className="layer-1 relative w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          <div className="layer-2 w-full pt-14 pb-6 bg-neutral-800 inline-flex flex-col justify-start items-center gap-6" data-layer="2">
            <div className="layer-3 self-stretch inline-flex justify-between items-start gap-8" data-layer="3">
              {/* Company Info */}
              <div className="layer-4 w-96 inline-flex flex-col justify-start items-start gap-4" role="complementary" data-layer="4">
                <div className="layer-5 self-stretch flex flex-col justify-start items-start gap-8" data-layer="5">
                  <div className="layer-6 w-72 h-24 flex flex-col justify-start items-center" data-layer="6">
                    <img className="w-72 h-28" src={companyInfo.logo} alt="DreamShop Logo" loading="lazy" />
                  </div>
                  <div className="layer-7 self-stretch h-auto justify-start text-white text-lg font-normal font-['Poppins'] leading-7" data-layer="7">{companyInfo.description}</div>
                </div>
                <div className="layer-8 inline-flex justify-start items-center gap-4" role="group" aria-label="Social media links" data-layer="8">
                  {[
                    { name: 'facebook', file: 'facebook' },
                    { name: 'instagram', file: 'instagram' },
                    { name: 'twitter', file: 'twiter' },
                    { name: 'linkedin', file: 'linkedin' },
                  ].map((item, i) => (
                    <a key={i} href="#" className="layer-9 p-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors" aria-label={`Visit our ${item.name} page`} data-layer="9">
                      <img src={`/footer/${item.file}.svg`} alt={`${item.name} icon`} className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
              {/* Quick Links */}
              <div className="layer-10 w-36 inline-flex flex-col justify-start items-start gap-3" role="navigation" aria-labelledby="quick-links-heading" data-layer="10">
                <div className="layer-11 self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight" id="quick-links-heading" role="heading" aria-level={3} data-layer="11">Quick link</div>
                <div className="layer-12 self-stretch flex flex-col justify-start items-start gap-3" data-layer="12">
                  {quickLinks.map((link, index) => link.onClick ? (
                    <button key={index} onClick={link.onClick} className="layer-13 self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors cursor-pointer text-left" data-layer="13">{link.name}</button>
                  ) : (
                    <Link key={index} href={link.href} className="layer-13 self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors cursor-pointer" data-layer="13">{link.name}</Link>
                  ))}
                </div>
              </div>
              {/* Support */}
              <div className="layer-14 w-32 inline-flex flex-col justify-start items-start gap-3" role="navigation" aria-labelledby="support-heading" data-layer="14">
                <div className="layer-15 self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight" id="support-heading" role="heading" aria-level={3} data-layer="15">Support</div>
                <div className="layer-16 self-stretch flex flex-col justify-start items-start gap-3 whitespace-nowrap" data-layer="16">
                  {supportLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="layer-17 self-stretch justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug hover:text-white transition-colors cursor-pointer" data-layer="17">{link.name}</Link>
                  ))}
                </div>
              </div>
              {/* Contact */}
              <div className="layer-18 w-96 inline-flex flex-col justify-start items-start gap-4" role="complementary" aria-labelledby="contact-heading" data-layer="18">
                <div className="layer-19 self-stretch justify-start text-white text-xl font-semibold font-['Poppins'] leading-relaxed tracking-tight" id="contact-heading" role="heading" aria-level={3} data-layer="19">Contact Us</div>
                <div className="layer-20 self-stretch flex flex-col justify-start items-start gap-3" data-layer="20">
                  {contactInfo.map((contact, index) => (
                    <a key={index} href={contact.href} className={`layer-21 ${contact.icon === 'location' ? 'self-stretch' : ''} inline-flex justify-start items-center gap-2 hover:text-white transition-colors cursor-pointer`} aria-label={`Contact us via ${contact.icon}`} data-layer="21">
                      <img className={`${contact.icon === 'location' ? 'w-8 h-8' : 'w-6 h-6'}`} src={`/footer/${contact.icon}.svg`} alt={`${contact.icon} icon`} loading="lazy" />
                      <div className={`layer-22 ${contact.icon === 'location' ? 'flex-1' : 'w-32'} justify-start text-gray-200 text-base font-normal font-['Poppins'] leading-snug`} data-layer="22">
                        {contact.text.split('\n').map((line, lineIndex) => (<span key={lineIndex}>{line}{lineIndex < contact.text.split('\n').length - 1 && <br />}</span>))}
                      </div>
                    </a>
                  ))}
                </div>
                <div className="layer-23 self-stretch flex flex-col justify-start items-start gap-2.5" data-layer="23">
                  <form onSubmit={handleNewsletterSubscribe} className="layer-24 self-stretch" data-layer="24">
                    <div className="layer-25 self-stretch h-14 px-1.5 py-1.5 bg-neutral-800 rounded-lg outline-1 outline-offset-[-1px] outline-fuchsia-500 flex flex-col justify-center items-center gap-2.5" data-layer="25">
                      <div className="layer-26 w-full inline-flex justify-between items-center" data-layer="26">
                        <input type="email" placeholder="Your email address" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="layer-27 flex-1 bg-transparent text-neutral-400 text-base font-normal font-['Poppins'] leading-relaxed tracking-tight placeholder-neutral-400 focus:outline-none focus:text-white" aria-label="Email address for newsletter subscription" data-layer="27" />
                        <button type="submit" disabled={isSubscribing || !newsletterEmail} className="layer-28 w-16 h-11 bg-gradient-to-r from-[#E279E8] to-[#FF10FF] rounded inline-flex justify-center items-center hover:from-[#D269D8] hover:to-[#F200FF] transition-colors disabled:opacity-50 ml-2" aria-label="Subscribe to newsletter" data-layer="28">
                          <MoveRight className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="layer-29 inline-flex justify-start items-center gap-2" data-layer="29">
                    <input type="checkbox" className="layer-30 w-3 h-3 border border-gray-200 bg-transparent" aria-label="Agree to privacy policy" data-layer="30" />
                    <div className="layer-31 justify-start text-gray-200 text-base font-normal font-['PolySans_Trial'] leading-relaxed tracking-tight" data-layer="31">I agree to the privacy policy</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="layer-32 self-stretch pt-2 border-t border-neutral-500 inline-flex justify-between items-center" data-layer="32">
              <div className="layer-33 text-center justify-start text-gray-200 text-lg font-normal font-['Poppins'] leading-7" data-layer="33">© 2025 DreamShop All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


