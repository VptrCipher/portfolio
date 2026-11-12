'use client';

import { useEffect, useRef, useState } from 'react';

// Kept apart from scene-kit so importing it never pulls three.js into the main bundle.
/** True while the element is within `margin` of the viewport. Scenes render only while true. */
export function useNearViewport<T extends HTMLElement>(margin = '200px') {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, near] as const;
}
