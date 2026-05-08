'use client';

import { useEffect, useState } from 'react';
import { THEME_KEY, applyThemeClass, readStoredTheme, type Theme } from '@/lib/theme';

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      suppressHydrationWarning
      className="p-1.5 rounded-lg hover:bg-surface-300 transition text-muted hover:text-on-surf"
    >
      <span
        suppressHydrationWarning
        className="material-symbols-outlined text-xl leading-none"
      >
        {isDark ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}
