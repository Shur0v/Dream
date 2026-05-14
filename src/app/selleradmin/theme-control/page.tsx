'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/dashboard';
import { DEFAULT_SITE_THEME, SITE_THEME_PRESETS, SiteThemeId, SiteThemePreset } from '@/lib/themePresets';

const THEME_EVENT = 'dreamshop-theme-updated';

export default function ThemeControlPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<SiteThemeId>(DEFAULT_SITE_THEME.id);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch('/api/admin/theme', { cache: 'no-store' });
        const result = await response.json();
        if (result?.success && result?.data?.current?.id) {
          setSelectedThemeId(result.data.current.id as SiteThemeId);
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      }
    };
    void loadTheme();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedThemeId }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to save theme');
      }

      const preset = result?.data?.preset as SiteThemePreset;
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: preset }));
      setMessage('Theme updated successfully. Reload homepage to verify.');
    } catch (error) {
      const err = error as Error;
      setMessage(err.message || 'Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h2 className="text-fuchsia-500 text-2xl md:text-3xl font-semibold font-['Poppins'] mb-3">Theme Control</h2>
        <p className="text-gray-600 mb-8">
          Choose one of five storefront themes. The current design stays default unless changed here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {SITE_THEME_PRESETS.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedThemeId(theme.id)}
                className={`text-left rounded-xl border-2 p-4 transition-all cursor-pointer ${
                  isSelected ? 'border-fuchsia-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{theme.name}</h3>
                  {isSelected && (
                    <span className="text-xs bg-fuchsia-500 text-white px-2 py-1 rounded-full">Selected</span>
                  )}
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full border" style={{ backgroundColor: theme.primary }} />
                  <span className="w-7 h-7 rounded-full border" style={{ backgroundColor: theme.secondary }} />
                  <span className="w-7 h-7 rounded-full border" style={{ backgroundColor: theme.accent }} />
                </div>
                <div className="text-xs text-gray-500">
                  Background: <span style={{ color: theme.foreground }}>{theme.background}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
