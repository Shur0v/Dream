'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface PromoBanner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  initialTime: { days: number; hours: number; minutes: number; seconds: number };
}

interface AddPromoBannerFormProps {
  onBack?: () => void;
  onSave?: (data: PromoBanner[]) => void;
  onDelete?: (id: number) => void;
}

export default function AddPromoBannerForm({ onBack, onSave, onDelete }: AddPromoBannerFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');

  // Existing banners
  const [banners, setBanners] = useState<PromoBanner[]>([
    {
      id: 1,
      image: '/promoslider/slider1.png',
      title: 'Flat 30% OFF on Headphones & Accessories',
      subtitle: "Don't miss out on today's exclusive deal.",
      initialTime: { days: 18, hours: 19, minutes: 18, seconds: 45 }
    },
    {
      id: 2,
      image: '/promoslider/slider2.png',
      title: 'Save 40% on Smart Watches',
      subtitle: 'Limited time offer ends soon.',
      initialTime: { days: 5, hours: 12, minutes: 0, seconds: 0 }
    },
    {
      id: 3,
      image: '/promoslider/slider3.png',
      title: 'Mega Sale: Bluetooth Speakers',
      subtitle: 'Grab premium sound at low prices.',
      initialTime: { days: 2, hours: 6, minutes: 30, seconds: 10 }
    },
    {
      id: 4,
      image: '/promoslider/slider4.png',
      title: 'Exclusive Deals on Gaming Gear',
      subtitle: 'Upgrade your setup today.',
      initialTime: { days: 10, hours: 0, minutes: 45, seconds: 20 }
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
    if (title.trim() && subtitle.trim() && image) {
      const newBanner: PromoBanner = {
        id: Math.max(...banners.map(b => b.id), 0) + 1,
        image: image,
        title: title.trim(),
        subtitle: subtitle.trim(),
        initialTime: { days, hours, minutes, seconds }
      };
      setBanners((prev) => [newBanner, ...prev]);
      onSave?.(banners);
      
      // Reset form
      setTitle('');
      setSubtitle('');
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

  const canConfirm = title.trim().length > 0 && subtitle.trim().length > 0 && image !== null;

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
            <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Promo Banners</h2>
            <p className="text-zinc-400 text-sm md:text-base font-normal">Manage promotional banners</p>
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
                placeholder="Enter banner title..."
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Subtitle</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter banner subtitle..."
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
          <label className="text-neutral-800 text-base font-medium font-['Poppins']">Banner Image</label>
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
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Promo Banners</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="relative group p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-3 hover:shadow-lg transition-all duration-300"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteClick(banner.id, banner.title)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label={`Delete ${banner.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Banner Image */}
                <img
                  className="w-full h-32 rounded-lg object-cover"
                  src={banner.image}
                  alt={banner.title}
                  loading="lazy"
                />

                {/* Banner Info */}
                <div className="flex flex-col gap-1">
                  <div className="text-black text-sm font-semibold font-['Poppins'] line-clamp-2">
                    {banner.title}
                  </div>
                  <div className="text-zinc-600 text-xs font-normal font-['Poppins'] line-clamp-1">
                    {banner.subtitle}
                  </div>
                  <div className="text-zinc-500 text-xs font-mono font-['Poppins'] mt-1">
                    {banner.initialTime.days}d {banner.initialTime.hours}h {banner.initialTime.minutes}m {banner.initialTime.seconds}s
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
        title="Delete Promo Banner"
        message="Are you sure you want to delete this promo banner?"
        itemName={deleteTargetName}
      />
    </div>
  );
}

