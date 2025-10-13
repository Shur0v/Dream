'use client';

import React from 'react';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

/**
 * Features Section Component
 * Displays key service features at the bottom
 */
export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      icon: Truck,
      title: 'Fast Delivery',
      description: 'We will deliver your orders in 4-6 days with fastest courier service',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      icon: Shield,
      title: 'Secure Payment',
      description: 'We provide safe and secure payment gateway for complete secure transactions',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      icon: RotateCcw,
      title: 'Easy Return',
      description: 'We provide easy return policy. Return product within 7 days in case of any issues',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 4,
      icon: Headphones,
      title: '24/7 Customer Support',
      description: 'Our customer care is available at your service 24/7 via email or phone call',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-4`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


