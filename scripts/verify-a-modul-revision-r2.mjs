import { chromium, request } from '@playwright/test';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const route = `${base}/modulnye-zdaniya/?qa=revision-r2`;
const output = resolve('reviews', 'a-modul-v2', 'revision-r2');
await mkdir(output, { recursive: true });

const defects = { consoleErrors: [], consoleWarnings: [], pageErrors: [], failedRequests: [], brokenImages: [] };
const routeStatuses = {};
const routeList = [
  '/modulnye-zdaniya/', '/vahtovye-poselki/', '/modulnye-ofisy-abk/',
  '/modulnye-obshchezhitiya/', '/privacy-policy/', '/robots.txt', '/sitemap.xml'
];
const api = await request.newContext();
for (const path of routeList) routeStatuses[path] = (await api.get(`${base}${path}`)).status();
await api.dispose();

const browser = await chromium.launch({ headless: true });

function observe(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') defects.consoleErrors.push(`${label}: ${message.text()}`);
    if (message.type() === 'warning') defects.consoleWarnings.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => defects.pageErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (failed) => {
    const error = failed.failure()?.errorText ?? 'unknown';
    if (failed.resourceType() === 'image' && error.includes('ERR_ABORTED')) return;
    defects.failedRequests.push(`${label}: ${failed.url()} — ${error}`);
  });
}

async function metrics(page, label) {
  const result = await page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      h1Count: document.querySelectorAll('h1').length,
      h1Visible: visible(document.querySelector('h1')),
      primaryCtaVisible: visible(document.querySelector('.hero__actions .button--primary')),
      finalCtaVisible: visible(document.querySelector('.final-cta .button--primary')),
      mapAsset: document.querySelector('.map__base')?.getAttribute('href') ?? '',
      mapTitle: document.querySelector('#map-title')?.textContent?.trim() ?? '',
      finderCasesLabel: document.querySelector('#finder .eyebrow')?.textContent?.trim() ?? '',
      factoryTabs: document.querySelectorAll('#factory [role="tab"]').length,
      lowerTabs: document.querySelectorAll('.lower-object [role="tab"]').length,
      disclosures: document.querySelectorAll('.visualization-label').length,
      images: [...document.images].map((image) => ({ src: image.currentSrc || image.src, complete: image.complete, naturalWidth: image.naturalWidth }))
    };
  });
  defects.brokenImages.push(...result.images.filter((image) => image.complete && image.naturalWidth < 1).map((image) => `${label}: ${image.src}`));
  return result;
}

const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference', colorScheme: 'dark' });
const desktop = await desktopContext.newPage();
observe(desktop, 'desktop-1440');
const response = await desktop.goto(route, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`General route returned ${response?.status() ?? 'no response'}`);
await desktop.screenshot({ path: resolve(output, 'desktop-hero.png') });

await desktop.locator('#logistics').scrollIntoViewIfNeeded();
await desktop.locator('.logistics__workspace').screenshot({ path: resolve(output, 'map-default.png') });
const mapDefault = await desktop.evaluate(() => ({ destinationPoints: document.querySelectorAll('.map__destination').length, countryMap: document.querySelector('.map__base')?.getAttribute('href') }));
await desktop.getByRole('button', { name: 'Россия', exact: true }).click();
await desktop.waitForTimeout(120);
const mapRussia = await desktop.evaluate(() => ({
  destinationPoints: document.querySelectorAll('.map__destination').length,
  selected: document.querySelector('.logistics__destinations button.active')?.textContent?.trim(),
  result: document.querySelector('.logistics__result h3')?.textContent?.trim(),
  modes: [...document.querySelectorAll('.logistics__mode-buttons button')].map((button) => button.textContent?.trim())
}));
await desktop.getByRole('button', { name: 'Дальний Восток', exact: true }).click();
await desktop.waitForTimeout(520);
await desktop.locator('.logistics__workspace').screenshot({ path: resolve(output, 'map-selected-region.png') });
const mapSelected = await desktop.evaluate(() => ({
  destinationPoints: document.querySelectorAll('.map__destination').length,
  selected: document.querySelector('.logistics__destinations button.active')?.textContent?.trim(),
  result: document.querySelector('.logistics__result h3')?.textContent?.trim(),
  modes: [...document.querySelectorAll('.logistics__mode-buttons button')].map((button) => button.textContent?.trim()),
  caseTitle: document.querySelector('.logistics__case strong')?.textContent?.trim(),
  source: document.querySelector('.logistics__mode-source a')?.getAttribute('href')
}));

await desktop.locator('#project-brief select[name="region"]').selectOption('moskva');
await desktop.waitForTimeout(120);
const logisticsExternalRegion = await desktop.evaluate(() => ({
  selected: document.querySelector('.logistics__destinations button.active')?.textContent?.trim(),
  modes: [...document.querySelectorAll('.logistics__mode-buttons button')].map((button) => button.textContent?.trim()),
  activeMode: document.querySelector('.logistics__mode-buttons button.active')?.textContent?.trim(),
  sourceMode: document.querySelector('.logistics__mode-source strong')?.textContent?.trim()
}));

await desktop.locator('#finder').scrollIntoViewIfNeeded();
const finderSelects = desktop.locator('#finder select');
await finderSelects.nth(0).selectOption('far-east');
await finderSelects.nth(1).selectOption('mining');
await finderSelects.nth(2).selectOption('shift');
await finderSelects.nth(4).selectOption('seismic');
await finderSelects.nth(5).selectOption('remote');
await desktop.waitForTimeout(180);
await desktop.locator('.finder__result').screenshot({ path: resolve(output, 'similar-project-finder.png') });
const finder = await desktop.evaluate(() => ({
  title: document.querySelector('.finder__case-copy h3')?.textContent?.trim(),
  comparisonPanels: document.querySelectorAll('.finder__comparison > div').length,
  source: document.querySelector('.finder__source')?.getAttribute('href'),
  disclosure: document.querySelector('.finder__visual .visualization-label')?.textContent?.trim(),
  carriedHref: document.querySelector('.finder__case-copy .button')?.getAttribute('href')
}));
await desktop.locator('.finder__case-copy .button').click();
await desktop.waitForTimeout(120);
const finderCarry = await desktop.evaluate(() => ({
  capacity: document.querySelector('#project-brief input[name="people"]')?.value ?? '',
  summary: document.querySelector('.brief__carry')?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}));

await finderSelects.nth(0).selectOption('all');
await finderSelects.nth(1).selectOption('mining');
await finderSelects.nth(2).selectOption('dorm');
await finderSelects.nth(3).selectOption('300');
await finderSelects.nth(4).selectOption('cold');
await finderSelects.nth(5).selectOption('standard');
await desktop.waitForTimeout(120);
const finderUnknownData = await desktop.evaluate(() => ({
  score: document.querySelector('.finder__case-copy .mono-label')?.textContent?.trim(),
  matches: document.querySelector('.finder__comparison > div:first-child p')?.textContent?.trim(),
  differences: document.querySelector('.finder__comparison > div:last-child p')?.textContent?.trim(),
  unknownOptions: document.querySelectorAll('#finder option[value="not-published"]').length
}));

await desktop.locator('#factory').scrollIntoViewIfNeeded();
await desktop.getByRole('tab', { name: /03 Инженерия/ }).click();
await desktop.waitForTimeout(180);
await desktop.locator('#factory').screenshot({ path: resolve(output, 'production.png') });
const factory = await desktop.evaluate(() => ({ active: document.querySelector('#factory [role="tab"][aria-selected="true"]')?.textContent?.trim(), facts: [...document.querySelectorAll('.factory__facts strong')].map((item) => item.textContent?.trim()) }));

await desktop.locator('.lower-object').scrollIntoViewIfNeeded();
await desktop.locator('.lower-object__visual').screenshot({ path: resolve(output, 'lower-state-01.png') });
await desktop.getByRole('tab', { name: /05 Эксплуатация/ }).click();
await desktop.waitForTimeout(180);
await desktop.locator('.lower-object').screenshot({ path: resolve(output, 'lower-object.png') });
await desktop.locator('.lower-object__visual').screenshot({ path: resolve(output, 'lower-state-05.png') });
const lower = await desktop.evaluate(() => ({ active: document.querySelector('.lower-object [role="tab"][aria-selected="true"]')?.textContent?.trim(), tabs: document.querySelectorAll('.lower-object [role="tab"]').length }));

await desktop.locator('#case').scrollIntoViewIfNeeded();
await desktop.locator('#case').screenshot({ path: resolve(output, 'dominant-case.png') });
await desktop.locator('.final-cta').scrollIntoViewIfNeeded();
await desktop.locator('.final-cta').screenshot({ path: resolve(output, 'final-cta.png') });

await desktop.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await desktop.waitForTimeout(450);
const desktopMetrics = await metrics(desktop, 'desktop-1440');
const performance = await desktop.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource');
  return {
    navigation: nav ? { domContentLoaded: nav.domContentLoadedEventEnd, loadEvent: nav.loadEventEnd, responseEnd: nav.responseEnd, transferSize: nav.transferSize } : null,
    resources: resources.length,
    transferredBytes: resources.reduce((sum, item) => sum + (item.transferSize || 0), 0),
    decodedBodyBytes: resources.reduce((sum, item) => sum + (item.decodedBodySize || 0), 0),
    images: resources.filter((item) => item.initiatorType === 'img').length
  };
});
await writeFile(resolve(output, 'performance.json'), `${JSON.stringify(performance, null, 2)}\n`, 'utf8');
await desktopContext.close();

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
  responsive[config.name] = await metrics(page, config.name);
  if (config.width === 390) {
    await page.screenshot({ path: resolve(output, 'mobile-390.png') });
    await page.locator('#logistics').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Дальний Восток', exact: true }).click();
    await page.locator('.logistics__workspace').screenshot({ path: resolve(output, 'mobile-map-390.png') });
  }
  if (config.width <= 390) {
    await page.locator('#logistics').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Дальний Восток', exact: true }).click();
    responsive[config.name].mapVisibility = await page.evaluate(() => {
      const container = document.querySelector('.logistics__map')?.getBoundingClientRect();
      const svg = document.querySelector('.logistics__map svg')?.getBoundingClientRect();
      const destination = document.querySelector('.map__destination circle')?.getBoundingClientRect();
      if (!container || !svg || !destination) return { fullSvg: false, destinationVisible: false };
      return {
        fullSvg: svg.left >= container.left - 1 && svg.right <= container.right + 1,
        destinationVisible: destination.left >= container.left && destination.right <= container.right
      };
    });
  }
  if (config.width === 768) await page.screenshot({ path: resolve(output, 'intermediate-768.png') });
  await context.close();
}

const specializedHeroes = {};
for (const item of [
  { key: 'shift', path: '/vahtovye-poselki/', asset: 'a-modul-shift-hero-v2' },
  { key: 'office', path: '/modulnye-ofisy-abk/', asset: 'a-modul-office-hero-v2' },
  { key: 'dormitory', path: '/modulnye-obshchezhitiya/', asset: 'a-modul-dormitory-hero-v2' }
]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference', colorScheme: 'dark' });
  const page = await context.newPage();
  observe(page, `specialized-${item.key}`);
  await page.goto(`${base}${item.path}?qa=revision-r2`, { waitUntil: 'networkidle' });
  const heroImage = page.locator('.route-hero__visual img');
  await heroImage.waitFor({ state: 'visible' });
  specializedHeroes[item.key] = {
    expectedAsset: item.asset,
    currentSrc: await heroImage.evaluate((image) => image.currentSrc),
    naturalWidth: await heroImage.evaluate((image) => image.naturalWidth)
  };
  await page.locator('.route-hero').screenshot({ path: resolve(output, `specialized-${item.key}-hero.png`) });
  await context.close();
}

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', colorScheme: 'dark' });
const reducedPage = await reducedContext.newPage();
observe(reducedPage, 'reduced-motion');
await reducedPage.goto(route, { waitUntil: 'networkidle' });
await reducedPage.screenshot({ path: resolve(output, 'reduced-motion.png') });
const reducedMotion = await reducedPage.evaluate(() => ({
  heroStage: Number(document.querySelector('.assembly')?.getAttribute('data-stage')),
  heroPosition: getComputedStyle(document.querySelector('.hero')).position,
  assemblyPosition: getComputedStyle(document.querySelector('.assembly')).position,
  routeAnimationDuration: getComputedStyle(document.querySelector('.map__route') ?? document.body).animationDuration,
  lowerAnimation: getComputedStyle(document.querySelector('.lower-object__visual picture')).animationName,
  motionPreference: matchMedia('(prefers-reduced-motion: reduce)').matches
}));
await reducedContext.close();
await browser.close();

const sourceFiles = [
  'docs/A-MODUL-LOGISTICS-SOURCES.md',
  'docs/A-MODUL-MAP-LICENSE.md',
  'apps/a-modul/static/data/russia-federal-subjects.svg',
  'apps/a-modul/static/data/russia-federal-subjects-LICENSE.txt',
  'apps/a-modul/artifacts/revision-r2/GENERATED-ASSET-NOTES.md'
];
const sourceInventory = [];
for (const file of sourceFiles) {
  const path = resolve(file);
  sourceInventory.push({ file, bytes: (await stat(path)).size, text: file.endsWith('.svg') ? null : (await readFile(path, 'utf8')).slice(0, 2_000) });
}
await writeFile(resolve(output, 'source-inventory.json'), `${JSON.stringify(sourceInventory, null, 2)}\n`, 'utf8');

await sharp(resolve(output, 'lower-state-01.png'))
  .composite([{ input: resolve(output, 'lower-state-05.png'), blend: 'difference' }])
  .png().toFile(resolve(output, 'diff-lower-start-end.png'));

async function beforeAfter(beforePath, afterPath, target) {
  const before = await sharp(beforePath).resize(720, 520, { fit: 'cover', position: 'centre' }).png().toBuffer();
  const after = await sharp(afterPath).resize(720, 520, { fit: 'cover', position: 'centre' }).png().toBuffer();
  await sharp({ create: { width: 1440, height: 520, channels: 4, background: '#111317' } })
    .composite([{ input: before, left: 0, top: 0 }, { input: after, left: 720, top: 0 }])
    .png().toFile(resolve(output, target));
}
await beforeAfter(resolve('reviews/a-modul-v2/milestone-b/logistics-route.png'), resolve(output, 'map-selected-region.png'), 'before-after-logistics.png');
await beforeAfter(resolve('reviews/a-modul-v2/milestone-b/factory-stage.png'), resolve(output, 'production.png'), 'before-after-production.png');

const results = {
  capturedAt: new Date().toISOString(), base, routeStatuses, desktop: desktopMetrics, responsive, specializedHeroes,
  mapDefault, mapRussia, mapSelected, logisticsExternalRegion, finder, finderCarry, finderUnknownData, factory, lower, reducedMotion, performance, defects
};
await writeFile(resolve(output, 'r2-qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

const widthChecks = [desktopMetrics, ...Object.values(responsive)];
const failed = Object.values(routeStatuses).some((status) => status !== 200)
  || widthChecks.some((item) => item.scrollWidth > item.clientWidth || !item.h1Visible || !item.primaryCtaVisible || item.h1Count !== 1)
  || !responsive['mobile-320'].mapVisibility?.fullSvg || !responsive['mobile-320'].mapVisibility?.destinationVisible
  || !responsive['mobile-390'].mapVisibility?.fullSvg || !responsive['mobile-390'].mapVisibility?.destinationVisible
  || Object.values(specializedHeroes).some((item) => !item.currentSrc.includes(item.expectedAsset) || item.naturalWidth < 1)
  || desktopMetrics.mapAsset !== '/data/russia-federal-subjects.svg'
  || desktopMetrics.factoryTabs !== 6 || desktopMetrics.lowerTabs !== 5 || desktopMetrics.disclosures < 7
  || mapRussia.destinationPoints !== 0 || mapRussia.selected !== 'Россия' || mapRussia.result !== 'Уточнить регион в России'
  || mapRussia.modes.join('|') !== 'Авто|Ж/д|Комбинированная'
  || mapSelected.destinationPoints !== 1 || mapSelected.selected !== 'Дальний Восток'
  || mapSelected.modes.join('|') !== 'Авто|Ж/д|Море / вода|Зимник|Комбинированная'
  || !mapSelected.source?.startsWith('https://a-modul.ru/') || !mapSelected.caseTitle?.includes('Камчатке')
  || logisticsExternalRegion.selected !== 'Москва и Московская область'
  || logisticsExternalRegion.modes.join('|') !== 'Авто|Ж/д|Комбинированная'
  || logisticsExternalRegion.activeMode !== 'Авто' || logisticsExternalRegion.sourceMode !== 'Авто'
  || finder.title !== 'Вахтовый посёлок для золоторудного проекта' || finder.comparisonPanels !== 2
  || !finder.source?.startsWith('https://a-modul.ru/object/') || finder.carriedHref !== '#project-brief'
  || finderCarry.capacity !== '' || !finderCarry.summary.includes('Численность нужно уточнить') || !finderCarry.summary.includes('Функциональный состав нужно уточнить')
  || !finderUnknownData.score?.includes('совпало 3 из 5') || finderUnknownData.matches?.includes('климат') || finderUnknownData.matches?.includes('удалённость')
  || !finderUnknownData.differences?.includes('не опубликовано') || finderUnknownData.differences?.includes('различий не выявлено') || finderUnknownData.unknownOptions !== 0
  || factory.active?.replace(/\s+/g, '') !== '03Инженерия' || factory.facts.join('|') !== '25 000 м²|до 750|до 25'
  || lower.tabs !== 5 || lower.active?.replace(/\s+/g, '') !== '05Эксплуатация'
  || reducedMotion.heroStage !== 3 || reducedMotion.assemblyPosition === 'sticky' || !reducedMotion.motionPreference
  || Object.values(defects).some((items) => items.length > 0);
if (failed) process.exitCode = 1;
