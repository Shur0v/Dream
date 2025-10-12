/**
 * @fileoverview Input component with validation states and icons
 * Provides consistent input styling across the application
 * 
 * @description This component supports:
 * - Multiple input types (text, email, password, etc.)
 * - Validation states (error, success)
 * - Icon support (left and right icons)
 * - Label and error message display
 * - Accessibility features
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Props interface for Input component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text for the input
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Success message to display
   */
  success?: string;
  
  /**
   * Helper text to display below input
   */
  helperText?: string;
  
  /**
   * Icon to display on the left side
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display on the right side
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;
}

/**
 * Input component with validation states and icon support
 * 
 * @description Provides a consistent input interface with:
 * - Tailwind CSS styling with proper states
 * - Validation error/success states
 * - Icon support for better UX
 * - Accessibility features built-in
 * - Label and helper text support
 * 
 * @param props - Input props including label, error, icons
 * @returns JSX input element with wrapper
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={emailError}
 *   leftIcon={<Mail />}
 *   required
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  required = false,
  className,
  id,
  ...props
}) => {
  /**
   * Generate unique ID if not provided
   */
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  /**
   * Base input classes
   */
  const baseClasses = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6';
  
  /**
   * State-specific classes
   */
  const stateClasses = {
    default: 'ring-gray-300 focus:ring-blue-600',
    error: 'ring-red-300 focus:ring-red-600',
    success: 'ring-green-300 focus:ring-green-600',
  };
  
  /**
   * Determine current state
   */
  const currentState = error ? 'error' : success ? 'success' : 'default';
  
  /**
   * Width classes
   */
  const widthClasses = fullWidth ? 'w-full' : '';
  
  /**
   * Icon padding classes
   */
  const iconPaddingClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  return (
    <div className={cn('space-y-1', widthClasses)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}
        
        {/* Input Field */}
        <input
          id={inputId}
          className={cn(
            baseClasses,
            stateClasses[currentState],
            iconPaddingClasses,
            className
          )}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {/* Helper Text */}
      {helperText && !error && !success && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Success Message */}
      {success && (
        <p className="text-sm text-green-600">{success}</p>
      )}
    </div>
  );
};

export default Input;
