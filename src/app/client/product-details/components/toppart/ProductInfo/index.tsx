'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Heart, ShoppingCart, Star } from 'lucide-react';
import { CheckoutModal } from '@/components/cart/CheckoutModal';
import { apiService } from '@/services/api';
import { stateFirstPaymentService } from '@/services/payment';

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
    colorDetailsMap?: Record<string, { name: string; hexCode: string }>;
    sizes: string[];
    inStock: boolean;
  };
  images?: string[];
  className?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, images = [], className }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? 'M');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleBuyNow = () => {
    // Calculate total price
    const totalPrice = product.price * quantity;
    
    // Store product data for payment
    const orderId = `product-${product.id}-${Date.now()}`;
    sessionStorage.setItem(`order_${orderId}`, JSON.stringify({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      images: images,
      totalPrice: totalPrice,
    }));

    // Redirect to payment checkout page
    router.push(`/client/payment/checkout?orderId=${orderId}&type=product&price=${totalPrice}&productId=${product.id}&quantity=${quantity}&productName=${encodeURIComponent(product.name)}`);
  };

  const handleCheckoutSubmit = async (formData: {
    name: string;
    phoneNumber: string;
    email: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      // Get or create a temporary userId (in production, this would come from auth)
      const tempUserId = `user-${Date.now()}`;
      
      // Calculate total amount
      const totalAmount = product.price * quantity;
      
      // Get product image (first image or placeholder)
      const productImage = images && images.length > 0 ? images[0] : '/placeholder-image.png';
      
      // Create order item with product snapshot
      const orderItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          sellerId: product.seller,
          images: images.length > 0 ? images : ['/placeholder-image.png'],
        },
        quantity: quantity,
        price: product.price,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      };
      
      // Create shipping address from form data
      const shippingAddress = {
        street: `${formData.thana}, ${formData.upazila}`,
        city: formData.district,
        state: formData.district,
        zipCode: formData.postOffice,
        country: 'Bangladesh',
      };
      
      // Create order ID for payment
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare payment data for State First
      const paymentData = {
        amount: totalAmount,
        currency: 'BDT',
        orderId: orderId,
        customerName: formData.name,
        customerPhone: formData.phoneNumber,
        customerEmail: formData.email,
        customerAddress: {
          district: formData.district,
          upazila: formData.upazila,
          thana: formData.thana,
          postOffice: formData.postOffice,
        },
        items: [{
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          price: product.price,
        }],
        returnUrl: `${window.location.origin}/client/payment/success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/client/payment/cancel?orderId=${orderId}`,
      };

      // Store order data in sessionStorage
      sessionStorage.setItem(`order_${orderId}`, JSON.stringify({
        orderData: {
          userId: tempUserId,
          items: [orderItem],
          shippingAddress: shippingAddress,
          paymentMethod: 'State First Payment',
          notes: JSON.stringify({
            customerName: formData.name,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            district: formData.district,
            upazila: formData.upazila,
            thana: formData.thana,
            postOffice: formData.postOffice,
          }),
        },
        paymentData: paymentData,
      }));

      // Create payment session with State First
      const paymentResponse = await stateFirstPaymentService.createPaymentSession(paymentData);
      
      if (paymentResponse.success && paymentResponse.paymentUrl) {
        // Redirect to State First payment page
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error(paymentResponse.error || 'Failed to create payment session');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again. Error: ' + (error.message || 'Unknown error'));
      setIsCheckoutOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Visual map for color swatches - use database colors if available, otherwise fallback to hardcoded map
  const fallbackColorCodeMap: Record<string, string> = {
    Lemon: '#FCD34D',
    Red: '#EF4444',
    Green: '#16A34A',
    Yellow: '#FDE047',
    Blue: '#3B82F6',
    Black: '#0B0B0B',
    White: '#F8FAFC',
    Platinum: '#E5E4E2',
    'Matte Black': '#1F1F20',
    Sage: '#87AE73',
    Silver: '#C5C9CC',
    'Space Gray': '#868686',
    'Space Grey': '#868686',
    Starlight: '#F7F0E5',
    Midnight: '#1C273A',
    Graphite: '#4A4A4A',
    'Core Black': '#111111',
  };

  // Get color hexCode from database or fallback map
  const getColorHexCode = (colorName: string): string => {
    if (product.colorDetailsMap && product.colorDetailsMap[colorName]) {
      return product.colorDetailsMap[colorName].hexCode;
    }
    return fallbackColorCodeMap[colorName] || fallbackColorCodeMap[colorName.trim()] || '#B0B0B0';
  };

  return (
    <div
      className={`w-full bg-sky-50 rounded-xl flex flex-col gap-6 p-4 sm:p-6 ${className || ''}`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          {/* Product Title */}
          <div className="text-black text-2xl sm:text-[28px] font-semibold font-['Poppins'] leading-snug tracking-wide">
            {product.name}
          </div>

          {/* Rating and Stock */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
              <div className="opacity-60 text-black text-sm font-normal font-['Poppins'] leading-tight">
                ({product.reviewsCount} Reviews)
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 border-l border-black/20 pl-3">
              <div className="text-green-500 text-sm font-medium font-['Poppins'] leading-tight">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>
          <div className="sm:hidden text-green-500 text-sm font-medium font-['Poppins'] leading-tight">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Description */}
        <div className="text-black text-sm font-normal font-['Poppins'] leading-relaxed">
          {product.description}
        </div>

        {/* Price */}
        <div className="text-black text-[26px] sm:text-3xl font-semibold font-['Poppins'] leading-tight tracking-wide">
          ${product.price.toFixed(2)}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5 text-neutral-700 text-sm sm:text-base font-medium font-['Poppins'] leading-relaxed">
          <div>Category: {product.category}</div>
          <div>Order id: {product.orderId}</div>
          <div>Seller: {product.seller}</div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Color Selection */}
          <div className="flex flex-col gap-2.5">
            <div className="text-zinc-600 text-sm font-medium font-['Poppins'] leading-tight">
              Color:
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-1.5 min-w-max">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((color) => {
                    const colorCode = getColorHexCode(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                          selectedColor === color ? 'border-b border-fuchsia-500' : 'border-b border-transparent'
                        }`}
                        aria-pressed={selectedColor === color}
                        aria-label={`Select ${color} color`}
                      >
                        <div
                          className={`w-11 h-11 rounded-md border ${
                            selectedColor === color ? 'border-fuchsia-500 shadow-[0_0_0_2px_rgba(236,72,153,0.25)]' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: colorCode }}
                        />
                        <span
                          className={`px-1 text-xs font-medium font-['Poppins'] whitespace-nowrap text-center ${
                            selectedColor === color ? 'text-zinc-900' : 'text-zinc-900/80 group-hover:text-zinc-900'
                          }`}
                        >
                          {color}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-zinc-500 text-sm font-['Poppins']">No colors available</div>
                )}
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="text-black text-lg sm:text-xl font-semibold font-['Poppins'] leading-tight tracking-wide">
                Size:
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 text-neutral-50 shadow-[0_4px_12px_rgba(236,72,153,0.25)]'
                        : 'border border-black/30 text-black/80 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span className="text-sm sm:text-base font-medium font-['Poppins'] leading-tight">{size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity and Action Buttons Row */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-9 rounded-l border border-black/40 border-r-0 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                  type="button"
                >
                  <Minus className="w-3 h-3 text-black" />
                </button>
                <div className="w-12 h-9 border border-black/40 flex items-center justify-center text-black text-base font-medium font-['Poppins']">
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
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 ml-auto justify-end">
                <button className="px-4 py-2.5 bg-fuchsia-500 rounded-md flex items-center gap-1.5 hover:bg-fuchsia-600 transition-colors shadow-[0_4px_12px_rgba(236,72,153,0.25)]">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="text-white text-base font-medium font-['Poppins'] leading-none">Add to Cart</span>
                </button>
                <button className="w-10 h-10 rounded-md border border-black/40 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0 bg-white">
                  <Heart className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* Buy Now Button */}
            <button 
              onClick={handleBuyNow}
              className="w-full px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-md flex justify-center items-center gap-2.5 hover:from-fuchsia-600 hover:to-fuchsia-600 transition-colors shadow-[0_6px_18px_rgba(236,72,153,0.25)]"
            >
              <span className="text-neutral-50 text-base font-semibold font-['Poppins'] leading-normal">Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProductInfo;
