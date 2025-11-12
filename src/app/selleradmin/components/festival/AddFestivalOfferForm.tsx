'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, Upload, Trash2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface Coupon {
  code: string;
  amount: string;
}

interface FestivalBanner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  discount: string;
  emi: string;
  coupons: Coupon[];
}

interface AddFestivalOfferFormProps {
  onBack?: () => void;
  onSave?: (data: FestivalBanner[]) => void;
  onDelete?: (id: number) => void;
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
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  // Existing banners
  const [banners, setBanners] = useState<FestivalBanner[]>([
    {
      id: 1,
      image: '/promoslider/slider1.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '50% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    },
    {
      id: 2,
      image: '/promoslider/slider2.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '40% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    },
    {
      id: 3,
      image: '/promoslider/slider3.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '60% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    },
    {
      id: 4,
      image: '/promoslider/slider4.png',
      title: 'শারদায় শপিং ফেস্ট',
      subtitle: 'ELECTRONIC & APPLIANCES',
      discount: '35% OFF',
      emi: '0% EMI AVAILABLE',
      coupons: [
        { code: 'puja5', amount: '1000TK*' },
        { code: 'puja7', amount: '2500TK*' }
      ]
    }
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([]);

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

  const handleConfirm = () => {
    if (title.trim() && subtitle.trim() && discount.trim() && emi.trim() && image && coupons.length > 0) {
      const newBanner: FestivalBanner = {
        id: Math.max(...banners.map(b => b.id), 0) + 1,
        image: image,
        title: title.trim(),
        subtitle: subtitle.trim(),
        discount: discount.trim(),
        emi: emi.trim(),
        coupons: [...coupons]
      };
      setBanners((prev) => [newBanner, ...prev]);
      onSave?.(banners);
      
      // Reset form
      setTitle('');
      setSubtitle('');
      setDiscount('');
      setEmi('');
      setImage(null);
      setCoupons([]);
      setCouponCode('');
      setCouponAmount('');
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
            <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Festival Offer</h2>
            <p className="text-zinc-400 text-sm md:text-base font-normal">Manage festival offer banners</p>
          </div>
        </div>
      </div>

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
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Festival Offer Banners</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="relative group h-[300px] sm:h-[380px] md:h-[450px] lg:h-[512px] rounded-tl-3xl rounded-tr-xl rounded-bl-3xl rounded-br-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover"
                    src={banner.image}
                    alt={banner.title}
                    loading="lazy"
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center text-white px-3 sm:px-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-yellow-300">
                      {banner.title}
                    </h1>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4">
                      {banner.subtitle}
                    </h2>
                    
                    {/* Promotional Badge */}
                    <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-xl inline-block mb-4 md:mb-6 bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                      <div className="text-sm md:text-base font-semibold text-white/90">UP TO {banner.discount}</div>
                      <div className="text-xs md:text-sm text-white/80">{banner.emi}</div>
                    </div>

                    {/* App Exclusive Coupons */}
                    <div className="space-y-2">
                      <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-3 text-white/90">APP EXCLUSIVE COUPON</h3>
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        {banner.coupons.map((coupon, index) => (
                          <div
                            key={index}
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
        title="Delete Festival Offer Banner"
        message="Are you sure you want to delete this festival offer banner?"
        itemName={deleteTargetName}
      />
    </div>
  );
}

