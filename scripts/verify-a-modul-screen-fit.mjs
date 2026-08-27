import { chromium, request } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const output = resolve('reviews', 'a-modul-v2', 'screen-fit-revision');
await mkdir(output, { recursive: true });

const routes = [
  '/modulnye-zdaniya/',
  '/vahtovye-poselki/',
  '/modulnye-ofisy-abk/',
  '/modulnye-obshchezhitiya/'
];
const screenSelectors = [
  '.brief', '.evidence', '.lower-object', '.configurator', '.risk', '.logistics',
  '.finder', '.bim', '.factory', '.price-scope', '.dominant-case', '.seismic-proof',
  '.proposal-process', '.final-cta', '.route-case', '.route-visuals'
];
const defects = { consoleErrors: [], pageErrors: [], failedRequests: [], brokenImages: [] };

const api = await request.newContext();
const routeStatuses = {};
for (const route of routes) routeStatuses[route] = (await api.get(`${base}${route}`)).status();
await api.dispose();

const browser = await chromium.launch({ headless: true });
const results = {};
let configuratorStress = null;

function observe(page, label) {
  page.on('console', (message) => { if (message.type() === 'error') defects.consoleErrors.push(`${label}: ${message.text()}`); });
  page.on('pageerror', (error) => defects.pageErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? 'unknown';
    if (request.resourceType() === 'image' && failure.includes('ERR_ABORTED')) return;
    defects.failedRequests.push(`${label}: ${request.url()} — ${failure}`);
  });
}

for (const viewport of [{ width: 1920, height: 900 }, { width: 1440, height: 900 }]) {
  for (const route of routes) {
    const label = `${viewport.width}x${viewport.height}:${route}`;
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    observe(page, label);
    const response = await page.goto(`${base}${route}?qa=screen-fit`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${label} returned ${response?.status() ?? 'no response'}`);

    const measurements = await page.evaluate((selectors) => {
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
      const available = innerHeight - header;
      const sections = selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector,
          id: element.id,
          height: Math.round(rect.height * 10) / 10,
          available: Math.round(available * 10) / 10,
          fits: rect.height <= available + 1
        };
      }));
      return {
        viewport: { width: innerWidth, height: innerHeight },
        headerHeight: header,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        sections,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth < 1)
          .map((image) => image.currentSrc || image.src)
      };
    }, screenSelectors);
    defects.brokenImages.push(...measurements.brokenImages.map((src) => `${label}: ${src}`));
    results[label] = measurements;

    if (route === '/modulnye-zdaniya/' && viewport.width === 1920) {
      await page.getByRole('button', { name: 'Общежитие', exact: true }).click();
      await page.getByRole('button', { name: '100', exact: true }).click();
      for (const checkbox of await page.locator('.zone-grid input[type="checkbox"]').all()) {
        if (!(await checkbox.isChecked())) await checkbox.check();
      }
      configuratorStress = await page.evaluate(() => {
        const inspect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const style = getComputedStyle(element);
          return {
            clientHeight: element.clientHeight,
            scrollHeight: element.scrollHeight,
            overflowY: style.overflowY,
            hasInternalScroll: element.scrollHeight > element.clientHeight + 1 && ['auto', 'scroll'].includes(style.overflowY)
          };
        };
        return { controls: inspect('.configurator__controls'), output: inspect('.configurator__output') };
      });
      for (const [selector, filename] of [
        ['.evidence', 'desktop-evidence-fit.png'],
        ['.configurator', 'desktop-configurator-fit.png'],
        ['.logistics', 'desktop-logistics-fit.png'],
        ['.bim', 'desktop-bim-fit.png']
      ]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        await page.screenshot({ path: resolve(output, filename) });
      }
    }
    await context.close();
  }
}

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
const mobilePage = await mobileContext.newPage();
observe(mobilePage, '390x844:/modulnye-zdaniya/');
await mobilePage.goto(`${base}/modulnye-zdaniya/?qa=screen-fit-mobile`, { waitUntil: 'networkidle' });
const mobile = await mobilePage.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  h1Visible: Boolean(document.querySelector('h1')?.getBoundingClientRect().height),
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src)
}));
defects.brokenImages.push(...mobile.brokenImages.map((src) => `390x844: ${src}`));
await mobilePage.screenshot({ path: resolve(output, 'mobile-390-unchanged.png') });
await mobileContext.close();
await browser.close();

const failedSections = Object.entries(results).flatMap(([label, item]) => item.sections.filter((section) => !section.fits).map((section) => ({ label, ...section })));
const report = { capturedAt: new Date().toISOString(), routeStatuses, results, mobile, configuratorStress, failedSections, defects };
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ routeStatuses, failedSections, mobile, configuratorStress, defects }, null, 2)}\n`);

if (Object.values(routeStatuses).some((status) => status !== 200)
  || failedSections.length
  || Object.values(results).some((item) => item.horizontalOverflow)
  || mobile.horizontalOverflow
  || !mobile.h1Visible
  || configuratorStress?.controls?.hasInternalScroll
  || configuratorStress?.output?.hasInternalScroll
  || Object.values(defects).some((items) => items.length)) process.exitCode = 1;
