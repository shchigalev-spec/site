import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin = process.env.TECH_ORIGIN || 'http://127.0.0.1:4173';
const performanceSlice = String(process.env.TECH_PERF_SLICE || '08').padStart(2, '0');
const output = path.resolve('reviews', 'tech-v2', `slice-${performanceSlice}`, 'performance-evidence.json');
const browser = await chromium.launch();

async function audit(name, viewport, mobile = false) {
  const context = await browser.newContext({ viewport, screen: viewport, isMobile: mobile, hasTouch: mobile });
  await context.addInitScript(() => {
    window.__techPerf = { longTasks: [], shifts: [], lcp: 0 };
    window.__techCls = (entries) => {
      let maximum = 0;
      let windowValue = 0;
      let windowStart = 0;
      let previous = 0;
      for (const entry of entries) {
        if (!windowValue || entry.start - previous > 1000 || entry.start - windowStart > 5000) {
          windowStart = entry.start;
          windowValue = entry.value;
        } else {
          windowValue += entry.value;
        }
        previous = entry.start;
        maximum = Math.max(maximum, windowValue);
      }
      return maximum;
    };
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__techPerf.longTasks.push({
          start: entry.startTime,
          duration: entry.duration,
          step: window.__techPerf.currentStep || 'initial'
        });
      }).observe({ type: 'longtask', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__techPerf.shifts.push({
              start: entry.startTime,
              value: entry.value,
              step: window.__techPerf.currentStep || 'initial',
              sources: (entry.sources || []).map((source) => {
                const node = source.node;
                return node instanceof Element ? `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.className && typeof node.className === 'string' ? `.${node.className.trim().replace(/\s+/g, '.')}` : ''}` : 'unknown';
              })
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length) window.__techPerf.lcp = entries.at(-1).startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
  });

  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText || 'unknown'}`));
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.waitForTimeout(350);
  const initial = await page.evaluate(() => ({ lcp: window.__techPerf.lcp, cls: window.__techCls(window.__techPerf.shifts) }));
  await page.evaluate(() => { window.__techPerf.longTasks = []; });

  const hero = page.locator('[data-v2-hero]');
  const heroRange = await hero.evaluate((node) => ({ top: node.offsetTop, range: Math.max(1, node.offsetHeight - innerHeight) }));
  for (let index = 0; index <= 18; index += 1) {
    await page.evaluate(({ top, range, progress }) => scrollTo(0, top + range * progress), { ...heroRange, progress: index / 18 });
    await page.waitForTimeout(22);
  }

  const chapters = [
    ['#noise-path-lab', '.path-lab'],
    ['#construction', '.construction-decision'],
    ['#renovation-morph', '.renovation-morph'],
    ['#cases', '#measured-evidence'],
    ['#scenario-v2', '#scenario'],
    ['[data-deferred-chapter="quality"]', '.quality'],
    ['#home-short-form', '#home-short-form-panel']
  ];
  for (const [hostSelector, contentSelector] of chapters) {
    await page.locator(hostSelector).scrollIntoViewIfNeeded();
    await page.locator(contentSelector).waitFor({ state: 'visible', timeout: 20_000 });
    await page.waitForTimeout(80);
  }

  await page.evaluate(async () => {
    await Promise.all([...document.images].filter((image) => image.complete).map((image) => image.decode().catch(() => undefined)));
  });
  await page.waitForTimeout(120);
  const deferredLoad = await page.evaluate(() => {
    const tasks = window.__techPerf.longTasks;
    const summary = {
      longTaskCount: tasks.length,
      maxLongTaskMs: tasks.length ? Math.round(Math.max(...tasks.map((task) => task.duration))) : 0,
      longTasksOver200: tasks.filter((task) => task.duration > 200)
    };
    window.__techPerf.longTasks = [];
    window.__techPerf.interactionShiftStart = window.__techPerf.shifts.length;
    return summary;
  });

  async function reveal(selector) {
    await page.locator(selector).evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const top = window.scrollY + rect.top - Math.max(0, (window.innerHeight - rect.height) / 2);
      window.scrollTo(0, Math.max(0, top));
    });
    await page.waitForTimeout(280);
  }

  const pathTabs = page.locator('.path-lab [role="tab"]');
  if (await pathTabs.count()) {
    await page.evaluate(() => { window.__techPerf.currentStep = 'path'; });
    await reveal('#noise-path-lab');
    const pathControl = mobile ? page.locator('.path-lab .mobile-stepper button').last() : pathTabs.nth(2);
    await pathControl.click();
    await page.waitForTimeout(900);
  }
  const constructionTabs = page.locator('.construction-decision .context-tabs [role="tab"]');
  if (await constructionTabs.count()) { await page.evaluate(() => { window.__techPerf.currentStep = 'construction'; }); await reveal('#construction'); await constructionTabs.last().click(); await page.waitForTimeout(2100); }
  const renovationControls = page.locator('.renovation-morph .mobile-progress button:visible, .renovation-morph .stage-datum button:visible');
  if (await renovationControls.count()) { await page.evaluate(() => { window.__techPerf.currentStep = 'renovation'; }); await reveal('#renovation-morph'); await renovationControls.last().click(); await page.waitForTimeout(520); }
  const scenarioAnswer = page.locator('#scenario .answers button:visible').first();
  if (await scenarioAnswer.count()) { await page.evaluate(() => { window.__techPerf.currentStep = 'scenario'; }); await reveal('#scenario-v2'); await scenarioAnswer.click(); await page.waitForTimeout(120); }
  const qualityControls = page.locator('.quality .sequence-state button');
  if (await qualityControls.count()) { await page.evaluate(() => { window.__techPerf.currentStep = 'quality'; }); await reveal('[data-deferred-chapter="quality"]'); await qualityControls.last().click(); await page.waitForTimeout(820); }

  await page.evaluate(() => { window.__techPerf.currentStep = 'offscreen-hold'; });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1300);
  const result = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource').map((entry) => entry.name);
    const images = resources.filter((url) => /\.(?:avif|webp|png|jpe?g)(?:\?|$)/i.test(url));
    const formats = new Map();
    for (const url of images) {
      const pathname = new URL(url).pathname;
      const extension = pathname.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
      const stem = pathname.replace(/\.(?:avif|webp|png|jpe?g)$/i, '');
      if (!formats.has(stem)) formats.set(stem, new Set());
      formats.get(stem).add(extension);
    }
    const duplicateFormats = [...formats.entries()].filter(([, extensions]) => extensions.size > 1).map(([stem, extensions]) => ({ stem, extensions: [...extensions] }));
    const tasks = window.__techPerf.longTasks;
    const running = document.getAnimations().filter((animation) => animation.playState === 'running').map((animation) => {
      const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
      return target instanceof Element ? `${target.tagName.toLowerCase()}.${target.className}` : 'unknown';
    });
    return {
      longTaskCount: tasks.length,
      maxLongTaskMs: tasks.length ? Math.round(Math.max(...tasks.map((task) => task.duration))) : 0,
      longTasksOver200: tasks.filter((task) => task.duration > 200),
      resourceCount: resources.length,
      imageRequests: images,
      duplicateFormats,
      runningAnimationsAfterOffscreenHold: running,
      finalCls: window.__techCls(window.__techPerf.shifts),
      cumulativeLayoutShiftSum: window.__techPerf.shifts.reduce((sum, entry) => sum + entry.value, 0),
      interactionCls: window.__techCls(window.__techPerf.shifts.slice(window.__techPerf.interactionShiftStart || 0)),
      layoutShifts: window.__techPerf.shifts.slice(window.__techPerf.interactionShiftStart || 0)
    };
  });
  await context.close();
  return { name, viewport, errors, initial, deferredLoad, ...result };
}

const report = {
  capturedAt: new Date().toISOString(),
  origin,
  desktop: await audit('desktop', { width: 1440, height: 1000 }),
  mobile: await audit('mobile', { width: 390, height: 844 }, true)
};
report.failures = [];
for (const result of [report.desktop, report.mobile]) {
  if (result.errors.length) report.failures.push(...result.errors.map((error) => `${result.name}: ${error}`));
  if (result.longTasksOver200.length) report.failures.push(`${result.name}: interaction long task exceeded 200ms`);
  if (result.initial.cls >= 0.1 || result.interactionCls >= 0.1) report.failures.push(`${result.name}: CLS session window reached the 0.1 limit`);
  if (result.duplicateFormats.length) report.failures.push(`${result.name}: duplicate raster formats downloaded`);
  if (result.runningAnimationsAfterOffscreenHold.length) report.failures.push(`${result.name}: animations still running after offscreen hold`);
}

await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
