import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const output = resolve('reviews', 'a-modul-v2', 'hero-smoothing-revision');
await mkdir(output, { recursive: true });

const defects = { consoleErrors: [], pageErrors: [], failedRequests: [], brokenImages: [] };
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
page.on('console', (message) => { if (message.type() === 'error') defects.consoleErrors.push(message.text()); });
page.on('pageerror', (error) => defects.pageErrors.push(error.message));
page.on('requestfailed', (request) => {
  const error = request.failure()?.errorText ?? 'unknown';
  if (request.resourceType() === 'image' && error.includes('ERR_ABORTED')) return;
  defects.failedRequests.push(`${request.url()} — ${error}`);
});

const response = await page.goto(`${base}/modulnye-zdaniya/?qa=hero-smoothing`, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`Route returned ${response?.status() ?? 'no response'}`);
const range = await page.evaluate(() => {
  const hero = document.querySelector('.hero');
  return hero ? Math.max(1, hero.offsetHeight - innerHeight + 88) : 1;
});

const samples = await page.evaluate(async (scrollTarget) => {
  window.scrollTo(0, scrollTarget);
  const values = [];
  for (let index = 0; index < 28; index += 1) {
    await new Promise((resolveFrame) => requestAnimationFrame(resolveFrame));
    const assembly = document.querySelector('.assembly');
    values.push({
      progress: Number(assembly?.getAttribute('data-progress') ?? 0),
      opacities: [...document.querySelectorAll('.assembly__plate')].map((plate) => Number.parseFloat(getComputedStyle(plate).opacity))
    });
  }
  return values;
}, Math.round(range * .42));

const progressDeltas = samples.slice(1).map((sample, index) => Math.abs(sample.progress - samples[index].progress));
const opacityDeltas = samples.slice(1).flatMap((sample, index) => sample.opacities.map((value, plate) => Math.abs(value - samples[index].opacities[plate])));
await page.locator('.hero').screenshot({ path: resolve(output, 'desktop-hero-smoothed-transition.png') });
const pageFacts = await page.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src)
}));
defects.brokenImages.push(...pageFacts.brokenImages);
await context.close();

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/modulnye-zdaniya/?qa=hero-smoothing-reduced`, { waitUntil: 'networkidle' });
const reducedMotion = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  stage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
  progress: Number(document.querySelector('.assembly')?.getAttribute('data-progress'))
}));
await reducedContext.close();
await browser.close();

const results = {
  capturedAt: new Date().toISOString(), range, samples,
  maxProgressDelta: Math.max(...progressDeltas),
  maxOpacityDelta: Math.max(...opacityDeltas),
  progressiveFrames: new Set(samples.map((sample) => sample.progress)).size,
  pageFacts, reducedMotion, defects
};
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ ...results, samples: `[${samples.length} frames]` }, null, 2)}\n`);

const failed = results.progressiveFrames < 10 || results.maxProgressDelta > 9 || results.maxOpacityDelta > .18
  || pageFacts.horizontalOverflow || !reducedMotion.preference || reducedMotion.stage !== 3 || reducedMotion.progress !== 100
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
