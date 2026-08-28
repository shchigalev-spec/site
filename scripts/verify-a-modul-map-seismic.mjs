import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const output = resolve('reviews', 'a-modul-v2', 'map-seismic-revision');
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

const response = await page.goto(`${base}/modulnye-zdaniya/?qa=map-seismic`, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`Route returned ${response?.status() ?? 'no response'}`);
await page.locator('#logistics').scrollIntoViewIfNeeded();

const mapHeights = [];
const regionButtons = page.locator('.logistics__destinations button');
for (let index = 0; index < await regionButtons.count(); index += 1) {
  await regionButtons.nth(index).click();
  await page.waitForTimeout(80);
  mapHeights.push(await page.locator('.logistics__workspace').evaluate((element) => Math.round(element.getBoundingClientRect().height)));
}
await page.locator('#logistics').screenshot({ path: resolve(output, 'desktop-map-stable.png') });

const mapFacts = await page.evaluate(() => ({
  visibleLicenseLabels: [...document.querySelectorAll('#logistics *')].filter((element) => getComputedStyle(element).display !== 'none' && /CC BY-SA|CCBI-CI/i.test(element.textContent ?? '')).length,
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
}));

await page.locator('#seismic').scrollIntoViewIfNeeded();
await page.waitForTimeout(240);
const seismicFacts = await page.evaluate(() => {
  const section = document.querySelector('#seismic');
  const signal = document.querySelector('.seismic-proof__signal svg');
  const copy = document.querySelector('.seismic-proof__copy');
  const keyframes = signal?.getAnimations()[0]?.effect?.getKeyframes?.() ?? [];
  return {
    active: section?.classList.contains('is-active') ?? false,
    signalAnimation: signal ? getComputedStyle(signal).animationName : '',
    copyAnimation: copy ? getComputedStyle(copy).animationName : '',
    iterationCount: copy ? getComputedStyle(copy).animationIterationCount : '',
    replayButtons: document.querySelectorAll('.seismic-proof__replay').length,
    hasTripleAmplitude: keyframes.some((frame) => String(frame.transform).includes('-27px'))
  };
});
await page.locator('#seismic').screenshot({ path: resolve(output, 'desktop-seismic-loop.png') });

await page.locator('#logistics').scrollIntoViewIfNeeded();
await page.waitForTimeout(120);
const inactiveAfterExit = !(await page.locator('#seismic').evaluate((element) => element.classList.contains('is-active')));
await page.locator('#seismic').scrollIntoViewIfNeeded();
await page.waitForTimeout(120);
const activeAfterReentry = await page.locator('#seismic').evaluate((element) => element.classList.contains('is-active'));

const brokenImages = await page.evaluate(() => [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src));
defects.brokenImages.push(...brokenImages);
await context.close();

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/modulnye-zdaniya/?qa=map-seismic-reduced`, { waitUntil: 'networkidle' });
await reducedPage.locator('#seismic').scrollIntoViewIfNeeded();
await reducedPage.waitForTimeout(120);
const reducedMotion = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  active: document.querySelector('#seismic')?.classList.contains('is-active') ?? false,
  animations: [...document.querySelectorAll('#seismic *')].flatMap((element) => element.getAnimations()).length
}));
await reducedContext.close();
await browser.close();

const results = { capturedAt: new Date().toISOString(), mapHeights, mapFacts, seismicFacts, inactiveAfterExit, activeAfterReentry, reducedMotion, defects };
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

const failed = new Set(mapHeights).size !== 1 || mapFacts.visibleLicenseLabels !== 0 || mapFacts.horizontalOverflow
  || !seismicFacts.active || seismicFacts.signalAnimation !== 'quake-shock' || seismicFacts.copyAnimation !== 'quake-copy'
  || seismicFacts.iterationCount !== 'infinite' || seismicFacts.replayButtons !== 0 || !seismicFacts.hasTripleAmplitude
  || !inactiveAfterExit || !activeAfterReentry || !reducedMotion.preference || reducedMotion.active || reducedMotion.animations !== 0
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
