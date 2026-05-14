export type SiteThemeId = 'default' | 'ocean' | 'forest' | 'sunset' | 'midnight';

export type SiteThemePreset = {
  id: SiteThemeId;
  name: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
};

export const SITE_THEME_PRESETS: SiteThemePreset[] = [
  {
    id: 'default',
    name: 'Dreamshop Default',
    primary: '#d946ef',
    primaryDark: '#c026d3',
    secondary: '#a855f7',
    accent: '#ec4899',
    background: '#ffffff',
    foreground: '#171717',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    secondary: '#2563eb',
    accent: '#06b6d4',
    background: '#f8fdff',
    foreground: '#0f172a',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primary: '#16a34a',
    primaryDark: '#15803d',
    secondary: '#22c55e',
    accent: '#84cc16',
    background: '#f8fff7',
    foreground: '#1a2e1f',
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#f97316',
    primaryDark: '#ea580c',
    secondary: '#f59e0b',
    accent: '#ef4444',
    background: '#fffaf5',
    foreground: '#2b1d15',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    background: '#0b1020',
    foreground: '#f1f5f9',
  },
];

export const DEFAULT_SITE_THEME = SITE_THEME_PRESETS[0];

export function getThemePresetById(id?: string): SiteThemePreset {
  if (!id) return DEFAULT_SITE_THEME;
  return SITE_THEME_PRESETS.find((theme) => theme.id === id) || DEFAULT_SITE_THEME;
}
