'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMounted(true);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      setMounted(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`absolute inset-0 backdrop-blur-[2px] bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className={`relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden h-[80vh] overflow-y-auto
        transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-[0.98]'}`}
      >
        <div className="relative p-6">
          <div className="flex items-start justify-between gap-6">
            <h3 id="modal-title" className="text-2xl font-semibold text-slate-900 tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm transition-colors"
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="mt-6">
            {children}
          </div>
        </div>

        <div className="h-4 w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
      </div>
    </div>
  );
}


