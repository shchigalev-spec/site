import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5176';
const outputDirectory = resolve('reviews', 'a-modul-v2', 'revision-r2');
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

await page.addInitScript(() => {
  window.__aModulPerformance = { lcp: 0, cls: 0, longTasks: [], events: [] };
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries.at(-1);
    if (last) window.__aModulPerformance.lcp = last.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__aModulPerformance.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__aModulPerformance.longTasks.push({ startTime: entry.startTime, duration: entry.duration });
  }).observe({ type: 'longtask', buffered: true });
  if (PerformanceObserver.supportedEntryTypes.includes('event')) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__aModulPerformance.events.push({ name: entry.name, duration: entry.duration });
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  }
});

const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));

await page.goto(`${base}/modulnye-zdaniya/?qa=production-performance`, { waitUntil: 'networkidle', timeout: 60_000 });
await page.locator('h1').waitFor({ state: 'visible' });
await page.waitForTimeout(1_000);

const interactionStart = await page.evaluate(() => performance.now());
await page.locator('.assembly__stages button').last().click();
await page.evaluate(() => new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
const interactionEnd = await page.evaluate(() => performance.now());

const metrics = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource');
  const paint = Object.fromEntries(performance.getEntriesByType('paint').map((entry) => [entry.name, entry.startTime]));
  const observed = window.__aModulPerformance;
  const totalBlockingTime = observed.longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0);
  const maxEventDuration = observed.events.reduce((max, event) => Math.max(max, event.duration), 0);
  return {
    environment: 'cold local production preview, Chromium, unthrottled',
    navigation: {
      responseEnd: navigation?.responseEnd ?? null,
      domContentLoaded: navigation?.domContentLoadedEventEnd ?? null,
      loadEvent: navigation?.loadEventEnd ?? null
    },
    webVitals: {
      lcp: observed.lcp || null,
      cls: observed.cls,
      totalBlockingTime,
      maxObservedEventDuration: maxEventDuration || null
    },
    paint,
    requestChain: {
      resourceCount: resources.length,
      imageCount: resources.filter((entry) => entry.initiatorType === 'img').length,
      transferredBytes: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      decodedBodyBytes: resources.reduce((sum, entry) => sum + (entry.decodedBodySize || 0), 0)
    },
    longTasks: observed.longTasks,
    observedEvents: observed.events
  };
});

metrics.webVitals.interactionToNextPaintProxy = interactionEnd - interactionStart;
metrics.consoleErrors = consoleErrors;
metrics.pageErrors = pageErrors;
metrics.pass = metrics.webVitals.lcp !== null
  && metrics.webVitals.lcp < 2_500
  && metrics.webVitals.cls < 0.1
  && metrics.webVitals.totalBlockingTime < 200
  && metrics.webVitals.interactionToNextPaintProxy < 200
  && consoleErrors.length === 0
  && pageErrors.length === 0;

await page.screenshot({ path: resolve(outputDirectory, 'production-performance-cold.png') });
await writeFile(resolve(outputDirectory, 'performance-production.json'), `${JSON.stringify(metrics, null, 2)}\n`);
await browser.close();

if (!metrics.pass) {
  console.error(JSON.stringify(metrics, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(metrics, null, 2));
}
