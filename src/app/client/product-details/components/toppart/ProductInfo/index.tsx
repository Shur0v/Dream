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
  className?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, className }) => {
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState('Lemon');
  const [selectedSize, setSelectedSize] = useState('M');

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  // Visual map for color swatches (keeps layout unchanged while feeling professional)
  const colorCodeMap: Record<string, string> = {
    Lemon: '#FCD34D',
    Red: '#EF4444',
    Green: '#16A34A',
    Yellow: '#FDE047',
    Blue: '#3B82F6',
    Black: '#000000',
    White: '#FFFFFF',
    Platinum: '#E5E4E2',
    'Matte Black': '#28282B',
    Sage: '#87AE73',
  };

  return (
    <div
      className={`w-full bg-sky-50 rounded-xl flex flex-col gap-8 p-4 sm:p-6 ${className || ''}`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Product Title */}
          <div className="text-black text-2xl font-semibold font-['Poppins'] leading-normal tracking-wide">
            {product.name}
          </div>

          {/* Rating and Stock */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
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
              <div className="opacity-50 text-black text-sm font-normal font-['Poppins'] leading-tight">
                ({product.reviewsCount} Reviews)
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-black/50 pl-4">
              <div className="opacity-60 text-green-500 text-sm font-normal font-['Poppins'] leading-tight">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-black text-sm font-normal font-['Poppins'] leading-tight">
          {product.description}
        </div>

        {/* Price */}
        <div className="text-black text-2xl font-medium font-['Poppins'] leading-normal tracking-wide">
          ${product.price.toFixed(2)}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1 text-neutral-700 text-base font-normal font-['Poppins'] leading-tight tracking-tight">
          <div>Category: {product.category}</div>
          <div>Order id: {product.orderId}</div>
          <div>Seller: {product.seller}</div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Color Selection */}
          <div className="flex flex-col gap-2">
            <div className="text-zinc-600 text-sm font-normal font-['Poppins'] leading-tight">
              Color:
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-2 min-w-max">
                {product.colors.map((color) => {
                  const colorCode = colorCodeMap[color] || '#CCCCCC';
                  const truncatedName = color.length > 3 ? `${color.substring(0, 3)}..` : color;
                  return (
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
                        className={`w-12 h-12 rounded border-2 ${
                          selectedColor === color ? 'border-fuchsia-500' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: colorCode }}
                      />
                      <span
                        className={`text-xs font-normal font-['Poppins'] whitespace-nowrap text-center ${
                          selectedColor === color ? 'text-zinc-900' : 'text-zinc-900/80 group-hover:text-zinc-900'
                        }`}
                      >
                        {truncatedName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-black text-xl font-normal font-['Poppins'] leading-tight tracking-wide">
                Size:
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 text-neutral-50'
                        : 'outline outline-1 outline-black/50 text-black'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span className="text-base font-medium font-['Poppins'] leading-tight">{size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity and Action Buttons Row */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-9 rounded-l border border-black/50 border-r-0 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                  type="button"
                >
                  <Minus className="w-3 h-3 text-black" />
                </button>
                <div className="w-12 h-9 border border-black/50 flex items-center justify-center text-black text-base font-medium font-['Poppins']">
                  {quantity.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-9 rounded-r bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 flex items-center justify-center hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors"
                  aria-label="Increase quantity"
                  type="button"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>

              {/* Add to Cart and Wishlist */}
              <div className="flex flex-wrap items-center gap-4 ml-auto justify-end">
                <button className="px-4 py-2.5 bg-fuchsia-500 rounded flex items-center gap-1.5 hover:bg-fuchsia-600 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="text-white text-base font-medium font-['Poppins'] leading-none">Add to Cart</span>
                </button>
                <button className="w-10 h-10 rounded border border-black/50 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0">
                  <Heart className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* Buy Now Button */}
            <button className="w-full px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded flex justify-center items-center gap-2.5 hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors">
              <span className="text-neutral-50 text-base font-medium font-['Poppins'] leading-normal">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
