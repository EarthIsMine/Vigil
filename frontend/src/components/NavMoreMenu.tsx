"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface MoreItem {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
}

// Shown at all breakpoints — secondary destinations
const ITEMS: MoreItem[] = [
  { href: "/protection", label: "Protection", icon: "shield", external: true },
  { href: "/api-docs", label: "API Docs", icon: "code", external: true },
];

// Mobile-only — main nav items hidden at sm/md breakpoints
const MOBILE_NAV: MoreItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/validator", label: "Validators", icon: "verified_user" },
  { href: "/receipt", label: "MEV Receipt", icon: "receipt_long" },
];

export default function NavMoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More menu"
        aria-expanded={open}
        className="p-1.5 rounded-lg hover:bg-surface-300 transition text-muted hover:text-on-surf"
      >
        <span className="material-symbols-outlined text-xl leading-none">
          {open ? "close" : "menu"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-surface-100 border border-outline/30 rounded-lg shadow-lg overflow-hidden z-50">
          <ul className="py-1">
            {MOBILE_NAV.map((item) => (
              <li key={item.href} className="md:hidden">
                <Link
                  href={item.href}
                  onClick={close}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surf hover:bg-surface-300 transition"
                >
                  <span className="material-symbols-outlined text-base text-muted leading-none">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="md:hidden border-t border-outline/15 my-1" aria-hidden="true" />

            {ITEMS.map((item) =>
              item.external ? (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surf hover:bg-surface-300 transition"
                  >
                    <span className="material-symbols-outlined text-base text-muted leading-none">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span className="material-symbols-outlined text-sm text-muted leading-none">
                      open_in_new
                    </span>
                  </a>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surf hover:bg-surface-300 transition"
                  >
                    <span className="material-symbols-outlined text-base text-muted leading-none">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
