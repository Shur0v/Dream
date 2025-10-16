'use client';

import React, { useState } from 'react';
import { Headphones, MessageCircle, Mail, Phone, Clock, HelpCircle, Search, FileText } from 'lucide-react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: "Account",
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button on our homepage and filling out the registration form with your email address and password."
    },
    {
      category: "Account",
      question: "I forgot my password. How do I reset it?",
      answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link."
    },
    {
      category: "Orders",
      question: "How can I track my order?",
      answer: "You can track your order by logging into your account and going to 'My Orders' section, or by using the tracking number sent to your email."
    },
    {
      category: "Orders",
      question: "Can I modify my order after placing it?",
      answer: "Orders can only be modified within 2 hours of placement. After that, you'll need to contact customer service for assistance."
    },
    {
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept bKash, Nagad, credit cards, debit cards, and bank transfers. All payments are processed securely."
    },
    {
      category: "Payment",
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption to protect your payment information. We never store your complete payment details."
    },
    {
      category: "Shipping",
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days within Dhaka and 5-7 business days for other cities in Bangladesh."
    },
    {
      category: "Shipping",
      question: "Do you deliver outside Dhaka?",
      answer: "Yes, we deliver to all major cities and districts in Bangladesh. Delivery times may vary by location."
    }
  ];

  const supportMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "0964710-1112",
      hours: "9:00 AM - 6:00 PM (Mon-Fri)",
      href: "tel:0964710-1112"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      hours: "Instant response",
      href: "#"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email",
      contact: "support@dreamshopltd.com",
      hours: "Response within 24 hours",
      href: "mailto:support@dreamshopltd.com"
    },
    {
      icon: Headphones,
      title: "WhatsApp",
      description: "Message us on WhatsApp",
      contact: "01576-609601",
      hours: "9:00 AM - 8:00 PM",
      href: "https://wa.me/01576609601"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === '' || faq.category === selectedCategory) &&
    (searchQuery === '' || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="father w-full bg-white">
      {/* Content Container - Constrained to 1320px */}
      <div className="children relative w-full max-w-[1320px] mx-auto">
        <div className="w-full py-20 px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold font-['Poppins'] text-slate-950 mb-4">
              Customer Support
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              We're here to help! Get assistance with your orders, account, and any questions you may have.
            </p>
          </div>

          {/* Support Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <a
                  key={index}
                  href={method.href}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 font-['Poppins'] text-sm mb-2">
                    {method.description}
                  </p>
                  <p className="text-purple-600 font-semibold font-['Poppins'] text-sm mb-1">
                    {method.contact}
                  </p>
                  <p className="text-gray-500 font-['Poppins'] text-xs">
                    {method.hours}
                  </p>
                </a>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold font-['Poppins'] text-slate-950 mb-6">
              Frequently Asked Questions
            </h2>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium font-['Poppins'] transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {['Account', 'Orders', 'Payment', 'Shipping'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium font-['Poppins'] transition-colors ${
                    selectedCategory === category 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4 mb-16">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium font-['Poppins'] text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 font-['Poppins'] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold font-['Poppins'] mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg font-['Poppins'] mb-6 opacity-90">
              Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Quick Contact
                </h3>
                <p className="font-['Poppins'] opacity-90 mb-4">
                  For immediate assistance, call us or use our live chat feature.
                </p>
                <div className="space-y-2">
                  <p className="font-['Poppins']">
                    📞 <a href="tel:0964710-1112" className="underline">0964710-1112</a>
                  </p>
                  <p className="font-['Poppins']">
                    💬 Live Chat (24/7)
                  </p>
                  <p className="font-['Poppins']">
                    📧 <a href="mailto:support@dreamshopltd.com" className="underline">support@dreamshopltd.com</a>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-['Poppins'] mb-2">
                  Business Hours
                </h3>
                <div className="font-['Poppins'] opacity-90 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="mt-2 text-sm">
                    Live chat and email support available 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
