'use client';

import React, { useRef, useState } from 'react';
import { Plus, ImagePlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  image: string;
}

interface AddCategoryFormProps {
  onCancel?: () => void;
  onConfirm?: (data: { category: string; childCategory: string; image?: string | null }) => void;
  onDelete?: (id: number) => void;
}

export default function AddCategoryForm({ onCancel, onConfirm, onDelete }: AddCategoryFormProps) {
  const [category, setCategory] = useState('');
  const [childCategory, setChildCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Existing categories - in a real app, this would come from an API/state management
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Jacket', image: '/categories/image/category1.png' },
    { id: 2, name: 'Trousers', image: '/categories/image/category2.png' },
    { id: 3, name: 'Hoodie', image: '/categories/image/category3.png' },
    { id: 4, name: 'Muffler', image: '/categories/image/category4.png' },
    { id: 5, name: 'Combo', image: '/categories/image/category5.png' },
    { id: 6, name: 'Shoe', image: '/categories/image/category6.png' },
  ]);

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
    if (category.trim() && image) {
      // Add new category to the list (at the beginning)
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: category,
        image: image,
      };
      setCategories((prev) => [newCategory, ...prev]);
      
      // Call the onConfirm callback
      onConfirm?.({ category, childCategory, image });
      
      // Reset form
      setCategory('');
      setChildCategory('');
      setImage(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      onDelete?.(id);
    }
  };

  const canConfirm = category.trim().length > 0 && image !== null;

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

      {/* Existing Categories Section */}
      {categories.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Categories</h3>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative group p-1.5 md:p-3 bg-fuchsia-400/10 rounded-xl flex flex-col justify-start items-center gap-1.5 md:gap-6 hover:shadow-[5px_11px_22.1px_0px_rgba(0,0,0,0.15)] transition-all duration-300"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label={`Delete ${cat.name} category`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Category Image */}
                <img
                  className="w-full h-20 md:h-40 rounded-lg object-cover"
                  src={cat.image}
                  alt={`${cat.name} category`}
                  loading="lazy"
                />

                {/* Category Name */}
                <div className="w-full text-center text-black text-sm md:text-lg font-medium font-['Poppins'] leading-tight md:leading-normal">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


