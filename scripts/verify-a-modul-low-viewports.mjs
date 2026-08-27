import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5175';
const output = resolve('reviews', 'a-modul-v2', 'low-viewport-repair');
await mkdir(output, { recursive: true });

const viewports = [
  { name: 'problem-900x536', width: 900, height: 536 },
  { name: 'problem-1637x621', width: 1637, height: 621 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'mobile-390x844', width: 390, height: 844 }
];
const defects = { consoleErrors: [], pageErrors: [], failedRequests: [] };
const results = {};
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') defects.consoleErrors.push(`${viewport.name}: ${message.text()}`); });
  page.on('pageerror', (error) => defects.pageErrors.push(`${viewport.name}: ${error.message}`));
  page.on('requestfailed', (request) => {
    if (!request.failure()?.errorText.includes('ERR_ABORTED')) defects.failedRequests.push(`${viewport.name}: ${request.url()} — ${request.failure()?.errorText}`);
  });
  const response = await page.goto(`${base}/modulnye-zdaniya/?qa=low-viewport-repair`, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`${viewport.name} returned ${response?.status() ?? 'no response'}`);

  const hero = await page.evaluate(() => {
    const inspect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height };
    };
    const assembly = document.querySelector('.assembly');
    const copy = document.querySelector('.hero__copy')?.getBoundingClientRect();
    const caption = document.querySelector('.assembly__caption')?.getBoundingClientRect();
    return {
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      assembly: inspect('.assembly'),
      caption: inspect('.assembly__caption'),
      stages: inspect('.assembly__stages'),
      copy: inspect('.hero__copy'),
      assemblyClipped: assembly ? assembly.scrollHeight > assembly.clientHeight + 1 : true,
      copyOverlapsCaption: Boolean(copy && caption && copy.bottom > caption.top + 1),
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth < 1).map((image) => image.currentSrc || image.src)
    };
  });
  await page.screenshot({ path: resolve(output, `${viewport.name}-hero.png`) });

  await page.getByRole('button', { name: 'Общежитие', exact: true }).click();
  await page.getByRole('button', { name: '100', exact: true }).click();
  for (const checkbox of await page.locator('.zone-grid input[type="checkbox"]').all()) {
    if (!(await checkbox.isChecked())) await checkbox.check();
  }
  await page.locator('.configurator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const configurator = await page.evaluate(() => {
    const inspect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height,
        clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
        overflowX: style.overflowX, overflowY: style.overflowY,
        hasInternalScroll: element.scrollHeight > element.clientHeight + 1 && ['auto', 'scroll'].includes(style.overflowY)
      };
    };
    const section = document.querySelector('.configurator');
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    return {
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      section: inspect('.configurator'),
      workspace: inspect('.configurator__workspace'),
      controls: inspect('.configurator__controls'),
      output: inspect('.configurator__output'),
      fitsAvailableViewport: section ? section.getBoundingClientRect().height <= innerHeight - headerHeight + 1 : false,
      sectionClipped: section ? section.scrollHeight > section.clientHeight + 1 && getComputedStyle(section).overflowY === 'hidden' : true
    };
  });
  await page.screenshot({ path: resolve(output, `${viewport.name}-configurator.png`) });
  results[viewport.name] = { hero, configurator };
  await context.close();
}

await browser.close();
const failures = Object.entries(results).flatMap(([name, result]) => {
  const items = [];
  if (result.hero.horizontalOverflow || result.configurator.horizontalOverflow) items.push(`${name}: horizontal overflow`);
  if (result.hero.assemblyClipped) items.push(`${name}: hero assembly clipped`);
  if (result.hero.copyOverlapsCaption) items.push(`${name}: hero copy overlaps caption`);
  if (result.configurator.sectionClipped) items.push(`${name}: configurator clipped`);
  if (result.configurator.controls?.hasInternalScroll || result.configurator.output?.hasInternalScroll) items.push(`${name}: configurator inner scroll`);
  if (viewports.find((viewport) => viewport.name === name).width >= 1121 && !result.configurator.fitsAvailableViewport) items.push(`${name}: configurator does not fit available desktop height`);
  if (result.configurator.workspace && (result.configurator.workspace.left < -1 || result.configurator.workspace.right > viewports.find((viewport) => viewport.name === name).width + 1)) items.push(`${name}: configurator outside viewport`);
  if (result.hero.brokenImages.length) items.push(`${name}: broken images`);
  return items;
});
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify({ capturedAt: new Date().toISOString(), results, defects, failures }, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ failures, defects, results }, null, 2)}\n`);
if (failures.length || Object.values(defects).some((items) => items.length)) process.exitCode = 1;
