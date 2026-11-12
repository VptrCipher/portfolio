'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../lib/store';
import { Arrow, agents } from './cursors';

const SEEN_KEY = 'nj-xp-seen-v2';
const IMAGES = ['/projects/sayit/sayit-home-idle.png', '/projects/sayit/sayit-recording.png', '/projects/sayit/sayit-result.png'];

/** Wireframe of the hero the cursors "build" while the real assets load. */
const boxes = [
  { k: 'nav', label: 'nav', style: { left: '30%', top: '6%', width: '40%', height: '6%' } },
  { k: 'title', label: 'h1 · portfolio', style: { left: '8%', top: '20%', width: '84%', height: '26%' } },
  { k: 'name', label: 'name', style: { left: '8%', top: '52%', width: '34%', height: '20%' } },
  { k: 'card', label: 'card', style: { left: '58%', top: '52%', width: '34%', height: '22%' } },
  { k: 'band', label: 'marquee', style: { left: '0%', top: '82%', width: '100%', height: '7%' } },
];

export function Loader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading');
  const stop = useRef(false);
  const setReady = useStore((s) => s.setReady);
  const reduced = useStore((s) => s.reduced);

  const finish = () => {
    if (stop.current) return;
    stop.current = true;
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable: not fatal */ }
    setPct(100); setReady(true);
    setPhase('leaving');
    window.setTimeout(() => setPhase('gone'), 900);
  };

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch { /* ignore */ }
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || mqReduced || window.location.pathname !== '/') { stop.current = true; setReady(true); setPhase('gone'); return; }
    // Real work only: the document fonts, the project screenshots, and the 3D floor bundle.
    const tasks: Array<Promise<unknown>> = [
      document.fonts?.ready ?? Promise.resolve(),
      ...IMAGES.map((src) => new Promise<void>((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = src; })),
      import('./grid-scene'),
    ];
    let done = 0;
    // The build animation needs ~2.2 s to read; progress never waits longer than the real work plus that.
    const minShow = new Promise((r) => window.setTimeout(r, 2200));
    tasks.forEach((t) => Promise.resolve(t).catch(() => undefined).then(() => {
      done++; setPct(Math.round((done / tasks.length) * 100));
      if (done === tasks.length) void minShow.then(() => window.setTimeout(finish, 250));
    }));
    const failsafe = window.setTimeout(finish, 6000); // never hold the page hostage
    return () => window.clearTimeout(failsafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone' || reduced) return null;
  return (
    <div className={`loader${phase === 'leaving' ? ' loader--leaving' : ''}`} role="status" aria-live="polite" aria-label={`Loading ${pct} percent`}>
      <div className="lb-canvas" aria-hidden="true">
        {boxes.map((b, i) => (
          <div key={b.k} className={`lb-box lb-box--${b.k}`} style={{ ...b.style, animationDelay: `${0.15 + i * 0.32}s`, ['--c' as string]: agents[i % agents.length].color }}>
            <span>{b.label}</span>
          </div>
        ))}
        {agents.map((a, i) => (
          <div key={a.name} className={`lb-cursor lb-cursor--${i}`}><Arrow color={a.color} /><span style={{ background: a.color }}>{a.name}</span></div>
        ))}
      </div>
      <div className="loader-ui">
        <span className="loader-name">Building <b>Noah Jonathan J.</b></span>
        <span className="loader-pct" aria-hidden="true">{String(pct).padStart(3, '0')}<i>%</i></span>
        <button type="button" className="loader-skip" onClick={finish}>Skip intro</button>
      </div>
    </div>
  );
}
