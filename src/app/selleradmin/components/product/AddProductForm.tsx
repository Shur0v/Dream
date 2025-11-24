'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ImagePlus, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimpleSelect from '../ui/SimpleSelect';
import SearchableMultiSelect from '../ui/SearchableMultiSelect';
import { Color, Category } from '@/types';
import { fetchCategories as loadCategoriesFromApi } from '@/lib/categories';

// Zod schema for validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  originalPrice: z.number().optional(),
  currency: z.string().min(1, 'Currency is required').default('৳'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  tags: z.array(z.string()),
  specifications: z.record(z.string(), z.string()),
  sellerId: z.string().optional(),
  seller: z.string().optional(),
  images: z.array(z.string()),
});

type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormData = z.output<typeof productSchema>;

interface AddProductFormProps {
  onBack?: () => void;
  onSave?: (data: ProductFormData) => void | Promise<void>;
  isSaving?: boolean;
}

type Distribution = 'Best selling' | 'Featured' | 'New arrival';

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL'];
const distributionOptions: Distribution[] = ['Best selling', 'Featured', 'New arrival'];
const currencyOptions = ['৳', '$', '€', '£', '¥'];

export default function AddProductForm({ onBack, onSave, isSaving = false }: AddProductFormProps) {
  const [images, setImages] = useState<string[]>(Array(12).fill(''));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [sizeInput, setSizeInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [colorsLoading, setColorsLoading] = useState(true);
  const [colorsError, setColorsError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      currency: '৳',
      originalPrice: undefined,
      category: '',
      subcategory: '',
      brand: '',
      sku: '',
      stock: 0,
      sizes: [],
      colors: [],
      tags: [],
      specifications: {},
      sellerId: 'seller-1',
      seller: '',
      images: [],
    },
    mode: 'onChange',
  });

  const watchedSizes = watch('sizes');
  const watchedColors = watch('colors');
  const watchedTags = watch('tags');
  const watchedSpecs = watch('specifications');

  // Fetch colors from database
  useEffect(() => {
    let active = true;
    const fetchColors = async () => {
      try {
        setColorsLoading(true);
        setColorsError(null);
        const response = await fetch(`/api/colors`);
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

    fetchColors();
    return () => {
      active = false;
    };
  }, []);

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

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  // Update images array in form when images state changes
  useEffect(() => {
    const validImages = images.filter(img => img !== '');
    setValue('images', validImages, { shouldValidate: true });
  }, [images, setValue]);

  const handleImagePick = (index: number) => {
    setSelectedImageIndex(index);
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length || selectedImageIndex === null) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageData = String(reader.result);
      const newImages = [...images];
      newImages[selectedImageIndex] = imageData;
      setImages(newImages);
    };
    
    reader.readAsDataURL(file);
    e.target.value = '';
    setSelectedImageIndex(null);
  };

  const addSize = () => {
    if (sizeInput.trim() && !watchedSizes?.includes(sizeInput.trim())) {
      const newSizes = [...(watchedSizes || []), sizeInput.trim()];
      setValue('sizes', newSizes, { shouldValidate: true });
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    const newSizes = watchedSizes?.filter((s) => s !== size) || [];
    setValue('sizes', newSizes, { shouldValidate: true });
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      const newTags = [...(watchedTags || []), tagInput.trim()];
      setValue('tags', newTags, { shouldValidate: true });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = watchedTags?.filter((t) => t !== tag) || [];
    setValue('tags', newTags, { shouldValidate: true });
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      const newSpecs = {
        ...(watchedSpecs || {}),
        [specKey.trim()]: specValue.trim(),
      };
      setValue('specifications', newSpecs, { shouldValidate: true });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...(watchedSpecs || {}) };
    delete newSpecs[key];
    setValue('specifications', newSpecs, { shouldValidate: true });
  };

  const handleColorSelectionChange = (ids: Array<string | number>) => {
    const normalized = ids.map((id) => String(id));
    console.log('[AddProductForm] Color selection changed:', normalized);
    setValue('colors', normalized, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormInput) => {
    if (isSaving) return;
    
    console.log('[AddProductForm] Form submitted with data:', data);
    console.log('[AddProductForm] Colors in form data:', data.colors);
    
    // Ensure images are included
    const validImages = images.filter(img => img !== '');
    const formData = {
      ...data,
      images: validImages.length > 0 ? validImages : data.images,
    };
    
    console.log('[AddProductForm] Form data after processing:', formData);
    console.log('[AddProductForm] Colors after processing:', formData.colors);
    
    try {
      const parsedData = productSchema.parse(formData);
      console.log('[AddProductForm] Parsed data:', parsedData);
      console.log('[AddProductForm] Parsed colors:', parsedData.colors);
      await onSave?.(parsedData);
    } catch (error) {
      console.error('[AddProductForm] Error saving product:', error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col gap-2.5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="self-stretch inline-flex justify-start items-center gap-7">
              <div className="flex-1 flex justify-start items-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-10 h-10 p-2 bg-neutral-100 rounded-lg flex justify-center items-center"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-900" />
                </button>
                <div className="flex-1 justify-start text-zinc-950 text-xl font-medium font-['Poppins'] leading-8">
                  Add New Product
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-6">
              {/* Basic Information */}
              <div className="w-full pb-6 border-b flex flex-col gap-6">
                <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Basic Information</h3>
                
                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_12rem] gap-6">
                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        {...register('name')}
                        placeholder="Product Name"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Currency
                    </label>
                    <Controller
                      name="currency"
                      control={control}
                      defaultValue="৳"
                      render={({ field }) => (
                        <SimpleSelect
                          value={field.value || '৳'}
                          onChange={field.onChange}
                          options={currencyOptions}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full min-h-[120px] px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200">
                    <textarea
                      {...register('description')}
                      placeholder="Product Description"
                      rows={4}
                      className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins'] resize-none"
                    />
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        type="number"
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Original Price
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        type="number"
                        step="0.01"
                        {...register('originalPrice', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <SimpleSelect
                          value={field.value || ''}
                          onChange={field.onChange}
                          options={categoryOptions.map(cat => cat.name)}
                          placeholder={categoriesLoading ? 'Loading categories...' : 'Select Category'}
                        />
                      )}
                    />
                    {categoriesError && (
                      <p className="text-red-500 text-sm">{categoriesError}</p>
                    )}
                    {!categoriesLoading && !categoriesError && categoryOptions.length === 0 && (
                      <p className="text-zinc-500 text-sm">
                        No categories found. Add categories first from the category management page.
                      </p>
                    )}
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Subcategory
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        {...register('subcategory')}
                        placeholder="Subcategory"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        {...register('brand')}
                        placeholder="Brand Name"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                    {errors.brand && (
                      <p className="text-red-500 text-sm">{errors.brand.message}</p>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        {...register('sku')}
                        placeholder="SKU-001"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                    {errors.sku && (
                      <p className="text-red-500 text-sm">{errors.sku.message}</p>
                    )}
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        type="number"
                        {...register('stock', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-red-500 text-sm">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="w-full pb-6 border-b flex flex-col gap-6">
                <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Sizes</h3>
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex gap-2">
                    <div className="flex-1 h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                        placeholder="Add size"
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
                  {watchedSizes && watchedSizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watchedSizes.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1.5 bg-neutral-100 rounded-md text-zinc-900 text-sm font-normal font-['Poppins'] inline-flex items-center gap-2"
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
              </div>

              {/* Colors */}
              <div className="w-full pb-6 border-b flex flex-col gap-6">
                <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Colors</h3>
                <div className="w-full flex flex-col gap-4">
                  <SearchableMultiSelect
                    options={colorOptions}
                    selectedIds={watchedColors || []}
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

              {/* Tags */}
              <div className="w-full pb-6 border-b flex flex-col gap-6">
                <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Tags</h3>
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex gap-2">
                    <div className="flex-1 h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag"
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
                  {watchedTags && watchedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watchedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-neutral-100 rounded-md text-zinc-900 text-sm font-normal font-['Poppins'] inline-flex items-center gap-2"
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
                    <div className="h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        placeholder="Key"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                    <div className="h-14 px-5 py-3.5 rounded-md outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        value={specValue}
                        onChange={(e) => setSpecValue(e.target.value)}
                        placeholder="Value"
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
                  {watchedSpecs && Object.keys(watchedSpecs).length > 0 && (
                    <div className="flex flex-col gap-2">
                      {Object.entries(watchedSpecs).map(([key, value]) => (
                        <div
                          key={key}
                          className="px-3 py-2 bg-neutral-100 rounded-md text-zinc-900 text-sm font-normal font-['Poppins'] inline-flex items-center justify-between"
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

              {/* Seller Information */}
              <div className="w-full pb-6 border-b flex flex-col gap-6">
                <h3 className="text-lg font-semibold text-zinc-900 font-['Poppins']">Seller Information</h3>
                
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Seller Name
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        {...register('seller')}
                        placeholder="Seller Name"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                      Seller ID
                    </label>
                    <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                      <input
                        {...register('sellerId')}
                        placeholder="seller-id"
                        className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="w-full pb-6 border-b flex flex-col gap-2.5">
                <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                  <div className="text-neutral-600 text-base font-medium font-['Poppins'] leading-6">Add Photos <span className="text-red-500">*</span></div>
                  <div className="text-zinc-400 text-sm font-normal font-['Poppins'] leading-5">Upload 1-12 product photos</div>
                </div>
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="inline-flex flex-col justify-start items-start gap-1.5">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => handleImagePick(i)}
                            className="w-20 h-20 p-2.5 bg-neutral-100 rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden group hover:bg-neutral-200 transition-colors"
                          >
                            {images[i] ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={images[i]} alt={`image ${i + 1}`} className="w-full h-full object-cover rounded" />
                              </>
                            ) : (
                              <ImagePlus className="w-8 h-8 text-zinc-400" />
                            )}
                          </button>
                          {images[i] && (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newImages = [...images];
                                newImages[i] = '';
                                setImages(newImages);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newImages = [...images];
                                  newImages[i] = '';
                                  setImages(newImages);
                                }
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="text-zinc-400 text-xs font-normal font-['Poppins'] leading-3 tracking-wide">image {i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFilesSelected}
                />
                {errors.images && (
                  <p className="text-red-500 text-sm">{errors.images.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-32 px-5 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-lg inline-flex justify-center items-center gap-2">
            <button
              type="submit"
              className={cn(
                'text-white text-sm font-medium font-["Poppins"] leading-4 transition-all duration-300',
                (!isValid || isSaving) && 'opacity-60 cursor-not-allowed',
                isSaving && 'animate-pulse'
              )}
              disabled={!isValid || isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
