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
    <section className="father w-full py-24 relative bg-fuchsia-500 overflow-hidden" role="region" aria-labelledby="features-heading" data-layer="father">
      {/* father = full width features section with background */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire features section */}
        
        <div className="layer-1 w-full max-w-[1320px] mx-auto" role="main" data-layer="1">
          {/* layer-1 = main content container with max width constraint */}
          
          <div className="layer-2 w-full flex justify-between items-stretch gap-6" data-layer="2">
            {/* layer-2 = features grid container */}
            
            {features.map((feature) => (
              <div
                key={feature.id}
                className="layer-3 w-[312px] p-8 bg-white rounded-xl inline-flex flex-col justify-center items-start gap-3 flex-shrink-0"
                role="article"
                aria-labelledby={`feature-title-${feature.id}`}
                data-layer="3"
              >
                {/* layer-3 = individual feature card */}
                
                <div className="layer-4 w-11 h-11 relative" data-layer="4">
                  {/* layer-4 = feature icon container */}
                  <Image 
                    src={feature.icon} 
                    alt={`${feature.title} icon`} 
                    width={44} 
                    height={44}
                    loading="lazy"
                  />
                </div>
                
                <div className="layer-5 self-stretch flex flex-col justify-start items-start" data-layer="5">
                  {/* layer-5 = feature content wrapper */}
                  
                  <div className="layer-6 self-stretch flex flex-col justify-start items-start gap-4" data-layer="6">
                    {/* layer-6 = feature text content container */}
                    
                    <div 
                      className="layer-7 self-stretch h-6 justify-center text-neutral-600 text-xl font-bold font-['Poppins'] leading-7"
                      id={`feature-title-${feature.id}`}
                      role="heading"
                      aria-level={3}
                      data-layer="7"
                    >
                      {/* layer-7 = feature title */}
                      {feature.title}
                    </div>
                    
                    <div className="layer-8 self-stretch justify-center text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-snug" data-layer="8">
                      {/* layer-8 = feature description */}
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
          alt="Decorative corner element"
          width={120}
          height={120}
          className="layer-9 pointer-events-none select-none absolute top-0 right-0"
          aria-hidden="true"
          priority
          data-layer="9"
        />
        {/* layer-9 = top right decorative element */}
        
        <Image
          src="/featuressection/bottomleft.png"
          alt="Decorative corner element"
          width={120}
          height={120}
          className="layer-10 pointer-events-none select-none absolute bottom-0 left-0"
          aria-hidden="true"
          priority
          data-layer="10"
        />
        {/* layer-10 = bottom left decorative element */}
      </div>
    </section>
  );
}


