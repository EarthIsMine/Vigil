// Global UI theme — single source of truth for both the docs page and the
// dashboard nav menu. The class lives on <html>, persistence on localStorage.

export type Theme = 'light' | 'dark';
export const THEME_KEY = 'vigil-theme';

export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const v = window.localStorage.getItem(THEME_KEY);
  return v === 'light' ? 'light' : 'dark';
}

export function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('theme-light', theme === 'light');
}
