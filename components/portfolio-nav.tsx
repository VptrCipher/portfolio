'use client';

import { useState } from 'react';

const links = [['Work', '/#work'], ['About', '/#about'], ['Toolkit', '/#toolkit'], ['Education', '/#education']] as const;

export function PortfolioNav() {
  const [open, setOpen] = useState(false);
  return <nav className={open ? 'portfolio-nav portfolio-nav--open' : 'portfolio-nav'} aria-label="Primary navigation">
    <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen((value) => !value)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    <div className="nav-menu" id="primary-links">{links.map(([name, href]) => <a key={name} href={href} onClick={() => setOpen(false)}>{name}</a>)}<a className="nav-contact" href="/#contact" onClick={() => setOpen(false)}>Let’s connect <span>↗</span></a></div>
  </nav>;
}
