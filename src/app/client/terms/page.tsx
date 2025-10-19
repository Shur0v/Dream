'use client';

import React from 'react';
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using DreamShop's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: Scale,
      title: "Use License",
      content: "Permission is granted to temporarily download one copy of the materials on DreamShop's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials."
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer",
      content: "The materials on DreamShop's website are provided on an 'as is' basis. DreamShop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      icon: XCircle,
      title: "Limitations",
      content: "In no event shall DreamShop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DreamShop's website, even if DreamShop or a DreamShop authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      icon: CheckCircle,
      title: "Accuracy of Materials",
      content: "The materials appearing on DreamShop's website could include technical, typographical, or photographic errors. DreamShop does not warrant that any of the materials on its website are accurate, complete, or current. DreamShop may make changes to the materials contained on its website at any time without notice."
    },
    {
      icon: Clock,
      title: "Modifications",
      content: "DreamShop may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service."
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
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our service.
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
              These Terms and Conditions ("Terms") govern your use of DreamShop's website and services operated by DreamShop Ltd. ("us", "we", or "our"). By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the service.
            </p>
          </div>

          {/* Terms Sections */}
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

          {/* Additional Terms */}
          <div className="mt-12 bg-yellow-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold font-['Poppins'] text-yellow-900 mb-4">
              Additional Terms
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-yellow-900 mb-2">
                  Prohibited Uses
                </h3>
                <p className="text-yellow-800 font-['Poppins']">
                  You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts, or to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-yellow-900 mb-2">
                  Governing Law
                </h3>
                <p className="text-yellow-800 font-['Poppins']">
                  These Terms shall be interpreted and governed by the laws of Bangladesh, without regard to its conflict of law provisions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-yellow-900 mb-2">
                  Severability
                </h3>
                <p className="text-yellow-800 font-['Poppins']">
                  If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold font-['Poppins'] mb-4">
              Contact Information
            </h2>
            <p className="text-lg font-['Poppins'] mb-6 opacity-90">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Email
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  legal@dreamshopltd.com
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

          {/* Agreement Notice */}
          <div className="mt-12 bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-bold font-['Poppins'] text-green-900 mb-3">
              Agreement
            </h3>
            <p className="text-green-800 font-['Poppins']">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. These terms constitute a legally binding agreement between you and DreamShop Ltd.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
