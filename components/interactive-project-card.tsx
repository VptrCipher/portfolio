'use client';

import Image from 'next/image';
import { useRef, type CSSProperties, type PointerEvent } from 'react';

type Props = {
  id: string;
  name: string;
  kind: string;
  desc: string;
  href: string;
  repo: string;
  tags: string[];
  accent: string;
  image?: string;
  secondaryImage?: string;
};

export function InteractiveProjectCard(project: Props) {
  const card = useRef<HTMLElement>(null);
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty('--tilt-x', `${(x - 0.5) * 3.2}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(0.5 - y) * 2.6}deg`);
    event.currentTarget.style.setProperty('--spot-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--spot-y', `${y * 100}%`);
  };
  const reset = () => {
    if (!card.current) return;
    card.current.style.setProperty('--tilt-x', '0deg');
    card.current.style.setProperty('--tilt-y', '0deg');
  };
  return <article ref={card} className={`project-card project-card--${project.accent}`} onPointerMove={tilt} onPointerLeave={reset}>
    <a className="project-visual" href={project.href} aria-label={`Explore ${project.name} case study`}>
      <span className="project-glare" aria-hidden="true" />
      {project.image ? <>
        <Image src={project.image} alt="SayIt desktop application screen from the public project repository" fill sizes="(max-width: 760px) 100vw, 58vw" className="project-shot project-shot--primary"/>
        {project.secondaryImage && <Image src={project.secondaryImage} alt="SayIt recording screen from the public project repository" fill sizes="(max-width: 760px) 100vw, 58vw" className="project-shot project-shot--secondary"/>}
        <div className="waveform" aria-hidden="true">{Array.from({ length: 31 }, (_, i) => <i key={i} style={{ '--wave-i': i, height: `${7 + Math.abs(Math.sin(i * 8.71)) * 38}px` } as CSSProperties}/>)}</div>
        <span className="visual-label"><i/> REPOSITORY UI · HOVER TO INSPECT</span>
        <span className="visual-state" aria-hidden="true"><b>VOICE INPUT</b><span>● LOCAL MODE / READY</span></span>
      </> : <div className="shadow-visual" aria-hidden="true">
        <div className="shadow-orbit shadow-orbit--one"/><div className="shadow-orbit shadow-orbit--two"/><div className="shadow-center">SS<span>AI</span></div>
        <span className="shadow-node shadow-node--a">TX · 204</span><span className="shadow-node shadow-node--b">MATCH?</span><span className="shadow-node shadow-node--c">RISK 0.82</span>
        <svg className="shadow-signal-path" viewBox="0 0 800 500" preserveAspectRatio="none"><path d="M55 340 C220 280 180 85 376 220 S580 470 745 135"/></svg>
        <div className="visual-label"><i/> SYSTEM DIAGRAM · CONCEPTUAL</div>
      </div>}
      <span className="project-arrow">↗</span>
    </a>
    <div className="project-info"><div className="project-topline"><span>{project.id} / {project.kind}</span><span>↗</span></div><h3><a href={project.href}>{project.name}<sup>{project.id}</sup></a></h3><p>{project.desc}</p><div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="project-visit" href={project.href}>Read the case study <span>↗</span></a></div>
  </article>;
}
