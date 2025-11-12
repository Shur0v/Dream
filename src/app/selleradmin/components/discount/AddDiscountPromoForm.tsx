'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface DiscountPromoBanner {
  id: number;
  title: string;
  startingBid: string;
  price: string;
  backgroundImage: string;
  alt: string;
  initialTime: { days: number; hours: number; minutes: number; seconds: number };
}

interface AddDiscountPromoFormProps {
  onBack?: () => void;
  onSave?: (data: DiscountPromoBanner[]) => void;
  onDelete?: (id: number) => void;
}

export default function AddDiscountPromoForm({ onBack, onSave, onDelete }: AddDiscountPromoFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startingBid, setStartingBid] = useState('Starting bid:');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  // Existing banners
  const [banners, setBanners] = useState<DiscountPromoBanner[]>([
    {
      id: 1,
      title: "Apple Powerbank Aluminum Case",
      startingBid: "Starting bid:",
      price: "$849.00",
      backgroundImage: "/promobanner/img1.png",
      alt: "Powerbank",
      initialTime: { days: 118, hours: 8, minutes: 18, seconds: 58 }
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra Pro",
      startingBid: "Starting bid:",
      price: "$1,299.00",
      backgroundImage: "/promobanner/img2.png",
      alt: "Smartphone",
      initialTime: { days: 45, hours: 12, minutes: 30, seconds: 15 }
    }
  ]);

  const handleChooseFile = () => fileRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(files[0]);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleConfirm = () => {
    if (title.trim() && price.trim() && image) {
      const newBanner: DiscountPromoBanner = {
        id: Math.max(...banners.map(b => b.id), 0) + 1,
        title: title.trim(),
        startingBid: startingBid.trim(),
        price: price.trim(),
        backgroundImage: image,
        alt: title.trim().toLowerCase().replace(/\s+/g, '-'),
        initialTime: { days, hours, minutes, seconds }
      };
      setBanners((prev) => [newBanner, ...prev]);
      onSave?.(banners);
      
      // Reset form
      setTitle('');
      setStartingBid('Starting bid:');
      setPrice('');
      setImage(null);
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const handleDeleteClick = (id: number, title: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(title);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId !== null) {
      setBanners((prev) => prev.filter((b) => b.id !== deleteTargetId));
      onDelete?.(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  const canConfirm = title.trim().length > 0 && price.trim().length > 0 && image !== null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Show/Hide Toggle Switch */}
      <div className="w-full p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-slate-950 text-lg font-semibold font-['Poppins']">Show on Client Side</span>
          <span className="text-zinc-500 text-sm font-normal font-['Poppins']">Toggle visibility of discount promo banners on homepage</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={cn('text-sm font-medium font-Poppins transition-colors', !isVisible ? 'text-slate-950' : 'text-zinc-400')}>
            Hide
          </span>
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className={cn(
              'relative inline-flex h-8 w-[60px] items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 shadow-inner',
              isVisible ? 'bg-fuchsia-500' : 'bg-gray-300'
            )}
            aria-label="Toggle visibility"
            role="switch"
            aria-checked={isVisible}
          >
            <span
              className={cn(
                'inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out',
                isVisible ? 'translate-x-[34px]' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn('text-sm font-medium font-Poppins transition-colors', isVisible ? 'text-slate-950' : 'text-zinc-400')}>
            Show
          </span>
        </div>
      </div>

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
            <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Discount Promo</h2>
            <p className="text-zinc-400 text-sm md:text-base font-normal">Manage discount promotional banners</p>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left card */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Title</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title..."
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Starting Bid Label</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                placeholder="Starting bid:"
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Price</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$849.00"
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Countdown Timer</label>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600">Days</label>
                <input
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg outline outline-1 outline-zinc-400 text-zinc-700 text-base font-['Poppins']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg outline outline-1 outline-zinc-400 text-zinc-700 text-base font-['Poppins']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg outline outline-1 outline-zinc-400 text-zinc-700 text-base font-['Poppins']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-600">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg outline outline-1 outline-zinc-400 text-zinc-700 text-base font-['Poppins']"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right card - Photo */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-2">
          <label className="text-neutral-800 text-base font-medium font-['Poppins']">Background Image</label>
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={handleDrop}
            className="w-full min-h-56 px-3 py-6 rounded-lg outline outline-1 outline-zinc-400 flex flex-col items-center justify-center gap-4"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Preview" className="w-full max-w-md h-40 object-contain rounded" />
            ) : (
              <>
                <div className="p-2.5 bg-blue-100 rounded-[117px]">
                  <div className="p-1.5 bg-blue-200 rounded-[32px]">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                      <Upload className="w-5 h-5 text-fuchsia-500" />
                    </div>
                  </div>
                </div>
                <p className="text-center text-zinc-600 text-base font-normal font-['Poppins']">
                  Drag and drop image here, or click add image
                </p>
              </>
            )}

            <button
              type="button"
              onClick={handleChooseFile}
              className="px-4 py-2.5 bg-fuchsia-500 rounded-lg text-white text-sm font-medium font-['Poppins']"
            >
              {image ? 'Change Image' : 'Add Image'}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
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
          Confirm
        </button>
      </div>

      {/* Existing Banners Section */}
      {banners.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Discount Promo Banners</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`relative group w-full ${index === 0 ? 'md:basis-[49%] md:max-w-[648px]' : 'md:basis-[51%] md:max-w-[648px] md:flex-1'} md:min-w-0 aspect-[648/400] bg-black/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteClick(banner.id, banner.title)}
                  className="absolute top-3 right-3 z-20 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  aria-label={`Delete ${banner.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Background Image */}
                <div className="absolute inset-0 z-0 rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={banner.backgroundImage}
                    alt={banner.alt}
                    loading="lazy"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/15" />
                </div>

                {/* Content Overlay - Matching Homepage Design */}
                <div className={`absolute inset-0 z-10 flex flex-col justify-center items-start ${index === 0 ? 'px-4 sm:px-6 md:px-9' : 'px-4 sm:px-6 md:px-[38px]'} ${index === 0 ? 'py-4 sm:py-6 md:py-10' : 'py-4 sm:py-6 md:py-[40px]'} gap-2.5 sm:gap-3.5 md:gap-6`}>
                  <div className={`w-full ${index === 0 ? 'max-w-[572px]' : 'md:w-[572px]'} flex flex-col justify-start items-start gap-2 sm:gap-2.5 md:gap-3`}>
                    {/* Title */}
                    <div className="w-full justify-start text-white text-base sm:text-xl md:text-3xl font-semibold font-['Poppins'] leading-tight sm:leading-7 md:leading-10">
                      {banner.title}
                    </div>
                    
                    {/* Price Info */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-0.5 sm:gap-1 md:gap-1">
                      <div className="self-stretch justify-start text-red-500 text-xs sm:text-sm md:text-base font-semibold font-['Poppins'] leading-5 sm:leading-6 md:leading-7">
                        {banner.startingBid}
                      </div>
                      <div className="self-stretch justify-start text-white text-lg sm:text-2xl md:text-3xl font-semibold font-['Poppins']">
                        {banner.price}
                      </div>
                    </div>
                    
                    {/* Countdown Timer */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2 sm:gap-2.5 md:gap-4">
                      <div className="flex flex-col justify-start items-center gap-1 sm:gap-1.5 md:gap-2">
                        <div className="inline-flex justify-start items-start gap-1 sm:gap-1.5 md:gap-2">
                          {/* Days */}
                          <div className="inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 md:gap-1.5">
                            <div className="w-10 sm:w-12 md:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 md:gap-1.5">
                              <div className="w-9 h-7 sm:w-10 sm:h-8 md:w-12 md:h-10 p-1 sm:p-1.5 md:p-2.5 bg-white rounded flex justify-center items-center">
                                <div className="text-center justify-start text-blue-700 text-xs sm:text-sm md:text-lg font-semibold font-['PolySans_Trial']">
                                  {String(banner.initialTime.days).padStart(2, '0')}
                                </div>
                              </div>
                              <div className="inline-flex flex-col justify-start items-start gap-0.5 sm:gap-1 md:gap-1.5">
                                <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-neutral-800 rounded-full" />
                                <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-neutral-800 rounded-full" />
                              </div>
                            </div>
                            <div className="justify-start text-white text-[9px] sm:text-[10px] md:text-xs font-medium font-['Poppins']">
                              DAYS
                            </div>
                          </div>
                          
                          {/* Hours */}
                          <div className="inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 md:gap-1.5">
                            <div className="w-10 sm:w-12 md:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 md:gap-1.5">
                              <div className="w-9 h-7 sm:w-10 sm:h-8 md:w-12 md:h-10 p-1 sm:p-1.5 md:p-2.5 bg-white rounded flex justify-center items-center">
                                <div className="text-center justify-start text-blue-700 text-xs sm:text-sm md:text-lg font-semibold font-['PolySans_Trial']">
                                  {String(banner.initialTime.hours).padStart(2, '0')}
                                </div>
                              </div>
                              <div className="inline-flex flex-col justify-start items-start gap-0.5 sm:gap-1 md:gap-1.5">
                                <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-neutral-800 rounded-full" />
                                <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-neutral-800 rounded-full" />
                              </div>
                            </div>
                            <div className="justify-start text-white text-[9px] sm:text-[10px] md:text-xs font-medium font-['Poppins']">
                              HOURS
                            </div>
                          </div>
                          
                          {/* Minutes */}
                          <div className="inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 md:gap-1.5">
                            <div className="w-10 sm:w-12 md:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 md:gap-1.5">
                              <div className="w-9 h-7 sm:w-10 sm:h-8 md:w-12 md:h-10 p-1 sm:p-1.5 md:p-2.5 bg-white rounded flex justify-center items-center">
                                <div className="text-center justify-start text-blue-700 text-xs sm:text-sm md:text-lg font-semibold font-['PolySans_Trial']">
                                  {String(banner.initialTime.minutes).padStart(2, '0')}
                                </div>
                              </div>
                              <div className="inline-flex flex-col justify-start items-start gap-0.5 sm:gap-1 md:gap-1.5">
                                <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-neutral-800 rounded-full" />
                                <div className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-neutral-800 rounded-full" />
                              </div>
                            </div>
                            <div className="justify-start text-white text-[9px] sm:text-[10px] md:text-xs font-medium font-['Poppins']">
                              MINS
                            </div>
                          </div>
                          
                          {/* Seconds */}
                          <div className="inline-flex flex-col justify-start items-center gap-1 sm:gap-1.5 md:gap-1.5">
                            <div className="w-10 sm:w-12 md:w-14 inline-flex justify-start items-center gap-0.5 sm:gap-1 md:gap-1.5">
                              <div className="w-9 h-7 sm:w-10 sm:h-8 md:w-12 md:h-10 p-1 sm:p-1.5 md:p-2.5 bg-white rounded flex justify-center items-center">
                                <div className="text-center justify-start text-blue-700 text-xs sm:text-sm md:text-lg font-semibold font-['PolySans_Trial']">
                                  {String(banner.initialTime.seconds).padStart(2, '0')}
                                </div>
                              </div>
                            </div>
                            <div className="justify-start text-white text-[9px] sm:text-[10px] md:text-xs font-medium font-['Poppins']">
                              SECS
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Buy Now Button */}
                    <div className="h-8 sm:h-9 md:h-11 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-xl inline-flex justify-center items-center cursor-pointer transition-colors duration-300">
                      <div className="justify-start text-white text-xs sm:text-sm md:text-base font-semibold font-['Poppins'] leading-none">
                        Buy Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        title="Delete Discount Promo Banner"
        message="Are you sure you want to delete this discount promo banner?"
        itemName={deleteTargetName}
      />
    </div>
  );
}

