/**
 * User Storage Utilities
 * Manages user data, cart, and wishlist in localStorage
 */

export interface UserData {
  username: string;
  mobile: string;
  email: string;
  password?: string | null;
  loginTime: string;
  cart?: CartItem[];
  wishlist?: WishlistItem[];
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

/**
 * Get current user data from localStorage
 */
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

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Get user email (used as key for cart/wishlist)
 */
export const getUserEmail = (): string | null => {
  const user = getCurrentUser();
  return user?.email || null;
};

/**
 * Get cart items for current user
 */
export const getCartItems = (): CartItem[] => {
  const email = getUserEmail();
  if (!email) return [];
  
  const cartData = localStorage.getItem(`cart_${email}`);
  if (!cartData) return [];
  
  try {
    return JSON.parse(cartData);
  } catch {
    return [];
  }
};

/**
 * Save cart items for current user
 */
export const saveCartItems = (items: CartItem[]): void => {
  const email = getUserEmail();
  if (!email) return;
  
  try {
    // Only save to user-specific key to avoid quota issues
    localStorage.setItem(`cart_${email}`, JSON.stringify(items));
    
    // Update current user data (lightweight, only basic info)
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Don't store full cart in userData to avoid quota issues
      // Cart is stored separately in cart_${email}
      localStorage.setItem('userData', JSON.stringify({
        ...currentUser,
        // Only store cart count, not full cart data
        cartCount: items.reduce((total, item) => total + item.quantity, 0),
      }));
    }
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Clearing old cart data...');
      // Clear old cart data and retry
      try {
        localStorage.removeItem(`cart_${email}`);
        localStorage.setItem(`cart_${email}`, JSON.stringify(items));
        window.dispatchEvent(new Event('storage'));
      } catch (retryError) {
        console.error('Failed to save cart after cleanup:', retryError);
      }
    } else {
      throw error;
    }
  }
};

/**
 * Add item to cart
 */
export const addToCart = (item: CartItem): void => {
  const cartItems = getCartItems();
  const existingItem = cartItems.find(
    (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
  );
  
  if (existingItem) {
    // Update quantity if item already exists
    existingItem.quantity += item.quantity;
  } else {
    // Add new item
    cartItems.push(item);
  }
  
  saveCartItems(cartItems);
};

/**
 * Remove item from cart
 */
export const removeFromCart = (itemId: string): void => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((item) => item.id !== itemId);
  saveCartItems(updatedItems);
};

/**
 * Update cart item quantity
 */
export const updateCartQuantity = (itemId: string, quantity: number): void => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.map((item) =>
    item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
  ).filter((item) => item.quantity > 0); // Remove items with 0 quantity
  
  saveCartItems(updatedItems);
};

/**
 * Get wishlist items for current user
 */
export const getWishlistItems = (): WishlistItem[] => {
  const email = getUserEmail();
  if (!email) return [];
  
  const wishlistData = localStorage.getItem(`wishlist_${email}`);
  if (!wishlistData) return [];
  
  try {
    return JSON.parse(wishlistData);
  } catch {
    return [];
  }
};

/**
 * Save wishlist items for current user
 */
export const saveWishlistItems = (items: WishlistItem[]): void => {
  const email = getUserEmail();
  if (!email) return;
  
  try {
    // Only save to user-specific key to avoid quota issues
    localStorage.setItem(`wishlist_${email}`, JSON.stringify(items));
    
    // Update current user data (lightweight, only basic info)
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Don't store full wishlist in userData to avoid quota issues
      // Wishlist is stored separately in wishlist_${email}
      localStorage.setItem('userData', JSON.stringify({
        ...currentUser,
        // Only store wishlist count, not full wishlist data
        wishlistCount: items.length,
      }));
    }
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Clearing old wishlist data...');
      // Clear old wishlist data and retry
      try {
        localStorage.removeItem(`wishlist_${email}`);
        localStorage.setItem(`wishlist_${email}`, JSON.stringify(items));
        window.dispatchEvent(new Event('storage'));
      } catch (retryError) {
        console.error('Failed to save wishlist after cleanup:', retryError);
      }
    } else {
      throw error;
    }
  }
};

/**
 * Add item to wishlist
 */
export const addToWishlist = (item: WishlistItem): void => {
  const wishlistItems = getWishlistItems();
  const exists = wishlistItems.some((i) => i.productId === item.productId);
  
  if (!exists) {
    wishlistItems.push(item);
    saveWishlistItems(wishlistItems);
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = (productId: string): void => {
  const wishlistItems = getWishlistItems();
  const updatedItems = wishlistItems.filter((item) => item.productId !== productId);
  saveWishlistItems(updatedItems);
};

/**
 * Check if product is in wishlist
 */
export const isInWishlist = (productId: string): boolean => {
  const wishlistItems = getWishlistItems();
  return wishlistItems.some((item) => item.productId === productId);
};

/**
 * Get cart count
 */
export const getCartCount = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Get wishlist count
 */
export const getWishlistCount = (): number => {
  return getWishlistItems().length;
};

