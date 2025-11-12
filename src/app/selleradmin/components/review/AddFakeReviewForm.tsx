'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Star, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { products, Product } from '@/lib/productData';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface AddFakeReviewFormProps {
  onBack?: () => void;
  onSave?: (data: Review) => void;
  onDelete?: (id: number) => void;
}

export default function AddFakeReviewForm({ onBack, onSave, onDelete }: AddFakeReviewFormProps) {
  const router = useRouter();
  const [productNameInput, setProductNameInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [verified, setVerified] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');

  // Format datetime to display format
  const formatDate = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `Posted on ${month} ${day}, ${year}`;
  };

  // Existing reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productId: 1,
      author: 'Samantha D.',
      rating: 5,
      comment: 'I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable.',
      date: 'Posted on August 14, 2023',
      verified: true
    },
    {
      id: 2,
      productId: 1,
      author: 'Alex M.',
      rating: 5,
      comment: 'The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch.',
      date: 'Posted on August 15, 2023',
      verified: true
    },
    {
      id: 3,
      productId: 2,
      author: 'Sarah M.',
      rating: 4,
      comment: 'Great quality t-shirt! The fabric is soft and comfortable. The design is exactly as shown.',
      date: 'Posted on August 12, 2023',
      verified: true
    }
  ]);

  // Filter products based on product name
  const filteredProducts = useMemo(() => {
    if (!productNameInput.trim()) return products.slice(0, 10);
    const input = productNameInput.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(input)
    ).slice(0, 10);
  }, [productNameInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowProductSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductSelect = (product: Product) => {
    setProductNameInput(product.name);
    setSelectedProduct(product);
    setShowProductSuggestions(false);
  };

  const handleConfirm = () => {
    if (selectedProduct && author.trim() && comment.trim() && dateTime.trim()) {
      const formattedDate = formatDate(dateTime);
      const newReview: Review = {
        id: Math.max(...reviews.map(r => r.id), 0) + 1,
        productId: selectedProduct.id,
        author: author.trim(),
        rating: rating,
        comment: comment.trim(),
        date: formattedDate,
        verified: verified
      };
      setReviews((prev) => [newReview, ...prev]);
      onSave?.(newReview);
      
      // Reset form
      setProductNameInput('');
      setSelectedProduct(null);
      setAuthor('');
      setRating(5);
      setComment('');
      setDateTime('');
      setVerified(false);
    }
  };

  const handleDeleteClick = (id: number, author: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(author);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId !== null) {
      setReviews((prev) => prev.filter((r) => r.id !== deleteTargetId));
      onDelete?.(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  const canConfirm = selectedProduct !== null && author.trim().length > 0 && comment.trim().length > 0 && dateTime.trim().length > 0;

  const renderStars = (count: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && onStarClick?.(i + 1)}
        className={cn(
          interactive && 'cursor-pointer hover:scale-110 transition-transform',
          !interactive && 'pointer-events-none'
        )}
      >
        <Star
          className={cn(
            'w-5 h-5',
            i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          )}
        />
      </button>
    ));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack || (() => router.back())}
            className="w-10 h-10 p-2 bg-neutral-100 rounded-lg flex justify-center items-center"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-900" />
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Fake Review</h2>
            <p className="text-zinc-400 text-sm md:text-base font-normal">Add fake reviews to products</p>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left card */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6">
          {/* Product Name with Autocomplete */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Product Name</label>
            <div className="relative" ref={suggestionsRef}>
              <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
                <input
                  value={productNameInput}
                  onChange={(e) => {
                    setProductNameInput(e.target.value);
                    setSelectedProduct(null);
                    setShowProductSuggestions(true);
                  }}
                  onFocus={() => setShowProductSuggestions(true)}
                  placeholder="Type product name..."
                  className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
                />
              </div>
              
              {/* Product Suggestions Dropdown */}
              {showProductSuggestions && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleProductSelect(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex flex-col gap-1 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-zinc-900 text-sm font-semibold font-['Poppins']">
                        {product.name}
                      </div>
                      <div className="text-zinc-600 text-xs font-['Poppins']">
                        ID: {product.id} {product.sku && `• SKU: ${product.sku}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedProduct && (
              <div className="text-xs text-green-600 font-['Poppins']">
                Selected: {selectedProduct.name} (ID: {selectedProduct.id})
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">User Name</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter reviewer name..."
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Rating</label>
            <div className="flex items-center gap-2">
              {renderStars(rating, true, setRating)}
              <span className="text-zinc-600 text-sm font-['Poppins'] ml-2">
                ({rating} / 5)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Review Comment</label>
            <div className="w-full h-32 p-3 rounded-lg outline outline-1 outline-zinc-400">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write review comment..."
                className="w-full h-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins'] resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Date & Time</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins'] cursor-pointer"
              />
            </div>
            {dateTime && (
              <p className="text-xs text-green-600 font-['Poppins']">
                Will display as: {formatDate(dateTime)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Verified Purchase</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 text-fuchsia-500 rounded"
                />
                <span className="text-zinc-900 text-base font-normal font-['Poppins']">Mark as verified purchase</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right card - Preview */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-2">
          <label className="text-neutral-800 text-base font-medium font-['Poppins']">Preview</label>
          <div className="w-full p-6 rounded-lg outline outline-1 outline-zinc-400 bg-gray-50 min-h-[400px]">
            {selectedProduct && author && comment ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {/* Stars */}
                    <div className="flex gap-1.5 mb-3.5">
                      {renderStars(rating)}
                    </div>
                    {/* Author and Verified Badge */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="text-black text-xl font-bold font-['Satoshi']">{author}</div>
                      {verified && (
                        <div className="w-6 h-6 bg-green-600 rounded-full flex justify-center items-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Review Text */}
                    <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug mb-4">
                      "{comment}"
                    </div>
                  </div>
                </div>
                {/* Date */}
                <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug">
                  {dateTime ? formatDate(dateTime) : 'Date will appear here'}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 text-base font-['Poppins']">
                Fill in the form to see preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={onBack || (() => router.back())}
          className="h-12 px-6 py-3 rounded outline outline-1 outline-red-500 text-red-500 font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={cn('h-12 px-6 py-3 rounded bg-fuchsia-500 text-white font-medium', !canConfirm && 'opacity-60 cursor-not-allowed')}
        >
          Add Review
        </button>
      </div>

      {/* Existing Reviews Section */}
      {reviews.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Reviews</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => {
              const product = products.find(p => p.id === review.productId);
              return (
                <div
                  key={review.id}
                  className="relative group px-6 sm:px-8 py-6 sm:py-7 rounded-[20px] outline-1 outline-offset-[-1px] outline-black/10 bg-white hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(review.id, review.author)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label={`Delete review by ${review.author}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Product Info */}
                  {product && (
                    <div className="mb-3 pb-3 border-b border-gray-200">
                      <div className="text-xs text-zinc-500 font-['Poppins'] mb-1">Product:</div>
                      <div className="text-sm text-zinc-900 font-semibold font-['Poppins']">
                        ID {product.id} - {product.name}
                      </div>
                    </div>
                  )}

                  {/* Review Content */}
                  <div className="flex justify-between items-start gap-4 mb-4">
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Review Text */}
                      <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug mb-4">
                        "{review.comment}"
                      </div>
                    </div>
                  </div>
                  {/* Date */}
                  <div className="text-black/60 text-base font-normal font-['Poppins'] leading-snug">
                    {dateTime ? formatDate(dateTime) : review.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeleteTargetName('');
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        itemName={deleteTargetName ? `Review by ${deleteTargetName}` : undefined}
      />
    </div>
  );
}

