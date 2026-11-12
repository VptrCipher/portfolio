# Portfolio Beyond Reality: build report

Next.js 15 (App Router) + React 19 + Three.js / React Three Fiber + GSAP ScrollTrigger + Lenis. Run it with `npm run dev -- --port 3002` or `npm run build && npm start`.

## What is built

Redesigned after a visual reference supplied by the owner (a short video of a black-and-red "poster" portfolio): condensed display type, red glow, a perspective grid floor, Figma-style multiplayer cursors, big project rows, toolkit cards and a "Let's build something" finale.

| Area | Implementation | Where |
|---|---|---|
| Opening sequence | "Agentic build": coloured cursors draw a wireframe of the hero while real work loads (fonts, three SayIt screenshots, the 3D floor bundle). Skip button, 6 s failsafe. Home page only; none for reduced motion or returning visitors (flag set before first paint). | `components/xp/loader.tsx`, inline script in `app/layout.tsx` |
| Hero | Giant gradient "PORTFOLIO" word, name in Anton, stats card. Behind it a WebGL grid floor (shader ridges, a swell that follows the pointer, scroll speeds it up). CSS perspective grid without WebGL. Optional portrait slot, empty because no photo was supplied. | `experience.tsx`, `grid-scene.tsx` |
| Multiplayer cursors | Five decorative cursors labelled with toolkit names (never people's names). They wander near the edges and "select" section headings with a Figma-style box as they scroll in. The visitor's pointer gets a "you" tag. Two cursors on phones, none for reduced motion. | `cursors.tsx` |
| Scroll motion | Lenis + GSAP. Titles rise in, project rows slide in, red highlights paint in with scroll, the giant word drifts away, marquees speed up and skew with scroll velocity, a counter counts up. Nothing is pinned or hijacked. | `experience.tsx` |
| Projects | "Things I've built": five rows (name, summary, stack, one-word status). A hover preview follows the pointer (the SayIt screenshot, or a labelled card where no screenshot exists). Featured rows open case studies; others open GitHub. | `experience.tsx`, `lib/content.ts` |
| Path | "Every claim. Linked." with a 100% counter (all listed projects link to a public repo) and verified rows only: the degree, SayIt's public releases, this site, and "Professional experience: none yet". | `experience.tsx` |
| Toolkit | Four 3D-tilt cards (skill groups). Selecting a tool names the project that uses it. Replaces the earlier 3D skills universe. | `experience.tsx` |
| Contact | "Let's build something" with a canvas swarm of tiny cursors that orbits the pointer and bursts on click. LinkedIn and GitHub only. | `swarm.tsx` |
| Nav | Floating pill with active-section highlight; on narrow screens the links move into a Menu panel. Links route back to the home page from case studies. | `chrome.tsx` |
| Quality tiers | ULTRA / BALANCED / ECO, chosen automatically from the device and then from measured frame times with hysteresis. There is no visitor-facing control: the graphics, sound and fps controls were removed at the owner's request. | `lib/store.ts`, `scene-kit.tsx` |

Removed in the redesign: the procedural hero sculpture, the 3D skills universe and the three Lab experiments (the reference has none of them). They remain in git history at commit 07b1160.

## Where the brief and the evidence disagreed

- **Project list.** The prompt's project list did not match the public repositories. The site follows the public repositories: SayIt and ShadowSync AI featured (ShadowSync is a fork and labelled a prototype), Agusta, ImaginePRO and Deadline-Radr in the archive. `foodshield-ai-platform`, `AtherNex` and `rag-production-system` are omitted.
- **Skills.** The older page listed SQL, Docker, Playwright and "computer vision". The audit has no repository evidence for them, so they are not claimed. Each skill now names the project that demonstrates it.
- **Typography.** Anton (display), Manrope and JetBrains Mono, self-hosted from exact-pinned `@fontsource` packages under the SIL Open Font License.
- **Reference vs. facts.** The reference shows a portrait, client metrics and job history. None exist for this portfolio, so the hero has no photo, the figures are counts of what the site lists, and the path shows only verified entries.

## Not delivered, on purpose

- Theatre.js, Rapier, Tailwind and Motion for React (extra weight with no feature that needed them).
- A photograph, a résumé link, an email address, a contact form, employment entries, certifications.
- A GLB or Spline hero asset, and a portrait (set `portrait` in `lib/content.ts` if one is supplied).
- Sound of any kind (the generated ambient pad was removed with the controls).

## Testing (executed; run `npm run qa:xp` with a production server up)

`scripts/xp-qa.mjs` against the production build, results in `qa/xp/report.json`, screenshots in `qa/xp/`:

- No horizontal overflow at 320x640, 375x812, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080, 2560x1440, 3840x2160 (all 0 px).
- Intro shows on the first home-page visit, removes itself, and is not shown on return (`intro-build-1280.png` captures the build animation).
- Reduced motion: no loader, no agent cursors, no "you" tag, headline present and untransformed, all 14 toolkit buttons present.
- WebGL unavailable (Chromium with 3D APIs disabled): CSS grid fallback shown, 5 project rows and 14 toolkit buttons usable.
- By interaction: toolkit selection names the project, the row hover preview appears, the mobile menu opens and Escape closes it.
- axe-core (WCAG 2.0/2.1/2.2 A and AA tags): 0 violations. Automated scan only; not a conformance claim.
- Zero console errors and page errors across all runs.
- `/work/sayit` and `/work/shadowsync` return 200 and render in the new type, without the intro.
- `tsc --noEmit` and `next build` pass.

Not tested: real-device touch behaviour (mobile viewports were emulated), screen readers, Safari and Firefox, long-session memory.

## Performance (measured, with caveats)

- Lighthouse 12-style desktop run against the local production build: performance 98, accessibility 100, best practices 96, SEO 100. FCP 0.3 s, LCP 0.8 s, TBT 130 ms, CLS 0.001, 499 KiB transferred (`qa/xp/lighthouse-desktop.json`). This is a lab run on localhost; it is not field data and not a mobile run.
- Frame rate: headless Chromium (software rendering) measured about 53 fps for plain `requestAnimationFrame` and the quality controller dropped the page to ECO on its own, which exercises the hysteresis. These numbers say nothing reliable about real GPUs. Measure on target devices before quoting any figure.
- First-load JS for `/` is 166 kB as reported by Next (down from about 420 kB: three.js is no longer pulled into the main bundle). The 3D floor chunk loads during the intro.
- The Lighthouse figures above predate the redesign and have not been re-measured.

## Licences

three, @react-three/fiber, @react-three/drei, lenis, zustand and Next.js are MIT. GSAP (with ScrollTrigger) is used under GSAP's standard licence. The SayIt screenshots come from its public repository. Fonts: Anton, Manrope, JetBrains Mono (SIL OFL 1.1, via @fontsource). No audio, models or textures are used.

## Deployment

Static-friendly Next output: `npm run build` then any Next host. Nothing is deployed and none of the figures above describe a deployed site. Before launch set the production URL for metadata and have someone review the site on real devices.
