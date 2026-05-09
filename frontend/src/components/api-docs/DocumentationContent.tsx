'use client';

import { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { DOCS } from '@/app/api-docs/content';
import {
  GETTING_STARTED_PAGES,
  MARKDOWN_GROUPS,
  parseDocPageId,
  type DocGroupKey,
} from '@/app/api-docs/constants';
import { useDocs } from '@/app/api-docs/DocsContext';
import { useDocsScrollSpy } from '@/hooks/useDocsScrollSpy';
import OverviewPanel from './OverviewPanel';
import QuickstartPanel from './QuickstartPanel';
import { MARKDOWN_COMPONENTS } from './markdownComponents';

// Anchor IDs for stacked layout. Group prefix prevents collisions between
// markdown sections with similar slugs (e.g., two groups both having a
// "quick-start" section would otherwise share the same DOM id).
export const docsAnchorId = (groupKey: string, sectionId: string) =>
  `${groupKey}__${sectionId}`;

export function parseDocsAnchorId(
  anchor: string,
): { group: string; section: string } | null {
  const sep = anchor.indexOf('__');
  if (sep < 0) return null;
  return { group: anchor.slice(0, sep), section: anchor.slice(sep + 2) };
}

const GETTING_STARTED_RENDERERS: Record<string, () => React.JSX.Element> = {
  overview: OverviewPanel,
  quickstart: QuickstartPanel,
};

interface FlatSection {
  group: DocGroupKey;
  sectionId: string;
  title: string;
}

export default function DocumentationContent() {
  const { lang, t, activeDocPage, setActiveDocPage } = useDocs();
  const lastSpySetRef = useRef<string | null>(null);
  const initialScrollDoneRef = useRef(false);
  const spyPausedRef = useRef(false);

  const allSections = useMemo<FlatSection[]>(() => {
    const list: FlatSection[] = [];
    for (const id of GETTING_STARTED_PAGES) {
      list.push({
        group: 'gettingStarted',
        sectionId: id,
        title: t.sidebar.gettingStartedPages[id],
      });
    }
    for (const groupKey of MARKDOWN_GROUPS) {
      const doc = DOCS[groupKey][lang];
      [doc.intro, ...doc.sections].forEach((s) => {
        list.push({ group: groupKey, sectionId: s.id, title: s.title });
      });
    }
    return list;
  }, [lang, t]);

  const sectionAnchorIds = useMemo(
    () => allSections.map((s) => docsAnchorId(s.group, s.sectionId)),
    [allSections],
  );

  const parsed = parseDocPageId(activeDocPage);
  const activeAnchor = parsed
    ? docsAnchorId(parsed.group, parsed.section)
    : docsAnchorId('gettingStarted', 'overview');

  useEffect(() => {
    if (lastSpySetRef.current === activeAnchor) return;
    const el = document.getElementById(activeAnchor);
    if (!el) return;
    const behavior: ScrollBehavior = initialScrollDoneRef.current ? 'smooth' : 'auto';
    spyPausedRef.current = true;
    el.scrollIntoView({ behavior, block: 'start' });
    initialScrollDoneRef.current = true;
    const tid = window.setTimeout(() => {
      spyPausedRef.current = false;
    }, 700);
    return () => window.clearTimeout(tid);
  }, [activeAnchor]);

  useDocsScrollSpy(sectionAnchorIds, (anchor) => {
    if (spyPausedRef.current) return;
    if (anchor === activeAnchor) return;
    const parts = parseDocsAnchorId(anchor);
    if (!parts) return;
    lastSpySetRef.current = anchor;
    setActiveDocPage(`${parts.group}:${parts.section}`);
  });

  return (
    <article>
      {allSections.map((s) => {
        const anchor = docsAnchorId(s.group, s.sectionId);
        if (s.group === 'gettingStarted') {
          const Renderer = GETTING_STARTED_RENDERERS[s.sectionId];
          if (!Renderer) return null;
          return (
            <section key={anchor} id={anchor} className="scroll-mt-24 pb-16">
              <Renderer />
            </section>
          );
        }

        const doc = DOCS[s.group as Exclude<DocGroupKey, 'gettingStarted'>][lang];
        const section = [doc.intro, ...doc.sections].find((x) => x.id === s.sectionId);
        if (!section) return null;
        const isFirstOfGroup = s.sectionId === doc.intro.id;
        const groupLabel = t.sidebar.docGroups[s.group];

        return (
          <section key={anchor} id={anchor} className="scroll-mt-24 pb-16">
            {isFirstOfGroup && (
              <p className="text-xs uppercase tracking-widest text-muted font-mono mb-3 mt-4">
                {groupLabel}
              </p>
            )}
            <h1 className="font-display font-bold text-4xl text-on-surf mt-1 mb-8 pb-4 border-b border-outline/15">
              {section.title}
            </h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={MARKDOWN_COMPONENTS}
            >
              {section.body}
            </ReactMarkdown>
          </section>
        );
      })}
    </article>
  );
}
