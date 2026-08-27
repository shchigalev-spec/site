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
      stage: Number(assembly?.getAttribute('data-stage') ?? 0),
      progress: Number(assembly?.getAttribute('data-progress') ?? 0),
      opacities: [...document.querySelectorAll('.assembly__plate')].map((plate) => Number.parseFloat(getComputedStyle(plate).opacity)),
      veilOpacity: Number.parseFloat(getComputedStyle(document.querySelector('.assembly__transition-veil')).opacity)
    });
  }
  return values;
}, Math.round(range * .42));

const progressDeltas = samples.slice(1).map((sample, index) => Math.abs(sample.progress - samples[index].progress));
const veilDeltas = samples.slice(1).map((sample, index) => Math.abs(sample.veilOpacity - samples[index].veilOpacity));
const visiblePlateCounts = samples.map((sample) => sample.opacities.filter((opacity) => opacity > .99).length);
const swapFrames = samples.slice(1).flatMap((sample, index) => sample.stage === samples[index].stage ? [] : [sample]);
await page.locator('.hero').screenshot({ path: resolve(output, 'desktop-hero-smoothed-transition.png') });
await page.evaluate((heroRange) => {
  const hero = document.querySelector('.hero');
  const start = (hero?.getBoundingClientRect().top ?? 0) + window.scrollY;
  window.scrollTo(0, start + heroRange * .18);
}, range);
await page.waitForFunction(() => {
  const progress = Number(document.querySelector('.assembly')?.getAttribute('data-progress'));
  return progress >= 17 && progress <= 19;
}, undefined, { timeout: 1800 });
await page.locator('.hero').screenshot({ path: resolve(output, 'desktop-hero-veiled-swap.png') });
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
  progress: Number(document.querySelector('.assembly')?.getAttribute('data-progress')),
  visiblePlates: [...document.querySelectorAll('.assembly__plate')].filter((plate) => Number.parseFloat(getComputedStyle(plate).opacity) > .99).length,
  veilOpacity: Number.parseFloat(getComputedStyle(document.querySelector('.assembly__transition-veil')).opacity)
}));
await reducedContext.close();
await browser.close();

const results = {
  capturedAt: new Date().toISOString(), range, samples,
  maxProgressDelta: Math.max(...progressDeltas),
  maxVeilDelta: Math.max(...veilDeltas),
  maxVisiblePlates: Math.max(...visiblePlateCounts),
  minVeilAtSwap: swapFrames.length ? Math.min(...swapFrames.map((sample) => sample.veilOpacity)) : 0,
  stageSwaps: swapFrames.length,
  progressiveFrames: new Set(samples.map((sample) => sample.progress)).size,
  pageFacts, reducedMotion, defects
};
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ ...results, samples: `[${samples.length} frames]` }, null, 2)}\n`);

const failed = results.progressiveFrames < 10 || results.maxProgressDelta > 9 || results.maxVeilDelta > .22
  || results.maxVisiblePlates !== 1 || results.stageSwaps < 1 || results.minVeilAtSwap < .65
  || pageFacts.horizontalOverflow || !reducedMotion.preference || reducedMotion.stage !== 3 || reducedMotion.progress !== 100 || reducedMotion.visiblePlates !== 1 || reducedMotion.veilOpacity !== 0
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
