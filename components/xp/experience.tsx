'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about, education, heroStats, person, portrait, projects, skillGroups, skills, story } from '../../lib/content';
import { useStore } from '../../lib/store';
import { useNearViewport } from './viewport';
import { Swarm } from './swarm';

const GridScene = dynamic(() => import('./grid-scene'), { ssr: false });

function Hero() {
  const [ref, near] = useNearViewport<HTMLElement>('0px');
  const webgl = useStore((s) => s.webgl);
  const ready = useStore((s) => s.ready);
  const [first, ...rest] = person.name.toUpperCase().split(' ');
  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero-stage" aria-hidden="true">
        <div className="hero-sun" />
        {webgl ? <GridScene active={near && ready} /> : <div className="hero-fallback" />}
      </div>
      <p className="hero-word" aria-hidden="true" data-hero-word>Portfolio</p>
      {portrait && <div className="hero-portrait"><Image src={portrait.src} alt={portrait.alt} fill priority sizes="(max-width: 900px) 70vw, 34vw" /></div>}
      <div className="hero-body">
        <div className="hero-id">
          <p className="kicker" data-hero-fade><span className="pulse" />Hi, I&apos;m</p>
          <h1 id="hero-title">
            <span className="mask"><span className="line" data-hero-line>{first}</span></span>
            <span className="mask"><span className="line line--red" data-hero-line>{rest.join(' ')}</span></span>
          </h1>
          <p className="hero-role" data-hero-fade>AI &amp; Data Science student <i>/</i> software builder <i>/</i> {person.location}</p>
          <div className="hero-actions" data-hero-fade>
            <a className="btn btn--red" href="#work">See the work <span aria-hidden="true">↓</span></a>
            <a className="btn" href={person.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <aside className="hero-card" data-hero-fade aria-label="At a glance">
          <p className="hero-card-tag"><span /> Currently</p>
          <p className="hero-card-title">Building intelligent software, one working project at a time.</p>
          <p className="hero-card-sub">Studying {education.degree} at {education.school}, and shipping tools along the way.</p>
          <dl className="hero-stats">
            {heroStats.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
          </dl>
        </aside>
      </div>
    </section>
  );
}

const stackWords = ['Python', 'TypeScript', 'React', 'Next.js', 'FastAPI', 'Django', 'PySide6', 'scikit-learn', 'Sherpa-ONNX', 'Three.js', 'GSAP'];
function Marquee({ reverse = false }: { reverse?: boolean }) {
  const words = reverse ? [...stackWords].reverse() : stackWords;
  const row = words.map((w) => <span key={w}>{w}<i aria-hidden="true">◆</i></span>);
  return <div className={`marquee${reverse ? ' marquee--rev' : ''}`} aria-hidden="true"><div className="marquee-track">{row}{row}</div></div>;
}

/** Splits text so the configured phrases can carry a scrubbed red highlight. */
function Marked({ text, marks }: { text: string; marks: readonly string[] }) {
  const parts: Array<{ t: string; m: boolean }> = [];
  let rest = text;
  while (rest) {
    const hits = marks.map((m) => [rest.indexOf(m), m] as const).filter(([i]) => i >= 0).sort((a, b) => a[0] - b[0]);
    if (!hits.length) { parts.push({ t: rest, m: false }); break; }
    const [i, m] = hits[0];
    if (i > 0) parts.push({ t: rest.slice(0, i), m: false });
    parts.push({ t: m, m: true });
    rest = rest.slice(i + m.length);
  }
  return <>{parts.map((p, i) => (p.m ? <mark key={i} className="hl">{p.t}</mark> : <Fragment key={i}>{p.t}</Fragment>))}</>;
}

function About() {
  return (
    <section id="about" className="sec about" aria-labelledby="about-title">
      <div className="about-head">
        <p className="eyebrow"><span>01</span> Background &amp; philosophy</p>
        <h2 id="about-title" className="display" data-select>Builder <span className="red">first.</span></h2>
      </div>
      <p className="story" data-reveal><Marked text={story.text} marks={story.marks} /></p>
      <ul className="principles">
        {about.principles.map(([t, d], i) => <li key={t} data-reveal><span>0{i + 1}</span><b>{t}</b><p>{d}</p></li>)}
      </ul>
      <p className="note">No photograph is shown: none was supplied, and one will not be generated.</p>
    </section>
  );
}

function Work() {
  const list = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const hp = projects.find((p) => p.id === hover);
  useEffect(() => {
    const l = list.current, pv = preview.current; if (!l || !pv || !window.matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(pv, 'x', { duration: 0.5, ease: 'power3' }); const y = gsap.quickTo(pv, 'y', { duration: 0.5, ease: 'power3' });
    const move = (e: PointerEvent) => { const r = l.getBoundingClientRect(); x(e.clientX - r.left); y(e.clientY - r.top); };
    l.addEventListener('pointermove', move);
    return () => l.removeEventListener('pointermove', move);
  }, []);
  return (
    <section id="work" className="sec work" aria-labelledby="work-title">
      <div className="work-head">
        <div>
          <p className="eyebrow"><span>02</span> Selected work</p>
          <h2 id="work-title" className="display" data-select>Things I&apos;ve <span className="red">built.</span></h2>
        </div>
        <p className="work-intro" data-reveal>Five projects, each linked to its public repository. Status is stated as it is: one release, one forked prototype, and three works in progress or archived.</p>
      </div>
      <div ref={list} className="rows-wrap" onPointerLeave={() => setHover(null)}>
      <ol className="rows">
        {projects.map((p) => {
          const href = p.slug ? `/work/${p.slug}` : p.repo;
          const inner = (
            <>
              <span className="row-no">{p.id}</span>
              <span className="row-name">{p.name}</span>
              <span className="row-meta"><span className="row-sum">{p.summary}</span><span className="row-stack">{p.stack.join(' · ')}</span></span>
              <span className={`row-tag${p.tag === 'Released' ? ' row-tag--on' : ''}`}>{p.tag}</span>
              <span className="row-go" aria-hidden="true">{p.slug ? '→' : '↗'}</span>
            </>
          );
          return (
            <li key={p.id} data-row onPointerEnter={() => setHover(p.id)}>
              {p.slug
                ? <Link href={href} aria-label={`${p.name}: read the case study`}>{inner}</Link>
                : <a href={href} target="_blank" rel="noreferrer" aria-label={`${p.name}: open the repository (new tab)`}>{inner}</a>}
            </li>
          );
        })}
      </ol>
        <div ref={preview} className={`row-preview${hp ? ' on' : ''}`} aria-hidden="true">
          {projects.map((p) => (
            <div key={p.id} className={`pv${hover === p.id ? ' pv--on' : ''}`}>
              {p.image ? <Image src={p.image} alt="" fill sizes="340px" /> : <div className="pv-card"><span>{p.kind}</span><b>{p.name}</b><small>No screenshot published. Open the repository for the source.</small></div>}
            </div>
          ))}
        </div>
      </div>
      <p className="note">Nothing here claims deployment, users or measured impact. Featured rows open case studies; the others open GitHub.</p>
    </section>
  );
}

const pathRows = [
  { role: education.degree, where: `${education.school} · ${education.university}`, when: 'Now', on: true },
  { role: 'SayIt: public desktop releases', where: 'Windows x64 and Linux x86_64 builds on GitHub', when: 'Shipped', on: false },
  { role: 'This portfolio', where: 'Next.js, React Three Fiber, GSAP, built in the open', when: 'Live here', on: false },
  { role: 'Professional experience', where: 'None listed. This timeline only holds verified entries.', when: 'None yet', on: false },
];

function Path() {
  return (
    <section id="path" className="sec path" aria-labelledby="path-title">
      <div className="path-left">
        <p className="eyebrow"><span>03</span> Path</p>
        <h2 id="path-title" className="display" data-select>Every claim. <span className="red">Linked.</span></h2>
        <p className="count" aria-label="100 percent"><span data-count="100">100</span>%</p>
        <p className="count-cap">of the projects on this page link to a public repository you can read.</p>
      </div>
      <ol className="path-rows">
        {pathRows.map((r) => (
          <li key={r.role} data-reveal><div><b>{r.role}</b><span>{r.where}</span></div><em className={r.on ? 'on' : ''}>{r.when}</em></li>
        ))}
      </ol>
    </section>
  );
}

function Quote() {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = card.current; if (!c || !window.matchMedia('(pointer: fine)').matches) return;
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' }); const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 16); rx(-((e.clientY - r.top) / r.height - 0.5) * 12); };
    const leave = () => { rx(0); ry(0); };
    c.addEventListener('pointermove', move); c.addEventListener('pointerleave', leave);
    return () => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); };
  }, []);
  return (
    <section className="sec quote" aria-labelledby="quote-title">
      <div>
        <h2 id="quote-title" className="display">More commits.<br /><span className="red">Fewer claims.</span></h2>
        <p className="quote-sub" data-reveal>I would rather show a working prototype with an honest label than a polished promise. The repositories are the receipts.</p>
      </div>
      <div className="quote-wrap"><div ref={card} className="quote-card" data-reveal><p>If it isn&apos;t in the repo, it isn&apos;t on this page.</p><span>— house rule for this site</span></div></div>
    </section>
  );
}

const groupBlurb: Record<string, string> = {
  Languages: 'What the projects are written in.',
  'AI & data': 'Models and scoring inside real tools.',
  'Application engineering': 'Frameworks used to ship interfaces and APIs.',
  Tooling: 'Motion, 3D and packaging.',
};

function Toolkit() {
  const [sel, setSel] = useState<string | null>(null);
  const cur = skills.find((s) => s.id === sel);
  return (
    <section id="toolkit" className="sec toolkit" aria-labelledby="toolkit-title">
      <div className="work-head">
        <div>
          <p className="eyebrow"><span>04</span> Toolkit</p>
          <h2 id="toolkit-title" className="display" data-select>The <span className="red">toolkit.</span></h2>
        </div>
        <p className="work-intro" data-reveal>Only tools that appear in a project. No percentages and no seniority labels, because they would be invented. Select one to see where it is used.</p>
      </div>
      <div className="tk-grid">
        {skillGroups.map((g, gi) => (
          <div key={g} className="tk-card" data-reveal data-tilt>
            <span className="tk-no">0{gi + 1}</span>
            <h3>{g}</h3>
            <p>{groupBlurb[g]}</p>
            <ul>{skills.filter((s) => s.group === g).map((s) => (
              <li key={s.id}><button type="button" aria-pressed={sel === s.id} onClick={() => setSel(sel === s.id ? null : s.id)}>{s.label}</button></li>
            ))}</ul>
          </div>
        ))}
      </div>
      <p className="tk-sel" aria-live="polite">{cur ? <><b>{cur.label}</b> is used in {cur.evidence}.</> : 'Select a tool to see the project behind it.'}</p>
    </section>
  );
}

function Contact() {
  const [ref, near] = useNearViewport<HTMLDivElement>('100px');
  return (
    <section id="contact" className="sec contact" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div>
          <p className="eyebrow"><span>05</span> Contact</p>
          <h2 id="contact-title" className="display display--xl" data-select>Let&apos;s build <span className="red">something.</span></h2>
          <p className="contact-sub" data-reveal>Have a project, a question about the work, or a good problem? Reach out on either profile.</p>
          <div className="contact-links" data-reveal>
            <a className="btn btn--red btn--xl" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a className="btn btn--xl" href={person.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div ref={ref} className="swarm-box" aria-hidden="true"><Swarm active={near} /><span>move · click</span></div>
      </div>
      <p className="note">There is no contact form on purpose: there is no backend behind one.</p>
      <footer className="foot"><span>© {person.name} · {person.location}</span><a href="#top">Back to top ↑</a></footer>
    </section>
  );
}

export function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const ready = useStore((s) => s.ready);
  const reduced = useStore((s) => s.reduced);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current; if (!el) return;
    const ctx = gsap.context(() => {
      if (reduced) { gsap.set('[data-reveal],[data-hero-line],[data-hero-fade]', { clearProps: 'all' }); return; }
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((n) => {
        gsap.from(n, { y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 90%', once: true } });
      });
      // Section titles: each word rises out of a mask.
      gsap.utils.toArray<HTMLElement>('.display').forEach((h) => {
        gsap.from(h, { yPercent: 30, opacity: 0, skewY: 4, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
      });
      // Project rows slide in one after another.
      gsap.from('[data-row]', { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.rows', start: 'top 82%', once: true } });
      // Red highlights paint in with scroll (scrubbed, so they follow the reader).
      gsap.utils.toArray<HTMLElement>('.hl').forEach((m) => {
        gsap.fromTo(m, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: m, start: 'top 80%', end: 'top 50%', scrub: true } });
      });
      // The giant word drifts and grows as the hero scrolls away.
      gsap.to('[data-hero-word]', { yPercent: 40, scale: 1.12, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-body', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: '90% top', scrub: true } });
      // Marquees: speed and skew follow scroll velocity.
      const tracks = gsap.utils.toArray<HTMLElement>('.marquee-track');
      const tweens = tracks.map((t, i) => gsap.to(t, { xPercent: i % 2 ? 0 : -50, startAt: { xPercent: i % 2 ? -50 : 0 }, duration: 38, ease: 'none', repeat: -1 }));
      const skew = gsap.quickTo('.marquee', 'skewX', { duration: 0.5, ease: 'power3' });
      ScrollTrigger.create({ onUpdate: (self) => { const v = self.getVelocity(); tweens.forEach((tw) => tw.timeScale(1 + Math.min(4, Math.abs(v) / 400))); skew(gsap.utils.clamp(-8, 8, v / -250)); } });
      // Counter counts up as it enters.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((n) => {
        const o = { v: 0 }; const to = Number(n.dataset.count);
        gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: n, start: 'top 85%', once: true }, onUpdate: () => { n.textContent = String(Math.round(o.v)); } });
      });
      // Toolkit cards tilt toward the pointer.
      if (window.matchMedia('(pointer: fine)').matches) {
        gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((c) => {
          const rx = gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3' }); const ry = gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3' });
          c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 8); c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`); });
          c.addEventListener('pointerleave', () => { rx(0); ry(0); });
        });
        gsap.utils.toArray<HTMLElement>('.xp .btn').forEach((b) => {
          const x = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' }); const y = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
          b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); x(((e.clientX - r.left) / r.width - 0.5) * 12); y(((e.clientY - r.top) / r.height - 0.5) * 8); });
          b.addEventListener('pointerleave', () => { x(0); y(0); });
        });
      }
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (!ready || reduced) return;
    const t = gsap.timeline({ defaults: { ease: 'power4.out' } });
    t.from('[data-hero-word]', { yPercent: 30, opacity: 0, scaleY: 1.3, duration: 1.4 })
      .from('[data-hero-line]', { yPercent: 115, duration: 1.1, stagger: 0.1 }, '-=1.0')
      .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.7');
    return () => { t.kill(); };
  }, [ready, reduced]);

  return (
    <div ref={root} className="xp">
      <Hero /><Marquee /><About /><Work /><Marquee reverse /><Path /><Quote /><Toolkit /><Contact />
    </div>
  );
}
