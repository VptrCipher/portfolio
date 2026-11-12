'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PortfolioMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    let removePointer: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled || preference.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const revealOnEnter = (trigger: Element, target: Element | Element[], from: gsap.TweenVars, to: gsap.TweenVars, start = 'top 86%') => {
          ScrollTrigger.create({
            trigger,
            start,
            once: true,
            onEnter: () => gsap.fromTo(target, from, { ...to, immediateRender: false }),
          });
        };
        const hero = document.querySelector<HTMLElement>('.hero');
        const copy = document.querySelector<HTMLElement>('.hero-copy');
        const artwork = document.querySelector<HTMLElement>('.hero-art');
        const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
        const opening = gsap.timeline({ defaults: { ease: 'power4.out' } });
        opening
          .fromTo('.hero .eyebrow', { y: 18, autoAlpha: 0, letterSpacing: '.28em' }, { y: 0, autoAlpha: 1, letterSpacing: '.12em', duration: 0.7 })
          .fromTo(lines, { yPercent: 125, rotateX: -8, transformOrigin: 'left bottom' }, { yPercent: 0, rotateX: 0, duration: 1.1, stagger: 0.1 }, '-=.35')
          .fromTo('.hero-lede', { y: 22, autoAlpha: 0, filter: 'blur(8px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.75 }, '-=.4')
          .fromTo('.hero-actions > *', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 }, '-=.35')
          .fromTo('.hero-art-label, .hero-art-caption', { autoAlpha: 0, letterSpacing: '.3em' }, { autoAlpha: 1, letterSpacing: '.12em', duration: 0.9, stagger: 0.08 }, '-=1.1')
          .fromTo(artwork, { scale: 0.86, rotateY: 13, rotateZ: -5, autoAlpha: 0 }, { scale: 1, rotateY: 0, rotateZ: 0, autoAlpha: 1, duration: 1.5, ease: 'power3.out' }, '-=1.25');

        if (document.querySelector('.case-study')) {
          gsap.utils.toArray<HTMLElement>('.case-story').forEach((node) => revealOnEnter(node, node.children as unknown as Element[], { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 'top 82%'));
          document.querySelector<HTMLElement>('.case-gallery')?.querySelectorAll('figure').forEach((node) => revealOnEnter(node, node, { y: 45, clipPath: 'inset(7% 0)' }, { y: 0, clipPath: 'inset(0% 0)', duration: 0.9, ease: 'power3.out', clearProps: 'transform,clipPath' }, 'top 82%'));
        }

        if (hero && artwork && copy) {
          gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.75 } })
            .to(artwork, { yPercent: 18, scale: 0.9, rotateZ: 4, ease: 'none' }, 0)
            .to(copy, { y: -54, scale: 0.96, autoAlpha: 0.18, ease: 'none' }, 0.12)
            .to('.hero-grid', { yPercent: 12, opacity: 0.12, ease: 'none' }, 0);

          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const artX = gsap.quickTo(artwork, 'x', { duration: 0.85, ease: 'power3.out' });
            const artY = gsap.quickTo(artwork, 'y', { duration: 0.85, ease: 'power3.out' });
            const copyX = gsap.quickTo(copy, 'x', { duration: 0.7, ease: 'power3.out' });
            const move = (event: PointerEvent) => {
              const rect = hero.getBoundingClientRect();
              const x = (event.clientX - rect.left) / rect.width - 0.5;
              const y = (event.clientY - rect.top) / rect.height - 0.5;
              artX(-x * 24); artY(-y * 18); copyX(x * 7);
            };
            const leave = () => { artX(0); artY(0); copyX(0); };
            hero.addEventListener('pointermove', move, { passive: true });
            hero.addEventListener('pointerleave', leave, { passive: true });
            removePointer = () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); };
          }
        }

        gsap.utils.toArray<HTMLElement>('.section-index').forEach((node, i) => {
          revealOnEnter(node, node, { x: -28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, delay: i % 2 ? 0.06 : 0, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 'top 92%');
        });
        gsap.utils.toArray<HTMLElement>('.project-card').forEach((node, i) => {
          revealOnEnter(node, node, { y: 64, rotateX: 4, scale: 0.965, clipPath: 'inset(10% 0 5% 0)' }, { y: 0, rotateX: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)', duration: 1.05, delay: i * 0.14, ease: 'power4.out', clearProps: 'transform,clipPath' });
          const image = node.querySelector<HTMLElement>('.project-visual img');
          if (image) revealOnEnter(node, image, { scale: 1.18, yPercent: 4 }, { scale: 1, yPercent: 0, duration: 1.2, ease: 'power3.out', clearProps: 'transform' });
        });
        gsap.utils.toArray<HTMLElement>('.archive-card').forEach((node, i) => {
          revealOnEnter(node, node, { x: 45, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.75, delay: i * 0.09, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 'top 91%');
        });
        gsap.utils.toArray<HTMLElement>('.skill-group').forEach((node, i) => {
          revealOnEnter(node, node, { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.65, delay: i * 0.09, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 'top 91%');
        });
        const education = document.querySelector('.education-card');
        if (education) revealOnEnter(education, education, { clipPath: 'inset(0 0 100% 0)', y: 34 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1, ease: 'power3.inOut', clearProps: 'clipPath,transform' });

        const contactLines = gsap.utils.toArray<HTMLElement>('.contact-line');
        const contact = document.querySelector<HTMLElement>('.contact');
        if (contact && contactLines.length) revealOnEnter(contact, contactLines, { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.13, ease: 'power4.out', clearProps: 'transform' }, 'top 74%');
        if (contact) revealOnEnter(contact, document.querySelector('.contact-cta')!, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 'top 65%');

        const progress = document.querySelector<HTMLElement>('.motion-progress');
        if (progress) gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.15 } });
        ScrollTrigger.refresh();
      }, document.body);
    })().catch(() => undefined);
    return () => { cancelled = true; removePointer?.(); context?.revert(); };
  }, [pathname]);
  return null;
}
