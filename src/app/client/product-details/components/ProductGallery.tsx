'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="inline-flex flex-col justify-center items-start gap-8">
      {/* Main Image */}
      <Image
        src={mainImage}
        alt="Product main image"
        width={471}
        height={384}
        className="w-[471px] h-96 rounded-[20px] object-cover"
        loading="lazy"
      />

      {/* Thumbnails */}
      <div className="self-stretch h-28 inline-flex justify-start items-start gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex-1 self-stretch rounded-[20px] border cursor-pointer transition-all duration-200 ${
              mainImage === image 
                ? 'border-fuchsia-500' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              width={146}
              height={120}
              className="w-full h-full object-cover rounded-[20px]"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;


