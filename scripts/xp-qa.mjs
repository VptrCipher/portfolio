// Executed QA for the portfolio. Writes qa/xp/report.json and screenshots. Usage: PORTFOLIO_URL=http://127.0.0.1:3003 node scripts/xp-qa.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:3003';
const out = path.resolve('qa/xp');
await mkdir(out, { recursive: true });
const sizes = [[320, 640], [375, 812], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080], [2560, 1440], [3840, 2160]];
const report = { base, at: new Date().toISOString(), renderer: 'headless Chromium (software GL where no GPU): frame rates are NOT representative of real hardware', viewports: [], modes: {}, axe: [], consoleErrors: [] };
const browser = await chromium.launch({ headless: true });

async function open(ctxOpts, label, launchArgs) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(`${label}: ${m.text()}`); });
  page.on('pageerror', (e) => report.consoleErrors.push(`${label}: ${e.message}`));
  await page.goto(base, { waitUntil: 'load' });
  return { ctx, page };
}

// 1. Viewports: no horizontal overflow, screenshots of the hero and of the full page.
for (const [w, h] of sizes) {
  const { ctx, page } = await open({ viewport: { width: w, height: h } }, `${w}x${h}`);
  await page.getByRole('button', { name: /skip intro/i }).click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.screenshot({ path: path.join(out, `hero-${w}x${h}.png`) });
  if (w === 1440 || w === 390) {
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 160)); } window.scrollTo(0, 0); });
    for (const id of ['about', 'work', 'path', 'toolkit', 'contact']) {
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(out, `${id}-${w}x${h}.png`) });
    }
  }
  report.viewports.push({ w, h, horizontalOverflowPx: overflow });
  await ctx.close();
}

// 2. Intro: real progress, skip, and no-delay for a returning visitor.
{
  const { ctx, page } = await open({ viewport: { width: 1280, height: 800 } }, 'intro');
  const first = await page.locator('.loader').count();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(out, 'intro-build-1280.png') });
  await page.waitForFunction(() => !document.querySelector('.loader'), null, { timeout: 12000 }).catch(() => {});
  const gone = (await page.locator('.loader').count()) === 0;
  await page.reload({ waitUntil: 'load' });
  const returningLoaderVisible = await page.locator('.loader').isVisible().catch(() => false);
  report.modes.intro = { loaderShownFirstVisit: first > 0, loaderRemovedAutomatically: gone, loaderVisibleOnReturnVisit: returningLoaderVisible };
  await ctx.close();
}

// 3. Reduced motion: no loader, no agent cursors, no "you" tag, content still complete.
{
  const { ctx, page } = await open({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }, 'reduced');
  await page.waitForTimeout(1200);
  report.modes.reducedMotion = {
    loader: await page.locator('.loader').count(), agentCursors: await page.locator('.agents').count(), youTag: await page.locator('.you-tag').count(),
    h1: await page.locator('h1').innerText(), toolkitButtons: await page.locator('.tk-card button').count(),
    heroLineTransform: await page.locator('[data-hero-line]').first().evaluate((e) => getComputedStyle(e).transform),
  };
  await page.screenshot({ path: path.join(out, 'reduced-motion-1280.png') });
  await ctx.close();
}

// 4. WebGL unavailable: the page must still be complete and operable.
{
  const b2 = await chromium.launch({ headless: true, args: ['--disable-3d-apis', '--disable-gpu', '--use-gl=disabled'] });
  const ctx = await b2.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => report.consoleErrors.push(`no-webgl: ${e.message}`));
  await page.goto(base, { waitUntil: 'load' });
  await page.getByRole('button', { name: /skip intro/i }).click({ timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(1500);
  report.modes.noWebgl = {
    webglAvailable: await page.evaluate(() => { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }),
    heroFallbackShown: await page.locator('.hero-fallback').count(), canvases: await page.locator('canvas').count(),
    toolkitButtons: await page.locator('.tk-card button').count(), projectRows: await page.locator('.rows li').count(),
  };
  await page.screenshot({ path: path.join(out, 'no-webgl-1280.png') });
  await b2.close();
}

// 5. Interaction: toolkit selection, project-row preview, mobile menu open/close.
{
  const { ctx, page } = await open({ viewport: { width: 1280, height: 800 } }, 'interact');
  await page.getByRole('button', { name: /skip intro/i }).click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await page.locator('#toolkit').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Python', exact: true }).click();
  const sel = await page.locator('.tk-sel').innerText();
  await page.locator('.rows li').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.locator('.rows li').first().hover();
  await page.waitForTimeout(500);
  const preview = await page.locator('.row-preview.on').count();
  // The menu is for narrow screens only (desktop links live in the pill).
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu' }).click();
  const menuOpened = (await page.locator('#xp-menu.open').count()) === 1;
  await page.keyboard.press('Escape');
  report.modes.interaction = { toolkitSelectionText: sel, rowPreviewShown: preview, menuOpened, menuClosedByEscape: !(await page.locator('#xp-menu.open').count()) };
  // Frame rate over 3s with the hero in view (software GL in headless: informational only).
  await page.evaluate(() => window.scrollTo(0, 0));
  report.modes.measuredFps = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res(Math.round((n / 3) * 10) / 10); }; requestAnimationFrame(f); }));
  // Axe on the rendered page.
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  report.axe = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
  await ctx.close();
}

// 6. Case-study routes still render.
for (const slug of ['sayit', 'shadowsync']) {
  const { ctx, page } = await open({ viewport: { width: 1280, height: 800 } }, `case-${slug}`);
  const res = await page.goto(`${base}/work/${slug}`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  report.modes[`case-${slug}`] = { status: res?.status(), h1: await page.locator('h1').first().innerText() };
  await page.screenshot({ path: path.join(out, `case-${slug}-1280.png`) });
  await ctx.close();
}

await browser.close();
await writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
