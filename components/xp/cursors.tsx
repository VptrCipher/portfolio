'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '../../lib/store';

/**
 * Decorative "multiplayer" cursors. They are labelled with tools from the toolkit, never with
 * people's names: there are no collaborators to imply. Each one wanders on its own smooth path,
 * and when a heading marked `data-select` scrolls into view, one of them flies over and "selects" it.
 */
export const agents = [
  { name: 'python', color: '#ffd23f' },
  { name: 'react', color: '#3df5a0' },
  { name: 'fastapi', color: '#b48cff' },
  { name: 'three.js', color: '#4cc9ff' },
  { name: 'gsap', color: '#ff7ad9' },
] as const;

export function Arrow({ color }: { color: string }) {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
      <path d="M1 1 L1 16 L5.2 12.3 L8.2 19 L11 17.8 L8.1 11.3 L13.8 11.1 Z" fill={color} stroke="#0a0505" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function AgentCursors() {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useStore((s) => s.reduced);
  const ready = useStore((s) => s.ready);

  useEffect(() => {
    if (reduced || !ready) return;
    const root = layer.current; if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.agent'));
    const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
    const count = coarse ? 2 : els.length;
    els.forEach((e, i) => { e.style.display = i < count ? '' : 'none'; });
    const st = els.slice(0, count).map((_, i) => ({ x: window.innerWidth * (0.15 + 0.7 * Math.random()), y: window.innerHeight * (0.2 + 0.6 * Math.random()), seed: i * 17.3 + Math.random() * 10, task: null as null | { x: number; y: number; until: number } }));
    let raf = 0; const t0 = performance.now();

    // Wander targets hug the edges so the cursors rarely sit on top of body copy.
    const wander = (s: (typeof st)[number], t: number) => {
      const w = window.innerWidth, h = window.innerHeight;
      const u = (Math.sin(t * 0.00013 + s.seed) + Math.sin(t * 0.00031 + s.seed * 2.1) * 0.5) / 1.5;
      const v = (Math.cos(t * 0.00017 + s.seed * 1.3) + Math.sin(t * 0.00023 + s.seed) * 0.5) / 1.5;
      const ex = u > 0 ? 0.62 + u * 0.33 : 0.38 + u * 0.33;
      return { x: Math.min(w * ex, w - 90), y: h * (0.5 + v * 0.4) };
    };

    const loop = (now: number) => {
      const t = now - t0;
      st.forEach((s, i) => {
        let target = wander(s, t);
        if (s.task) { if (now > s.task.until) s.task = null; else target = s.task; }
        s.x += (target.x - s.x) * (s.task ? 0.09 : 0.03);
        s.y += (target.y - s.y) * (s.task ? 0.09 : 0.03);
        els[i].style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Selection moments: a cursor flies to a heading and draws a selection box around it.
    let next = 0;
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target as HTMLElement;
        if (el.dataset.selected) continue;
        el.dataset.selected = '1';
        const s = st[next++ % st.length]; const a = agents[(next - 1) % count];
        el.style.setProperty('--sel', a.color);
        el.dataset.selTag = a.name;
        el.classList.add('is-selected');
        const r = el.getBoundingClientRect();
        s.task = { x: r.right - 6, y: r.bottom - 4, until: performance.now() + 1600 };
        window.setTimeout(() => el.classList.remove('is-selected'), 2200);
      }
    }, { rootMargin: '-25% 0px -35% 0px' });
    document.querySelectorAll('[data-select]').forEach((n) => io.observe(n));
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reduced, ready]);

  if (reduced) return null;
  return (
    <div ref={layer} className="agents" aria-hidden="true">
      {agents.map((a) => (
        <div key={a.name} className="agent"><Arrow color={a.color} /><span style={{ background: a.color }}>{a.name}</span></div>
      ))}
    </div>
  );
}

/** The visitor's own cursor gets a "you" tag; the native cursor stays visible. Fine pointers only. */
export function YouTag() {
  const tag = useRef<HTMLDivElement>(null);
  const reduced = useStore((s) => s.reduced);
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const el = tag.current; if (!el) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, shown = false;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; if (!shown) { x = tx; y = ty; shown = true; el.style.opacity = '1'; } };
    const loop = () => { x += (tx - x) * 0.25; y += (ty - y) * 0.25; el.style.transform = `translate3d(${x + 16}px, ${y + 18}px, 0)`; raf = requestAnimationFrame(loop); };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [reduced]);
  if (reduced) return null;
  return <div ref={tag} className="you-tag" aria-hidden="true">you</div>;
}
