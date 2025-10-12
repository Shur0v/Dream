/**
 * @fileoverview Placeholder image component
 * Provides fallback images for missing product images
 * 
 * @description This component:
 * - Shows placeholder images when product images are missing
 * - Provides consistent fallback UI
 * - Handles different image types
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import { Package, User, Image as ImageIcon } from 'lucide-react';

/**
 * Props interface for PlaceholderImage component
 */
interface PlaceholderImageProps {
  /**
   * Type of placeholder image
   * @default 'product'
   */
  type?: 'product' | 'user' | 'generic';
  
  /**
   * Size of the placeholder
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Placeholder Image component
 * 
 * @description Renders a placeholder image with appropriate icon
 * Used when actual images are not available
 * 
 * @param props - PlaceholderImage props including type and size
 * @returns JSX placeholder element
 * 
 * @example
 * ```tsx
 * <PlaceholderImage type="product" size="large" />
 * ```
 */
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  type = 'product',
  size = 'medium',
  className = '',
}) => {
  /**
   * Get appropriate icon based on type
   */
  const getIcon = () => {
    switch (type) {
      case 'product':
        return Package;
      case 'user':
        return User;
      default:
        return ImageIcon;
    }
  };

  /**
   * Get size classes
   */
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const IconComponent = getIcon();
  const sizeClasses = getSizeClasses();

  return (
    <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${sizeClasses} ${className}`}>
      <IconComponent className="h-6 w-6 text-gray-400" />
    </div>
  );
};

export default PlaceholderImage;
