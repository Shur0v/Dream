'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps<T extends { id: number | string; name: string; [key: string]: any }> {
  value: T | null;
  onChange: (v: T | null) => void;
  options: T[];
  placeholder?: string;
  className?: string;
  controlClassName?: string;
  searchPlaceholder?: string;
  maxItems?: number;
  renderOption?: (option: T) => React.ReactNode;
}

export default function SearchableSelect<T extends { id: number | string; name: string; [key: string]: any }>({
  value,
  onChange,
  options,
  placeholder = 'Select',
  className,
  controlClassName,
  searchPlaceholder = 'Search...',
  maxItems,
  renderOption,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Limit to maxItems if specified
  const displayOptions = maxItems ? filteredOptions.slice(0, maxItems) : filteredOptions;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSelect = (option: T) => {
    onChange(option);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-between items-center gap-2',
          controlClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('text-base font-normal font-["Poppins"] flex-1 text-left', value ? 'text-zinc-900' : 'text-zinc-500')}>
          {value ? value.name : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-neutral-100 rounded"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
          <ChevronDown className={cn('w-5 h-5 text-zinc-500 transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-neutral-200 z-50 max-h-80 overflow-hidden flex flex-col"
        >
          {/* Search Input */}
          <div className="p-2 border-b border-neutral-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent font-['Poppins']"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {displayOptions.length > 0 ? (
              displayOptions.map((opt) => {
                const selected = value?.id === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-neutral-50 transition-colors',
                      selected ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-700'
                    )}
                    role="option"
                    aria-selected={selected}
                  >
                    {selected ? <Check className="w-4 h-4 text-fuchsia-600" /> : <span className="w-4 h-4" />}
                    {renderOption ? renderOption(opt) : <span className="font-['Poppins']">{opt.name}</span>}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-zinc-500 font-['Poppins']">
                {searchQuery ? 'No results found' : 'No options available'}
              </div>
            )}
          </div>

          {/* Show more indicator if items are limited */}
          {maxItems && filteredOptions.length > maxItems && (
            <div className="px-3 py-2 text-xs text-zinc-500 border-t border-neutral-200 font-['Poppins']">
              Showing {maxItems} of {filteredOptions.length} results
            </div>
          )}
        </div>
      )}
    </div>
  );
}





