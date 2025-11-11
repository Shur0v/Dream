'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Color {
  id: number;
  name: string;
  code: string;
}

interface AddColorFormProps {
  onCancel?: () => void;
  onConfirm?: (data: { name: string; code: string }) => void;
  onDelete?: (id: number) => void;
}

export default function AddColorForm({ onCancel, onConfirm, onDelete }: AddColorFormProps) {
  const [colorName, setColorName] = useState('');
  const [colorCode, setColorCode] = useState('#000000');

  // Existing colors - in a real app, this would come from an API/state management
  const [colors, setColors] = useState<Color[]>([
    { id: 1, name: 'Red', code: '#FF0000' },
    { id: 2, name: 'Blue', code: '#0000FF' },
    { id: 3, name: 'Green', code: '#00FF00' },
    { id: 4, name: 'Black', code: '#000000' },
    { id: 5, name: 'White', code: '#FFFFFF' },
    { id: 6, name: 'Gray', code: '#808080' },
  ]);

  const handleConfirm = () => {
    if (colorName.trim() && colorCode.trim()) {
      // Add new color to the list (at the beginning)
      const newColor: Color = {
        id: Math.max(...colors.map(c => c.id), 0) + 1,
        name: colorName.trim(),
        code: colorCode.trim(),
      };
      setColors((prev) => [newColor, ...prev]);
      
      // Call the onConfirm callback
      onConfirm?.({ name: colorName.trim(), code: colorCode.trim() });
      
      // Reset form
      setColorName('');
      setColorCode('#000000');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      setColors((prev) => prev.filter((color) => color.id !== id));
      onDelete?.(id);
    }
  };

  const canConfirm = colorName.trim().length > 0 && colorCode.trim().length > 0;

  // Helper function to validate hex color
  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Title */}
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins']">Color</h2>
          <p className="text-zinc-400 text-sm md:text-base font-normal">Manage your color inventory</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left card - Color Name */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Color Name</label>
            <div className="w-full p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
              <input
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Type color name here... (e.g., Red, Blue)"
                className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins']"
              />
            </div>
          </div>
        </div>

        {/* Right card - Color Code */}
        <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-800 text-base font-medium font-['Poppins']">Color Code</label>
            <div className="w-full flex gap-3 items-center">
              <input
                type="color"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <div className="flex-1 p-3 rounded-lg outline outline-1 outline-zinc-400 inline-flex items-center gap-2">
                <input
                  type="text"
                  value={colorCode}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Auto-add # if user types hex without #
                    if (value && !value.startsWith('#') && /^[0-9A-Fa-f]{6}$/.test(value)) {
                      value = '#' + value;
                    }
                    setColorCode(value);
                  }}
                  placeholder="#000000"
                  className="w-full bg-transparent outline-none text-zinc-700 text-base font-['Poppins'] font-mono"
                />
              </div>
            </div>
            {colorCode && !isValidHex(colorCode) && (
              <p className="text-red-500 text-sm font-['Poppins']">Please enter a valid hex color code (e.g., #FF0000)</p>
            )}
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
          disabled={!canConfirm || !isValidHex(colorCode)}
          className={cn('h-12 px-6 py-3 rounded bg-fuchsia-500 text-white font-medium', (!canConfirm || !isValidHex(colorCode)) && 'opacity-60 cursor-not-allowed')}
        >
          Confirm
        </button>
      </div>

      {/* Existing Colors Section */}
      {colors.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-slate-950 text-xl md:text-2xl font-medium font-['Poppins']">Existing Colors</h3>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {colors.map((color) => (
              <div
                key={color.id}
                className="relative group p-1.5 md:p-3 bg-fuchsia-400/10 rounded-xl flex flex-col justify-start items-center gap-1.5 md:gap-6 hover:shadow-[5px_11px_22.1px_0px_rgba(0,0,0,0.15)] transition-all duration-300"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(color.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label={`Delete ${color.name} color`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Color Preview */}
                <div
                  className="w-full h-20 md:h-40 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: color.code }}
                />

                {/* Color Name */}
                <div className="w-full text-center text-black text-sm md:text-lg font-medium font-['Poppins'] leading-tight md:leading-normal">
                  {color.name}
                </div>

                {/* Color Code */}
                <div className="w-full text-center text-zinc-600 text-xs md:text-sm font-mono font-['Poppins']">
                  {color.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

