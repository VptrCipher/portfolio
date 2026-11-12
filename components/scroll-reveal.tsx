'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (cancelled || !ref.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (!ref.current) return;
          gsap.fromTo(ref.current, { y: 30, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration: 0.75, ease: 'power3.out', immediateRender: false,
          });
        },
      });
      ctx = { revert: () => trigger.kill() };
    });
    return () => { cancelled = true; ctx?.revert(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
