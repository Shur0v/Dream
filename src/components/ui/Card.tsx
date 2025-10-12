/**
 * @fileoverview Card component for displaying content in containers
 * Provides consistent card styling across the application
 * 
 * @description This component supports:
 * - Multiple card variants
 * - Header and footer sections
 * - Hover effects
 * - Clickable cards
 * - Custom content areas
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Props interface for Card component
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant style
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  
  /**
   * Hover effect
   * @default false
   */
  hover?: boolean;
  
  /**
   * Clickable card
   * @default false
   */
  clickable?: boolean;
  
  /**
   * Padding size
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component for displaying content in containers
 * 
 * @description Provides a consistent card interface with:
 * - Multiple visual variants
 * - Hover and click effects
 * - Flexible padding options
 * - Semantic HTML structure
 * 
 * @param props - Card props including variant, hover, clickable
 * @returns JSX card element
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" hover clickable>
 *   <CardHeader>
 *     <CardTitle>Product Name</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Product description...
 *   </CardContent>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  clickable = false,
  padding = 'md',
  className,
  children,
  ...props
}) => {
  /**
   * Base card classes
   */
  const baseClasses = 'rounded-lg border bg-white';
  
  /**
   * Variant-specific classes
   */
  const variantClasses = {
    default: 'border-gray-200',
    outlined: 'border-gray-300 border-2',
    elevated: 'border-gray-200 shadow-lg',
    flat: 'border-gray-100 shadow-sm',
  };
  
  /**
   * Padding classes
   */
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  /**
   * Interactive classes
   */
  const interactiveClasses = {
    hover: hover ? 'hover:shadow-md transition-shadow duration-200' : '',
    clickable: clickable ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200' : '',
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        interactiveClasses.hover,
        interactiveClasses.clickable,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header component
 * 
 * @description Provides consistent header styling for cards
 * 
 * @param props - Header props
 * @returns JSX header element
 */
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Title component
 * 
 * @description Provides consistent title styling for cards
 * 
 * @param props - Title props
 * @returns JSX title element
 */
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

/**
 * Card Description component
 * 
 * @description Provides consistent description styling for cards
 * 
 * @param props - Description props
 * @returns JSX description element
 */
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn('text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * Card Content component
 * 
 * @description Provides consistent content styling for cards
 * 
 * @param props - Content props
 * @returns JSX content element
 */
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Footer component
 * 
 * @description Provides consistent footer styling for cards
 * 
 * @param props - Footer props
 * @returns JSX footer element
 */
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
