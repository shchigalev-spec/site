import { chromium, request } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const route = `${base}/modulnye-zdaniya/`;
const output = resolve('reviews', 'a-modul-v2', 'revision-r1');
await mkdir(output, { recursive: true });

const defects = { consoleErrors: [], pageErrors: [], failedRequests: [], brokenImages: [] };
const routeStatuses = {};
const routeList = [
  '/modulnye-zdaniya/', '/vahtovye-poselki/', '/modulnye-ofisy-abk/',
  '/modulnye-obshchezhitiya/', '/privacy-policy/', '/robots.txt', '/sitemap.xml'
];
const api = await request.newContext();
for (const path of routeList) {
  const response = await api.get(`${base}${path}`);
  routeStatuses[path] = response.status();
}
await api.dispose();

const browser = await chromium.launch({ headless: true });

function observe(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') defects.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => defects.pageErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (failed) => defects.failedRequests.push(`${label}: ${failed.url()} — ${failed.failure()?.errorText ?? 'unknown'}`));
}

async function pageMetrics(page, label) {
  const metrics = await page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const h1 = document.querySelector('h1');
    const copyRect = document.querySelector('.hero__copy')?.getBoundingClientRect();
    const captionRect = document.querySelector('.assembly__caption')?.getBoundingClientRect();
    const overlap = copyRect && captionRect
      ? Math.max(0, Math.min(copyRect.right, captionRect.right) - Math.max(copyRect.left, captionRect.left))
        * Math.max(0, Math.min(copyRect.bottom, captionRect.bottom) - Math.max(copyRect.top, captionRect.top))
      : 0;
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      h1Visible: visible(document.querySelector('h1')),
      primaryCtaVisible: visible(document.querySelector('.hero__actions .button--primary')),
      h1Count: document.querySelectorAll('h1').length,
      h1Lines: h1 ? Math.round(h1.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(h1).lineHeight)) : 0,
      heroCopyCaptionOverlap: Math.round(overlap),
      images: Array.from(document.images).map((image) => ({ src: image.currentSrc || image.src, complete: image.complete, naturalWidth: image.naturalWidth }))
    };
  });
  // Lazy images below the fold may still be incomplete here; an image is broken only
  // when the browser completed its request but decoded no intrinsic width.
  defects.brokenImages.push(...metrics.images.filter((image) => image.complete && image.naturalWidth < 1).map((image) => `${label}: ${image.src}`));
  return metrics;
}

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference', colorScheme: 'dark' });
const desktop = await desktopContext.newPage();
observe(desktop, 'desktop-1440');
const response = await desktop.goto(route, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`General route returned ${response?.status() ?? 'no response'}`);
await desktop.screenshot({ path: resolve(output, 'hero-after-1440.png') });
await desktop.screenshot({ path: resolve(output, 'hero-animation-start.png') });
const desktopMetrics = await pageMetrics(desktop, 'desktop-1440');

const motionTrace = [];
for (const [name, progress] of [['start', 0], ['foundations', .32], ['assembly', .62], ['end', .96]]) {
  const trace = await desktop.evaluate(({ progress }) => {
    const hero = document.querySelector('.hero');
    const top = window.scrollY + hero.getBoundingClientRect().top;
    const available = Math.max(1, hero.offsetHeight - window.innerHeight + 88);
    window.scrollTo({ top: top + available * progress, behavior: 'instant' });
    return { requestedProgress: progress, targetScrollY: top + available * progress };
  }, { progress });
  await desktop.waitForTimeout(500);
  const state = await desktop.evaluate(() => ({
    scrollY: window.scrollY,
    stage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
    progress: Number(document.querySelector('.assembly')?.getAttribute('data-progress')),
    visiblePlate: document.querySelector('.assembly__plate.visible')?.className ?? ''
  }));
  motionTrace.push({ name, ...trace, ...state });
  if (name === 'foundations') await desktop.screenshot({ path: resolve(output, 'hero-animation-mid.png') });
  if (name === 'end') await desktop.screenshot({ path: resolve(output, 'hero-animation-end.png') });
}

await desktop.locator('#project-brief').scrollIntoViewIfNeeded();
await desktop.locator('#project-brief').getByRole('button', { name: '3–6 месяцев', exact: true }).click();
await desktop.waitForTimeout(150);
const rangeSerialization = await desktop.evaluate(() => ({
  miniBrief: document.querySelector('#project-brief input[name="commissioning"]')?.value ?? null,
  fullForm: document.querySelector('#full-brief input[name="desiredCommissioningDate"]')?.value ?? null
}));
await desktop.reload({ waitUntil: 'networkidle' });
await desktop.waitForTimeout(1000);
const rangeAfterReload = await desktop.evaluate(() => ({
  miniBrief: document.querySelector('#project-brief input[name="commissioning"]')?.value ?? null,
  fullForm: document.querySelector('#full-brief input[name="desiredCommissioningDate"]')?.value ?? null,
  formDataMiniBrief: new FormData(document.querySelector('#project-brief form')).get('commissioning'),
  formDataFullForm: new FormData(document.querySelector('#full-brief form')).get('desiredCommissioningDate')
}));
await desktop.locator('#project-brief').scrollIntoViewIfNeeded();
await desktop.getByRole('button', { name: 'Есть точная дата', exact: true }).first().click();
await desktop.waitForTimeout(150);
const exactYear = String(new Date().getUTCFullYear() + 1);
await desktop.locator('#project-brief .commissioning__exact select').nth(0).selectOption('12');
await desktop.locator('#project-brief .commissioning__exact select').nth(1).selectOption(exactYear);
await desktop.waitForTimeout(150);
await desktop.locator('.field--commissioning').first().screenshot({ path: resolve(output, 'commissioning-date.png') });
const commissioning = await desktop.evaluate(({ exactYear }) => ({
  nativeMonthInputs: document.querySelectorAll('input[type="month"]').length,
  optionButtons: document.querySelectorAll('#project-brief .commissioning__options button').length,
  exactSelects: document.querySelectorAll('#project-brief .commissioning__exact select').length,
  miniBriefValue: document.querySelector('#project-brief input[name="commissioning"]')?.value ?? null,
  fullFormValue: document.querySelector('#full-brief input[name="desiredCommissioningDate"]')?.value ?? null,
  exactYear
}), { exactYear });
await desktop.reload({ waitUntil: 'networkidle' });
await desktop.waitForTimeout(1000);
const exactAfterReload = await desktop.evaluate(() => ({
  miniBrief: document.querySelector('#project-brief input[name="commissioning"]')?.value ?? null,
  fullForm: document.querySelector('#full-brief input[name="desiredCommissioningDate"]')?.value ?? null,
  formDataMiniBrief: new FormData(document.querySelector('#project-brief form')).get('commissioning'),
  formDataFullForm: new FormData(document.querySelector('#full-brief form')).get('desiredCommissioningDate')
}));

await desktop.locator('#evidence').scrollIntoViewIfNeeded();
await desktop.locator('#evidence').screenshot({ path: resolve(output, 'proof-scale.png') });
const proof = await desktop.evaluate(() => {
  const section = document.querySelector('#evidence');
  return { height: section?.getBoundingClientRect().height ?? 0, facts: section?.querySelectorAll('article').length ?? 0 };
});
await desktopContext.close();

const desktop1920Context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'no-preference', colorScheme: 'dark' });
const desktop1920 = await desktop1920Context.newPage();
observe(desktop1920, 'desktop-1920');
await desktop1920.goto(route, { waitUntil: 'networkidle' });
await desktop1920.screenshot({ path: resolve(output, 'hero-after-1920.png') });
const desktop1920Metrics = await pageMetrics(desktop1920, 'desktop-1920');
await desktop1920Context.close();

const responsive = {};
for (const config of [
  { width: 320, height: 720, name: 'mobile-320' },
  { width: 390, height: 844, name: 'mobile-390' },
  { width: 768, height: 900, name: 'intermediate-768' }
]) {
  const context = await browser.newContext({ viewport: { width: config.width, height: config.height }, reducedMotion: 'no-preference', colorScheme: 'dark', hasTouch: config.width < 820 });
  const page = await context.newPage();
  observe(page, config.name);
  await page.goto(route, { waitUntil: 'networkidle' });
  responsive[config.name] = await pageMetrics(page, config.name);
  if (config.width === 390) {
    await page.screenshot({ path: resolve(output, 'hero-after-mobile-390.png') });
    responsive[config.name].mobileStageButtons = await page.locator('.assembly__stages button').count();
    await page.getByRole('button', { name: 'Следующая стадия' }).click();
    await page.waitForTimeout(150);
    responsive[config.name].stageAfterNext = Number(await page.locator('.assembly').getAttribute('data-stage'));
  }
  if (config.width === 768) await page.screenshot({ path: resolve(output, 'intermediate-768.png') });
  await context.close();
}

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'dark' });
const reduced = await reducedContext.newPage();
observe(reduced, 'reduced-motion');
await reduced.goto(route, { waitUntil: 'networkidle' });
await reduced.screenshot({ path: resolve(output, 'reduced-motion-hero.png') });
const reducedMotion = await reduced.evaluate(() => ({
  stage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
  heroHeight: document.querySelector('.hero')?.getBoundingClientRect().height ?? 0,
  heroPosition: getComputedStyle(document.querySelector('.hero')).position,
  assemblyPosition: getComputedStyle(document.querySelector('.assembly')).position,
  scrollNote: document.querySelector('.assembly__scroll-note')?.textContent?.trim() ?? ''
}));
await reducedContext.close();
await browser.close();

await sharp(resolve(output, 'hero-animation-start.png'))
  .composite([{ input: resolve(output, 'hero-animation-end.png'), blend: 'difference' }])
  .png()
  .toFile(resolve(output, 'diff-hero-start-end.png'));

const results = {
  capturedAt: new Date().toISOString(), base, routeStatuses, desktop: desktopMetrics, desktop1920: desktop1920Metrics,
  responsive, rangeSerialization, rangeAfterReload, commissioning, exactAfterReload, proof, motionTrace, reducedMotion, defects
};
await writeFile(resolve(output, 'motion-trace.json'), `${JSON.stringify(motionTrace, null, 2)}\n`, 'utf8');
await writeFile(resolve(output, 'r1-qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

const widthChecks = [desktopMetrics, desktop1920Metrics, ...Object.values(responsive)];
const failed = Object.values(routeStatuses).some((status) => status !== 200)
  || widthChecks.some((item) => item.scrollWidth > item.clientWidth || !item.h1Visible || !item.primaryCtaVisible || item.h1Count !== 1)
  || commissioning.nativeMonthInputs !== 0 || commissioning.optionButtons !== 5 || commissioning.exactSelects !== 2
  || rangeSerialization.miniBrief !== '3–6 месяцев' || rangeSerialization.fullForm !== '3–6 месяцев'
  || Object.values(rangeAfterReload).some((value) => value !== '3–6 месяцев')
  || commissioning.miniBriefValue !== `${commissioning.exactYear}-12` || commissioning.fullFormValue !== `${commissioning.exactYear}-12`
  || Object.values(exactAfterReload).some((value) => value !== `${commissioning.exactYear}-12`)
  || desktopMetrics.h1Lines < 3 || desktopMetrics.h1Lines > 4
  || desktop1920Metrics.h1Lines < 2 || desktop1920Metrics.h1Lines > 3
  || responsive['mobile-390'].h1Lines < 4 || responsive['mobile-390'].h1Lines > 5
  || responsive['intermediate-768'].heroCopyCaptionOverlap > 0
  || proof.facts !== 6 || proof.height > 820
  || motionTrace.map((item) => item.stage).join(',') !== '0,1,2,3'
  || responsive['mobile-390'].mobileStageButtons !== 3 || responsive['mobile-390'].stageAfterNext !== 2
  || reducedMotion.stage !== 3 || reducedMotion.heroHeight > 1050 || reducedMotion.assemblyPosition === 'sticky'
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
