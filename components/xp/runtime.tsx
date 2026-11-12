'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { live } from '../../lib/live';
import { detectWebgl, initialTier, useStore } from '../../lib/store';

/**
 * Mounts once. Owns: reduced-motion state, WebGL detection, the initial graphics
 * tier, pointer/velocity tracking, and Lenis smooth scrolling driven by the GSAP ticker.
 * Lenis only smooths wheel input; the native scrollbar, keyboard and anchors still work.
 */
export function Runtime() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = useStore.getState();
    st.setWebgl(detectWebgl());
    st.setTier(initialTier());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    st.setReduced(mq.matches);
    document.documentElement.dataset.reduced = String(mq.matches);

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const startLenis = () => {
      if (lenis) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };
    const stopLenis = () => {
      if (!lenis) return;
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    };
    if (!mq.matches) startLenis();
    const onMq = () => {
      useStore.getState().setReduced(mq.matches);
      document.documentElement.dataset.reduced = String(mq.matches);
      if (mq.matches) stopLenis(); else startLenis();
      ScrollTrigger.refresh();
    };
    mq.addEventListener('change', onMq);

    // Pointer, velocity (damped per frame) and scroll progress for the WebGL scenes.
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      live.vx += nx - live.px; live.vy += ny - live.py;
      live.px = nx; live.py = ny;
      live.touch = e.pointerType === 'touch';
    };
    let lastY = window.scrollY;
    const frame = () => {
      live.vx *= 0.9; live.vy *= 0.9;
      live.speed = Math.min(1, Math.hypot(live.vx, live.vy) * 4);
      const y = window.scrollY;
      live.scrollVel += ((y - lastY) / window.innerHeight - live.scrollVel) * 0.2;
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      live.scroll = max > 0 ? y / max : 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    gsap.ticker.add(frame);

    return () => {
      mq.removeEventListener('change', onMq);
      window.removeEventListener('pointermove', onMove);
      gsap.ticker.remove(frame);
      stopLenis();
    };
  }, []);
  return null;
}
