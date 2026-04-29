/**
 * User session + cart/wishlist helpers.
 * Cart/wishlist persistence is API-backed (no localStorage data storage).
 */

import apiService from '@/services/api';

export interface UserData {
  username: string;
  mobile: string;
  email: string;
  password?: string | null;
  loginTime: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

let cartCache: CartItem[] = [];
let wishlistCache: WishlistItem[] = [];

const dispatchStateUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-wishlist-updated'));
  }
};

export const getCurrentUser = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('userData');
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const isUserLoggedIn = (): boolean => getCurrentUser() !== null;

export const getUserEmail = (): string | null => {
  const user = getCurrentUser();
  return user?.email || null;
};

export const getCartItems = (): CartItem[] => cartCache;
export const getWishlistItems = (): WishlistItem[] => wishlistCache;
export const getCartCount = (): number => cartCache.reduce((total, item) => total + item.quantity, 0);
export const getWishlistCount = (): number => wishlistCache.length;
export const isInWishlist = (productId: string): boolean => wishlistCache.some((item) => item.productId === productId);

export const syncCartFromApi = async (): Promise<CartItem[]> => {
  const response = await apiService.getCart();
  cartCache = (response.data?.items || []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    name: item.product?.name || item.name || 'Product',
    price: Number(item.product?.price ?? item.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    image: item.product?.images?.[0] || item.image || '/placeholder-image.png',
    color: item.color,
    size: item.size,
  }));
  dispatchStateUpdate();
  return cartCache;
};

export const syncWishlistFromApi = async (): Promise<WishlistItem[]> => {
  const response = await apiService.getWishlist();
  wishlistCache = (response.data || []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: Number(item.price ?? 0),
    image: item.image || '/placeholder-image.png',
  }));
  dispatchStateUpdate();
  return wishlistCache;
};

export const addToCart = async (item: CartItem): Promise<void> => {
  await apiService.addToCart(item.productId, item.quantity || 1);
  await syncCartFromApi();
};

export const removeFromCart = async (itemId: string): Promise<void> => {
  const found = cartCache.find((item) => item.id === itemId);
  if (!found) return;
  await apiService.removeFromCart(found.productId);
  await syncCartFromApi();
};

export const updateCartQuantity = async (itemId: string, quantity: number): Promise<void> => {
  const found = cartCache.find((item) => item.id === itemId);
  if (!found) return;
  await apiService.updateCartItem(found.productId, Math.max(0, quantity));
  await syncCartFromApi();
};

export const saveCartItems = async (_items: CartItem[]): Promise<void> => {
  // Deprecated: cart is API-backed. Kept for compatibility.
  await syncCartFromApi();
};

export const addToWishlist = async (item: WishlistItem): Promise<void> => {
  await apiService.addToWishlist(item.productId);
  await syncWishlistFromApi();
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await apiService.removeFromWishlist(productId);
  await syncWishlistFromApi();
};

export const saveWishlistItems = async (_items: WishlistItem[]): Promise<void> => {
  // Deprecated: wishlist is API-backed. Kept for compatibility.
  await syncWishlistFromApi();
};

