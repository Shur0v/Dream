'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="father inline-flex flex-col justify-center items-start gap-8" role="region" aria-labelledby="product-gallery-heading" data-layer="father">
      {/* father = full width product gallery section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire product gallery section */}
        
        <div className="layer-1 w-full flex flex-col justify-center items-start gap-8" role="main" data-layer="1">
          {/* layer-1 = main gallery container */}
          
          <div className="layer-2 w-[471px] h-96 relative" data-layer="2">
            {/* layer-2 = main image container */}
            
            <Image
              src={mainImage}
              alt="Product main image"
              width={471}
              height={384}
              className="layer-3 w-full h-full rounded-[20px] object-cover"
              loading="lazy"
              data-layer="3"
            />
            {/* layer-3 = main product image */}
          </div>

          <div className="layer-4 self-stretch h-28 inline-flex justify-start items-start gap-4" data-layer="4">
            {/* layer-4 = thumbnails container */}
            
            {images.map((image, index) => (
              <div
                key={index}
                className={`layer-5 flex-1 self-stretch rounded-[20px] border cursor-pointer transition-all duration-200 ${
                  mainImage === image 
                    ? 'border-fuchsia-500' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setMainImage(image)}
                role="button"
                aria-label={`View product image ${index + 1}`}
                tabIndex={0}
                data-layer="5"
              >
                {/* layer-5 = individual thumbnail container */}
                
                <Image
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  width={146}
                  height={120}
                  className="layer-6 w-full h-full object-cover rounded-[20px]"
                  loading="lazy"
                  data-layer="6"
                />
                {/* layer-6 = thumbnail image */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
