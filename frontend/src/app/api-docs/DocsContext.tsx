'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { STRINGS, type Lang, type Strings } from './i18n';

export type Theme = 'light' | 'dark';
export type DocsTab = 'documentation' | 'api-reference';

export interface DocsContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: DocsTab;
  setActiveTab: (tab: DocsTab) => void;
  activeDocPage: string;
  setActiveDocPage: (id: string) => void;
  activeApiPage: string;
  setActiveApiPage: (id: string) => void;
  t: Strings;
}

const DocsContext = createContext<DocsContextValue | null>(null);

export function DocsProvider({
  value,
  children,
}: {
  value: Omit<DocsContextValue, 't'>;
  children: ReactNode;
}) {
  return (
    <DocsContext.Provider value={{ ...value, t: STRINGS[value.lang] }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs(): DocsContextValue {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error('useDocs must be used within DocsProvider');
  return ctx;
}
