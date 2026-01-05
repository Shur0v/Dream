/**
 * Custom hook for cart and wishlist operations
 * Provides easy-to-use functions for adding products to cart/wishlist
 */

import { useState, useEffect } from 'react';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist, CartItem, WishlistItem } from '@/lib/userStorage';

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
}

export const useCartWishlist = (product: Product) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id]);

  const handleAddToCart = (options?: { quantity?: number; color?: string; size?: string }) => {
    const cartItem: CartItem = {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: options?.quantity || 1,
      image: product.images?.[0] || product.image || '/placeholder-image.png',
      color: options?.color,
      size: options?.size,
    };
    
    addToCart(cartItem);
    
    // Trigger storage event to update header counts
    window.dispatchEvent(new Event('storage'));
    
    return true;
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      const wishlistItem: WishlistItem = {
        id: `wishlist-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '/placeholder-image.png',
      };
      
      addToWishlist(wishlistItem);
      setIsWishlisted(true);
    }
    
    // Trigger storage event to update header counts
    window.dispatchEvent(new Event('storage'));
  };

  return {
    isWishlisted,
    handleAddToCart,
    handleToggleWishlist,
  };
};

