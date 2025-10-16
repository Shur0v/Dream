'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Headphones, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { 
      icon: Mail, 
      title: "Email", 
      info: "support@dreamshopltd.com",
      href: "mailto:support@dreamshopltd.com"
    },
    { 
      icon: Phone, 
      title: "Phone", 
      info: "01846-437119",
      href: "tel:01846-437119"
    },
    { 
      icon: MessageCircle, 
      title: "WhatsApp", 
      info: "01576-609601",
      href: "https://wa.me/01576609601"
    },
    { 
      icon: Headphones, 
      title: "Support", 
      info: "0964710-1112",
      href: "tel:09647101112"
    },
    { 
      icon: MapPin, 
      title: "Address", 
      info: "DreamShop Limited\nKayra Bazar, Ullapara, Sirajgonj",
      href: "https://maps.google.com"
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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Get in touch with us. We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                    placeholder="Your message"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold font-['Poppins'] hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-1">
                          {contact.title}
                        </h3>
                        <p className="text-gray-600 font-['Poppins'] whitespace-pre-line">
                          {contact.info}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
