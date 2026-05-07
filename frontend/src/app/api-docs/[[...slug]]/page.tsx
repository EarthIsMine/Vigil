'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { parseDocPageId, isMarkdownGroup } from '../constants';
import { DocsProvider, type Theme, type DocsTab } from '../DocsContext';
import type { Lang } from '../i18n';
import { parseUrl, buildUrl } from '../urlMapping';
import DocsHeader from '@/components/api-docs/DocsHeader';
import DocsTabs from '@/components/api-docs/DocsTabs';
import DocsSidebar from '@/components/api-docs/DocsSidebar';
import DocsRightToc from '@/components/api-docs/DocsRightToc';
import DocsContent from '@/components/api-docs/DocsContent';
import DocSectionView from '@/components/api-docs/DocSectionView';
import GettingStartedView from '@/components/api-docs/GettingStartedView';
import { THEME_KEY, applyThemeClass, readStoredTheme } from '@/lib/theme';

const LANG_KEY = 'vigil-docs-lang';

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const v = window.localStorage.getItem(key);
  return (allowed as readonly string[]).includes(v ?? '') ? (v as T) : fallback;
}

export default function ApiDocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const route = parseUrl(slug);
  const router = useRouter();

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
    (next: Partial<{ activeTab: DocsTab; activeApiPage: string; activeDocPage: string }>) => {
      const url = buildUrl({ ...route, ...next });
      router.replace(url, { scroll: false });
      window.scrollTo({ top: 0 });
    },
    [route, router]
  );

  const setActiveTab = useCallback((tab: DocsTab) => navigate({ activeTab: tab }), [navigate]);
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
                ) : (() => {
                  const parsed = parseDocPageId(route.activeDocPage);
                  if (parsed && isMarkdownGroup(parsed.group)) {
                    return <DocSectionView pageId={route.activeDocPage} />;
                  }
                  return <GettingStartedView pageId={route.activeDocPage} />;
                })()}
              </div>
            </main>
            <DocsRightToc />
          </div>
        </div>
      </div>
    </DocsProvider>
  );
}
