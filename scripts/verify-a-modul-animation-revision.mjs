import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const output = resolve('reviews', 'a-modul-v2', 'animation-revision');
await mkdir(output, { recursive: true });

const defects = { consoleErrors: [], pageErrors: [], failedRequests: [], brokenImages: [] };
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference', colorScheme: 'dark' });
const page = await context.newPage();
page.on('console', (message) => { if (message.type() === 'error') defects.consoleErrors.push(message.text()); });
page.on('pageerror', (error) => defects.pageErrors.push(error.message));
page.on('requestfailed', (request) => {
  const error = request.failure()?.errorText ?? 'unknown';
  if (request.resourceType() === 'image' && error.includes('ERR_ABORTED')) return;
  defects.failedRequests.push(`${request.url()} — ${error}`);
});

const response = await page.goto(`${base}/modulnye-zdaniya/?qa=animation-revision`, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`Route returned ${response?.status() ?? 'no response'}`);
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

const heroGeometry = await page.evaluate(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return { start: 0, range: 1 };
  return {
    start: hero.getBoundingClientRect().top + window.scrollY,
    range: Math.max(1, hero.clientHeight - window.innerHeight + 88)
  };
});
const heroRange = heroGeometry.range;

async function heroState(progress) {
  await page.evaluate(({ start, range, value }) => window.scrollTo(0, start + range * value), { start: heroGeometry.start, range: heroRange, value: progress });
  await page.waitForFunction((expected) => {
    const actual = Number(document.querySelector('.assembly')?.getAttribute('data-progress'));
    return Math.abs(actual - expected * 100) <= 2;
  }, progress, { timeout: 1800 });
  return page.evaluate(() => ({
    stage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
    progress: Number(document.querySelector('.assembly')?.getAttribute('data-progress')),
    opacities: [...document.querySelectorAll('.assembly__plate')].map((plate) => Number.parseFloat(getComputedStyle(plate).opacity)),
    transforms: [...document.querySelectorAll('.assembly__plate')].map((plate) => getComputedStyle(plate).transform),
    scrollY: window.scrollY,
    heroTop: document.querySelector('.hero')?.getBoundingClientRect().top ?? null,
    heroHeight: document.querySelector('.hero')?.clientHeight ?? null
  }));
}

const heroStart = await heroState(0);
await page.locator('.hero').screenshot({ path: resolve(output, 'hero-staking.png') });
const hero = {
  start: heroStart,
  transitionOne: await heroState(.28),
  transitionTwo: await heroState(.64),
  finish: await heroState(.96)
};
await page.locator('.hero').screenshot({ path: resolve(output, 'hero-smooth-scroll.png') });

await page.locator('#bim').scrollIntoViewIfNeeded();
const bimInitial = Number(await page.locator('.bim__sequence').getAttribute('data-stage'));
await page.getByRole('button', { name: /Следующий этап:/ }).click();
const bimAfterClick = Number(await page.locator('.bim__sequence').getAttribute('data-stage'));
await page.waitForTimeout(1900);
const bimAfterWait = Number(await page.locator('.bim__sequence').getAttribute('data-stage'));
const bimButton = await page.locator('.bim__play').innerText();
await page.locator('#bim').screenshot({ path: resolve(output, 'bim-manual-step.png') });

await page.locator('#seismic').scrollIntoViewIfNeeded();
await page.waitForTimeout(140);
const seismicAuto = await page.evaluate(() => ({
  active: document.querySelector('#seismic')?.classList.contains('is-active') ?? false,
  signalAnimation: getComputedStyle(document.querySelector('.seismic-proof__signal svg')).animationName,
  copyAnimation: getComputedStyle(document.querySelector('.seismic-proof__copy')).animationName,
  signalDuration: getComputedStyle(document.querySelector('.seismic-proof__signal svg')).animationDuration,
  copyDuration: getComputedStyle(document.querySelector('.seismic-proof__copy')).animationDuration,
  iterationCount: getComputedStyle(document.querySelector('.seismic-proof__copy')).animationIterationCount,
  replayButtons: document.querySelectorAll('.seismic-proof__replay').length
}));
const quakeStart = await page.evaluate(() => [...document.querySelectorAll('#seismic *')].flatMap((element) => element.getAnimations()).map((animation) => Number(animation.currentTime ?? 0)));
await page.waitForTimeout(220);
const quakeAdvance = await page.evaluate(() => [...document.querySelectorAll('#seismic *')].flatMap((element) => element.getAnimations()).map((animation) => Number(animation.currentTime ?? 0)));
await page.locator('#seismic').screenshot({ path: resolve(output, 'seismic-quake.png') });

const pageFacts = await page.evaluate(() => ({
  externalMainSiteLinks: document.querySelectorAll('a[href^="https://a-modul.ru"]').length,
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src)
}));
defects.brokenImages.push(...pageFacts.brokenImages);
await context.close();

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'dark' });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${base}/modulnye-zdaniya/?qa=animation-revision-reduced`, { waitUntil: 'networkidle' });
await reducedPage.locator('#seismic').scrollIntoViewIfNeeded();
const reducedMotion = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  heroStage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
  bimStage: Number(document.querySelector('.bim__sequence')?.getAttribute('data-stage')),
  quakeActive: document.querySelector('#seismic')?.classList.contains('is-active') ?? false,
  replayButtons: document.querySelectorAll('.seismic-proof__replay').length
}));
await reducedPage.screenshot({ path: resolve(output, 'reduced-motion-static.png'), fullPage: false });
await reducedContext.close();
await browser.close();

const results = { capturedAt: new Date().toISOString(), heroRange, hero, bimInitial, bimAfterClick, bimAfterWait, bimButton, seismicAuto, quakeStart, quakeAdvance, pageFacts, reducedMotion, defects };
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

const identityTransforms = new Set(['none', 'matrix(1, 0, 0, 1, 0, 0)', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)']);
const opacityValid = Object.values(hero).every((state) => state.opacities.every((value) => value >= 0 && value <= 1) && state.opacities.filter((value) => value > .001).length <= 2 && state.transforms.every((value) => identityTransforms.has(value)))
  && hero.start.opacities[0] === 1 && hero.finish.opacities[3] === 1;
const quakeAdvances = quakeStart.length > 0 && quakeAdvance.some((value, index) => value > (quakeStart[index] ?? 0));
const failed = !opacityValid
  || hero.start.stage !== 0 || hero.finish.stage !== 3
  || bimInitial !== 0 || bimAfterClick !== 1 || bimAfterWait !== 1 || !bimButton.includes('Следующий этап')
  || !seismicAuto.active || seismicAuto.signalAnimation !== 'quake-shock' || seismicAuto.copyAnimation !== 'quake-copy' || seismicAuto.signalDuration !== '4.8s' || seismicAuto.copyDuration !== '4.8s' || seismicAuto.iterationCount !== 'infinite' || seismicAuto.replayButtons !== 0 || !quakeAdvances
  || pageFacts.externalMainSiteLinks !== 0 || pageFacts.horizontalOverflow
  || !reducedMotion.preference || reducedMotion.heroStage !== 3 || reducedMotion.bimStage !== 6 || reducedMotion.quakeActive || reducedMotion.replayButtons !== 0
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
