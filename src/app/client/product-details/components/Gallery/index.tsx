'use client';

import React, { useState } from 'react';

/**
 * Gallery component for product images
 * 
 * @description Displays product images with thumbnail navigation
 * and zoom functionality
 */
export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const productImages = [
    '/card/image/img1.jpg',
    '/hero/images/image2.jpg',
    '/hero/images/image3.png',
    '/hero/images/image4.png',
  ];

  return (
    <section className="father w-full py-20 bg-white" role="region" aria-labelledby="gallery-heading" data-layer="father">
      {/* father = full width gallery section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        {/* daughter = design holder for entire gallery section */}
        
        <div className="layer-1 space-y-4" data-layer="1">
          {/* layer-1 = main content container */}
          
          <div className="layer-2 aspect-square rounded-xl overflow-hidden bg-gray-100" data-layer="2">
            {/* layer-2 = main image container */}
            
            <div className="layer-3" data-layer="3">
              {/* layer-3 = main image wrapper */}
              
              <div className="layer-4" data-layer="4">
                {/* layer-4 = main image */}
                <img
                  src={productImages[selectedImage]}
                  alt={`Product image ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="layer-2 flex gap-2" data-layer="2">
            {/* layer-2 = thumbnails container */}
            
            <div className="layer-3" data-layer="3">
              {/* layer-3 = thumbnails wrapper */}
              
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`layer-4 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  data-layer="4"
                >
                  {/* layer-4 = individual thumbnail */}
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
