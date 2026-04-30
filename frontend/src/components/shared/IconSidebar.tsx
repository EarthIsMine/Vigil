"use client";

import Link from "next/link";

interface IconSidebarProps {
  activePath: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/receipt', icon: 'receipt_long', label: 'Receipt' },
  { href: '/protection', icon: 'security', label: 'Protection' },
  { href: '/analytics', icon: 'analytics', label: 'Analytics' },
];

export default function IconSidebar({ activePath }: IconSidebarProps) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-16 bg-vigil-card-dark border-r border-vigil-border-dark flex flex-col items-center py-6 gap-6 z-40">
      {NAV_ITEMS.map((item) => {
        const isActive = activePath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={`p-3 rounded-lg transition ${
              isActive
                ? 'bg-vigil-accent/10 text-vigil-accent'
                : 'hover:bg-vigil-accent/10 text-vigil-muted hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
          </Link>
        );
      })}
      <div className="mt-auto">
        <button className="p-3 rounded-lg hover:bg-vigil-accent/10 transition text-vigil-muted hover:text-white">
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>
    </aside>
  );
}
