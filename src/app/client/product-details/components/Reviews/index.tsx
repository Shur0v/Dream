'use client';

import React, { useState } from 'react';
import { Star, SlidersVertical, ChevronDown, MoreHorizontal, Check } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'qa'>('reviews');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);

  const reviews: Review[] = [
    {
      id: 1,
      author: 'Samantha D.',
      rating: 5,
      comment: 'I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt.',
      date: 'Posted on August 14, 2023',
      verified: true
    },
    {
      id: 2,
      author: 'Alex M.',
      rating: 5,
      comment: 'The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.',
      date: 'Posted on August 15, 2023',
      verified: true
    },
    {
      id: 3,
      author: 'Sarah M.',
      rating: 4,
      comment: 'Great quality t-shirt! The fabric is soft and comfortable. The design is exactly as shown in the pictures. Would definitely recommend to others.',
      date: 'Posted on August 12, 2023',
      verified: true
    },
    {
      id: 4,
      author: 'John D.',
      rating: 5,
      comment: 'Excellent product! Fast shipping and the t-shirt exceeded my expectations. The fit is perfect and the material feels premium. Will order again for sure.',
      date: 'Posted on August 10, 2023',
      verified: false
    },
    {
      id: 5,
      author: 'Emma L.',
      rating: 5,
      comment: 'Perfect! Exactly what I was looking for. The design is beautiful and the fabric is very comfortable. The colors are vibrant and true to the photos.',
      date: 'Posted on August 8, 2023',
      verified: true
    },
    {
      id: 6,
      author: 'Mike R.',
      rating: 4,
      comment: 'Good t-shirt overall, but the sizing runs a bit small. Material quality is decent for the price. Would suggest ordering one size up.',
      date: 'Posted on August 6, 2023',
      verified: true
    },
    {
      id: 7,
      author: 'Lisa K.',
      rating: 5,
      comment: 'Amazing quality! The print is crisp and the fabric is so soft. I\'ve washed it multiple times and it still looks brand new. Highly recommend!',
      date: 'Posted on August 4, 2023',
      verified: true
    },
    {
      id: 8,
      author: 'David P.',
      rating: 3,
      comment: 'Decent t-shirt for the price. The design is nice but the fabric could be better quality. It\'s comfortable but not as durable as expected.',
      date: 'Posted on August 2, 2023',
      verified: false
    }
  ];

  const displayedReviews = reviews.slice(0, visibleReviewsCount);
  
  const handleSeeMore = () => {
    setVisibleReviewsCount(prev => Math.min(prev + 4, reviews.length));
  };
  
  const handleHideAll = () => {
    setVisibleReviewsCount(4);
  };

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
            <div className="w-full">
              <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins'] mb-4">
                Product Details
              </h3>
              <p className="text-gray-600 font-['Poppins']">
                This is where the product details and description will be displayed.
              </p>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="w-full space-y-6 max-w-[1320px] mx-auto">
            {/* Layer 4: Review Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="text-black text-2xl font-normal font-['Poppins']">All Reviews</div>
                <div className="text-black/60 text-base font-normal font-['Poppins']">(451)</div>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Filter Button */}
                <div className="w-12 h-12 bg-zinc-100 rounded-[62px] flex justify-center items-center">
                  <SlidersVertical size={20} className="text-black" />
                </div>
                {/* Sort Button */}
                <div className="w-28 h-12 px-5 py-4 bg-zinc-100 rounded-[62px] flex justify-between items-center">
                  <div className="text-black text-base font-normal font-['Poppins']">Latest</div>
                  <ChevronDown size={16} className="text-black" />
                </div>
                {/* Write Review Button */}
                <div className="w-40 h-12 px-5 py-4 bg-black rounded-[62px] flex justify-center items-center">
                  <div className="text-white text-base font-normal font-['Poppins']">Write a Review</div>
                </div>
              </div>
            </div>

            {/* Layer 4: Reviews Grid */}
            <div className="grid grid-cols-2 gap-6">
              {displayedReviews.map((review) => (
                <div key={review.id} className="px-8 py-7 rounded-[20px] outline-1 outline-offset-[-1px] outline-black/10">
                  {/* Layer 5: Review Card Content */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {/* Stars */}
                      <div className="flex gap-1.5 mb-3.5">
                        {renderStars(review.rating)}
                      </div>
                      {/* Author and Verified Badge */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="text-black text-xl font-bold font-['Satoshi']">{review.author}</div>
                        {review.verified && (
                          <div className="w-6 h-6 bg-green-600 rounded-full flex justify-center items-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      {/* Review Text */}
                      <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug mb-4">
                        "{review.comment}"
                      </div>
                    </div>
                    {/* More Options */}
                    <div className="flex items-start">
                      <MoreHorizontal size={20} className="text-black/40" />
                    </div>
                  </div>
                  {/* Date */}
                  <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug">
                    {review.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Layer 4: See More/Hide All Button */}
            {visibleReviewsCount < reviews.length && (
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
      case 'qa':
        return (
          <div className="w-full max-w-[1320px] mx-auto">
            {/* Layer 4: Q&A Content */}
            <div className="w-full">
              <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins'] mb-4">
                Question & Answer
              </h3>
              <p className="text-gray-600 font-['Poppins']">
                This is where the Q&A section will be displayed.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white max-w-[1320px] mx-auto">
      {/* Layer 1: Tab Navigation */}
      <div className="flex items-center gap-12 border-b border-black">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-6 px-4 ${activeTab === 'details' 
            ? 'border-b-2 border-fuchsia-500 text-fuchsia-500' 
            : 'text-black/60'
          } text-xl font-medium font-['Poppins']`}
        >
          Product Details
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-6 px-4 ${activeTab === 'reviews' 
            ? 'border-b-2 border-fuchsia-500 text-fuchsia-500' 
            : 'text-black/60'
          } text-xl font-medium font-['Poppins']`}
        >
          Rating & Reviews
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`py-6 px-4 ${activeTab === 'qa' 
            ? 'border-b-2 border-fuchsia-500 text-fuchsia-500' 
            : 'text-black/60'
          } text-xl font-medium font-['Poppins']`}
        >
          Question & Answer
        </button>
      </div>

      {/* Layer 2: Tab Content Container */}
      <div className="w-full py-6 max-w-[1320px] mx-auto">
        {/* Layer 3: Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Reviews;