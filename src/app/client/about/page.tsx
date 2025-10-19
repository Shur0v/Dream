'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <section className="father w-full bg-white">
      {/* Content Container - Constrained to 1320px */}
      <div className="children relative w-full max-w-[1320px] mx-auto">
        <div className="w-full py-20 px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold font-['Poppins'] text-slate-950 mb-4">
              About DreamShop
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Your trusted e-commerce platform for quality products and secure shopping
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1">
              <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl font-bold">D</span>
                  </div>
                  <p className="text-gray-600 font-['Poppins']">DreamShop Logo</p>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 font-['Poppins'] leading-relaxed">
                <p>
                  DreamShop Ltd. is a trusted e-commerce platform committed to providing quality products and secure shopping experiences. We connect customers, vendors, and resellers through innovation and opportunity.
                </p>
                <p>
                  Our mission is to empower young entrepreneurs to achieve their dreams by providing them with a reliable platform to showcase and sell their products.
                </p>
                <p>
                  With a focus on customer satisfaction, secure transactions, and innovative solutions, we strive to be the leading e-commerce platform in Bangladesh.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 text-center mb-12">
              Why Choose DreamShop?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold font-['Poppins'] text-slate-950 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 font-['Poppins']">Quick and reliable delivery across Bangladesh</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold font-['Poppins'] text-slate-950 mb-2">Secure Payment</h3>
                <p className="text-gray-600 font-['Poppins']">Safe and encrypted payment processing</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold font-['Poppins'] text-slate-950 mb-2">Quality Products</h3>
                <p className="text-gray-600 font-['Poppins']">Curated selection of verified products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
