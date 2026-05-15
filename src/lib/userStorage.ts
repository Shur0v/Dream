/**
 * User session + cart/wishlist helpers.
 * Guest users: localStorage-backed.
 * Logged-in users: API-backed with local cache mirror.
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
const CART_STORAGE_KEY = 'guest_cart_items';
const WISHLIST_STORAGE_KEY = 'guest_wishlist_items';

const dispatchStateUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-wishlist-updated'));
  }
};

const readLocalArray = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalArray = <T>(key: string, data: T[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
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

export const getCartItems = (): CartItem[] => {
  if (!isUserLoggedIn()) {
    cartCache = readLocalArray<CartItem>(CART_STORAGE_KEY);
  }
  return cartCache;
};
export const getWishlistItems = (): WishlistItem[] => {
  if (!isUserLoggedIn()) {
    wishlistCache = readLocalArray<WishlistItem>(WISHLIST_STORAGE_KEY);
  }
  return wishlistCache;
};
export const getCartCount = (): number => cartCache.reduce((total, item) => total + item.quantity, 0);
export const getWishlistCount = (): number => wishlistCache.length;
export const isInWishlist = (productId: string): boolean => wishlistCache.some((item) => item.productId === productId);

export const syncCartFromApi = async (): Promise<CartItem[]> => {
  if (!isUserLoggedIn()) {
    cartCache = readLocalArray<CartItem>(CART_STORAGE_KEY);
    return cartCache;
  }
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
  writeLocalArray(CART_STORAGE_KEY, cartCache);
  return cartCache;
};

export const syncWishlistFromApi = async (): Promise<WishlistItem[]> => {
  if (!isUserLoggedIn()) {
    wishlistCache = readLocalArray<WishlistItem>(WISHLIST_STORAGE_KEY);
    return wishlistCache;
  }
  const response = await apiService.getWishlist();
  wishlistCache = (response.data || []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: Number(item.price ?? 0),
    image: item.image || '/placeholder-image.png',
  }));
  writeLocalArray(WISHLIST_STORAGE_KEY, wishlistCache);
  return wishlistCache;
};

export const addToCart = async (item: CartItem): Promise<void> => {
  if (!isUserLoggedIn()) {
    const items = readLocalArray<CartItem>(CART_STORAGE_KEY);
    const existingIndex = items.findIndex(
      (x) => x.productId === item.productId && (x.color || '') === (item.color || '') && (x.size || '') === (item.size || '')
    );
    if (existingIndex >= 0) {
      items[existingIndex].quantity += Math.max(1, Number(item.quantity || 1));
    } else {
      items.push({ ...item, quantity: Math.max(1, Number(item.quantity || 1)) });
    }
    cartCache = items;
    writeLocalArray(CART_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  await apiService.addToCart(item.productId, item.quantity || 1);
  await syncCartFromApi();
  dispatchStateUpdate();
};

export const removeFromCart = async (itemId: string): Promise<void> => {
  if (!isUserLoggedIn()) {
    const items = readLocalArray<CartItem>(CART_STORAGE_KEY).filter((item) => item.id !== itemId);
    cartCache = items;
    writeLocalArray(CART_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  const found = cartCache.find((item) => item.id === itemId);
  if (!found) return;
  await apiService.removeFromCart(found.productId);
  await syncCartFromApi();
  dispatchStateUpdate();
};

export const updateCartQuantity = async (itemId: string, quantity: number): Promise<void> => {
  if (!isUserLoggedIn()) {
    const items = readLocalArray<CartItem>(CART_STORAGE_KEY).map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter((item) => item.quantity > 0);
    cartCache = items;
    writeLocalArray(CART_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  const found = cartCache.find((item) => item.id === itemId);
  if (!found) return;
  await apiService.updateCartItem(found.productId, Math.max(0, quantity));
  await syncCartFromApi();
  dispatchStateUpdate();
};

export const saveCartItems = async (items: CartItem[]): Promise<void> => {
  if (!isUserLoggedIn()) {
    cartCache = items;
    writeLocalArray(CART_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  if (items.length === 0) {
    await apiService.clearCart();
  }
  await syncCartFromApi();
  dispatchStateUpdate();
};

export const addToWishlist = async (item: WishlistItem): Promise<void> => {
  if (!isUserLoggedIn()) {
    const items = readLocalArray<WishlistItem>(WISHLIST_STORAGE_KEY);
    if (!items.some((x) => x.productId === item.productId)) {
      items.push(item);
    }
    wishlistCache = items;
    writeLocalArray(WISHLIST_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  await apiService.addToWishlist(item.productId);
  await syncWishlistFromApi();
  dispatchStateUpdate();
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  if (!isUserLoggedIn()) {
    const items = readLocalArray<WishlistItem>(WISHLIST_STORAGE_KEY).filter((item) => item.productId !== productId);
    wishlistCache = items;
    writeLocalArray(WISHLIST_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  await apiService.removeFromWishlist(productId);
  await syncWishlistFromApi();
  dispatchStateUpdate();
};

export const saveWishlistItems = async (items: WishlistItem[]): Promise<void> => {
  if (!isUserLoggedIn()) {
    wishlistCache = items;
    writeLocalArray(WISHLIST_STORAGE_KEY, items);
    dispatchStateUpdate();
    return;
  }
  await syncWishlistFromApi();
  dispatchStateUpdate();
};
