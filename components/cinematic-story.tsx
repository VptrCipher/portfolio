"use client";
import { useEffect, useMemo } from 'react';

export function CinematicStory({ html }: { html: string }) {
  const markup = useMemo(() => ({ __html: html }), [html]);
  
  useEffect(() => { const root = document.querySelector('.cinematic-story');
    if (!root) return () => {};
    let disposed = false; let controller: { destroy(): void } | undefined;
    import(/* webpackIgnore: true */ new URL('assets/story-motion.js', document.baseURI).href).then(({mountMotion}) => { if (!disposed) controller = mountMotion(root, {"intensity":"expressive","scene":"signal-wave","renderer":"webgl","devices":["masked-type-entrance","pinned-scene-timeline","pointer-and-drag-orbit","scroll-object-transformation","editorial-word-reveal","scroll-type-ribbon","chapter-scene-change","magnetic-cta","hover-depth","navigation-line-draw"],"beats":[{"name":"Opening","trigger":"load / first viewport","behavior":"Headline lines arrive in sequence while the focal object assembles in depth."},{"name":"Unpack","trigger":"hero scroll 0–70%","behavior":"The camera orbits, execution planes separate or waveform changes, and the first headline hands off to a second composition."},{"name":"Resolve","trigger":"hero scroll 70–100%","behavior":"The scene settles and a contrasting editorial section enters through a changing frame."},{"name":"Inspect","trigger":"capability chapters and pointer input","behavior":"The persistent scene changes with each chapter; controls offer stack/explode and pause."},{"name":"Act","trigger":"hover, keyboard focus, final CTA","behavior":"Links draw their underline and the CTA responds with a bounded magnetic displacement."}],"reducedMotion":"No pinning, ambient loops, WebGL download, or staged text hiding. Keep static SVG/image, complete copy, native anchors, and form functionality."}); }).catch(() => { root.setAttribute('data-motion-state','fallback'); });
    return () => { disposed = true; controller?.destroy(); }; }, []);
  return <> <div dangerouslySetInnerHTML={markup} /></>;
}
