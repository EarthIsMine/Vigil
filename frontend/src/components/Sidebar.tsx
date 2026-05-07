'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLatestSlot } from '@/hooks/useLatestSlot';
import { useConnectionStatus } from '@/components/ConnectionStatusProvider';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',  label: 'Dashboard',   icon: 'dashboard' },
  { href: '/validator',  label: 'Validators',  icon: 'verified_user' },
  { href: '/receipt',    label: 'MEV Receipt', icon: 'receipt_long' },
  { href: '/protection', label: 'Protection',  icon: 'shield' },
  { href: '/api-docs',   label: 'API Docs',    icon: 'code' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const latestSlot = useLatestSlot();
  const status = useConnectionStatus();

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-56 bg-surface flex-col border-r border-vigil-border z-40">
      <Link
        href="/"
        className="flex items-center gap-2 px-6 h-16 border-b border-vigil-border"
      >
        <span className="material-symbols-outlined text-vigil-green text-2xl">shield</span>
        <span className="font-display font-bold text-lg tracking-tight text-white">
          VIGIL
        </span>
      </Link>

      <nav aria-label="Primary" className="flex-1 px-3 py-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                'transition-colors',
                active
                  ? 'bg-white/[0.06] text-white'
                  : 'text-vigil-muted hover:text-white hover:bg-white/[0.03]',
              ].join(' ')}
            >
              <span
                className="material-symbols-outlined text-lg"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-vigil-border space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={[
              'w-1.5 h-1.5 rounded-full',
              status === 'live' ? 'bg-vigil-green animate-pulse' : 'bg-error',
            ].join(' ')}
            aria-hidden="true"
          />
          <span
            className={status === 'live' ? 'text-vigil-green' : 'text-error'}
          >
            {status === 'live' ? 'Live' : 'Offline'}
          </span>
        </div>
        <p className="font-mono text-xs text-vigil-muted tabular-nums">
          {latestSlot ? `Slot ${latestSlot.toLocaleString('en-US')}` : 'Connecting…'}
        </p>
      </div>
    </aside>
  );
}
