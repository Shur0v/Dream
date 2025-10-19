'use client';

import React from 'react';
import { Percent, Clock, Star, ShoppingBag } from 'lucide-react';

export default function OffersPage() {
  const offers = [
    {
      id: 1,
      title: "Flash Sale - Electronics",
      discount: "30% OFF",
      description: "Get amazing discounts on all electronics. Limited time offer!",
      image: "/offers/electronics.jpg",
      validUntil: "2025-01-31",
      category: "Electronics"
    },
    {
      id: 2,
      title: "Fashion Week Special",
      discount: "50% OFF",
      description: "Up to 50% off on all fashion items. Don't miss out!",
      image: "/offers/fashion.jpg",
      validUntil: "2025-02-15",
      category: "Fashion"
    },
    {
      id: 3,
      title: "Home & Living",
      discount: "25% OFF",
      description: "Transform your home with our exclusive home decor offers.",
      image: "/offers/home.jpg",
      validUntil: "2025-02-28",
      category: "Home & Living"
    },
    {
      id: 4,
      title: "Sports & Fitness",
      discount: "40% OFF",
      description: "Stay fit and active with our sports equipment offers.",
      image: "/offers/sports.jpg",
      validUntil: "2025-03-10",
      category: "Sports"
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
              Special Offers
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Discover amazing deals and exclusive offers on your favorite products
            </p>
          </div>

          {/* Featured Offer Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-12 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  Mega Sale - Up to 70% OFF
                </h2>
                <p className="text-lg font-['Poppins'] opacity-90">
                  Limited time offer on selected items. Shop now and save big!
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold font-['Poppins']">
                  70%
                </div>
                <div className="text-sm font-['Poppins'] opacity-90">
                  OFF
                </div>
              </div>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {/* Offer Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-['Poppins']">{offer.category}</p>
                  </div>
                </div>

                {/* Offer Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold font-['Poppins']">
                      {offer.discount}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm font-['Poppins']">
                      <Clock className="w-4 h-4 mr-1" />
                      Valid until {offer.validUntil}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-['Poppins'] text-slate-950 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 font-['Poppins'] mb-4">
                    {offer.description}
                  </p>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold font-['Poppins'] hover:from-purple-600 hover:to-pink-600 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold font-['Poppins'] text-slate-950 mb-6 text-center">
              How Our Offers Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">
                  Automatic Discounts
                </h3>
                <p className="text-gray-600 font-['Poppins']">
                  Discounts are automatically applied at checkout
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">
                  Limited Time
                </h3>
                <p className="text-gray-600 font-['Poppins']">
                  Offers are valid for a limited time only
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">
                  Best Deals
                </h3>
                <p className="text-gray-600 font-['Poppins']">
                  We offer the best deals on quality products
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}