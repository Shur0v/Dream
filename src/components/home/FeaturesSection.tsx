'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Features Section
 * Matches the provided design and mirrors BestSelling card sizing/spacing
 */
export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: 'Fast Delivery',
      description:
        'Get your orders delivered quickly and safely, ensuring no time is wasted.',
      icon: '/featuressection/fastdelivery.svg',
    },
    {
      id: 2,
      title: 'Secure Payment',
      description:
        'Pay via bKash, Nagad, or credit/debit card with full encryption and safety.',
      icon: '/featuressection/securepayment.svg',
    },
    {
      id: 3,
      title: 'Easy Return',
      description:
        'Not satisfied? Enjoy hassle-free returns or exchanges with no complications.',
      icon: '/featuressection/easyreturn.svg',
    },
    {
      id: 4,
      title: '24/7 Customer Support',
      description:
        'Our expert support team is available round-the-clock to assist you anytime.',
      icon: '/featuressection/customersupport.svg',
    },
  ];

  return (
    <section className="w-full py-24 relative bg-fuchsia-500 overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto">
        <div className="w-full flex justify-between items-stretch gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="w-[312px] p-8 bg-white rounded-xl inline-flex flex-col justify-center items-start gap-3 flex-shrink-0"
            >
              <div className="w-11 h-11 relative">
                <Image src={feature.icon} alt={feature.title} width={44} height={44} />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch h-6 justify-center text-neutral-600 text-xl font-bold font-['Poppins'] leading-7">
                    {feature.title}
                  </div>
                  <div className="self-stretch justify-center text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-snug">
                    {feature.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* corner decorations */}
      <Image
        src="/featuressection/topright.png"
        alt=""
        width={120}
        height={120}
        className="pointer-events-none select-none absolute top-0 right-0"
        aria-hidden
        priority
      />
      <Image
        src="/featuressection/bottomleft.png"
        alt=""
        width={120}
        height={120}
        className="pointer-events-none select-none absolute bottom-0 left-0"
        aria-hidden
        priority
      />
    </section>
  );
}


