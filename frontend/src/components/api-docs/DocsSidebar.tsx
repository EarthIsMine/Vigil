import { NAV_SECTIONS } from '@/app/api-docs/constants';

export default function DocsSidebar({ activeSection }: { activeSection: string }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-surface-100 fixed top-14 bottom-0 left-0 overflow-y-auto py-6 px-4 hidden lg:block fade-up">
      {NAV_SECTIONS.map((group) => (
        <div key={group.group} className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-2 px-3 font-mono">
            {group.group}
          </p>
          {group.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm px-3 py-1.5 transition-colors ${
                activeSection === item.id
                  ? 'text-primary bg-primary-dim/40'
                  : 'text-muted hover:text-on-surf hover:bg-surface-200'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
      <div className="mt-8 mx-3 p-3 bg-surface">
        <p className="text-xs text-muted">Need help?</p>
        <a href="#" className="text-xs text-primary hover:underline mt-1 inline-block">Join Discord →</a>
      </div>
    </aside>
  );
}
