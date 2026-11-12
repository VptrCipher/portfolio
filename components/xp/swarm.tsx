'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '../../lib/store';
import { agents } from './cursors';

/**
 * Contact finale: a 2D canvas swarm of tiny coloured cursors that orbit the pointer and burst
 * outward on click or tap. Runs only while visible; reduced motion draws a single still frame.
 */
export function Swarm({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useStore((s) => s.reduced);

  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const g = c.getContext('2d'); if (!g) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const N = w < 500 ? 46 : 84;
    const ps = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2; const r = 40 + (i % 7) * 14;
      return { x: w / 2 + Math.cos(a) * r, y: h / 2 + Math.sin(a) * r, vx: 0, vy: 0, a, r, col: agents[i % agents.length].color, s: 0.7 + (i % 3) * 0.18 };
    });
    let px = w / 2, py = h / 2, raf = 0;
    const arrow = (x: number, y: number, rot: number, s: number, col: string) => {
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 12); g.lineTo(3.2, 9.2); g.lineTo(5.6, 14); g.lineTo(7.6, 13.1); g.lineTo(5.4, 8.4); g.lineTo(9.6, 8.3); g.closePath();
      g.fillStyle = col; g.fill(); g.restore();
    };
    const draw = (t: number) => {
      g.clearRect(0, 0, w, h);
      for (const p of ps) {
        const a = p.a + t * 0.0004 * (p.s > 0.9 ? -1 : 1);
        const tx = px + Math.cos(a) * p.r * (1 + Math.sin(t * 0.001 + p.a * 3) * 0.12);
        const ty = py + Math.sin(a) * p.r * 0.8;
        p.vx += (tx - p.x) * 0.012; p.vy += (ty - p.y) * 0.012;
        p.vx *= 0.9; p.vy *= 0.9; p.x += p.vx; p.y += p.vy;
        arrow(p.x, p.y, Math.atan2(p.vy, p.vx) - Math.PI / 4, p.s, p.col);
      }
    };
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
    const leave = () => { px = w / 2; py = h / 2; };
    const burst = () => { for (const p of ps) { const dx = p.x - px, dy = p.y - py; const d = Math.hypot(dx, dy) || 1; p.vx += (dx / d) * 18; p.vy += (dy / d) * 18; } };
    const host = c.parentElement!;
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('pointerdown', burst);
    const ro = new ResizeObserver(() => { resize(); px = w / 2; py = h / 2; }); ro.observe(c);

    if (reduced) { for (let i = 0; i < 120; i++) draw(i * 16); }
    else if (active) { const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerdown', burst); };
  }, [active, reduced]);

  return <canvas ref={canvas} className="swarm" aria-hidden="true" />;
}
