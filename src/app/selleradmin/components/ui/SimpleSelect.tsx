'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleSelectProps<T extends string> {
  value: T | '';
  onChange: (v: T) => void;
  options: readonly T[];
  placeholder?: string;
  className?: string;
}

export default function SimpleSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder = 'Select',
  className,
}: SimpleSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-14 px-5 py-3.5 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-between items-center"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('text-base font-normal font-["Poppins"]', value ? 'text-zinc-900' : 'text-zinc-500')}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-5 h-5 text-zinc-500" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-neutral-200 p-2 z-50"
        >
          {options.map((opt) => {
            const selected = value === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm',
                  selected ? 'bg-neutral-100 text-zinc-900' : 'hover:bg-neutral-50 text-zinc-700'
                )}
                role="option"
                aria-selected={selected}
              >
                {selected ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                <span className="font-['Poppins']">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


