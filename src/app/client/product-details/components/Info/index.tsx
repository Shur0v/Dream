'use client';

import React, { useState } from 'react';

/**
 * Info component for product details and purchase options
 * 
 * @description Displays product information, pricing, variants,
 * and add to cart functionality
 */
export default function Info() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('default');

  const product = {
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 128,
    description: 'High-quality wireless headphones with noise cancellation, premium sound quality, and comfortable design perfect for all-day use.',
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Quick charge technology',
      'Premium materials',
      'Comfortable fit'
    ],
    variants: [
      { id: 'black', name: 'Black', color: 'bg-black' },
      { id: 'white', name: 'White', color: 'bg-white border' },
      { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    ]
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', { quantity, variant: selectedVariant });
    // TODO: Implement add to cart functionality
  };

  const handleAddToWishlist = () => {
    console.log('Added to wishlist');
    // TODO: Implement add to wishlist functionality
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">${product.price}</span>
        <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
          Save ${(product.originalPrice - product.price).toFixed(2)}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* Features */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
        <ul className="space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Variants */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Color:</h3>
        <div className="flex gap-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant.id)}
              className={`w-10 h-10 rounded-full ${variant.color} border-2 transition-all duration-200 ${
                selectedVariant === variant.id 
                  ? 'border-gray-900' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              title={variant.name}
            />
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Quantity:</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <span className="w-16 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToWishlist}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          ♡ Wishlist
        </button>
      </div>
    </div>
  );
}
