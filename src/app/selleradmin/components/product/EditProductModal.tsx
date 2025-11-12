'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { X, ImagePlus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimpleSelect from '../ui/SimpleSelect';
import type { Product } from '@/lib/productData';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: Partial<Product>) => void;
  product: Product | null;
}

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL'];
const colorOptions = ['Red', 'Blue', 'Green', 'Black', 'White', 'Brown', 'Gray', 'Navy', 'Silver', 'Gold', 'Pink', 'Purple'];
const categoryOptions = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food'];
const currencyOptions = ['৳', '$', '€', '£', '¥'];

export default function EditProductModal({ isOpen, onClose, onSave, product }: EditProductModalProps) {
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    price: undefined,
    originalPrice: undefined,
    currency: '৳',
    image: '',
    category: '',
    brand: '',
    sizes: [],
    description: '',
    colors: [],
    inStock: true,
    tags: [],
    sku: '',
    stock: undefined,
    isActive: true,
    specifications: {},
    discount: undefined,
    subcategory: '',
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load product data when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setForm({
        name: product.name || '',
        price: product.price,
        originalPrice: product.originalPrice,
        currency: product.currency || '৳',
        image: product.image || '',
        category: product.category || '',
        brand: product.brand || '',
        sizes: product.sizes || [],
        description: product.description || '',
        colors: product.colors || [],
        inStock: product.inStock ?? true,
        tags: product.tags || [],
        sku: product.sku || '',
        stock: product.stock,
        isActive: product.isActive ?? true,
        specifications: product.specifications || {},
        discount: product.discount,
        subcategory: product.subcategory || '',
      });
      setImages(product.image ? [product.image] : []);
    }
  }, [isOpen, product]);

  const canSave = useMemo(() => {
    return (form.name?.trim() ?? '') !== '';
  }, [form]);

  const handleChange = <K extends keyof Product>(key: K, value: Product[K] | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value as Product[K] }));
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    const toRead = files.slice(0, Math.max(0, 12 - images.length));
    const readers = await Promise.all(
      toRead.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(file);
          })
      )
    );
    setImages((prev) => [...prev, ...readers]);
    if (readers.length > 0) {
      handleChange('image', readers[0]);
    }
    e.target.value = '';
  };

  const addSize = () => {
    if (sizeInput.trim() && !form.sizes?.includes(sizeInput.trim())) {
      handleChange('sizes', [...(form.sizes || []), sizeInput.trim()]);
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    handleChange('sizes', form.sizes?.filter((s) => s !== size) || []);
  };

  const addColor = () => {
    if (colorInput.trim() && !form.colors?.includes(colorInput.trim())) {
      handleChange('colors', [...(form.colors || []), colorInput.trim()]);
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    handleChange('colors', form.colors?.filter((c) => c !== color) || []);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      handleChange('tags', [...(form.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    handleChange('tags', form.tags?.filter((t) => t !== tag) || []);
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      handleChange('specifications', {
        ...(form.specifications || {}),
        [specKey.trim()]: specValue.trim(),
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...(form.specifications || {}) };
    delete newSpecs[key];
    handleChange('specifications', newSpecs);
  };

  const handleSave = () => {
    if (!canSave || !product) return;
    const productData: Partial<Product> = {
      ...form,
      id: product.id,
      image: images[0] || form.image || '',
      updatedAt: new Date().toISOString(),
    };
    onSave?.(productData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-slate-950 text-xl font-semibold font-['Poppins']">Edit Product</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Basic Information */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Basic Information</h3>
            
            <div className="w-full flex flex-col gap-2.5">
              <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                <input
                  value={form.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Product Name"
                  className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Brand
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    value={form.brand || ''}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="Brand Name"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  SKU
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    value={form.sku || ''}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="SKU Code"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                Description
              </label>
              <div className="w-full h-36 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200">
                <textarea
                  value={form.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Write product description"
                  className="w-full h-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins'] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Pricing</h3>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Price
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    type="number"
                    step="0.01"
                    value={form.price ?? ''}
                    onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Original Price
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    type="number"
                    step="0.01"
                    value={form.originalPrice ?? ''}
                    onChange={(e) => handleChange('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Currency
                </label>
                <SimpleSelect
                  value={(form.currency as any) || ''}
                  onChange={(v) => handleChange('currency', v)}
                  options={currencyOptions as readonly string[]}
                  placeholder="Select Currency"
                />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Discount (%)
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    type="number"
                    step="0.01"
                    value={form.discount ?? ''}
                    onChange={(e) => handleChange('discount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category & Classification */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Category & Classification</h3>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Category
                </label>
                <SimpleSelect
                  value={(form.category as any) || ''}
                  onChange={(v) => handleChange('category', v)}
                  options={categoryOptions as readonly string[]}
                  placeholder="Select Category"
                />
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Subcategory
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    value={form.subcategory || ''}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    placeholder="Subcategory"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Sizes & Colors</h3>
            
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Sizes
                </label>
                <div className="w-full flex gap-2">
                  <div className="flex-1 h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                    <input
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                      placeholder="Add size (e.g., S, M, L)"
                      className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 h-14 bg-neutral-100 rounded-md flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 text-zinc-900" />
                  </button>
                </div>
                {form.sizes && form.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 bg-neutral-100 rounded-md text-sm text-zinc-900 font-['Poppins'] inline-flex items-center gap-2"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Colors
                </label>
                <div className="w-full flex gap-2">
                  <div className="flex-1 h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                    <input
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                      placeholder="Add color (e.g., Red, Blue)"
                      className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 h-14 bg-neutral-100 rounded-md flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 text-zinc-900" />
                  </button>
                </div>
                {form.colors && form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1 bg-neutral-100 rounded-md text-sm text-zinc-900 font-['Poppins'] inline-flex items-center gap-2"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
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
          </div>

          {/* Inventory */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Inventory</h3>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Stock Quantity
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    type="number"
                    value={form.stock ?? ''}
                    onChange={(e) => handleChange('stock', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  In Stock
                </label>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.inStock ?? false}
                      onChange={(e) => handleChange('inStock', e.target.checked)}
                      className="w-4 h-4 text-fuchsia-500 rounded"
                    />
                    <span className="text-zinc-900 text-base font-normal font-['Poppins']">Available in stock</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Tags</h3>
            
            <div className="w-full flex flex-col gap-2.5">
              <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                Product Tags
              </label>
              <div className="w-full flex gap-2">
                <div className="flex-1 h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag (e.g., running, athletic)"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 h-14 bg-neutral-100 rounded-md flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-zinc-900" />
                </button>
              </div>
              {form.tags && form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-100 rounded-md text-sm text-zinc-900 font-['Poppins'] inline-flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
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

          {/* Specifications */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Specifications</h3>
            
            <div className="w-full flex flex-col gap-4">
              <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="Specification Key (e.g., Material)"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
                <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                  <input
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Specification Value (e.g., Cotton)"
                    className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 h-14 bg-neutral-100 rounded-md flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-zinc-900" />
                </button>
              </div>
              {form.specifications && Object.keys(form.specifications).length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {Object.entries(form.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="px-3 py-2 bg-neutral-100 rounded-md text-sm text-zinc-900 font-['Poppins'] inline-flex items-center justify-between"
                    >
                      <span>
                        <strong>{key}:</strong> {String(value)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="hover:text-red-500 ml-4"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="w-full pb-6 border-b flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Status</h3>
            
            <div className="w-full flex flex-col gap-2.5">
              <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                Active Status
              </label>
              <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive ?? false}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-fuchsia-500 rounded"
                  />
                  <span className="text-zinc-900 text-base font-normal font-['Poppins']">Product is active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="w-full pb-6 border-b flex flex-col gap-2.5">
            <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
              <div className="text-neutral-600 text-base font-medium font-['Poppins'] leading-6">Add Photos</div>
              <div className="text-zinc-400 text-sm font-normal font-['Poppins'] leading-5">Upload 1-12 product photos</div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="inline-flex flex-col justify-start items-start gap-1.5">
                    <button
                      type="button"
                      onClick={handleImagePick}
                      className="w-20 h-20 p-2.5 bg-neutral-100 rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden"
                    >
                      {images[i] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[i]} alt={`image ${i + 1}`} className="w-full h-full object-cover rounded" />
                      ) : (
                        <ImagePlus className="w-8 h-8 text-zinc-400" />
                      )}
                    </button>
                    <div className="text-zinc-400 text-xs font-normal font-['Poppins'] leading-3 tracking-wide">image {i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />
          </div>

          {/* Actions */}
          <div className="w-full flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium font-['Poppins'] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                'px-6 py-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 text-white font-medium font-["Poppins"] transition-colors',
                !canSave && 'opacity-60 cursor-not-allowed'
              )}
              disabled={!canSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

