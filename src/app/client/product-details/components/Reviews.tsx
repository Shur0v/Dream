'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ReviewsProps {
  rating: number;
  reviewsCount: number;
}

const Reviews: React.FC<ReviewsProps> = ({ rating, reviewsCount }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews: Review[] = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      comment: 'Absolutely love this t-shirt! The fabric is so soft and comfortable. Perfect fit and the design is exactly as shown. Highly recommend!',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      author: 'John D.',
      rating: 4,
      comment: 'Great quality t-shirt. The color is vibrant and the material feels durable. Would definitely recommend to others.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      author: 'Emma L.',
      rating: 5,
      comment: 'Excellent product! Fast shipping and the t-shirt exceeded my expectations. Will order again for sure.',
      date: '2024-01-08',
      verified: false
    },
    {
      id: 4,
      author: 'Mike R.',
      rating: 3,
      comment: 'Good t-shirt overall, but the sizing runs a bit small. Material quality is decent for the price.',
      date: '2024-01-05',
      verified: true
    },
    {
      id: 5,
      author: 'Lisa K.',
      rating: 5,
      comment: 'Perfect! Exactly what I was looking for. The design is beautiful and the fabric is very comfortable.',
      date: '2024-01-03',
      verified: true
    }
  ];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="w-full bg-white rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins']">
          Customer Reviews
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={20}
                fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                className="text-yellow-400"
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm font-['Poppins']">
            ({reviewsCount} Reviews)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="font-semibold text-gray-800 font-['Poppins']">
                  {review.author}
                </div>
                {review.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Verified Purchase
                  </span>
                )}
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16}
                      fill={i < review.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      className="text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-500 text-sm font-['Poppins']">
                {review.date}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed font-['Poppins']">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors font-medium font-['Poppins']"
          >
            {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}

      {/* Write Review Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button className="w-full py-3 border-2 border-fuchsia-500 text-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-colors font-medium font-['Poppins']">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default Reviews;


