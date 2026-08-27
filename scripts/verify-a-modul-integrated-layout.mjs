import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const output = resolve('reviews', 'a-modul-v2', 'integrated-layout-revision');
await mkdir(output, { recursive: true });

const defects = { consoleErrors: [], pageErrors: [], failedRequests: [], brokenImages: [] };
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
page.on('console', (message) => { if (message.type() === 'error') defects.consoleErrors.push(message.text()); });
page.on('pageerror', (error) => defects.pageErrors.push(error.message));
page.on('requestfailed', (request) => defects.failedRequests.push(`${request.url()} — ${request.failure()?.errorText ?? 'unknown'}`));

const response = await page.goto(`${base}/modulnye-zdaniya/?qa=integrated-layout`, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`Route returned ${response?.status() ?? 'no response'}`);
await page.locator('.hero').screenshot({ path: resolve(output, 'desktop-hero-integrated-stakeout.png') });

await page.locator('#bim').scrollIntoViewIfNeeded();
for (const [index, name] of ['genplan', 'functional-layout', 'module-grid'].entries()) {
  await page.locator('.bim__stages button').nth(index).click();
  await page.waitForTimeout(420);
  await page.locator('.bim__sequence').screenshot({ path: resolve(output, `desktop-bim-${name}.png`) });
}

const desktopFacts = await page.evaluate(() => ({
  removedOverlayCount: document.querySelectorAll('.assembly__technical, .bim__overlay, .bim__transport').length,
  heroSource: document.querySelector('.assembly__plate img')?.getAttribute('src') ?? '',
  bimSources: [...document.querySelectorAll('.bim__plate img')].slice(0, 3).map((image) => image.getAttribute('src') ?? ''),
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src)
}));
defects.brokenImages.push(...desktopFacts.brokenImages);
await context.close();

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${base}/modulnye-zdaniya/?qa=integrated-layout-mobile`, { waitUntil: 'networkidle' });
await mobilePage.locator('.hero').screenshot({ path: resolve(output, 'mobile-hero-integrated-stakeout.png') });
const mobileFacts = await mobilePage.evaluate(() => ({
  heroStage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src)
}));
defects.brokenImages.push(...mobileFacts.brokenImages);
await mobileContext.close();

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/modulnye-zdaniya/?qa=integrated-layout-reduced`, { waitUntil: 'networkidle' });
const reducedFacts = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  heroStage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
  bimStage: Number(document.querySelector('.bim__sequence')?.getAttribute('data-stage'))
}));
await reducedPage.screenshot({ path: resolve(output, 'reduced-motion-static.png'), fullPage: false });
await reducedContext.close();
await browser.close();

const results = { capturedAt: new Date().toISOString(), desktopFacts, mobileFacts, reducedFacts, defects };
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

const failed = desktopFacts.removedOverlayCount !== 0
  || !desktopFacts.heroSource.includes('a-modul-general-hero-v3-stakeout')
  || !desktopFacts.bimSources.every((source) => source.includes('a-modul-bim-integrated-'))
  || desktopFacts.horizontalOverflow || mobileFacts.horizontalOverflow || mobileFacts.heroStage !== 0
  || !reducedFacts.preference || reducedFacts.heroStage !== 3 || reducedFacts.bimStage !== 6
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
