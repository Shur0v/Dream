/**
 * @fileoverview Shopping Cart Dropdown Component
 * 100% clone of the exact design provided with proper data-layer properties
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus, X, Trash2 } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

// Sample data with proper image paths from public/common/cart/
const SAMPLE_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    quantity: 2,
    price: 89.99,
    image: '/common/cart/image1.png'
  },
  {
    id: '2',
    name: 'Smart Watch Series 8',
    quantity: 1,
    price: 299.99,
    image: '/common/cart/image2.jpg'
  },
  {
    id: '3',
    name: 'Gaming Mechanical Keyboard',
    quantity: 3,
    price: 149.99,
    image: '/common/cart/image3.png'
  },
  {
    id: '4',
    name: 'Wireless Mouse Pro',
    quantity: 1,
    price: 79.99,
    image: '/common/cart/image4.png'
  },
  {
    id: '5',
    name: 'USB-C Hub Adapter',
    quantity: 2,
    price: 45.99,
    image: '/common/cart/image5.jpg'
  },
  {
    id: '6',
    name: 'Portable Power Bank',
    quantity: 1,
    price: 59.99,
    image: '/common/cart/image6.png'
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    quantity: 2,
    price: 129.99,
    image: '/common/cart/image7.jpg'
  },
  {
    id: '8',
    name: 'Phone Case Premium',
    quantity: 1,
    price: 24.99,
    image: '/common/cart/image8.png'
  },
  {
    id: '9',
    name: 'Screen Protector Glass',
    quantity: 3,
    price: 12.99,
    image: '/common/cart/image9.png'
  }
];

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onCheckout?: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({
  isOpen,
  onClose,
  items = [],
  onQuantityChange,
  onRemoveItem,
  onCheckout,
}) => {
  // Local state for cart items
  const [localItems, setLocalItems] = useState<CartItem[]>(SAMPLE_ITEMS);
  // State for delete confirmation modal
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  // State for checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Update local state when items prop changes
  useEffect(() => {
    if (items.length > 0) {
      setLocalItems(items);
    }
  }, [items]);

  const cartItems = localItems;

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return; // Allow 0 quantity
    
    // Update local state
    setLocalItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    
    // Call parent callback if provided
    onQuantityChange?.(itemId, newQuantity);
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // Update local state
      setLocalItems(prevItems => prevItems.filter(item => item.id !== itemToDelete));
      
      // Call parent callback if provided
      onRemoveItem?.(itemToDelete);
      
      // Close confirmation modal
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleCheckoutClick = () => {
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = (formData: {
    name: string;
    phoneNumber: string;
    email: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  }) => {
    // Close checkout modal
    setIsCheckoutOpen(false);
    // Close cart dropdown
    onClose();
    // Call parent callback if provided
    onCheckout?.();
    // Log form data (you can replace this with API call)
    console.log('Checkout form data:', formData);
    console.log('Cart items:', cartItems);
    console.log('Total price:', totalPrice);
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
      
      {/* Cart Dropdown */}
      <div className="father fixed top-0 right-0 h-screen w-[90vw] flex justify-center items-start pt-20 z-50" role="dialog" data-layer="father">
        {/* father = cart dropdown positioned from right side, 80vw width, horizontally centered */}
        
        <div className="layer-1 relative bg-white rounded-xl h-[80vh] w-full max-w-md flex flex-col" data-layer="1">
          {/* layer-1 = cart dropdown container with exact design */}
          
          {/* Header Section */}
          <div className="layer-2 p-4 flex flex-col justify-start items-start gap-3" data-layer="2">
            {/* layer-2 = header section */}
            
            <div className="layer-3 self-stretch py-4 border-b border-stone-300 inline-flex justify-start items-center gap-2.5" data-layer="3">
              {/* layer-3 = title section */}
              
              <div className="layer-4 text-center justify-start text-zinc-800 text-2xl font-medium font-['Poppins'] leading-normal" data-layer="4">
                {/* layer-4 = cart title */}
                Shopping Cart
              </div>
            </div>
            
            <div className="layer-6 self-stretch justify-start text-zinc-800 text-base font-normal font-['Poppins'] leading-none" data-layer="6">
              {/* layer-6 = shipment text */}
              Shipment 1
            </div>
          </div>

          {/* Cart Items - Scrollable */}
          <div className="layer-7 flex-1 overflow-y-auto overflow-x-hidden px-4" data-layer="7">
            {/* layer-7 = cart items scrollable container */}
            
            <div className="layer-8 flex flex-col gap-6 py-4" data-layer="8">
              {/* layer-8 = cart items wrapper */}
              
              {cartItems.map((item) => (
                <div key={item.id} className="layer-9 flex flex-col gap-4" data-layer="9">
                  {/* layer-9 = individual cart item */}
                  
                  <div className="flex justify-start items-end gap-4">
                    {/* Item Info */}
                    <div className="layer-10 flex-1 flex flex-col justify-start items-start gap-4" data-layer="10">
                      {/* layer-10 = item info container */}
                      
                      <div className="layer-11 self-stretch h-auto flex flex-col justify-start items-start gap-1.5" data-layer="11">
                        {/* layer-11 = item details */}
                        
                        <div className="layer-12 self-stretch justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-tight" data-layer="12">
                          {/* layer-12 = item name */}
                          {item.name}
                        </div>
                      </div>
                      
                      {/* Quantity Controls and Price */}
                      <div className="layer-14 self-stretch flex justify-start items-center gap-4 flex-wrap" data-layer="14">
                        {/* layer-14 = quantity and price container */}
                        
                        {/* Quantity Controls */}
                        <div className="layer-15 flex justify-start items-start" data-layer="15">
                          {/* layer-15 = quantity controls */}
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="layer-16 w-7 h-8 relative rounded-tl-[2.91px] rounded-bl-[2.91px] outline-[0.73px] outline-offset-[-0.73px] outline-black/50 overflow-hidden hover:bg-gray-50 transition-colors flex items-center justify-center"
                            aria-label="Decrease quantity"
                            data-layer="16"
                          >
                            {/* layer-16 = minus button */}
                            <Minus className="w-3 h-3 text-black" />
                          </button>
                          
                          <div className="layer-17 w-11 h-8 relative border-t border-b border-black/50 overflow-hidden flex items-center justify-center" data-layer="17">
                            {/* layer-17 = quantity display */}
                            <div className="text-black text-base font-medium font-['Poppins'] leading-none">
                              {item.quantity.toString().padStart(2, '0')}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="layer-18 w-7 h-8 relative bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-tr-[2.91px] rounded-br-[2.91px] overflow-hidden hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors flex items-center justify-center"
                            aria-label="Increase quantity"
                            data-layer="18"
                          >
                            {/* layer-18 = plus button */}
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="layer-19 flex justify-start items-center" data-layer="19">
                          {/* layer-19 = price container */}
                          
                          <div className="layer-20 w-6 h-6" data-layer="20">
                            {/* layer-20 = currency icon */}
                            <div className="w-6 h-6 text-black text-lg">৳</div>
                          </div>
                          
                          <div className="layer-21 justify-start text-black text-base font-medium font-['Poppins'] leading-normal" data-layer="21">
                            {/* layer-21 = price text */}
                            {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Item Image */}
                    <div className="layer-22 w-28 h-28 flex-shrink-0 relative" data-layer="22">
                      {/* layer-22 = item image container */}
                      
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                      />
                      
                      {/* Delete Button - Top Right Corner with Glassy Background */}
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="absolute top-1 right-1 w-7 h-7 rounded-md bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:bg-white/90 transition-all flex items-center justify-center z-10"
                        aria-label="Remove from cart"
                        data-layer="15"
                      >
                        {/* layer-15 = delete button with glassy effect */}
                        <Trash2 className="w-4 h-4 text-red-600" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Button - Sticky Bottom */}
          <div className="layer-23 p-4 bg-transparent" data-layer="23">
            {/* layer-23 = checkout button sticky container */}
            
            <button
              onClick={handleCheckoutClick}
              className="layer-24 w-full h-14 px-7 py-3 bg-fuchsia-500 rounded-xl flex justify-center items-center gap-1.5 hover:bg-fuchsia-600 transition-colors"
              data-layer="24"
            >
              {/* layer-24 = checkout button */}
              
              <div className="layer-25 justify-start text-white text-base font-semibold font-['Poppins'] leading-none" data-layer="25">
                {/* layer-25 = checkout button text */}
                Checkout - ৳{totalPrice.toFixed(2)}
              </div>
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="layer-5 w-6 h-6 absolute top-4 right-4 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label="Close cart"
            data-layer="5"
          >
            {/* layer-5 = close button */}
            <X className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 bg-opacity-50 z-[60]"
            onClick={handleCancelDelete}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold font-['Poppins'] text-slate-950 mb-2">
                Remove Item
              </h3>
              <p className="text-base font-normal font-['Poppins'] text-neutral-700 mb-6">
                Are you sure you want to remove this item from your cart?
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-base font-medium font-['Poppins'] text-neutral-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-base font-medium font-['Poppins'] text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
      />
    </>
  );
};
