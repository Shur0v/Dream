'use client';

import { useEffect } from 'react';
import { DEFAULT_SITE_THEME, SiteThemePreset } from '@/lib/themePresets';

const THEME_EVENT = 'dreamshop-theme-updated';

function applyTheme(preset: SiteThemePreset) {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', preset.primary);
  root.style.setProperty('--theme-primary-dark', preset.primaryDark);
  root.style.setProperty('--theme-secondary', preset.secondary);
  root.style.setProperty('--theme-accent', preset.accent);
  root.style.setProperty('--theme-bg', preset.background);
  root.style.setProperty('--theme-text', preset.foreground);
  root.style.setProperty('--background', preset.background);
  root.style.setProperty('--foreground', preset.foreground);
}

export default function ThemeBootstrap() {
  useEffect(() => {
    applyTheme(DEFAULT_SITE_THEME);

    const fetchAndApplyTheme = async () => {
      try {
        const response = await fetch('/api/theme', { cache: 'no-store' });
        const result = await response.json();
        if (result?.success && result?.data?.preset) {
          applyTheme(result.data.preset as SiteThemePreset);
        }
      } catch (error) {
        console.error('Failed to apply site theme:', error);
      }
    };

    void fetchAndApplyTheme();

    const onThemeUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<SiteThemePreset>;
      if (customEvent.detail) {
        applyTheme(customEvent.detail);
      }
    };

    window.addEventListener(THEME_EVENT, onThemeUpdated);
    return () => window.removeEventListener(THEME_EVENT, onThemeUpdated);
  }, []);

  return null;
}
