'use client';

import React, { useState } from 'react';
import { Minus, Plus, Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductInfoProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewsCount: number;
    description: string;
    category: string;
    orderId: string;
    seller: string;
    colors: string[];
    sizes: string[];
    inStock: boolean;
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState('Lemon');
  const [selectedSize, setSelectedSize] = useState('M');

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  // Visual map for color swatches (keeps layout unchanged while feeling professional)
  const colorDotClass: Record<string, string> = {
    Lemon: 'bg-yellow-400',
    Red: 'bg-red-500',
    Green: 'bg-green-600',
    Yellow: 'bg-yellow-300',
    Blue: 'bg-blue-500',
    Black: 'bg-black',
    White: 'bg-white ring-1 ring-gray-300',
  };

  return (
    <div className="w-[468px] p-6 bg-sky-50 rounded-xl inline-flex flex-col justify-center items-end gap-12 overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="w-96 flex flex-col justify-start items-start gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {/* Product Title */}
              <div className="self-stretch justify-start text-black text-2xl font-semibold font-['Poppins'] leading-normal tracking-wide">
                {product.name}
              </div>
              
              {/* Rating and Stock */}
              <div className="inline-flex justify-center items-center gap-4">
                <div className="flex justify-center items-center gap-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16}
                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        className="text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="opacity-50 justify-start text-black text-sm font-normal font-['Poppins'] leading-tight">
                    ({product.reviewsCount} Reviews)
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 border-l border-black/50 pl-4">
                  {/* <div className="w-4 h-0 origin-top-left rotate-90 opacity-50 outline-1 outline-offset-[-0.50px] outline-black"></div> */}
                  <div className="opacity-60 justify-start text-green-500 text-sm font-normal font-['Poppins'] leading-tight">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="w-96 justify-start text-black text-sm font-normal font-['Poppins'] leading-tight">
              {product.description}
            </div>
            
            {/* Price */}
            <div className="self-stretch justify-start text-black text-2xl font-medium font-['Poppins'] leading-normal tracking-wide">
              ${product.price.toFixed(2)}
            </div>
            
            {/* Product Details */}
            <div className="self-stretch h-20 flex flex-col justify-between items-center">
              <div className="self-stretch justify-start text-neutral-700 text-base font-normal font-['Poppins'] leading-tight tracking-tight">
                Category: {product.category}
              </div>
              <div className="self-stretch justify-start text-neutral-700 text-base font-normal font-['Poppins'] leading-tight tracking-tight">
                Order id: {product.orderId}
              </div>
              <div className="self-stretch justify-start text-neutral-700 text-base font-normal font-['Poppins'] leading-tight tracking-tight">
                Seller: {product.seller}
              </div>
            </div>
          </div>
        </div>
        
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          {/* Color Selection */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-zinc-600 text-sm font-normal font-['Poppins'] leading-tight">Color:</div>
            <div className="self-stretch overflow-x-auto">
              <div className="flex gap-4 pb-2 min-w-max">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`group relative flex flex-col items-center gap-2 transition-colors cursor-pointer ${
                      selectedColor === color ? 'border-b-2 border-fuchsia-500' : 'border-b-2 border-transparent'
                    }`}
                    aria-pressed={selectedColor === color}
                  >
                    <div
                      className={`w-8 h-8 rounded border-2 ${
                        colorDotClass[color] ?? 'bg-gray-300'
                      } ${
                        selectedColor === color ? 'border-fuchsia-500' : 'border-gray-300'
                      }`}
                    />
                    <span className={`text-xs font-normal font-['Poppins'] whitespace-nowrap ${
                      selectedColor === color ? 'text-zinc-900' : 'text-zinc-900/80 group-hover:text-zinc-900'
                    }`}>
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Size and Quantity **/}
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-6">
              <div className="justify-start text-black text-xl font-normal font-['Poppins'] leading-tight tracking-wide">Size:</div>
              <div className="flex justify-start items-start gap-3">
                {product.sizes.map((size) => (
                  <div 
                    key={size}
                    className={`w-8 h-8 relative rounded overflow-hidden cursor-pointer ${
                      selectedSize === size 
                        ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-500' 
                        : 'outline-1 outline-black/50'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <div className={`${
                      selectedSize === size ? 'text-neutral-50' : 'text-black'
                    } text-base font-medium font-['Poppins'] leading-tight absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                      {size}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex justify-start items-start">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-7 h-8 relative rounded-tl-[2.91px] rounded-bl-[2.91px] outline-[0.73px] outline-offset-[-0.73px] outline-black/50 overflow-hidden hover:bg-gray-50 transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <div className="w-11 self-stretch relative border-t border-b border-black/50 overflow-hidden flex items-center justify-center">
                <div className="justify-start text-black text-base font-medium font-['Poppins'] leading-none">
                  {quantity.toString().padStart(2, '0')}
                </div>
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-7 h-8 relative bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-tr-[2.91px] rounded-br-[2.91px] overflow-hidden hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="self-stretch flex flex-col justify-center items-start gap-6">
        <div className="inline-flex justify-start items-center gap-6">
          <button className="px-12 py-2.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded flex justify-center items-center gap-2.5 hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors">
            <div className="justify-start text-neutral-50 text-base font-medium font-['Poppins'] leading-normal">
              Buy Now
            </div>
          </button>
          <button className="w-40 self-stretch px-4 py-2.5 bg-fuchsia-500 rounded flex justify-center items-center gap-1.5 hover:bg-fuchsia-600 transition-colors">
            <ShoppingCart className="w-5 h-5 text-white" />
            <div className="justify-start text-white text-base font-medium font-['Poppins'] leading-none">
              Add to Cart
            </div>
          </button>
          <button className="w-10 h-10 relative rounded outline-1 outline-black/50 overflow-hidden hover:bg-gray-50 transition-colors">
            <Heart className="w-8 h-8 left-[4px] top-[4px] absolute text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;


