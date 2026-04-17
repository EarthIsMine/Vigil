"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/validator", label: "Validators" },
  { href: "/receipt", label: "MEV Receipt" },
  { href: "/protection", label: "Protection" },
  { href: "/api-docs", label: "API Docs" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-100/80 backdrop-blur-xl border-b border-outline/30">
      <div className="flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">shield</span>
            <span className="font-display font-bold text-lg tracking-tight text-white">VIGIL</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-3 py-1.5 text-sm font-medium rounded-md ${
                  pathname === link.href
                    ? "active text-primary"
                    : "text-muted hover:text-on-surf"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sec-dim/40 border border-secondary/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary pulse-dot"></span>
            <span className="text-xs font-mono text-secondary">Block 19,482,731</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-300 hover:bg-surface-400 border border-outline/40 rounded-lg text-sm text-on-surf transition">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            0x7a3…f19c
          </button>
        </div>
      </div>
    </nav>
  );
}
