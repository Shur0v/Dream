'use client';

import React, { useRef, useState } from 'react';
import { Plus, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddCategoryFormProps {
  onCancel?: () => void;
  onConfirm?: (data: { category: string; childCategory: string; image?: string | null }) => void;
}

export default function AddCategoryForm({ onCancel, onConfirm }: AddCategoryFormProps) {
  const [category, setCategory] = useState('');
  const [childCategory, setChildCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleChoose = () => fileRef.current?.click();

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
    onConfirm?.({ category, childCategory, image });
  };

  const canConfirm = category.trim().length > 0;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Title */}
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Category</h2>
          <p className="text-zinc-400 text-sm md:text-base font-normal">Manage your store inventory</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left card */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6">
          {/* Category Name */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Category Name</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Type category name here..."
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>

          {/* Child Category Name */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Child Category Name</label>
            <div className="w-full h-12 p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={childCategory}
                onChange={(e) => setChildCategory(e.target.value)}
                placeholder="Type child category name here..."
                className="flex-1 bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
              <Plus className="w-4 h-4 text-neutral-800" />
            </div>
          </div>
        </div>

        {/* Right card - Photo */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-2">
          <label className="text-neutral-800 text-base font-medium font-['Poppins']">Photo</label>
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={handleDrop}
            className="w-full min-h-56 px-3 py-6 rounded-lg outline outline-1 outline-zinc-400 flex flex-col items-center justify-center gap-4"
          >
            <div className="p-2.5 bg-blue-100 rounded-[117px]">
              <div className="p-1.5 bg-blue-200 rounded-[32px]">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-fuchsia-500" />
                </div>
              </div>
            </div>

            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Preview" className="w-full max-w-md h-40 object-contain rounded" />
            ) : (
              <p className="text-center text-zinc-600 text-base font-normal font-['Poppins']">
                Drag and drop image here, or click add image
              </p>
            )}

            <button
              type="button"
              onClick={handleChoose}
              className="px-4 py-2.5 bg-fuchsia-500 rounded-lg text-white text-sm font-medium font-['Poppins']"
            >
              Add Image
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
          onClick={onCancel}
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
    </div>
  );
}


