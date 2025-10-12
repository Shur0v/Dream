/**
 * @fileoverview Top Information Bar component
 * Displays contact information and support options
 * 
 * @description This component includes:
 * - Support message
 * - Contact options (Web Chat, Phone, Hotline)
 * - Responsive design for mobile devices
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import Image from 'next/image';

/**
 * TopBar component
 * 
 * @description Renders the top information bar with:
 * - Support message
 * - Contact options with icons
 * - Responsive layout
 * 
 * @returns JSX top bar element
 */
export const TopBar: React.FC = () => {
  const topBarContacts = [
    {
      icon: "/header/icons/flychat.svg",
      text: "Web Chat",
      isImage: true,
    },
    {
      icon: "/header/icons/whatsapp.svg",
      text: "01576-609601",
      isImage: true,
    },
    {
      icon: "/header/icons/hotline.svg",
      text: "Hotline: 096471-01112",
      isImage: true,
    },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[rgba(210,105,216,1)] to-[rgba(242,0,255,1)] py-1">
      <div className="w-full max-w-[1320px] mx-auto flex items-center justify-between">
        <div className="font-normal text-white text-sm tracking-[-0.28px] leading-[22.4px] whitespace-nowrap">
          Need help with your order?
        </div>

        <div className="hidden md:inline-flex items-center gap-4">
          {topBarContacts.map((contact, index) => (
            <div key={index} className="inline-flex items-center gap-2">
              <Image
                className={
                  contact.icon === "/header/icons/flychat.svg"
                    ? "w-[31px] h-6"
                    : "w-5 h-5"
                }
                alt={contact.text}
                src={contact.icon}
                width={contact.icon === "/header/icons/flychat.svg" ? 31 : 20}
                height={contact.icon === "/header/icons/flychat.svg" ? 24 : 20}
              />
              <div className="font-normal text-white text-sm tracking-[-0.28px] leading-[22.4px] whitespace-nowrap">
                {contact.text}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Contact - Show only phone */}
        <div className="md:hidden inline-flex items-center gap-2">
          <Image
            className="w-5 h-5"
            alt="Phone"
            src="/header/icons/whatsapp.svg"
            width={20}
            height={20}
          />
          <div className="font-normal text-white text-sm tracking-[-0.28px] leading-[22.4px] whitespace-nowrap">
            01576-609601
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;