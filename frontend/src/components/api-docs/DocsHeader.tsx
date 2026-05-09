'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useDocs } from '@/app/api-docs/DocsContext';
import LangDropdown from './LangDropdown';

export default function DocsHeader() {
  const { lang, setLang, theme, toggleTheme, searchQuery, setSearchQuery, t } = useDocs();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-14 bg-surface-100/90 backdrop-blur-xl border-b border-outline/30 flex items-center px-5 gap-4">
      {/* Left: Logo + Language */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link href="/api-docs" className="flex items-center">
          <span className="font-display font-bold text-lg tracking-tight text-on-surf">VIGIL</span>
        </Link>
        <LangDropdown value={lang} onChange={setLang} />
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-muted leading-none pointer-events-none">
            search
          </span>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.header.searchPlaceholder}
            className="w-full bg-surface-200 text-sm text-on-surf placeholder:text-muted pl-9 pr-12 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted bg-surface-100 px-1.5 py-0.5 rounded border border-outline/30">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-accent-blue hover:bg-blue-600 rounded-md transition"
        >
          {t.header.mainSite}
          <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t.header.themeLight : t.header.themeDark}
          suppressHydrationWarning
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-on-surf hover:bg-surface-200 transition"
        >
          <span suppressHydrationWarning className="material-symbols-outlined text-xl leading-none">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
}
