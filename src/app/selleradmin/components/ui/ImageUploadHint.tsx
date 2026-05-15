'use client';

import React from 'react';

interface ImageUploadHintProps {
  width: number;
  height: number;
  className?: string;
}

const gcd = (a: number, b: number): number => {
  if (!b) return a;
  return gcd(b, a % b);
};

export default function ImageUploadHint({ width, height, className = '' }: ImageUploadHintProps) {
  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;

  return (
    <p className={`text-xs text-zinc-500 ${className}`}>
      Recommended: {width}px × {height}px ({ratioW}:{ratioH})
    </p>
  );
}

