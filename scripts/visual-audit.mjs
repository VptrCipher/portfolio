import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:3000';
const out = path.resolve('qa/visual-audit');
await mkdir(out, { recursive: true });
const sizes = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'laptop-1280x800', width: 1280, height: 800 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-375x812', width: 375, height: 812 },
  { name: 'mobile-narrow-320x640', width: 320, height: 640 },
];
const browser = await chromium.launch({ headless: true });
const report = { base, checkedAt: new Date().toISOString(), viewports: [], routes: [], consoleErrors: [], axeViolations: [] };
for (const size of sizes) {
  const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(`${size.name}: ${message.text()}`); });
  page.on('pageerror', (error) => report.consoleErrors.push(`${size.name}: ${error.message}`));
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(size.name === 'desktop-1440x900' ? 1800 : 900);
  const metrics = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    h1: (() => { const el = document.querySelector('h1'); const r = el?.getBoundingClientRect(); return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) } : null; })(),
    links: [...document.querySelectorAll('a[href]')].length,
    heroCanvas: (() => { const el = document.querySelector('.hero-art canvas'); return el ? { width: el.width, height: el.height } : null; })(),
  }));
  await page.screenshot({ path: path.join(out, `${size.name}.png`), fullPage: true, animations: 'disabled' });
  if (size.name === 'desktop-1440x900') {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(250);
    await page.mouse.move(1130, 430);
    await page.waitForTimeout(450);
    await page.locator('.hero').screenshot({ path: path.join(out, 'desktop-hero-pointer-motion.png'), animations: 'disabled' });
    await page.mouse.move(30, 30);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(250);
    for (const [label, selector] of [['desktop-hero', '.hero'], ['desktop-projects', '#work'], ['desktop-toolkit', '#toolkit'], ['desktop-education', '#education'], ['desktop-contact', '#contact']]) {
      const el = page.locator(selector);
      await el.screenshot({ path: path.join(out, `${label}.png`), animations: 'disabled' });
    }
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1100);
    const sayitVisual = page.locator('.project-card--mint .project-visual');
    await sayitVisual.hover();
    await page.waitForTimeout(3300);
    const sayitHover = await page.locator('.project-card--mint').evaluate((el) => ({ transform: getComputedStyle(el).transform, secondaryOpacity: getComputedStyle(el.querySelector('.project-shot--secondary')).opacity, waveformOpacity: getComputedStyle(el.querySelector('.waveform')).opacity }));
    await sayitVisual.screenshot({ path: path.join(out, 'project-sayit-hover-motion.png'), animations: 'disabled' });
    const shadowVisual = page.locator('.project-card--orange .project-visual');
    await shadowVisual.hover();
    await page.waitForTimeout(350);
    const shadowHover = await page.locator('.project-card--orange').evaluate((el) => ({ transform: getComputedStyle(el).transform, signalDash: getComputedStyle(el.querySelector('.shadow-signal-path path')).strokeDashoffset }));
    await shadowVisual.screenshot({ path: path.join(out, 'project-shadowsync-hover-motion.png'), animations: 'disabled' });
    report.motion = { sayitHover, shadowHover, heroCanvasPresent: await page.locator('.hero-art canvas').count() > 0 };
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(250);
  }
  if (size.name === 'mobile-390x844') {
    await page.getByRole('button', { name: /menu/i }).click();
    const expanded = await page.getByRole('button', { name: /close/i }).getAttribute('aria-expanded');
    if (expanded !== 'true') report.consoleErrors.push('mobile-390x844: navigation menu did not open');
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await page.waitForTimeout(900);
  }
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.axeViolations.push(...axe.violations.map((v) => ({ viewport: size.name, id: v.id, impact: v.impact, description: v.help, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })));
  report.viewports.push({ ...size, status: response?.status(), ...metrics, horizontalOverflow: metrics.scrollWidth > metrics.width });
  await context.close();
}
const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
reducedPage.on('pageerror', (error) => report.consoleErrors.push(`reduced-motion: ${error.message}`));
const reducedResponse = await reducedPage.goto(base, { waitUntil: 'networkidle' });
await reducedPage.waitForTimeout(500);
await reducedPage.screenshot({ path: path.join(out, 'reduced-motion-desktop.png'), fullPage: true, animations: 'disabled' });
report.routes.push({ route: '/ (prefers-reduced-motion)', status: reducedResponse?.status(), contentVisible: await reducedPage.locator('#about h2').isVisible() });
await reducedContext.close();
for (const route of ['/work/sayit', '/work/shadowsync']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(`${route}: ${message.text()}`); });
  page.on('pageerror', (error) => report.consoleErrors.push(`${route}: ${error.message}`));
  const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, `case-${route.split('/').at(-1)}.png`), fullPage: true, animations: 'disabled' });
  report.routes.push({ route, status: response?.status(), title: await page.title(), h1: await page.locator('h1').innerText() });
  await context.close();
}
await browser.close();
report.summary = {
  allViewportResponsesOk: report.viewports.every((v) => v.status === 200),
  noHorizontalOverflow: report.viewports.every((v) => !v.horizontalOverflow),
  routesOk: report.routes.every((r) => r.status === 200),
  consoleErrorCount: report.consoleErrors.length,
  axeViolationCount: report.axeViolations.length,
};
await writeFile(path.join(out, 'audit-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
if (!report.summary.allViewportResponsesOk || !report.summary.noHorizontalOverflow || !report.summary.routesOk || report.consoleErrors.length) process.exitCode = 1;
