'use client';

import React, { useState } from 'react';
import { CheckCircle, DollarSign, Users, TrendingUp, Shield, Headphones } from 'lucide-react';

export default function BecomeSellerPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Seller application submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn More",
      description: "Increase your revenue with our platform"
    },
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Access to thousands of potential customers"
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Scale your business with our tools"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and reliable payment processing"
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
              Become a Seller
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Join thousands of successful sellers on DreamShop and grow your business
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits Section */}
            <div>
              <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 mb-6">
                Why Sell on DreamShop?
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 font-['Poppins']">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Requirements */}
              <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold font-['Poppins'] text-slate-950 mb-4">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600 font-['Poppins']">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Valid business registration
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 font-['Poppins']">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Bank account for payments
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 font-['Poppins']">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Quality product images
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 font-['Poppins']">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Commitment to customer service
                  </li>
                </ul>
              </div>
            </div>

            {/* Application Form */}
            <div>
              <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 mb-6">
                Apply to Become a Seller
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                    placeholder="Your business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div>
                    <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Living</option>
                    <option value="sports">Sports & Fitness</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="books">Books & Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium font-['Poppins'] text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-['Poppins']"
                    placeholder="Tell us about your business"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold font-['Poppins'] hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Submit Application
                </button>
              </form>

              {/* Support Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Headphones className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold font-['Poppins'] text-blue-900 mb-1">
                      Need Help?
                    </h4>
                    <p className="text-sm text-blue-700 font-['Poppins']">
                      Contact our seller support team at <a href="tel:0964710-1112" className="underline">0964710-1112</a> for assistance with your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
