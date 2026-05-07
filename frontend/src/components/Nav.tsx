"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavMoreMenu from "./NavMoreMenu";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/validator", label: "Validators" },
  { href: "/receipt", label: "MEV Receipt" },
];

export default function Nav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/api-docs") || pathname?.startsWith("/protection")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-100/80 backdrop-blur-xl border-b border-outline/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="font-display font-bold text-lg tracking-tight text-white">VIGIL</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-3 py-1.5 text-sm font-medium rounded-md ${
                  pathname === link.href ? "active text-primary" : "text-muted hover:text-on-surf"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NavMoreMenu />
        </div>
      </div>
    </nav>
  );
}
