'use client';

import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const compute = () => {
      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
      if (atBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1] ?? '');
        return;
      }
      const activationY = window.innerHeight * 0.25;
      let current = sectionIds[0] ?? '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= activationY) current = id;
        else break;
      }
      setActiveSection(current);
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [sectionIds]);

  return activeSection;
}
