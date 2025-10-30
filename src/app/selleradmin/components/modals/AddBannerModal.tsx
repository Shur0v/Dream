'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Backdrop: React.FC<{ onClick: () => void } > = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black/50 z-[60]"
    onClick={onClick}
    aria-hidden="true"
  />
);

export default function AddBannerModal({ isOpen, onClose }: AddBannerModalProps) {
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sliderIconInputRef = useRef<HTMLInputElement | null>(null);
  const headerFileRefs = [useRef<HTMLInputElement | null>(null), useRef<HTMLInputElement | null>(null), useRef<HTMLInputElement | null>(null)];
  const [headerPreviews, setHeaderPreviews] = useState<Array<string | null>>([null, null, null]);
  const rightBannerRefs = [useRef<HTMLInputElement | null>(null), useRef<HTMLInputElement | null>(null)];
  const [rightBannerPreviews, setRightBannerPreviews] = useState<Array<string | null>>([null, null]);

  useEffect(() => {
    if (!isOpen) return;
    // Reset current index if images changed or modal opened
    if (currentIndex >= sliderImages.length) setCurrentIndex(0);
  }, [isOpen, sliderImages.length, currentIndex]);

  const hasImages = sliderImages.length > 0;

  const handlePrev = () => {
    if (!hasImages) return;
    setCurrentIndex((idx) => (idx - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleNext = () => {
    if (!hasImages) return;
    setCurrentIndex((idx) => (idx + 1) % sliderImages.length);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  const handleAddToSlider = () => {
    if (!previewImage) return;
    setSliderImages((prev) => [...prev, previewImage]);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload from top-right icon: instantly add to slider
  const handleSliderIconChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSliderImages((prev) => {
      const next = [...prev, url];
      setCurrentIndex(next.length - 1);
      return next;
    });
    if (sliderIconInputRef.current) sliderIconInputRef.current.value = '';
  };

  const handleChooseHeaderFile = (i: number) => {
    headerFileRefs[i].current?.click();
  };

  const handleHeaderFileChange = (i: number): React.ChangeEventHandler<HTMLInputElement> => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setHeaderPreviews((prev) => prev.map((v, idx) => (idx === i ? url : v)));
  };

  const handleChooseRightBanner = (i: number) => {
    rightBannerRefs[i].current?.click();
  };

  const handleRightBannerChange = (i: number): React.ChangeEventHandler<HTMLInputElement> => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRightBannerPreviews((prev) => prev.map((v, idx) => (idx === i ? url : v)));
  };

  const removeSlide = (i: number) => {
    setSliderImages((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      const nextIndex = Math.max(0, Math.min(currentIndex, next.length - 1));
      setCurrentIndex(nextIndex);
      return next;
    });
  };

  const clearHeaderPreview = () => setHeaderPreviews((prev) => prev.map((v, i) => (i === 0 ? null : v)));
  const clearRightBannerPreview = (i: number) => setRightBannerPreviews((prev) => prev.map((v, idx) => (idx === i ? null : v)));

  const ModalBody = useMemo(() => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Banner</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Slider (50% width) */}
          <div>
            <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center aspect-[804/513]">
              {hasImages ? (
                // Current slide
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sliderImages[currentIndex]} alt="banner" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500">No banner added yet</div>
              )}

              {/* Upload icon (top-right) */}
              <button
                onClick={() => sliderIconInputRef.current?.click()}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-white shadow inline-flex items-center gap-2 hover:bg-gray-50 text-sm font-medium text-neutral-700"
                aria-label="Upload banner image"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <input ref={sliderIconInputRef} type="file" accept="image/*" className="hidden" onChange={handleSliderIconChange} />

              {/* Controls */}
              <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow">‹</button>
              <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow">›</button>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full ${i === currentIndex ? 'bg-fuchsia-600' : 'bg-white/70'} border border-fuchsia-500`}
                  />
                ))}
              </div>
            </div>
            {/* Gallery thumbnails */}
            <div className="mt-4 w-full overflow-x-auto">
              <div className="flex items-center gap-3 min-w-full">
                {sliderImages.map((src, i) => (
                  <div key={`thumb-${i}`} className={`relative flex-shrink-0 w-[120px] aspect-[804/513] rounded-lg overflow-hidden border ${i === currentIndex ? 'border-fuchsia-500 ring-2 ring-fuchsia-300' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setCurrentIndex(i)}
                      className="absolute inset-0"
                      aria-label={`Select slide ${i + 1}`}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSlide(i); }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/60 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white/80"
                      aria-label="Remove slide"
                    >
                      <X className="w-3 h-3 text-neutral-700" />
                    </button>
                  </div>
                ))}
                {!sliderImages.length && (
                  <div className="text-gray-400 text-sm">No images in slider</div>
                )}
              </div>
            </div>

            {/* Uploader controls under banner */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleChooseFile} className="h-[40px] px-4 rounded-lg bg-neutral-800 text-white text-sm font-semibold hover:opacity-90">Choose Image</button>
              <button onClick={handleAddToSlider} disabled={!previewImage} className="h-[40px] px-4 rounded-lg bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 text-white text-sm font-semibold disabled:opacity-50">Add to Slider</button>
            </div>
          </div>

          {/* Right: Red-marked structure */}
          <div>
            <div className="border border-gray-200 rounded-xl p-4">
              {/* Top row: single header card */}
              <div className="grid grid-cols-1 gap-4">
                <div className="relative border border-gray-200 rounded-xl p-3">
                  <div className="text-sm font-medium mb-2">Header Image</div>
                  <div className="bg-gray-50 rounded-lg overflow-hidden aspect-[492/229] flex items-center justify-center">
                    {headerPreviews[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={headerPreviews[0] as string} alt={`header-1`} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-400 text-sm">Preview</span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center justify-center gap-4">
                    {headerPreviews[0] && (
                      <button
                        onClick={(e) => { e.stopPropagation(); clearHeaderPreview(); }}
                        className="px-3 py-1.5 rounded-md bg-white shadow inline-flex items-center justify-center hover:bg-gray-50 text-sm text-neutral-700"
                        aria-label="Clear header image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleChooseHeaderFile(0)}
                      className="px-3 py-1.5 rounded-md bg-white shadow inline-flex items-center gap-2 hover:bg-gray-50 text-sm font-medium text-neutral-700"
                      aria-label={`Upload header image`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                  <input ref={headerFileRefs[0]} type="file" accept="image/*" className="hidden" onChange={handleHeaderFileChange(0)} />
                </div>
              </div>

              {/* Bottom row: two big boxes */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[0,1].map((i) => (
                  <div key={`rb-${i}`} className="relative border border-gray-200 rounded-xl p-3">
                    <div className="text-sm font-medium mb-2">Right Banner {i+1}</div>
                    <div className="bg-gray-50 rounded-lg overflow-hidden aspect-[234/260] flex items-center justify-center">
                      {rightBannerPreviews[i] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rightBannerPreviews[i] as string} alt={`right-${i+1}`} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-400 text-sm">Preview</span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center justify-center gap-4">
                      {rightBannerPreviews[i] && (
                        <button
                          onClick={(e) => { e.stopPropagation(); clearRightBannerPreview(i); }}
                          className="px-3 py-1.5 rounded-md bg-white shadow inline-flex items-center justify-center hover:bg-gray-50 text-sm text-neutral-700"
                          aria-label={`Clear right banner ${i+1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleChooseRightBanner(i)}
                        className="px-3 py-1.5 rounded-md bg-white shadow inline-flex items-center gap-2 hover:bg-gray-50 text-sm font-medium text-neutral-700"
                        aria-label={`Upload right banner ${i+1}`}
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    </div>
                    <input ref={rightBannerRefs[i]} type="file" accept="image/*" className="hidden" onChange={handleRightBannerChange(i)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="h-[40px] px-4 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50">Close</button>
          <button
            onClick={() => { console.log('Saved banners', { sliderImages, headerImage: headerPreviews[0], rightBanners: rightBannerPreviews }); onClose(); }}
            className="h-[40px] px-5 rounded-lg bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ), [onClose, sliderImages, currentIndex, previewImage, hasImages, headerPreviews, rightBannerPreviews]);

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      {ModalBody}
    </>
  );
}


