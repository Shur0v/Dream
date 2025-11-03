'use client';

import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import SimpleSelect from '../ui/SimpleSelect';

interface AddProductFormProps {
  onBack?: () => void;
  onSave?: (data: ProductFormState) => void;
}

type Distribution = 'Best selling' | 'Featured' | 'New arrival';

export interface ProductFormState {
  name: string;
  price: string;
  productId: string;
  size: string;
  color: string;
  description: string;
  distribution: Distribution;
  images: string[]; // data URLs for preview
}

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorOptions = ['Red', 'Blue', 'Green', 'Black', 'White', 'Brown'];
const distributionOptions: Distribution[] = ['Best selling', 'Featured', 'New arrival'];

export default function AddProductForm({ onBack, onSave }: AddProductFormProps) {
  const [form, setForm] = useState<ProductFormState>({
    name: '',
    price: '',
    productId: '#123456B',
    size: '',
    color: '',
    description: '',
    distribution: 'Best selling',
    images: [],
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSave = useMemo(() => {
    return form.name.trim() !== '' && form.price.trim() !== '' && form.productId.trim() !== '';
  }, [form]);

  const handleChange = (key: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    const toRead = files.slice(0, Math.max(0, 12 - form.images.length));
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
    setForm((prev) => ({ ...prev, images: [...prev.images, ...readers] }));
    // reset input to allow re-upload same files
    e.target.value = '';
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave?.(form);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col gap-2.5">
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
              {/* Right side space intentionally left for future chips/actions */}
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="w-full pb-6 border-b flex flex-col gap-6">
              {/* Row 1 */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_12rem] gap-6">
                <div className="w-full flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Product Name
                  </label>
                  <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                    <input
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Product Name"
                      className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-48 flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Product distribute
                  </label>
                  <SimpleSelect
                    value={form.distribution}
                    onChange={(v) => handleChange('distribution', v)}
                    options={distributionOptions}
                    placeholder="Select distribution"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Product Price
                  </label>
                  <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                    <input
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="Product Price"
                      type="number"
                      className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Product ID
                  </label>
                  <div className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex items-center gap-2.5">
                    <input
                      value={form.productId}
                      onChange={(e) => handleChange('productId', e.target.value)}
                      placeholder="#123456B"
                      className="w-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins']"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Size
                  </label>
                  <SimpleSelect
                    value={(form.size as any) || ''}
                    onChange={(v) => handleChange('size', v)}
                    options={sizeOptions as readonly string[]}
                    placeholder="Select Size"
                  />
                </div>
                <div className="w-full flex flex-col gap-2.5">
                  <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                    Color
                  </label>
                  <SimpleSelect
                    value={(form.color as any) || ''}
                    onChange={(v) => handleChange('color', v)}
                    options={colorOptions as readonly string[]}
                    placeholder="Select Color"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="w-full flex flex-col gap-2.5">
                <label className="self-stretch text-neutral-600 text-base font-medium font-['Poppins'] leading-6">
                  Product Description
                </label>
                <div className="w-full h-36 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200">
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Write product description"
                    className="w-full h-full bg-transparent outline-none text-zinc-900 text-base font-normal font-['Poppins'] resize-none"
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="w-full max-w-3xl flex flex-col gap-2.5">
                <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                  <div className="text-neutral-600 text-base font-medium font-['Poppins'] leading-6">Add Photos</div>
                  <div className="text-zinc-400 text-sm font-normal font-['Poppins'] leading-5">Upload 1-12 product photos</div>
                </div>
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="inline-flex flex-col justify-start items-start gap-1.5">
                        <button
                          type="button"
                          onClick={handleImagePick}
                          className="w-20 h-20 p-2.5 bg-neutral-100 rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden"
                        >
                          {form.images[i] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={form.images[i]} alt={`image ${i + 1}`} className="w-full h-full object-cover rounded" />
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
            </div>
          </div>
        </div>

        <div className="w-32 px-5 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 rounded-lg inline-flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className={cn('text-white text-sm font-medium font-["Poppins"] leading-4', !canSave && 'opacity-60 cursor-not-allowed')}
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


