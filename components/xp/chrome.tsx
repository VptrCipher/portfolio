'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav, person } from '../../lib/content';

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  // Section anchors only exist on the home page; elsewhere they lead back to it.
  const home = usePathname() === '/';
  const to = (h: string) => (home ? h : `/${h}`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const els = nav.map(([, h]) => document.querySelector(h)).filter(Boolean) as Element[];
    const io = new IntersectionObserver((en) => { for (const e of en) if (e.isIntersecting) setActive(`#${e.target.id}`); }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((e) => io.observe(e));
    return () => { window.removeEventListener('keydown', onKey); io.disconnect(); };
  }, []);

  return (
    <header className="xp-nav">
      <div className="xp-pill">
        <a className="xp-brand" href={to('#top')} aria-label={`${person.name}, back to top`}><span className="xp-dot" aria-hidden="true" /><span className="xp-brand-text">NJ</span></a>
        <nav className="xp-links" aria-label="Primary">
          {nav.map(([label, href]) => <a key={label} href={to(href)} className={active === href ? 'on' : ''} aria-current={active === href ? 'true' : undefined}>{label}</a>)}
        </nav>
        <button type="button" className="xp-menu-btn" aria-expanded={open} aria-controls="xp-menu" onClick={() => setOpen((v) => !v)}>{open ? 'Close' : 'Menu'}</button>
      </div>
      <div id="xp-menu" className={`xp-menu${open ? ' open' : ''}`}>
        <nav className="xp-menu-links" aria-label="Menu">
          {nav.map(([label, href], i) => <a key={label} href={to(href)} onClick={() => setOpen(false)}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
