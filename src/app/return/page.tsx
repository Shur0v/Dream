'use client';

import React from 'react';
import { RotateCcw, Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ReturnPolicyPage() {
  const sections = [
    {
      icon: Clock,
      title: "Return Timeframe",
      content: "You have 30 days from the date of delivery to return or exchange your purchase. Items must be in their original condition with all tags and packaging intact."
    },
    {
      icon: Package,
      title: "Return Process",
      content: "To initiate a return, contact our customer service team or use our online return portal. You'll receive a return authorization number and instructions for packaging and shipping your item."
    },
    {
      icon: CheckCircle,
      title: "Eligible Items",
      content: "Most items are eligible for return or exchange. However, certain items such as personalized products, perishable goods, and intimate items may not be eligible for return due to hygiene reasons."
    },
    {
      icon: XCircle,
      title: "Non-Returnable Items",
      content: "Items that are damaged due to misuse, missing original packaging, or items returned after 30 days are not eligible for return. Custom-made or personalized items are also non-returnable."
    },
    {
      icon: RotateCcw,
      title: "Refund Process",
      content: "Once we receive your returned item and verify its condition, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method used for the purchase."
    },
    {
      icon: AlertCircle,
      title: "Exchange Policy",
      content: "If you need to exchange an item for a different size or color, please contact our customer service team. Exchanges are subject to availability and may require additional shipping charges."
    }
  ];

  const returnSteps = [
    {
      step: "1",
      title: "Contact Us",
      description: "Reach out to our customer service team or use our online return portal"
    },
    {
      step: "2",
      title: "Get Authorization",
      description: "Receive your return authorization number and packaging instructions"
    },
    {
      step: "3",
      title: "Package Item",
      description: "Pack the item securely in its original packaging with all tags attached"
    },
    {
      step: "4",
      title: "Ship Item",
      description: "Send the item back to us using the provided shipping label"
    },
    {
      step: "5",
      title: "Receive Refund",
      description: "Get your refund processed within 5-7 business days"
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
              Return Policy
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              We want you to be completely satisfied with your purchase. Here's everything you need to know about returns and exchanges.
            </p>
            <p className="text-sm text-gray-500 font-['Poppins'] mt-4">
              Last Updated: January 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold font-['Poppins'] text-slate-950 mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-600 font-['Poppins'] leading-relaxed">
              At DreamShop, we stand behind the quality of our products and want you to be completely satisfied with your purchase. If you're not happy with your order, we'll make it right. Our return policy is designed to be fair, transparent, and easy to understand.
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

          {/* Return Process Steps */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 text-center mb-12">
              How to Return an Item
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {returnSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold font-['Poppins']">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 font-['Poppins'] text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <div className="mt-16 bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold font-['Poppins'] text-blue-900 mb-6">
              Important Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-blue-900 mb-3">
                  Shipping Costs
                </h3>
                <p className="text-blue-800 font-['Poppins']">
                  Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product. We will provide a prepaid return label for defective items.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-blue-900 mb-3">
                  Processing Time
                </h3>
                <p className="text-blue-800 font-['Poppins']">
                  Once we receive your returned item, please allow 5-7 business days for processing. You will receive an email confirmation once your refund has been processed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-blue-900 mb-3">
                  Damaged Items
                </h3>
                <p className="text-blue-800 font-['Poppins']">
                  If you receive a damaged item, please contact us immediately with photos of the damage. We will arrange for a replacement or full refund at no cost to you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-blue-900 mb-3">
                  Gift Returns
                </h3>
                <p className="text-blue-800 font-['Poppins']">
                  Gift purchases can be returned within 30 days of purchase. The refund will be issued as store credit or to the original purchaser's payment method.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold font-['Poppins'] mb-4">
              Need Help with Returns?
            </h2>
            <p className="text-lg font-['Poppins'] mb-6 opacity-90">
              Our customer service team is here to help with any questions about returns or exchanges:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Email
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  returns@dreamshopltd.com
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
                  Live Chat
                </h3>
                <p className="font-['Poppins'] opacity-90">
                  Available 24/7 on our website
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
        </div>
      </div>
    </section>
  );
}
