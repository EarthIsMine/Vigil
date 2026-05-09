'use client';

import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver-based scroll spy. Calls onActiveChange whenever a
 * different section in `sectionIds` becomes the most prominent in the viewport.
 *
 * Caller is responsible for keeping `sectionIds` stable (memo) so the observer
 * isn't reset on every render.
 */
export function useDocsScrollSpy(
  sectionIds: readonly string[],
  onActiveChange: (id: string) => void,
  rootMargin = '-20% 0px -70%',
) {
  const onChangeRef = useRef(onActiveChange);
  useEffect(() => {
    onChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    if (sectionIds.length === 0) return;
    let active: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id !== active) {
            active = entry.target.id;
            onChangeRef.current(entry.target.id);
            break;
          }
        }
      },
      { rootMargin },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);
}
