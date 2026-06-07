'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import { Color } from '@/types';
import { getApiUrl } from '@/lib/apiConfig';

interface AddColorFormProps {
  onCancel?: () => void;
  onConfirm?: (data: { name: string; code: string }) => void;
  onDelete?: (id: string) => void;
}

export default function AddColorForm({ onCancel, onConfirm, onDelete }: AddColorFormProps) {
  const [colorName, setColorName] = useState('');
  const [colorCode, setColorCode] = useState('#000000');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch colors from database
  useEffect(() => {
    let active = true;
    const fetchColors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(getApiUrl('colors'));
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load colors');
        }
        if (active) {
          setColors(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching colors:', error);
        // Silent error handling - don't show error to user
        if (active) {
          setError(null);
          setColors([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchColors();
    return () => {
      active = false;
    };
  }, []);

  const handleConfirm = async () => {
    if (colorName.trim() && colorCode.trim() && !saving) {
      try {
        setSaving(true);
        setError(null);
        
        const { getApiUrl } = await import('@/lib/apiConfig');
        const response = await fetch(getApiUrl('colors'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: colorName.trim(),
            hexCode: colorCode.trim(),
          }),
        });

        const result = await response.json();
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to save color');
        }

        // Add new color to the list (at the beginning)
        if (result.data) {
          setColors((prev) => [result.data, ...prev]);
        }
        
        // Call the onConfirm callback
        onConfirm?.({ name: colorName.trim(), code: colorCode.trim() });
        
        // Reset form
        setColorName('');
        setColorCode('#000000');
      } catch (error) {
        console.error('Error saving color:', error);
        setError(error instanceof Error ? error.message : 'Failed to save color');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null && !deleting) {
      try {
        setDeleting(true);
        setError(null);
        
        const { getApiUrl } = await import('@/lib/apiConfig');
        const response = await fetch(getApiUrl(`colors/${deleteTargetId}`), {
          method: 'DELETE',
        });

        const result = await response.json();
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to delete color');
        }

        // Remove color from the list
        setColors((prev) => prev.filter((color) => color.id !== deleteTargetId));
        onDelete?.(deleteTargetId);
        setDeleteTargetId(null);
        setDeleteTargetName('');
      } catch (error) {
        console.error('Error deleting color:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete color');
      } finally {
        setDeleting(false);
        setDeleteModalOpen(false);
      }
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
          <h2 className="text-zinc-800 text-2xl font-bold font-['Poppins']">Color</h2>
          <p className="text-zinc-400 text-xs font-semibold font-['Poppins'] uppercase tracking-wider">Manage your color inventory</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left card - Color Name */}
        <div className="w-full p-6 bg-white rounded-2xl border border-zinc-150/80 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-500 text-xs font-bold font-['Poppins'] uppercase tracking-wider">Color Name</label>
            <div className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder-zinc-450 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all font-['Poppins'] inline-flex items-center gap-2">
              <input
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Type color name here... (e.g., Red, Blue)"
                className="w-full bg-transparent outline-none text-zinc-700 text-sm font-semibold font-['Poppins']"
              />
            </div>
          </div>
        </div>

        {/* Right card - Color Code */}
        <div className="w-full p-6 bg-white rounded-2xl border border-zinc-150/80 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-500 text-xs font-bold font-['Poppins'] uppercase tracking-wider">Color Code</label>
            <div className="w-full flex gap-3 items-center font-['Poppins']">
              <input
                type="color"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="w-16 h-11 rounded-xl border border-zinc-200 cursor-pointer shadow-sm"
              />
              <div className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-750 placeholder-zinc-450 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all inline-flex items-center gap-2">
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
                  className="w-full bg-transparent outline-none text-zinc-700 text-sm font-semibold font-mono font-['Poppins']"
                />
              </div>
            </div>
            {colorCode && !isValidHex(colorCode) && (
              <p className="text-rose-500 text-xs font-semibold font-['Poppins'] mt-1">Please enter a valid hex color code (e.g., #FF0000)</p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full p-4 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-rose-600 text-sm font-semibold font-['Poppins']">{error}</p>
        </div>
      )}

      {/* Footer buttons */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-5 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold tracking-wider uppercase text-zinc-650 transition-all cursor-pointer flex items-center justify-center font-['Poppins']"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm || !isValidHex(colorCode) || saving}
          className={cn(
            'h-11 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-purple-200/50 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center font-[\'Poppins\']',
            (!canConfirm || !isValidHex(colorCode) || saving) && 'opacity-60 cursor-not-allowed'
          )}
        >
          {saving ? 'Saving...' : 'Confirm'}
        </button>
      </div>

      {/* Existing Colors Section */}
      {loading ? (
        <div className="w-full flex justify-center items-center py-12 bg-white rounded-2xl border border-zinc-150/70 shadow-sm">
          <p className="text-zinc-400 text-sm font-semibold font-['Poppins'] animate-pulse">Loading colors...</p>
        </div>
      ) : colors.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-zinc-800 text-lg font-bold font-['Poppins']">Existing Colors</h3>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {colors.map((color) => (
              <div
                key={color.id}
                className="relative group p-4 bg-white rounded-2xl border border-zinc-150 shadow-sm flex flex-col justify-start items-center gap-3 hover:shadow-md hover:border-zinc-200/80 transition-all duration-300"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteClick(color.id, color.name)}
                  disabled={deleting}
                  className={cn(
                    "absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer",
                    deleting && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label={`Delete ${color.name} color`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Color Preview */}
                <div
                  className="w-full h-20 rounded-xl border border-zinc-150 shadow-inner"
                  style={{ backgroundColor: color.hexCode }}
                />

                {/* Color Name */}
                <div className="w-full text-center text-zinc-800 text-sm font-bold font-['Poppins'] truncate">
                  {color.name}
                </div>

                {/* Color Code */}
                <div className="text-zinc-400 font-mono text-[11px] font-bold bg-zinc-55/60 px-2 py-0.5 rounded-md border border-zinc-100/50 inline-block">
                  <code>{color.hexCode}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center py-12 bg-white rounded-2xl border border-zinc-150/70 shadow-sm">
          <p className="text-zinc-450 text-sm font-semibold font-['Poppins']">No colors found. Add your first color above.</p>
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
        title="Delete Color"
        message="Are you sure you want to delete this color?"
        itemName={deleteTargetName}
      />
    </div>
  );
}

