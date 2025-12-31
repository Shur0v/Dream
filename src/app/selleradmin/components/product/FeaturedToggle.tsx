'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedToggleProps {
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  productThumbnail: string;
  className?: string;
}

export default function FeaturedToggle({
  productId,
  productName,
  productSlug,
  productPrice,
  productThumbnail,
  className,
}: FeaturedToggleProps) {
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if product is featured on mount
  useEffect(() => {
    const checkFeatured = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/featured`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }

        const result = await response.json();
        if (result.success && result.data) {
          const featured = result.data.some((fp: { productId: string }) => fp.productId === productId);
          setIsFeatured(featured);
        }
      } catch (err) {
        console.error('Error checking featured status:', err);
        // Don't show error to user, just log it
      }
    };

    checkFeatured();
  }, [productId]);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      if (isFeatured) {
        // Remove from featured
        const response = await fetch(`${apiUrl}/admin/feature/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to remove from featured');
        }

        setIsFeatured(false);
      } else {
        // Add to featured
        const response = await fetch(`${apiUrl}/admin/feature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            name: productName,
            slug: productSlug,
            price: productPrice,
            thumbnail: productThumbnail,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to add to featured');
        }

        setIsFeatured(true);
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
      setError(err instanceof Error ? err.message : 'Failed to update featured status');
      // Show error briefly, then clear
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        title={isFeatured ? 'Remove from Featured' : 'Add to Featured'}
        className={cn(
          'p-2 rounded-md outline outline-1 outline-gray-200 hover:bg-neutral-50 transition-colors',
          isFeatured && 'bg-yellow-50',
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={handleToggle}
        disabled={isLoading}
      >
        <Star className={cn('w-5 h-5', isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-800')} />
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded whitespace-nowrap z-50">
          {error}
        </div>
      )}
    </div>
  );
}





