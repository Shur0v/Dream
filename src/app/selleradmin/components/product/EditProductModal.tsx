'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { X, ImagePlus, Plus, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimpleSelect from '../ui/SimpleSelect';
import SearchableMultiSelect from '../ui/SearchableMultiSelect';
import { Color, Category } from '@/types';
import { getApiUrl } from '@/lib/apiConfig';
import { fetchCategories as loadCategoriesFromApi } from '@/lib/categories';

interface EditableProduct {
  id: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  image?: string;
  category?: string;
  brand?: string;
  sizes?: string[];
  description?: string;
  colors?: string[];
  inStock?: boolean;
  tags?: string[];
  sku?: string;
  stock?: number;
  isActive?: boolean;
  specifications?: Record<string, unknown>;
  discount?: number;
  subcategory?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: Partial<EditableProduct>) => void;
  onImagesUpdate?: (images: string[]) => void;
  product: EditableProduct | null;
}

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL'];
const currencyOptions = ['৳', '$', '€', '£', '¥'];

export default function EditProductModal({ isOpen, onClose, onSave, onImagesUpdate, product }: EditProductModalProps) {
  const [form, setForm] = useState<Partial<EditableProduct>>({
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
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null);
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [colorsLoading, setColorsLoading] = useState(true);
  const [colorsError, setColorsError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch colors from database
  useEffect(() => {
    let active = true;
    const fetchColors = async () => {
      try {
        setColorsLoading(true);
        setColorsError(null);
        const response = await fetch(getApiUrl('colors'));
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load colors');
        }
        if (active) {
          setColorOptions(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching colors:', error);
        if (active) {
          setColorsError(error instanceof Error ? error.message : 'Unable to load colors');
        }
      } finally {
        if (active) {
          setColorsLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchColors();
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Fetch categories from database
  useEffect(() => {
    let active = true;
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const categories = await loadCategoriesFromApi();
        if (active) {
          setCategoryOptions(categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (active) {
          setCategoriesError(error instanceof Error ? error.message : 'Unable to load categories');
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    if (isOpen) {
      loadCategories();
    }

    return () => {
      active = false;
    };
  }, [isOpen]);

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
      // Load all images from product (check for images array or single image)
      const productImages = (product as any).images && Array.isArray((product as any).images) 
        ? (product as any).images 
        : (product.image ? [product.image] : []);
      setImages(productImages);
    }
  }, [isOpen, product]);

  const canSave = useMemo(() => {
    return (form.name?.trim() ?? '') !== '';
  }, [form]);

  const handleChange = <K extends keyof EditableProduct>(key: K, value: EditableProduct[K] | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const syncPrimaryImage = (imageList: string[]) => {
    if (imageList.length > 0) {
      handleChange('image', imageList[0]);
    } else {
      handleChange('image', '');
    }
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
    setImages((prev) => {
      const next = [...prev, ...readers];
      if (next.length > 0) {
        syncPrimaryImage(next);
      }
      return next;
    });
    e.target.value = '';
  };

  const handleDeleteImage = async (index: number) => {
    if (!product || deletingImageIndex !== null || !images[index]) return;

    const previousImages = [...images];
    const updatedImages = images.filter((_, i) => i !== index);
    setDeletingImageIndex(index);
    setImages(updatedImages);
    syncPrimaryImage(updatedImages);
    
    try {
      const response = await fetch(`/api/products/${product.id}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete image');
      }

      const serverImages: string[] = Array.isArray(result.data?.images)
        ? result.data.images
        : updatedImages;

      setImages(serverImages);
      syncPrimaryImage(serverImages);
      onImagesUpdate?.(serverImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      setImages(previousImages);
      syncPrimaryImage(previousImages);
      alert(
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the image'
      );
    } finally {
      setDeletingImageIndex(null);
    }
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

  const handleColorSelectionChange = (ids: Array<string | number>) => {
    const normalized = ids.map((id) => String(id));
    console.log('[EditProductModal] Color selection changed:', normalized);
    handleChange('colors', normalized);
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
    const productData: Partial<EditableProduct> = {
      ...form,
      id: product.id,
      name: form.name || product.name,
      price: form.price !== undefined ? form.price : product.price,
      originalPrice: form.originalPrice !== undefined ? form.originalPrice : product.originalPrice,
      description: form.description || '',
      category: form.category || product.category || '',
      subcategory: form.subcategory || '',
      brand: form.brand || product.brand || '',
      sku: form.sku || product.sku || '',
      stock: form.stock !== undefined ? form.stock : product.stock,
      sizes: form.sizes || [],
      colors: form.colors || [],
      tags: form.tags || [],
      specifications: form.specifications || {},
      isActive: form.isActive !== undefined ? form.isActive : (product.isActive ?? true),
      image: images[0] || form.image || '',
      images: images, // Include all images
      updatedAt: new Date().toISOString(),
    };
    console.log('[EditProductModal] Saving product data:', productData);
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
                  options={categoryOptions.map(cat => cat.name) as readonly string[]}
                  placeholder={categoriesLoading ? 'Loading categories...' : 'Select Category'}
                />
                {categoriesError && (
                  <p className="text-red-500 text-sm">{categoriesError}</p>
                )}
                {!categoriesLoading && !categoriesError && categoryOptions.length === 0 && (
                  <p className="text-zinc-500 text-sm">
                    No categories found. Add categories first from the category management page.
                  </p>
                )}
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

              {/* Colors */}
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Colors
                </label>
                <div className="w-full flex flex-col gap-4">
                  <SearchableMultiSelect
                    options={colorOptions}
                    selectedIds={form.colors || []}
                    onChange={handleColorSelectionChange}
                    placeholder={colorsLoading ? 'Loading colors...' : 'Select colors'}
                    disabled={colorsLoading || !!colorsError}
                  />
                  {colorsError && (
                    <p className="text-red-500 text-sm">{colorsError}</p>
                  )}
                  {!colorsLoading && !colorsError && colorOptions.length === 0 && (
                    <p className="text-zinc-500 text-sm">
                      No colors found. Add colors first from the color management page.
                    </p>
                  )}
                </div>
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
              <div className="text-neutral-600 text-base font-medium font-['Poppins'] leading-6">Product Photos</div>
              <div className="text-zinc-400 text-sm font-normal font-['Poppins'] leading-5">
                Upload 1-12 product photos. Use the delete option under each image to remove it from the database instantly.
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => {
                  const hasImage = Boolean(images[i]);
                  const isDeleting = deletingImageIndex === i;
                  return (
                    <div key={i} className="inline-flex flex-col justify-start items-start gap-1.5">
                      {hasImage ? (
                        <div className="relative group w-20 h-20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={images[i]!} 
                            alt={`image ${i + 1}`} 
                            className={cn(
                              'w-20 h-20 object-cover rounded-lg border-2 border-neutral-200 transition-all',
                              isDeleting && 'opacity-60'
                            )} 
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(i)}
                            disabled={isDeleting}
                            className={cn(
                              'absolute top-1 right-1 p-1 rounded-full bg-white/90 border border-red-100 text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity',
                              'hover:bg-red-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200',
                              isDeleting && 'cursor-wait opacity-100'
                            )}
                            aria-label={`Delete image ${i + 1}`}
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleImagePick}
                          className="w-20 h-20 p-2.5 bg-neutral-100 rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-neutral-200 transition-colors"
                        >
                          <ImagePlus className="w-8 h-8 text-zinc-400" />
                        </button>
                      )}
                      <div className="w-full flex items-center justify-between text-zinc-400 text-xs font-normal font-['Poppins'] leading-3 tracking-wide">
                        <span>image {i + 1}</span>
                        {hasImage && (
                          <span className={cn('text-[10px]', isDeleting ? 'text-red-500' : 'text-zinc-400')}>
                            {isDeleting ? 'Deleting…' : 'Delete'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
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

