'use client';

import { useDocs, type DocsTab } from '@/app/api-docs/DocsContext';

const TABS: DocsTab[] = ['documentation', 'api-reference'];

export default function DocsTabs() {
  const { activeTab, setActiveTab, t } = useDocs();
  const labels: Record<DocsTab, string> = {
    documentation: t.tabs.documentation,
    'api-reference': t.tabs.apiReference,
  };

  return (
    <div className="sticky top-14 z-40 bg-surface-100/90 backdrop-blur-xl border-b border-outline/30">
      <div className="flex items-center px-5 h-10 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative h-10 px-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'text-primary'
                : 'text-muted hover:text-on-surf'
            }`}
          >
            {labels[tab]}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
