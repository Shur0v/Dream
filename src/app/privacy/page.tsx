'use client';

import React from 'react';
import { Shield, Eye, Lock, Database, Users, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information."
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers."
    },
    {
      icon: Shield,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted third parties who assist us in operating our website and conducting our business."
    },
    {
      icon: Database,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
    },
    {
      icon: Users,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. To exercise these rights, please contact us using the information provided below."
    },
    {
      icon: FileText,
      title: "Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last Updated' date."
    }
  ];

  return (
    <section className="father w-full bg-white">
      {/* Content Container - Constrained to 1320px */}
      <div className="children relative w-full max-w-[1320px] mx-auto">
        <div className="w-full py-20 px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold font-['Poppins'] text-slate-950 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 font-['Poppins'] mt-4">
              Last Updated: January 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold font-['Poppins'] text-slate-950 mb-4">
              Introduction
            </h2>
            <p className="text-gray-600 font-['Poppins'] leading-relaxed">
              DreamShop Ltd. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-['Poppins'] text-slate-950 mb-3">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 font-['Poppins'] leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Information */}
          <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold font-['Poppins'] mb-4">
              Contact Us
            </h2>
            <p className="text-lg font-['Poppins'] mb-6 opacity-90">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Email
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  privacy@dreamshopltd.com
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Phone
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  0964710-1112
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Address
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  DreamShop Limited<br />
                  Kayra Bazar, Ullapara, Sirajgonj
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Business Hours
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold font-['Poppins'] text-blue-900 mb-3">
              Important Notice
            </h3>
            <p className="text-blue-800 font-['Poppins']">
              By using our services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your information as described herein. We reserve the right to modify this policy at any time, and such modifications will be effective immediately upon posting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
