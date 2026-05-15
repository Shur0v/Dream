'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Heart, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { CheckoutModal } from '@/components/cart/CheckoutModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist, CartItem, WishlistItem } from '@/lib/userStorage';

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

interface SavedUserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface SavedUserProfile {
  id: string;
  email: string;
  firstName?: string;
  phone?: string;
  address?: SavedUserAddress;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, images = [], className }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? 'M');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [checkoutInitialValues, setCheckoutInitialValues] = useState<{
    name: string;
    phoneNumber: string;
    email: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  } | undefined>(undefined);

  const getCurrentUserProfile = async (): Promise<SavedUserProfile | null> => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
    const email = currentUser?.email;
    if (!email) return null;

    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) return null;
    const result = await response.json();
    if (!result?.success || !result?.data) return null;
    return result.data as SavedUserProfile;
  };

  const getGuestUserId = (): string => {
    if (typeof window === 'undefined') return `guest-${Date.now()}`;
    const existing = localStorage.getItem('guestUserId');
    if (existing) return existing;
    const created = `guest-${Date.now()}`;
    localStorage.setItem('guestUserId', created);
    return created;
  };

  const createOrder = async (input: {
    userId: string;
    shippingAddress: SavedUserAddress;
    customerName: string;
    phoneNumber: string;
    email: string;
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  }) => {
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
      quantity,
      price: product.price,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    };

    const orderData = {
      userId: input.userId,
      items: [orderItem],
      shippingAddress: input.shippingAddress,
      billingAddress: input.shippingAddress,
      paymentMethod: 'Cash on Delivery',
      notes: JSON.stringify({
        customerName: input.customerName,
        phoneNumber: input.phoneNumber,
        email: input.email,
        district: input.district,
        upazila: input.upazila,
        thana: input.thana,
        postOffice: input.postOffice,
      }),
    };

    const response = await fetch(`/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to create order' };
      }
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create order');
    }
    return {
      order: result.data,
      paymentUrl: result.paymentUrl || result.steadfast?.paymentUrl || result?.data?.steadfast?.paymentUrl,
    };
  };

  // Check if product is in wishlist
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id]);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleBuyNow = () => {
    (async () => {
      try {
        const userFromStorage = JSON.parse(localStorage.getItem('userData') || 'null');
        const profile = await getCurrentUserProfile();
        const resolvedUserId = profile?.id || getGuestUserId();

        const hasSavedAddress =
          !!profile?.address?.street &&
          !!profile?.address?.city &&
          !!profile?.address?.zipCode;

        if (hasSavedAddress) {
          setIsSubmitting(true);
          const savedAddress = profile.address as SavedUserAddress;
          const savedDistrict = savedAddress.city || '';
          const parts = (savedAddress.street || '').split(',').map((part) => part.trim());
          const savedThana = parts[0] || '';
          const savedUpazila = parts[1] || '';
          const savedPostOffice = savedAddress.zipCode || '';

          const created = await createOrder({
            userId: resolvedUserId,
            shippingAddress: savedAddress,
            customerName: profile.firstName || userFromStorage.username || 'Customer',
            phoneNumber: profile.phone || userFromStorage.mobile || '',
            email: userFromStorage?.email || '',
            district: savedDistrict,
            upazila: savedUpazila,
            thana: savedThana,
            postOffice: savedPostOffice,
          });

          if (created.paymentUrl) {
            window.location.href = created.paymentUrl;
            return;
          }
          setOrderId(created.order.id);
          setIsSuccessModalOpen(true);
          toast.success('Order placed successfully');
          return;
        }

        setCheckoutInitialValues({
          name: userFromStorage.username || '',
          phoneNumber: userFromStorage.mobile || '',
          email: userFromStorage.email || '',
          district: '',
          upazila: '',
          thana: '',
          postOffice: '',
        });
        setIsCheckoutOpen(true);
      } catch (error: any) {
        console.error('Error in Buy Now flow:', error);
        toast.error('Failed to process Buy Now. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: images && images.length > 0 ? images[0] : '/placeholder-image.png',
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    };
    
    addToCart(cartItem);
    window.dispatchEvent(new Event('storage'));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast.success('Removed from favourite');
    } else {
      const wishlistItem: WishlistItem = {
        id: `wishlist-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images && images.length > 0 ? images[0] : '/placeholder-image.png',
      };
      
      addToWishlist(wishlistItem);
      setIsWishlisted(true);
      toast.success('Added to favourite');
    }
    window.dispatchEvent(new Event('storage'));
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
      const userFromStorage = JSON.parse(localStorage.getItem('userData') || 'null');
      const profile = await getCurrentUserProfile();
      const resolvedUserId = profile?.id || getGuestUserId();

      const shippingAddress = {
        street: `${formData.thana}, ${formData.upazila}`,
        city: formData.district,
        state: formData.district,
        zipCode: formData.postOffice,
        country: 'Bangladesh',
      };

      // Save one-time address to user account for future instant Buy Now
      if (userFromStorage?.email) {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.name || userFromStorage.username,
            mobile: formData.phoneNumber || userFromStorage.mobile,
            email: userFromStorage.email,
            address: shippingAddress,
          }),
        });
      }
      const created = await createOrder({
        userId: resolvedUserId,
        shippingAddress,
        customerName: formData.name || userFromStorage.username || '',
        phoneNumber: formData.phoneNumber || userFromStorage.mobile || '',
        email: formData.email || userFromStorage?.email || '',
        district: formData.district,
        upazila: formData.upazila,
        thana: formData.thana,
        postOffice: formData.postOffice,
      });

      if (created.paymentUrl) {
        window.location.href = created.paymentUrl;
        return;
      }
      setOrderId(created.order.id);
      setIsCheckoutOpen(false);
      setIsSuccessModalOpen(true);
      toast.success('Order placed successfully');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
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
          ৳{product.price.toFixed(2)}
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
                    <span
                      className={`text-sm sm:text-base font-medium font-['Poppins'] leading-tight ${
                        selectedSize === size ? 'text-white' : 'text-black'
                      }`}
                    >
                      {size}
                    </span>
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
                <button 
                  onClick={handleAddToCart}
                  className="px-4 py-2.5 bg-fuchsia-500 rounded-md flex items-center gap-1.5 hover:bg-fuchsia-600 transition-colors shadow-[0_4px_12px_rgba(236,72,153,0.25)] cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="text-white text-base font-medium font-['Poppins'] leading-none">Add to Cart</span>
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`w-10 h-10 rounded-md border border-black/40 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0 bg-white cursor-pointer ${isWishlisted ? 'bg-red-50 border-red-300' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-600 fill-red-600' : 'text-black'}`} />
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
        initialValues={checkoutInitialValues}
        hideContactFields={false}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Order Confirmed!"
        message="Your order has been placed successfully!"
        orderId={orderId || undefined}
      />

    </div>
  );
};

export default ProductInfo;
