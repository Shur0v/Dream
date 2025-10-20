'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Rocket, Coins, Users, ShieldCheck, TrendingUp } from 'lucide-react';

export default function SellerLandingPage() {
  const benefits = [
    { icon: Rocket, title: 'Launch Fast', description: 'Set up your shop in minutes with easy onboarding.' },
    { icon: TrendingUp, title: 'Grow Sales', description: 'Reach thousands of customers across Bangladesh.' },
    { icon: Coins, title: 'Low Fees', description: 'Competitive commissions and transparent payouts.' },
    { icon: ShieldCheck, title: 'Secure Platform', description: 'Protected payments and seller-friendly policies.' },
  ];

  const steps = [
    { step: '1', title: 'Create Account', desc: 'Register your seller account with basic details.' },
    { step: '2', title: 'Add Products', desc: 'Upload products with photos, price and stock.' },
    { step: '3', title: 'Start Selling', desc: 'Go live and receive orders instantly.' },
  ];

  return (
    <section className="father w-full bg-white">
      <div className="children relative w-full max-w-[1320px] mx-auto">
        <div className="w-full py-20 px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold font-['Poppins'] text-slate-950 mb-4">
              Become a Seller on DreamShop
            </h1>
            <p className="text-xl text-gray-600 font-['Poppins'] max-w-3xl mx-auto">
              Join a growing marketplace. Start your online business and reach more customers today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/client/auth/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold font-['Poppins'] hover:from-purple-600 hover:to-pink-600 transition-colors">
                Create Seller Account
              </Link>
              <Link href="/client/contact" className="py-3 px-6 rounded-lg font-semibold font-['Poppins'] border border-gray-300 hover:bg-gray-50">
                Talk to Sales
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">{b.title}</h3>
                  <p className="text-gray-600 font-['Poppins'] text-sm">{b.description}</p>
                </div>
              );
            })}
          </div>

          {/* How it works */}
          <div className="mt-6">
            <h2 className="text-3xl font-bold font-['Poppins'] text-slate-950 text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold font-['Poppins']">{s.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold font-['Poppins'] text-slate-950 mb-2">{s.title}</h3>
                  <p className="text-gray-600 font-['Poppins'] text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold font-['Poppins'] text-slate-950 mb-2">Join Our Seller Community</h3>
              <p className="text-gray-600 font-['Poppins']">Get support, best practices, and growth tips from thousands of active sellers.</p>
            </div>
            <Link href="/client/auth/register" className="py-3 px-6 rounded-lg font-semibold font-['Poppins'] border border-gray-300 hover:bg-gray-100">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


