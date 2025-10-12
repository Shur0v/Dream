/**
 * @fileoverview Custom React hooks for common functionality
 * Provides reusable hooks for API calls, form handling, and state management
 * 
 * @description This file contains:
 * - useApi hook for API calls
 * - useForm hook for form handling
 * - useLocalStorage hook for persistence
 * - useDebounce hook for performance
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for API calls with loading and error states
 * 
 * @description Provides a standardized way to handle API calls with:
 * - Loading states
 * - Error handling
 * - Success callbacks
 * - Automatic cleanup
 * 
 * @param apiFunction - Async function that makes the API call
 * @returns Object with data, loading, error states and execute function
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi(fetchProducts);
 * 
 * useEffect(() => {
 *   execute();
 * }, []);
 * ```
 */
export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
}

/**
 * Custom hook for form handling with validation
 * 
 * @description Provides form state management with:
 * - Field values and errors
 * - Validation functions
 * - Form submission handling
 * - Reset functionality
 * 
 * @param initialValues - Initial form values
 * @param validationSchema - Validation rules
 * @returns Form state and handlers
 * 
 * @example
 * ```tsx
 * const { values, errors, handleChange, handleSubmit, reset } = useForm({
 *   email: '',
 *   password: ''
 * }, validationSchema);
 * ```
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const newErrors = validationSchema(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validate()) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
  };
}

/**
 * Custom hook for localStorage with React state synchronization
 * 
 * @description Provides localStorage integration with:
 * - Automatic state synchronization
 * - Type safety
 * - Error handling
 * - SSR compatibility
 * 
 * @param key - localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Current value and setter function
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

/**
 * Custom hook for debouncing values
 * 
 * @description Delays updating a value until after specified delay
 * Useful for search inputs and API calls
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // API call with debounced value
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for intersection observer
 * 
 * @description Provides intersection observer functionality for:
 * - Lazy loading
 * - Infinite scrolling
 * - Animation triggers
 * 
 * @param options - Intersection observer options
 * @returns Ref and intersection state
 * 
 * @example
 * ```tsx
 * const [ref, isIntersecting] = useIntersectionObserver({
 *   threshold: 0.1
 * });
 * ```
 */
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting] as const;
}
