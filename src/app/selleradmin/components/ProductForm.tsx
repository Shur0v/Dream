'use client';

import React, { useCallback, useRef, useState } from 'react';
import type { Product } from '@/lib/productData';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  nextId: number;
}

export default function ProductForm({ onSubmit, nextId }: ProductFormProps) {
  const [form, setForm] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    currency: '৳',
    image: '/common/allproduct/product6.png',
    rating: 5,
    reviews: 0,
    category: 'Electronics',
    brand: 'Generic',
    sizes: ['M'],
    description: '',
  });
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quantity, setQuantity] = useState<number>(10);
  const [sizesSelected, setSizesSelected] = useState<string[]>(['M']);
  const [colors, setColors] = useState<string[]>(['#22d3ee', '#60a5fa', '#34d399']);
  const [colorInput, setColorInput] = useState<string>('');

  const PRESET_COLORS = ['#000000','#FFFFFF','#EF4444','#3B82F6','#10B981','#F59E0B','#A855F7','#EC4899','#6B7280','#1E3A8A','#92400E','#F97316'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'rating' || name === 'reviews' ? Number(value) : value,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: nextId,
      name: form.name,
      price: form.price,
      originalPrice: form.originalPrice,
      currency: form.currency,
      image: filePreviewUrl || form.image,
      rating: Math.max(1, Math.min(5, form.rating || 5)),
      reviews: form.reviews || 0,
      isVerifiedSeller: true,
      category: form.category,
      brand: form.brand,
      sizes: sizesSelected.length ? sizesSelected : form.sizes,
      description: form.description || undefined,
      colors: colors.length ? colors : undefined,
      stock: quantity,
    };
    onSubmit(newProduct);
  };

  const onFileSelected = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 mb-1">
        <div className="text-slate-900 text-lg font-semibold">Product Information</div>
      </div>
      <div className="md:col-span-2">
        <div
          className={`relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border-2 ${isDragging ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-dashed border-gray-300 bg-slate-50'}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-700 mb-1">Upload Image</div>
            <div className="text-xs text-slate-500 mb-3">Drag & drop product image here, or click to browse. If you don’t upload, the Image URL below will be used.</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 px-4 rounded-lg bg-white border border-gray-300 hover:bg-slate-50"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files[0] && onFileSelected(e.target.files[0])}
              />
              <div className="text-xs text-slate-500 truncate">{filePreviewUrl ? 'Image selected' : 'No file chosen'}</div>
            </div>
          </div>
          <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden bg-white border border-gray-200">
            {filePreviewUrl ? (
              // Use regular img for blob/data URLs to avoid Next Image restrictions
              <img src={filePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Product Title</label>
        <input name="name" value={form.name} onChange={handleChange} required className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-sm text-slate-700">Product Description</label>
        <input name="description" value={form.description} onChange={handleChange} placeholder="Ultra-Soft Merino Wool Scarf" className="h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-slate-700">Available Sizes</div>
          <div className="flex flex-wrap gap-2">
            {['XS','S','M','L','XL'].map(sz => {
              const active = sizesSelected.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSizesSelected(prev => active ? prev.filter(s => s !== sz) : [...prev, sz])}
                  className={`h-8 px-3 rounded-full border ${active ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-slate-700 border-gray-300 hover:bg-slate-50'}`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-slate-700">Quantity Available</div>
          <div className="inline-flex items-center gap-3">
            <button type="button" onClick={() => setQuantity(q => Math.max(0, q - 1))} className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">−</button>
            <div className="h-10 px-4 rounded-full bg-white border border-gray-300 inline-flex items-center justify-center min-w-[64px] text-slate-900 font-medium">{quantity}</div>
            <button type="button" onClick={() => setQuantity(q => q + 1)} className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">+</button>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 flex flex-col gap-3">
        <div className="text-sm text-slate-700">Color Options</div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
          {PRESET_COLORS.map((preset) => {
            const selected = colors.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => setColors(prev => selected ? prev.filter(c => c !== preset) : [...prev, preset])}
                className={`relative h-11 w-11 rounded-lg border-2 transition-all focus:outline-none ${selected ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-gray-200 hover:border-gray-300'}`}
                style={{ backgroundColor: preset }}
                aria-label={`Color ${preset}`}
                title={preset}
              >
                <span className="absolute inset-0 rounded-lg pointer-events-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]" />
              </button>
            );
          })}
        </div>

        {colors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((c, idx) => (
              <div key={`${c}-${idx}`} className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-200 bg-white">
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                <span className="text-xs text-slate-700 font-medium">{c}</span>
                <button type="button" onClick={() => setColors(prev => prev.filter((_, i) => i !== idx))} className="text-[11px] text-red-500 hover:underline">remove</button>
              </div>
            ))}
          </div>
        )}

        <div className="inline-flex items-center gap-2">
          <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="#HEX or name" className="h-9 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          <button type="button" onClick={() => { const val = colorInput.trim(); if (val) { setColors(prev => [...prev, val]); setColorInput(''); } }} className="h-9 px-4 rounded-md bg-cyan-500 text-white hover:bg-cyan-600">Add Color</button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Price</label>
        <input name="price" type="number" min={0} step="0.01" value={form.price} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Original Price</label>
        <input name="originalPrice" type="number" min={0} step="0.01" value={form.originalPrice} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Currency</label>
        <input name="currency" value={form.currency} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Rating (1-5)</label>
        <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Reviews</label>
        <input name="reviews" type="number" min={0} value={form.reviews} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Category</label>
        <input name="category" value={form.category} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Brand</label>
        <input name="brand" value={form.brand} onChange={handleChange} className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={() => { setForm({ ...form, name: '', description: '', image: '/common/allproduct/product6.png' }); setFilePreviewUrl(null); }} className="px-5 h-10 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
        <button type="submit" className="px-5 h-10 rounded-md bg-cyan-500 text-white hover:bg-cyan-600">Add Product</button>
      </div>
    </form>
  );
}


