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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={productImages[selectedImage]}
          alt={`Product image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnail Images */}
      <div className="flex gap-2">
        {productImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === index 
                ? 'border-blue-500' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
