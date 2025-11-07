/**
 * @fileoverview Wishlist Dropdown Component
 * 100% clone of the exact design provided with proper data-layer properties
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Trash2 } from 'lucide-react';
import { products, Product } from '@/lib/productData';

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  orderId: string;
}

// Convert products to wishlist items format
const getWishlistItems = (): WishlistItem[] => {
  // Using first 10 products from productData.ts as wishlist items
  return products.slice(0, 10).map((product: Product, index: number) => ({
    id: product.id,
    name: product.name,
    image: product.image,
    orderId: `#${String(10000000 + product.id).padStart(8, '0')}${String.fromCharCode(65 + index)}`,
  }));
};

interface WishlistDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items?: WishlistItem[];
  onRemoveItem?: (itemId: number) => void;
}

export const WishlistDropdown: React.FC<WishlistDropdownProps> = ({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
}) => {
  // Local state for wishlist items
  const [localItems, setLocalItems] = useState<WishlistItem[]>(getWishlistItems());

  // Update local state when items prop changes
  useEffect(() => {
    if (items.length > 0) {
      setLocalItems(items);
    }
  }, [items]);

  const wishlistItems = localItems;

  const handleRemoveItem = (itemId: number) => {
    // Update local state
    setLocalItems(prevItems => prevItems.filter(item => item.id !== itemId));
    
    // Call parent callback if provided
    onRemoveItem?.(itemId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile/overlay effect */}
      <div 
        className="daughter fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-xs z-40" 
        onClick={onClose}
        data-layer="daughter"
      />
      
      {/* Wishlist Dropdown */}
      <div className="father fixed top-0 right-0 h-screen w-[90vw] flex justify-center items-start pt-20 z-50" role="dialog" data-layer="father">
        {/* father = wishlist dropdown positioned from right side, 90vw width, horizontally centered */}
        
        <div className="layer-1 relative bg-white rounded-xl w-[465px] max-w-[465px] flex flex-col" data-layer="1">
          {/* layer-1 = wishlist dropdown container with exact design */}
          
          <div className="layer-2 p-4 relative bg-white rounded-xl inline-flex flex-col justify-start items-start gap-8" data-layer="2">
            {/* layer-2 = main content container */}
            
            {/* Header Section */}
            <div className="layer-3 self-stretch flex flex-col justify-start items-start gap-3" data-layer="3">
              {/* layer-3 = header section */}
              
              <div className="layer-4 self-stretch py-4 border-b border-stone-300 inline-flex justify-start items-center gap-2.5" data-layer="4">
                {/* layer-4 = title section */}
                
                <div className="layer-5 text-center justify-start text-zinc-800 text-2xl font-medium font-['Poppins'] leading-6" data-layer="5">
                  {/* layer-5 = wishlist title */}
                  Wishlist
                </div>
              </div>
              
              <div className="layer-6 self-stretch justify-start text-zinc-800 text-base font-normal font-['Poppins'] leading-4" data-layer="6">
                {/* layer-6 = shipment text */}
                Shipment 1
              </div>
            </div>

            {/* Wishlist Items - Scrollable */}
            <div className="layer-7 self-stretch flex flex-col gap-0 max-h-[60vh] overflow-y-auto" data-layer="7">
              {/* layer-7 = wishlist items container */}
              
              {wishlistItems.map((item) => (
                <div key={item.id} className="layer-8 self-stretch inline-flex justify-between items-center py-2" data-layer="8">
                  {/* layer-8 = individual wishlist item */}
                  
                  <div className="layer-9 self-stretch flex justify-start items-center gap-6" data-layer="9">
                    {/* layer-9 = item info container */}
                    
                    {/* Product Image */}
                    <div className="layer-10 w-16 h-16 bg-fuchsia-500/10 rounded-lg relative overflow-hidden flex-shrink-0" data-layer="10">
                      {/* layer-10 = product image container */}
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="layer-11 w-64 inline-flex flex-col justify-start items-start gap-4" data-layer="11">
                      {/* layer-11 = product info container */}
                      
                      <div className="layer-12 self-stretch h-14 flex flex-col justify-start items-start gap-1.5" data-layer="12">
                        {/* layer-12 = product details */}
                        
                        <div className="layer-13 self-stretch justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-8" data-layer="13">
                          {/* layer-13 = product name */}
                          {item.name}
                        </div>
                        
                        <div className="layer-14 self-stretch justify-start text-neutral-700 text-base font-normal font-['Poppins'] leading-5 tracking-tight" data-layer="14">
                          {/* layer-14 = order id */}
                          Order id: {item.orderId}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="layer-15 w-8 h-8 relative overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
                    aria-label="Remove from wishlist"
                    data-layer="15"
                  >
                    {/* layer-15 = delete button */}
                    <Trash2 className="w-6 h-6 text-red-600" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="layer-17 w-6 h-6 absolute right-4 top-4 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
              aria-label="Close wishlist"
              data-layer="17"
            >
              {/* layer-17 = close button */}
              <X className="w-4 h-4 text-zinc-600" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

