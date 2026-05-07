'use client';

import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/app/api-docs/i18n';

const OPTIONS: { value: Lang; flag: string; label: string }[] = [
  { value: 'en', flag: '🇺🇸', label: 'English' },
  { value: 'ko', flag: '🇰🇷', label: '한국어' },
];

interface Props {
  value: Lang;
  onChange: (lang: Lang) => void;
}

export default function LangDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        suppressHydrationWarning
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-surface-200 transition text-sm text-on-surf"
      >
        <span suppressHydrationWarning className="text-base leading-none">{current.flag}</span>
        <span suppressHydrationWarning>{current.label}</span>
        <span className="material-symbols-outlined text-sm leading-none text-muted">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1 min-w-[170px] bg-surface-100 border border-outline/30 rounded-lg shadow-lg overflow-hidden z-50"
        >
          {OPTIONS.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition text-left ${
                    selected ? 'text-primary font-medium' : 'text-on-surf hover:bg-surface-200'
                  }`}
                >
                  <span className="text-base leading-none">{opt.flag}</span>
                  <span className="flex-1">{opt.label}</span>
                  {selected && (
                    <span className="material-symbols-outlined text-base leading-none text-primary">
                      check
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
