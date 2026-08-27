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

const heroRange = await page.evaluate(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return 0;
  return Math.max(1, hero.getBoundingClientRect().top + window.scrollY + hero.clientHeight - window.innerHeight + 88);
});

async function heroState(progress) {
  await page.evaluate(({ range, value }) => window.scrollTo(0, range * value), { range: heroRange, value: progress });
  await page.waitForTimeout(240);
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
  copyAnimation: getComputedStyle(document.querySelector('.seismic-proof__copy')).animationName
}));
await page.waitForTimeout(1100);
await page.getByRole('button', { name: 'Повторить толчок' }).click();
await page.waitForTimeout(120);
const replayStart = await page.evaluate(() => [...document.querySelectorAll('#seismic *')].flatMap((element) => element.getAnimations()).map((animation) => Number(animation.currentTime ?? 0)));
await page.waitForTimeout(220);
const replayAdvance = await page.evaluate(() => [...document.querySelectorAll('#seismic *')].flatMap((element) => element.getAnimations()).map((animation) => Number(animation.currentTime ?? 0)));
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
  replayDisabled: document.querySelector('.seismic-proof__replay')?.hasAttribute('disabled') ?? false
}));
await reducedPage.screenshot({ path: resolve(output, 'reduced-motion-static.png'), fullPage: false });
await reducedContext.close();
await browser.close();

const results = { capturedAt: new Date().toISOString(), heroRange, hero, bimInitial, bimAfterClick, bimAfterWait, bimButton, seismicAuto, replayStart, replayAdvance, pageFacts, reducedMotion, defects };
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

const opacityValid = Object.values(hero).every((state) => state.opacities.every((value) => value >= 0 && value <= 1) && state.opacities.filter((value) => value > .001).length <= 2 && state.transforms.every((value) => value === 'none'))
  && hero.start.opacities[0] === 1 && hero.finish.opacities[3] === 1;
const replayAdvances = replayStart.length > 0 && replayAdvance.some((value, index) => value > (replayStart[index] ?? 0));
const failed = !opacityValid
  || hero.start.stage !== 0 || hero.finish.stage !== 3
  || bimInitial !== 0 || bimAfterClick !== 1 || bimAfterWait !== 1 || !bimButton.includes('Следующий этап')
  || !seismicAuto.active || seismicAuto.signalAnimation !== 'quake-shock' || seismicAuto.copyAnimation !== 'quake-copy' || !replayAdvances
  || pageFacts.externalMainSiteLinks !== 0 || pageFacts.horizontalOverflow
  || !reducedMotion.preference || reducedMotion.heroStage !== 3 || reducedMotion.bimStage !== 6 || reducedMotion.quakeActive || !reducedMotion.replayDisabled
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
