'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Upload, Trash2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import { FestivalBanner } from '@/types';
import { uploadImageClient } from '@/lib/uploadImageClient';

interface Coupon {
  code: string;
  amount: string;
}

interface AddFestivalOfferFormProps {
  onBack?: () => void;
  onSave?: (data: FestivalBanner[]) => void;
  onDelete?: (id: string) => void;
}

export default function AddFestivalOfferForm({ onBack, onSave, onDelete }: AddFestivalOfferFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [discount, setDiscount] = useState('');
  const [emi, setEmi] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponAmount, setCouponAmount] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [banners, setBanners] = useState<FestivalBanner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChooseFile = () => fileRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploadedUrl = await uploadImageClient(files[0], { folder: 'festival-banners' });
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

  const addCoupon = () => {
    if (couponCode.trim() && couponAmount.trim()) {
      setCoupons((prev) => [...prev, { code: couponCode.trim(), amount: couponAmount.trim() }]);
      setCouponCode('');
      setCouponAmount('');
    }
  };

  const removeCoupon = (index: number) => {
    setCoupons((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/festival-banners?includeInactive=true');
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load festival banners');
      }

      const data: FestivalBanner[] = Array.isArray(result.data) ? result.data : [];
      setBanners(data);
      setIsVisible(data.some((banner) => banner.isActive));
      onSave?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load festival banners');
      setBanners([]);
      setIsVisible(false);
    } finally {
      setLoading(false);
    }
  }, [onSave]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const resetFormFields = () => {
    setTitle('');
    setSubtitle('');
    setDiscount('');
    setEmi('');
    setImage(null);
    setCoupons([]);
    setCouponCode('');
    setCouponAmount('');
  };

  const handleVisibilityToggle = async () => {
    if (!banners.length) {
      setIsVisible((prev) => !prev);
      return;
    }

    const nextState = !isVisible;
    setIsVisible(nextState);
    try {
      await Promise.all(
        banners.map((banner) =>
          fetch(`/api/festival-banners/${banner.id}`, {
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
        discount: discount.trim(),
        emi: emi.trim(),
        image,
        coupons,
        order: banners.length,
        isActive: true,
      };

      const response = await fetch('/api/festival-banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save festival banner');
      }

      await fetchBanners();
      resetFormFields();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save festival banner');
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
      const response = await fetch(`/api/festival-banners/${deleteTargetId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete festival banner');
      }
      onDelete?.(deleteTargetId);
      await fetchBanners();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete festival banner');
    } finally {
      setDeleteTargetId(null);
      setDeleteTargetName('');
      setDeleteModalOpen(false);
    }
  };

  const canConfirm = title.trim().length > 0 && subtitle.trim().length > 0 && discount.trim().length > 0 && emi.trim().length > 0 && image !== null && coupons.length > 0;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Show/Hide Toggle Switch */}
      <div className="w-full p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-slate-950 text-lg font-semibold font-['Poppins']">Show on Client Side</span>
          <span className="text-zinc-500 text-sm font-normal font-['Poppins']">Toggle visibility of festival offer banners on categories page</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={cn('text-sm font-medium font-Poppins transition-colors', !isVisible ? 'text-slate-950' : 'text-zinc-400')}>
            Hide
          </span>
          <button
            type="button"
            onClick={handleVisibilityToggle}
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
            <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Festival Offer</h2>
            <p className="text-zinc-400 text-sm md:text-base font-normal">Manage festival offer banners</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left card */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Title (Bengali)</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="শারদায় শপিং ফেস্ট"
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Subtitle (English)</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="ELECTRONIC & APPLIANCES"
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-800 text-base font-medium font-['Poppins']">Discount</label>
              <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
                <input
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="50% OFF"
                  className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-800 text-base font-medium font-['Poppins']">EMI</label>
              <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
                <input
                  value={emi}
                  onChange={(e) => setEmi(e.target.value)}
                  placeholder="0% EMI AVAILABLE"
                  className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
                />
              </div>
            </div>
          </div>

          {/* Coupons Section */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Coupons</label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (e.g., puja5)"
                  className="flex-1 bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoupon())}
                />
              </div>
              <div className="flex-1 p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
                <input
                  value={couponAmount}
                  onChange={(e) => setCouponAmount(e.target.value)}
                  placeholder="Amount (e.g., 1000TK*)"
                  className="flex-1 bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoupon())}
                />
              </div>
              <button
                type="button"
                onClick={addCoupon}
                className="px-4 h-12 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200"
              >
                <Plus className="w-5 h-5 text-zinc-900" />
              </button>
            </div>
            {coupons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {coupons.map((coupon, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-neutral-100 rounded-md text-sm text-zinc-900 font-['Poppins'] inline-flex items-center gap-2"
                  >
                    {coupon.code} • save upto {coupon.amount}
                    <button
                      type="button"
                      onClick={() => removeCoupon(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
          className="h-12 px-6 py-3 rounded outline outline-1 outline-red-500 text-red-500 font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm || saving || uploading}
          className={cn(
            'h-12 px-6 py-3 rounded bg-fuchsia-500 text-white font-medium transition-opacity',
            (!canConfirm || saving || uploading) && 'opacity-60 cursor-not-allowed'
          )}
        >
          {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Confirm'}
        </button>
      </div>

      {/* Existing Banners Section */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Festival Offer Banners</h3>
          {!loading && (
            <span className="text-sm text-zinc-500 font-medium">
              {banners.filter((banner) => banner.isActive).length} active / {banners.length} total
            </span>
          )}
        </div>

        {loading ? (
          <div className="w-full p-4 bg-white rounded-lg border border-dashed border-neutral-200 text-center text-zinc-500">
            Loading festival offer banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="w-full p-4 bg-white rounded-lg border border-dashed border-neutral-200 text-center text-zinc-500">
            No festival offer banners yet. Add your first banner above.
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="relative group h-[300px] sm:h-[380px] md:h-[450px] lg:h-[512px] rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteClick(banner.id, banner.title)}
                  className="absolute top-3 right-3 z-20 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  aria-label={`Delete ${banner.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover"
                    src={banner.image}
                    alt={banner.title}
                    loading="lazy"
                  />
                  {!banner.isActive && (
                    <span className="absolute top-3 left-3 z-20 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-red-600">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center text-white px-3 sm:px-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-yellow-300">
                      {banner.title}
                    </h1>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4">
                      {banner.subtitle}
                    </h2>

                    <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-xl inline-block mb-4 md:mb-6 bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                      <div className="text-sm md:text-base font-semibold text-white/90">UP TO {banner.discount}</div>
                      <div className="text-xs md:text-sm text-white/80">{banner.emi}</div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-3 text-white/90">APP EXCLUSIVE COUPON</h3>
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        {banner.coupons.map((coupon, index) => (
                          <div
                            key={`${banner.id}-${coupon.code}-${index}`}
                            className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium text-xs md:text-sm text-white/90 bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
                          >
                            {coupon.code} • save upto {coupon.amount}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        title="Delete Festival Offer Banner"
        message="Are you sure you want to delete this festival offer banner?"
        itemName={deleteTargetName}
      />
    </div>
  );
}

