'use client';

import { useMemo } from 'react';
import { parseDocPageId, isMarkdownGroup } from '@/app/api-docs/constants';
import { DOCS } from '@/app/api-docs/content';
import { useDocs } from '@/app/api-docs/DocsContext';
import { extractHeadings } from '@/lib/extractHeadings';
import { useActiveSection } from '@/hooks/useActiveSection';

// API Reference: hardcoded sub-anchors per section.
// Empty arrays mean the section has no useful sub-headings — TOC will hide.
const API_SECTION_SUBHEADINGS: Record<string, { id: string; label: { en: string; ko: string } }[]> = {
  introduction: [],
  authentication: [],
  'send-transaction': [{ id: 'parameters', label: { en: 'Parameters', ko: '파라미터' } }],
  'mev-receipt': [
    { id: 'path-parameters', label: { en: 'Path Parameters', ko: '경로 파라미터' } },
    { id: 'response-fields', label: { en: 'Response Fields', ko: '응답 필드' } },
  ],
  'protection-status': [
    { id: 'response-fields', label: { en: 'Response Fields', ko: '응답 필드' } },
  ],
  'rate-limits': [],
  settings: [],
};

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

function TocList({ entries, activeId }: { entries: TocEntry[]; activeId: string }) {
  // Hierarchy: H2 sits at the primary indent, H3 nested further.
  // If all entries are the same level, treat them as primary (no extra indent).
  const hasMixedLevels = entries.some((e) => e.level === 2) && entries.some((e) => e.level === 3);

  return (
    <ul className="border-l border-outline/30">
      {entries.map((e) => {
        const isActive = activeId === e.id;
        const isNested = hasMixedLevels && e.level === 3;
        return (
          <li
            key={e.id}
            className={`-ml-px border-l-2 ${isActive ? 'border-primary' : 'border-transparent'}`}
          >
            <a
              href={`#${e.id}`}
              className={`block text-sm py-1.5 pr-2 transition-colors ${
                isNested ? 'pl-7' : 'pl-4'
              } ${
                isActive
                  ? 'text-primary font-medium'
                  : isNested
                    ? 'text-muted hover:text-on-surf'
                    : 'text-on-surf/85 hover:text-on-surf font-medium'
              }`}
            >
              {e.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ApiSectionToc() {
  const { lang, activeApiPage } = useDocs();
  const entries = useMemo<TocEntry[]>(
    () =>
      (API_SECTION_SUBHEADINGS[activeApiPage] ?? []).map((it) => ({
        id: it.id,
        text: it.label[lang],
        level: 2,
      })),
    [activeApiPage, lang]
  );
  const ids = useMemo(() => entries.map((e) => e.id), [entries]);
  const active = useActiveSection(ids);

  if (entries.length === 0) return null;
  return <TocList entries={entries} activeId={active} />;
}

function DocSectionToc({ pageId }: { pageId: string }) {
  const { lang } = useDocs();
  const parsed = parseDocPageId(pageId);

  const entries = useMemo<TocEntry[]>(() => {
    if (!parsed || !isMarkdownGroup(parsed.group)) return [];
    const doc = DOCS[parsed.group][lang];
    const section = [doc.intro, ...doc.sections].find((s) => s.id === parsed.section);
    if (!section) return [];
    return extractHeadings(section.body).map((h) => ({ id: h.id, text: h.text, level: h.level }));
  }, [parsed, lang]);

  const ids = useMemo(() => entries.map((e) => e.id), [entries]);
  const active = useActiveSection(ids);

  if (entries.length === 0) return null;
  return <TocList entries={entries} activeId={active} />;
}

export default function DocsRightToc() {
  const { t, activeTab, activeDocPage, activeApiPage } = useDocs();

  let content: React.ReactNode = null;
  if (activeTab === 'documentation') {
    const parsed = parseDocPageId(activeDocPage);
    if (!parsed || !isMarkdownGroup(parsed.group)) return null;
    content = <DocSectionToc pageId={activeDocPage} />;
  } else {
    if ((API_SECTION_SUBHEADINGS[activeApiPage] ?? []).length === 0) return null;
    content = <ApiSectionToc />;
  }

  return (
    <aside className="w-52 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto py-6 px-5 hidden xl:block">
      <div className="flex items-center gap-2 mb-3 text-on-surf">
        <span className="material-symbols-outlined text-base leading-none text-muted">notes</span>
        <p className="text-sm font-semibold">{t.rightToc.title}</p>
      </div>
      {content}
    </aside>
  );
}
