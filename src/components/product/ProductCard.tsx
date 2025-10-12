/**
 * @fileoverview Product Card component for displaying product information
 * Shows product details in a card format with actions
 * 
 * @description This component displays:
 * - Product image with hover effects
 * - Product name and description
 * - Price with discount calculation
 * - Add to cart and wishlist actions
 * - Stock status indicators
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import PlaceholderImage from '../ui/PlaceholderImage';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, calculateDiscount, truncateText } from '../../lib/utils';

/**
 * Props interface for ProductCard component
 */
interface ProductCardProps {
  /**
   * Product data to display
   */
  product: Product;
  
  /**
   * Callback when add to cart is clicked
   */
  onAddToCart?: (product: Product) => void;
  
  /**
   * Callback when add to wishlist is clicked
   */
  onAddToWishlist?: (product: Product) => void;
  
  /**
   * Callback when product is clicked
   */
  onProductClick?: (product: Product) => void;
  
  /**
   * Loading state for add to cart
   * @default false
   */
  isAddingToCart?: boolean;
  
  /**
   * Loading state for add to wishlist
   * @default false
   */
  isAddingToWishlist?: boolean;
  
  /**
   * Whether product is in wishlist
   * @default false
   */
  isInWishlist?: boolean;
  
  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * Product Card component for displaying product information
 * 
 * @description Renders a product card with:
 * - Responsive image with hover zoom effect
 * - Product details with proper truncation
 * - Price display with discount calculation
 * - Action buttons for cart and wishlist
 * - Stock status and rating display
 * 
 * @param props - ProductCard props including product data and callbacks
 * @returns JSX product card element
 * 
 * @example
 * ```tsx
 * <ProductCard
 *   product={product}
 *   onAddToCart={handleAddToCart}
 *   onAddToWishlist={handleAddToWishlist}
 *   onProductClick={handleProductClick}
 *   isAddingToCart={isLoading}
 * />
 * ```
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  isAddingToCart = false,
  isAddingToWishlist = false,
  isInWishlist = false,
  className,
}) => {
  /**
   * Calculate discount percentage
   */
  const discountPercentage = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;
  
  /**
   * Handle product click
   */
  const handleProductClick = () => {
    onProductClick?.(product);
  };
  
  /**
   * Handle add to cart click
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };
  
  /**
   * Handle add to wishlist click
   */
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
  };
  
  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
      hover
      clickable
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaceholderImage type="product" size="large" className="w-full h-full rounded-t-lg" />
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      </div>
      
      {/* Product Content */}
      <CardContent className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.brand}
        </p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {truncateText(product.name, 50)}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">(4.0)</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Stock Indicator */}
          <div className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      </CardContent>
      
      {/* Product Actions */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          loading={isAddingToCart}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
