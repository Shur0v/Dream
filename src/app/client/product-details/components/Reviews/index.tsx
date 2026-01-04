'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Star, SlidersVertical, ChevronDown, MoreHorizontal, Check } from 'lucide-react';
import { ProductReview } from '@/types';

interface ReviewsProps {
  productId: string;
  productName?: string;
  productDescription?: string;
  productSpecifications?: Record<string, any>;
  initialReviews: ProductReview[];
}

const Reviews: React.FC<ReviewsProps> = ({ productId, productName, productDescription, productSpecifications, initialReviews }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('reviews');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query string with both productId and productName
        const params = new URLSearchParams({ productId });
        if (productName) {
          params.append('productName', productName);
        }
        const response = await fetch(`/api/reviews?${params.toString()}`, {
          cache: 'no-store',
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load reviews');
        }
        if (active) {
          setReviews(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load reviews');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [productId, productName]);

  const displayedReviews = useMemo(
    () => reviews.slice(0, visibleReviewsCount),
    [reviews, visibleReviewsCount]
  );
  
  const handleSeeMore = () => {
    setVisibleReviewsCount(prev => Math.min(prev + 4, reviews.length));
  };
  
  const handleHideAll = () => {
    setVisibleReviewsCount(4);
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={20}
        fill={i < rating ? 'currentColor' : 'none'}
        stroke="currentColor"
        className={`${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="w-full max-w-[1320px] mx-auto">
            {/* Layer 4: Product Details Content */}
            <div className="w-full space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins'] mb-4">
                Product Details
              </h3>
              
              {/* Product Specifications */}
              {productSpecifications && Object.keys(productSpecifications).length > 0 ? (
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(productSpecifications).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-3 last:border-0">
                          <dt className="text-sm font-semibold text-gray-700 font-['Poppins'] mb-1">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                          </dt>
                          <dd className="text-gray-600 font-['Poppins']">
                            {typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value || 'N/A')}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 font-['Poppins'] italic">
                  No specifications available for this product.
                </p>
              )}
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="w-full space-y-6 max-w-[1320px] mx-auto">
            {/* Layer 4: Review Controls */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="text-black text-2xl font-normal font-['Poppins']">All Reviews</div>
                <div className="text-black/60 text-base font-normal font-['Poppins']">
                  ({reviews.length})
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Filter Button */}
                <div className="w-12 h-12 bg-zinc-100 rounded-[62px] flex justify-center items-center">
                  <SlidersVertical size={20} className="text-black" />
                </div>
                {/* Sort Button */}
                <div className="min-w-[112px] h-12 px-5 py-4 bg-zinc-100 rounded-[62px] flex justify-between items-center">
                  <div className="text-black text-base font-normal font-['Poppins']">Latest</div>
                  <ChevronDown size={16} className="text-black" />
                </div>
                {/* Write Review Button */}
                <div className="h-12 px-5 py-4 bg-black rounded-[62px] flex justify-center items-center">
                  <div className="text-white text-base font-normal font-['Poppins']">Write a Review</div>
                </div>
              </div>
            </div>

            {/* Layer 4: Reviews Grid */}
            {loading ? (
              <div className="w-full p-6 text-center text-zinc-500">Loading reviews...</div>
            ) : error ? (
              <div className="w-full p-6 text-center text-red-500">{error}</div>
            ) : reviews.length === 0 ? (
              <div className="w-full p-6 text-center text-zinc-500">
                No reviews yet. Be the first to share your thoughts!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="px-6 sm:px-8 py-6 sm:py-7 rounded-[20px] outline-1 outline-offset-[-1px] outline-black/10">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex gap-1.5 mb-3.5">
                          {renderStars(review.rating)}
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="text-black text-xl font-bold font-['Satoshi']">{review.author}</div>
                          {review.verified && (
                            <div className="w-6 h-6 bg-green-600 rounded-full flex justify-center items-center">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug mb-4">
                          "{review.comment}"
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MoreHorizontal size={20} className="text-black/40" />
                      </div>
                    </div>
                    <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Layer 4: See More/Hide All Button */}
            {visibleReviewsCount < reviews.length && reviews.length > 0 && (
              <div className="flex justify-start mt-8">
                <button
                  onClick={handleSeeMore}
                  className="px-6 py-3 border-2 border-fuchsia-500 text-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-colors font-medium font-['Poppins']"
                >
                  See More Review
                </button>
              </div>
            )}
            {visibleReviewsCount >= reviews.length && visibleReviewsCount > 4 && (
              <div className="flex justify-start mt-8">
                <button
                  onClick={handleHideAll}
                  className="px-6 py-3 border-2 border-fuchsia-500 text-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-colors font-medium font-['Poppins']"
                >
                  Hide All
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-white max-w-[1320px] mx-auto px-2">
      {/* Layer 1: Tab Navigation */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 border-b border-black">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-4 sm:py-6 px-2 sm:px-4 ${activeTab === 'details' 
            ? 'border-b-2 border-fuchsia-500 text-fuchsia-500' 
            : 'text-black/60'
          } text-xl font-medium font-['Poppins']`}
        >
          Product Details
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-4 sm:py-6 px-2 sm:px-4 ${activeTab === 'reviews' 
            ? 'border-b-2 border-fuchsia-500 text-fuchsia-500' 
            : 'text-black/60'
          } text-xl font-medium font-['Poppins']`}
        >
          Rating & Reviews
        </button>
      </div>

      {/* Layer 2: Tab Content Container */}
      <div className="w-full py-6">
        {/* Layer 3: Tab Content */}
        {renderTabContent()}
      </div>
    </section>
  );
};

export default Reviews;
