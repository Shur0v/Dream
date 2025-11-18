'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableMultiSelectOption {
  id: string | number;
  name: string;
  hexCode?: string;
  [key: string]: any;
}

interface SearchableMultiSelectProps<T extends SearchableMultiSelectOption> {
  options: T[];
  selectedIds: Array<string | number>;
  onChange: (ids: Array<string | number>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  controlClassName?: string;
  searchPlaceholder?: string;
  maxItems?: number;
  renderOption?: (option: T) => React.ReactNode;
}

export default function SearchableMultiSelect<T extends SearchableMultiSelectOption>({
  options,
  selectedIds,
  onChange,
  placeholder = 'Select options',
  disabled = false,
  className,
  controlClassName,
  searchPlaceholder = 'Search...',
  maxItems,
  renderOption,
}: SearchableMultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedSelectedIds = useMemo(
    () => selectedIds.map((id) => String(id)),
    [selectedIds]
  );

  const selectedOptions = useMemo(
    () =>
      normalizedSelectedIds
        .map((id) => options.find((opt) => String(opt.id) === id) || { id, name: id } as T)
        .filter(Boolean),
    [normalizedSelectedIds, options]
  );

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return options.filter((opt) => opt.name.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const displayOptions = maxItems ? filteredOptions.slice(0, maxItems) : filteredOptions;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const toggleOption = (option: T) => {
    const optionId = String(option.id);
    const exists = normalizedSelectedIds.includes(optionId);
    const updated = exists
      ? normalizedSelectedIds.filter((id) => id !== optionId)
      : [...normalizedSelectedIds, optionId];
    onChange(updated);
  };

  const handleRemoveChip = (id: string) => {
    onChange(normalizedSelectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={cn(
          'w-full min-h-14 px-5 py-2 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 text-left flex items-center gap-2',
          disabled && 'bg-neutral-50 cursor-not-allowed opacity-70',
          controlClassName
        )}
      >
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {selectedOptions.length === 0 ? (
            <span className="text-zinc-500 text-base font-normal font-['Poppins']">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-sm text-zinc-900 font-['Poppins']"
              >
                {option.hexCode && (
                  <span
                    className="w-3 h-3 rounded-full border border-white shadow"
                    style={{ backgroundColor: option.hexCode }}
                  />
                )}
                {option.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChip(String(option.id));
                  }}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 rounded hover:bg-neutral-100"
              aria-label="Clear all selections"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'w-5 h-5 text-zinc-500 transition-transform',
              open && !disabled && 'rotate-180'
            )}
          />
        </div>
      </button>

      {open && !disabled && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-neutral-200 z-50 max-h-80 overflow-hidden flex flex-col">
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

          <div className="overflow-y-auto flex-1">
            {displayOptions.length > 0 ? (
              displayOptions.map((option) => {
                const selected = normalizedSelectedIds.includes(String(option.id));
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => toggleOption(option)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-neutral-50 transition-colors',
                      selected ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-700'
                    )}
                  >
                    {selected ? (
                      <Check className="w-4 h-4 text-fuchsia-600" />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <div className="flex items-center gap-2 font-['Poppins']">
                        {option.hexCode && (
                          <span
                            className="w-3 h-3 rounded-full border border-white shadow"
                            style={{ backgroundColor: option.hexCode }}
                          />
                        )}
                        {option.name}
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-zinc-500 font-['Poppins']">
                {searchQuery ? 'No results found' : 'No options available'}
              </div>
            )}
          </div>

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

