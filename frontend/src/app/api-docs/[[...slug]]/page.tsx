'use client';

import { use, useEffect, useMemo, useState, useCallback } from 'react';
import { DocsProvider, type Theme, type DocsTab } from '../DocsContext';
import type { Lang } from '../i18n';
import { parseUrl, buildUrl, type DocsRoute } from '../urlMapping';
import DocsHeader from '@/components/api-docs/DocsHeader';
import DocsTabs from '@/components/api-docs/DocsTabs';
import DocsSidebar from '@/components/api-docs/DocsSidebar';
import DocsRightToc from '@/components/api-docs/DocsRightToc';
import DocsContent from '@/components/api-docs/DocsContent';
import DocumentationContent from '@/components/api-docs/DocumentationContent';
import { THEME_KEY, applyThemeClass, readStoredTheme } from '@/lib/theme';

const LANG_KEY = 'vigil-docs-lang';

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const v = window.localStorage.getItem(key);
  return (allowed as readonly string[]).includes(v ?? '') ? (v as T) : fallback;
}

export default function ApiDocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  // The route is parsed from URL on mount; in-page navigation (sidebar click,
  // scroll-spy URL sync) updates `route` via local state and writes the URL
  // through history.replaceState — bypassing Next's router avoids the implicit
  // scroll-to-top some App Router transitions trigger on catch-all segments.
  const initialRoute = useMemo(() => parseUrl(slug), [slug]);
  const [route, setRoute] = useState<DocsRoute>(initialRoute);

  // External URL changes (browser back/forward) drop a new params Promise → new
  // slug. Re-derive and overwrite local state so the UI reflects the URL.
  useEffect(() => {
    setRoute(parseUrl(slug));
  }, [slug]);

  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [lang, setLangState] = useState<Lang>(() => readStored(LANG_KEY, ['en', 'ko'] as const, 'en'));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const setLang = (next: Lang) => {
    window.localStorage.setItem(LANG_KEY, next);
    setLangState(next);
  };

  const navigate = useCallback(
    (
      next: Partial<DocsRoute>,
      opts?: { scrollTop?: boolean },
    ) => {
      setRoute((prev) => {
        const merged = { ...prev, ...next };
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', buildUrl(merged));
        }
        return merged;
      });
      if (opts?.scrollTop) window.scrollTo({ top: 0 });
    },
    [],
  );

  // Tab change resets to top — sections within a tab handle their own anchoring.
  const setActiveTab = useCallback(
    (tab: DocsTab) => navigate({ activeTab: tab }, { scrollTop: true }),
    [navigate],
  );
  const setActiveApiPage = useCallback(
    (id: string) => navigate({ activeTab: 'api-reference', activeApiPage: id }),
    [navigate]
  );
  const setActiveDocPage = useCallback(
    (id: string) => navigate({ activeTab: 'documentation', activeDocPage: id }),
    [navigate]
  );

  return (
    <DocsProvider
      value={{
        lang,
        setLang,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        activeTab: route.activeTab,
        setActiveTab,
        activeDocPage: route.activeDocPage,
        setActiveDocPage,
        activeApiPage: route.activeApiPage,
        setActiveApiPage,
      }}
    >
      <div suppressHydrationWarning className="min-h-screen bg-surface-100 text-on-surf">
        <div className="px-[7%]">
          <DocsHeader />
          <DocsTabs />
          <div className="flex">
            <DocsSidebar />
            <main className="flex-1 min-w-0">
              <div className="max-w-3xl mx-auto px-6 py-12 lg:px-10">
                {route.activeTab === 'api-reference' ? (
                  <DocsContent />
                ) : (
                  <DocumentationContent />
                )}
              </div>
            </main>
            <DocsRightToc />
          </div>
        </div>
      </div>
    </DocsProvider>
  );
}
