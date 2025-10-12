/**
 * @fileoverview Button component with multiple variants and sizes
 * Provides consistent button styling across the application
 * 
 * @description This component supports:
 * - Multiple visual variants (primary, secondary, outline, ghost)
 * - Different sizes (sm, md, lg)
 * - Loading states with spinner
 * - Disabled states
 * - Icon support
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Props interface for Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  
  /**
   * Size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Loading state - shows spinner and disables button
   * @default false
   */
  loading?: boolean;
  
  /**
   * Icon to display before text
   */
  icon?: React.ReactNode;
  
  /**
   * Icon to display after text
   */
  iconRight?: React.ReactNode;
  
  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Button component with multiple variants and states
 * 
 * @description Provides a consistent button interface with:
 * - Tailwind CSS styling with proper variants
 * - Loading states with spinner animation
 * - Icon support for better UX
 * - Accessibility features built-in
 * 
 * @param props - Button props including variant, size, loading state
 * @returns JSX button element
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" loading={isLoading}>
 *   Submit Order
 * </Button>
 * 
 * <Button variant="outline" icon={<ShoppingCart />}>
 *   Add to Cart
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  /**
   * Base button classes - common styles for all variants
   */
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  /**
   * Variant-specific classes
   */
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };
  
  /**
   * Size-specific classes
   */
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  
  /**
   * Width classes
   */
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && iconRight && (
        <span className="ml-2">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
