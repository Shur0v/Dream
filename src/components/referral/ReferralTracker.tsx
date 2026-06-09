'use client';

import { useEffect } from 'react';

const REFERRAL_STORAGE_KEY = 'dreamshop_referral';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function getStoredReferralCode(): string {
  if (typeof window === 'undefined') return '';
  try {
    const stored = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!stored) return '';
    const parsed = JSON.parse(stored) as { code?: string; expiresAt?: number };
    if (!parsed.code || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return '';
    }
    return parsed.code;
  } catch {
    return '';
  }
}

export default function ReferralTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('ref')?.trim().toUpperCase();
    if (!code) return;

    const payload = { code, expiresAt: Date.now() + THIRTY_DAYS_MS };
    window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(payload));
    document.cookie = `dreamshop_ref=${encodeURIComponent(code)}; Max-Age=${30 * 24 * 60 * 60}; Path=/; SameSite=Lax`;

    fetch('/api/reseller/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: code }),
    }).catch(() => {
      // Tracking should never block shopping.
    });
  }, []);

  return null;
}
