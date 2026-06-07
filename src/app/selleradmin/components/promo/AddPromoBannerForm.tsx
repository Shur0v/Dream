'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import ImageUploadHint from '../ui/ImageUploadHint';
import { PromoBanner, PromoBannerVariant } from '@/types';
import { uploadImageClient } from '@/lib/uploadImageClient';

interface AddPromoBannerFormProps {
  onBack?: () => void;
  onSave?: (data: PromoBanner[]) => void;
  onDelete?: (id: string) => void;
}

const SLIDER_VARIANT: PromoBannerVariant = 'slider';

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
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/promo-banners?includeInactive=true&variant=${SLIDER_VARIANT}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load promo banners');
      }
      const data: PromoBanner[] = Array.isArray(result.data) ? result.data : [];
      setBanners(data);
      setIsVisible(data.some(banner => banner.isActive));
      onSave?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load promo banners');
    } finally {
      setLoading(false);
    }
  }, [onSave]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleChooseFile = () => fileRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploadedUrl = await uploadImageClient(files[0], { folder: 'promo-banners' });
      setImage(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleFiles(e.dataTransfer.files);
  };

  const handleVisibilityToggle = async () => {
    if (!banners.length) {
      setIsVisible(prev => !prev);
      return;
    }

    const nextState = !isVisible;
    setIsVisible(nextState);
    try {
      await Promise.all(
        banners.map((banner) =>
          fetch(`/api/promo-banners/${banner.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: nextState }),
          })
        )
      );
      await fetchBanners();
    } catch (err) {
      setIsVisible(!nextState);
      setError(err instanceof Error ? err.message : 'Failed to update visibility');
    }
  };

  const resetFormFields = () => {
    setTitle('');
    setSubtitle('');
    setImage(null);
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleConfirm = async () => {
    if (!canConfirm || !image) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        image,
        initialTime: { days, hours, minutes, seconds },
        variant: SLIDER_VARIANT,
        isActive: true,
      };

      const response = await fetch('/api/promo-banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save promo banner');
      }

      await fetchBanners();
      resetFormFields();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save promo banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(title);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) {
      return;
    }

    try {
      const response = await fetch(`/api/promo-banners/${deleteTargetId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete promo banner');
      }
      onDelete?.(deleteTargetId);
      await fetchBanners();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete promo banner');
    } finally {
      setDeleteTargetId(null);
      setDeleteTargetName('');
      setDeleteModalOpen(false);
    }
  };

  const canConfirm = title.trim().length > 0 && subtitle.trim().length > 0 && image !== null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Show/Hide Toggle Switch */}
      <div className="w-full p-6 bg-white rounded-2xl border border-zinc-150/80 shadow-sm flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-zinc-800 text-base font-bold font-['Poppins']">Show on Client Side</span>
          <span className="text-zinc-400 text-xs font-semibold font-['Poppins']">Toggle visibility of promo banners on homepage</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={cn('text-xs font-bold font-[\'Poppins\'] uppercase tracking-wider transition-colors', !isVisible ? 'text-zinc-800' : 'text-zinc-400')}>
            Hide
          </span>
          <button
            type="button"
            onClick={handleVisibilityToggle}
            className={cn(
              'relative inline-flex h-8 w-[60px] items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 shadow-inner cursor-pointer',
              isVisible ? 'bg-purple-650' : 'bg-zinc-200'
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
          <span className={cn('text-xs font-bold font-[\'Poppins\'] uppercase tracking-wider transition-colors', isVisible ? 'text-zinc-800' : 'text-zinc-400')}>
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
            className="w-10 h-10 p-2 bg-zinc-55/60 border border-zinc-150 rounded-xl flex justify-center items-center cursor-pointer hover:bg-zinc-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-700" />
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-zinc-800 text-2xl font-bold font-['Poppins']">Promo Banners</h2>
            <p className="text-zinc-450 text-xs font-semibold font-['Poppins'] uppercase tracking-wider">Manage promotional banners</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full p-4 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-rose-600 text-sm font-semibold font-['Poppins']">{error}</p>
        </div>
      )}

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left card */}
        <div className="w-full p-6 bg-white rounded-2xl border border-zinc-150/80 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-500 text-xs font-bold font-['Poppins'] uppercase tracking-wider">Title</label>
            <div className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all font-['Poppins'] inline-flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter banner title..."
                className="w-full bg-transparent outline-none text-zinc-700 text-sm font-semibold font-['Poppins']"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-zinc-500 text-xs font-bold font-['Poppins'] uppercase tracking-wider">Subtitle</label>
            <div className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all font-['Poppins'] inline-flex items-center gap-2">
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter banner subtitle..."
                className="w-full bg-transparent outline-none text-zinc-700 text-sm font-semibold font-['Poppins']"
              />
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-500 text-xs font-bold font-['Poppins'] uppercase tracking-wider mb-1">Countdown Timer</label>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Days</label>
                <input
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-['Poppins']"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right card - Photo */}
        <div className="w-full p-6 bg-white rounded-2xl border border-zinc-150/80 shadow-sm flex flex-col gap-4">
          <label className="text-zinc-500 text-xs font-bold font-['Poppins'] uppercase tracking-wider">Banner Image</label>
          <ImageUploadHint width={984} height={458} />
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={handleDrop}
            className="w-full min-h-56 px-4 py-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 flex flex-col items-center justify-center gap-4 transition-all"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Preview" className="w-full max-w-md h-40 object-contain rounded-xl border border-zinc-100" />
            ) : (
              <>
                <div className="p-2 bg-purple-50 rounded-full">
                  <div className="p-1.5 bg-purple-100/80 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <Upload className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </div>
                <p className="text-center text-zinc-455 text-xs font-bold font-['Poppins'] uppercase tracking-wider">
                  Drag and drop image here, or click add image
                </p>
              </>
            )}

            <button
              type="button"
              onClick={handleChooseFile}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer font-['Poppins']"
            >
              {image ? 'Change Image' : 'Add Image'}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void handleFiles(e.target.files);
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={onBack || (() => router.back())}
          className="h-11 px-5 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold tracking-wider uppercase text-zinc-655 transition-all cursor-pointer flex items-center justify-center font-['Poppins']"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm || saving || uploading}
          className={cn(
            'h-11 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center font-[\'Poppins\']',
            (!canConfirm || saving || uploading) && 'opacity-60 cursor-not-allowed'
          )}
        >
          {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Confirm'}
        </button>
      </div>

      {/* Existing Banners Section */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-zinc-800 text-lg font-bold font-['Poppins']">Existing Promo Banners</h3>
          {!loading && (
            <span className="text-xs text-zinc-450 font-bold font-['Poppins'] uppercase tracking-wider">
              {banners.filter(banner => banner.isActive).length} active / {banners.length} total
            </span>
          )}
        </div>

        {loading ? (
          <div className="w-full p-8 bg-white rounded-2xl border border-zinc-150/70 text-center text-zinc-400 font-semibold font-['Poppins'] shadow-sm animate-pulse">
            Loading promo banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="w-full p-8 bg-white rounded-2xl border border-zinc-150/70 text-center text-zinc-455 font-semibold font-['Poppins'] shadow-sm">
            No promo banners yet. Add your first banner above.
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {banners.map((banner) => {
              const countdown = banner.initialTime || { days: 0, hours: 0, minutes: 0, seconds: 0 };
              return (
                <div
                  key={banner.id}
                  className="relative group p-4 bg-white rounded-2xl border border-zinc-150 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-zinc-200/80 transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(banner.id, banner.title)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    aria-label={`Delete ${banner.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <img
                    className="w-full h-32 rounded-xl object-cover border border-zinc-100"
                    src={banner.image}
                    alt={banner.title}
                    loading="lazy"
                  />

                  <div className="flex flex-col gap-1">
                    <div className="text-zinc-800 text-sm font-bold font-['Poppins'] line-clamp-2">
                      {banner.title}
                    </div>
                    <div className="text-zinc-500 text-xs font-semibold font-['Poppins'] line-clamp-2 mt-0.5">
                      {banner.subtitle || '—'}
                    </div>
                    <div className="text-zinc-400 font-mono text-[11px] font-bold bg-zinc-55/60 px-2 py-0.5 rounded-md border border-zinc-100/50 inline-block w-fit mt-1.5">
                      {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                      {!banner.isActive && <span className="ml-2 text-rose-500 font-bold">Hidden</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
