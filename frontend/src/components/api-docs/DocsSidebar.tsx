'use client';

import {
  NAV_SECTIONS,
  DOC_GROUPS,
  GETTING_STARTED_PAGES,
  isMarkdownGroup,
  type EndpointMethod,
  type DocGroupKey,
} from '@/app/api-docs/constants';
import { DOCS } from '@/app/api-docs/content';
import { useDocs } from '@/app/api-docs/DocsContext';
import { docsAnchorId } from './DocumentationContent';

function scrollToAnchor(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const METHOD_PILL_COLORS: Record<EndpointMethod, string> = {
  GET: 'bg-secondary/15 text-secondary',
  POST: 'bg-primary/15 text-primary',
  DELETE: 'bg-error/15 text-error',
};

const DOC_GROUP_ICONS: Record<DocGroupKey, string> = {
  gettingStarted: 'menu_book',
  detectorReadme: 'sensors',
  detectorDesign: 'architecture',
  rpcReadme: 'shield',
};

function GroupHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 px-3 mb-3">
      <span className="material-symbols-outlined text-base leading-none text-on-surf">{icon}</span>
      <span className="text-sm font-semibold text-on-surf">{title}</span>
    </div>
  );
}

export default function DocsSidebar() {
  const {
    searchQuery,
    t,
    lang,
    activeTab,
    activeDocPage,
    activeApiPage,
  } = useDocs();
  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'documentation') {
    const groups = DOC_GROUPS.map((groupKey) => {
      let items: { id: string; title: string }[];
      if (isMarkdownGroup(groupKey)) {
        // Skip the auto-extracted intro (raw README front matter) — covered by curated Overview.
        items = DOCS[groupKey][lang].sections.map((s) => ({ id: s.id, title: s.title }));
      } else {
        // gettingStarted: curated pages
        items = GETTING_STARTED_PAGES.map((id) => ({
          id,
          title: t.sidebar.gettingStartedPages[id],
        }));
      }
      const filtered = q
        ? items.filter((it) => it.title.toLowerCase().includes(q) || it.id.toLowerCase().includes(q))
        : items;
      return {
        groupKey,
        title: t.sidebar.docGroups[groupKey],
        icon: DOC_GROUP_ICONS[groupKey],
        items: filtered,
      };
    }).filter((g) => g.items.length > 0);

    return (
      <aside className="w-60 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto py-6 px-4 hidden lg:block fade-up">
        {groups.length === 0 ? (
          <p className="text-sm text-muted px-3">{t.sidebar.noResults}</p>
        ) : (
          groups.map((group, idx) => (
            <div
              key={group.groupKey}
              className={`mb-2 ${idx > 0 ? 'pt-6 mt-6 border-t border-outline/15' : ''}`}
            >
              <GroupHeader icon={group.icon} title={group.title} />
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const pageId = `${group.groupKey}:${item.id}`;
                  const isActive = activeDocPage === pageId;
                  return (
                    <button
                      key={pageId}
                      type="button"
                      onClick={() => {
                        // All doc-tab content is stacked in one page — every
                        // sidebar item is a scroll target. Spy updates the URL.
                        scrollToAnchor(docsAnchorId(group.groupKey, item.id));
                      }}
                      className={`w-full text-left flex items-center gap-2 text-sm px-3 py-2 rounded transition-colors ${
                        isActive
                          ? 'text-primary bg-primary-dim/30 font-medium'
                          : 'text-muted hover:text-on-surf hover:bg-surface-200'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </aside>
    );
  }

  // API Reference tab
  const itemLabels = t.sidebar.items;
  const filteredGroups = NAV_SECTIONS.map((group) => ({
    group: group.group,
    items: group.items.filter((item) => {
      if (!q) return true;
      const label = itemLabels[item.id as keyof typeof itemLabels] ?? item.id;
      return (
        label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.method?.toLowerCase().includes(q) ?? false)
      );
    }),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="w-60 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto py-6 px-4 hidden lg:block fade-up">
      {filteredGroups.length === 0 ? (
        <p className="text-sm text-muted px-3">{t.sidebar.noResults}</p>
      ) : (
        filteredGroups.map((group, idx) => (
          <div
            key={group.group}
            className={`mb-2 ${idx > 0 ? 'pt-6 mt-6 border-t border-outline/15' : ''}`}
          >
            <p className="text-sm font-bold text-on-surf px-3 mb-3">
              {t.sidebar.groups[group.group as keyof typeof t.sidebar.groups] ?? group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const label = itemLabels[item.id as keyof typeof itemLabels] ?? item.id;
                const isActive = activeApiPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      // All API sections are stacked — scroll to the anchor.
                      // Spy updates the URL once it lands.
                      scrollToAnchor(item.id);
                    }}
                    className={`w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/15 font-medium'
                        : 'text-muted hover:text-on-surf hover:bg-surface-200'
                    }`}
                  >
                    {item.method && (
                      <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${METHOD_PILL_COLORS[item.method]}`}
                      >
                        {item.method}
                      </span>
                    )}
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </aside>
  );
}
