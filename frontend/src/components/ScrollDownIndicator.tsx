"use client";

import { useEffect, useState } from "react";

interface Props {
  sectionIds: string[];
}

export default function ScrollDownIndicator({ sectionIds }: Props) {
  const [nextId, setNextId] = useState<string | null>(sectionIds[0] ?? null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      const docHeight = document.documentElement.scrollHeight;
      const scrollBottom = window.scrollY + window.innerHeight;

      // Hide near the bottom of the page
      if (docHeight - scrollBottom < 200) {
        setVisible(false);
        return;
      }
      setVisible(true);

      // Find the next section below the current viewport middle
      let found: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > viewportMiddle) {
          found = id;
          break;
        }
      }

      setNextId(found);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  if (!visible || !nextId) return null;

  return (
    <a
      href={`#${nextId}`}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 scroll-down-arrow text-vigil-muted hover:text-white transition-opacity duration-300"
      aria-label="Scroll to next section"
    >
      <svg
        className="w-10 h-10 drop-shadow-lg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </a>
  );
}
