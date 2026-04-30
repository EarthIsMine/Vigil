'use client';

import { NAV_SECTIONS } from './constants';
import { useActiveSection } from '@/hooks/useActiveSection';
import DocsSidebar from '@/components/api-docs/DocsSidebar';
import DocsContent from '@/components/api-docs/DocsContent';

const SECTION_IDS = NAV_SECTIONS.flatMap((g) => g.items.map((i) => i.id));

export default function ApiDocsPage() {
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-surface-100 text-on-surf">
      <div className="flex pt-14 min-h-screen">
        <DocsSidebar activeSection={activeSection} />
        <main className="flex-1 lg:ml-56">
          <div className="max-w-3xl px-6 py-12 lg:px-10">
            <DocsContent />
          </div>
        </main>
      </div>
    </div>
  );
}
