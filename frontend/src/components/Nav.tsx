"use client";

import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-sec-dim/40 border border-secondary/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary pulse-dot"></span>
            <span className="text-xs font-mono text-secondary">Block 19,482,731</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-300 hover:bg-surface-400 border border-outline/40 rounded-lg text-sm text-on-surf transition">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="hidden sm:inline">0x7a3…f19c</span>
          </button>
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-surface-300 transition text-muted"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline/20 bg-surface-100/95 backdrop-blur-xl">
          <div className="flex flex-col py-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted hover:text-on-surf hover:bg-surface-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
