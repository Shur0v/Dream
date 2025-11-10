'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  className?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, className }) => {
  const fallbackImages = images.length ? images : ['/images/product1.jpg'];
  const displayImages = fallbackImages.slice(0, 3);
  const [mainImage, setMainImage] = useState(displayImages[0]);

  return (
    <div
      className={`father w-full flex flex-col justify-center items-start gap-6 ${className || ''}`}
      role="region"
      aria-labelledby="product-gallery-heading"
      data-layer="father"
    >
      {/* father = full width product gallery section */}
      <div className="daughter w-full" data-layer="daughter">
        {/* daughter = design holder for entire product gallery section */}
        <div className="layer-1 w-full flex flex-col justify-center items-start gap-6" role="main" data-layer="1">
          {/* layer-1 = main gallery container */}
          <div
            className="layer-2 w-full rounded-[20px] bg-gray-100 relative overflow-hidden aspect-[471/384] max-w-full md:max-w-[471px]"
            data-layer="2"
          >
            {/* layer-2 = main image container */}
            <Image
              src={mainImage}
              alt="Product main image"
              fill
              className="layer-3 object-cover rounded-[20px]"
              sizes="(max-width: 768px) 100vw, 471px"
              loading="lazy"
              data-layer="3"
            />
            {/* layer-3 = main product image */}
          </div>

          <div
            className="layer-4 w-full grid grid-cols-3 gap-2 sm:gap-3 md:gap-4"
            data-layer="4"
          >
            {/* layer-4 = thumbnails container */}
            {displayImages.map((image, index) => {
              const isActive = mainImage === image;
              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`layer-5 rounded-[20px] border transition-all duration-200 ${
                    isActive ? 'border-fuchsia-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMainImage(image)}
                  aria-label={`View product image ${index + 1}`}
                  data-layer="5"
                >
                  {/* layer-5 = individual thumbnail container */}
                  <div className="relative w-full aspect-[146/120] rounded-[20px] overflow-hidden">
                    <Image
                      src={image}
                      alt={`Product thumbnail ${index + 1}`}
                      fill
                      className="layer-6 object-cover rounded-[20px]"
                      sizes="(max-width: 768px) 25vw, 146px"
                      loading="lazy"
                      data-layer="6"
                    />
                  </div>
                  {/* layer-6 = thumbnail image */}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
