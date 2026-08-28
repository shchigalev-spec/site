import { chromium, request } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = process.argv[2] ?? 'http://127.0.0.1:4175';
const output = resolve('reviews', 'a-modul-v2', 'milestone-d');
await mkdir(output, { recursive: true });

const primaryRoutes = ['/modulnye-zdaniya/', '/vahtovye-poselki/', '/modulnye-ofisy-abk/', '/modulnye-obshchezhitiya/'];
const supplementalViewports = [
  { name: 'mobile360', width: 360, height: 800 },
  { name: 'mobile375', width: 375, height: 812 },
  { name: 'mobile430', width: 430, height: 932 },
  { name: 'tablet1024', width: 1024, height: 1366 },
  { name: 'desktop1920', width: 1920, height: 1080 }
];
const assertions = [];
const runtimeDefects = { consoleErrors: [], consoleWarnings: [], pageErrors: [], failedRequests: [] };
const report = { generatedAt: '', origin, supplementalViewports: {}, accessibility: {}, reducedMotion: {}, performance: {} };

function assert(condition, message) {
  if (!condition) assertions.push(message);
}

function monitor(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeDefects.consoleErrors.push(`${label}: ${message.text()}`);
    if (message.type() === 'warning') runtimeDefects.consoleWarnings.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => runtimeDefects.pageErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (request) => runtimeDefects.failedRequests.push(`${label}: ${request.url()} (${request.failure()?.errorText})`));
}

const browser = await chromium.launch({ headless: true });

for (const viewport of supplementalViewports) {
  report.supplementalViewports[viewport.name] = {};
  for (const route of primaryRoutes) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.width <= 768 });
    const page = await context.newPage();
    monitor(page, `${viewport.name}:${route}`);
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    const state = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const cta = document.querySelector('.hero__actions .button--primary');
      const ctaRect = cta?.getBoundingClientRect();
      return {
        statusReady: document.body.innerText.length > 500,
        h1Count: document.querySelectorAll('h1').length,
        h1Visible: Boolean(h1 && h1.getBoundingClientRect().height > 0),
        ctaVisible: Boolean(ctaRect && ctaRect.width > 0 && ctaRect.height > 0 && ctaRect.top < innerHeight),
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        brokenLoadedImages: [...document.images].filter((image) => image.complete && image.currentSrc && image.naturalWidth === 0).map((image) => image.currentSrc),
        intrinsicDefects: [...document.images].filter((image) => !image.hasAttribute('width') || !image.hasAttribute('height')).map((image) => image.currentSrc || image.src)
      };
    });
    report.supplementalViewports[viewport.name][route] = state;
    assert(response?.status() === 200, `${viewport.name}:${route}: expected 200`);
    assert(state.statusReady, `${viewport.name}:${route}: incomplete body`);
    assert(state.h1Count === 1 && state.h1Visible, `${viewport.name}:${route}: H1 invalid`);
    assert(state.ctaVisible, `${viewport.name}:${route}: initial CTA not visible`);
    assert(state.scrollWidth <= state.clientWidth, `${viewport.name}:${route}: horizontal overflow ${state.scrollWidth - state.clientWidth}px`);
    assert(state.brokenLoadedImages.length === 0, `${viewport.name}:${route}: broken loaded images`);
    assert(state.intrinsicDefects.length === 0, `${viewport.name}:${route}: missing image dimensions`);
    await context.close();
  }
}

const accessibilityContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
await accessibilityContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
const accessibilityPage = await accessibilityContext.newPage();
monitor(accessibilityPage, 'accessibility');
await accessibilityPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await accessibilityPage.locator('.mobile-menu-toggle').click();
await accessibilityPage.keyboard.press('Tab');
await accessibilityPage.keyboard.press('Escape');
const accessibility = await accessibilityPage.evaluate(() => {
  const duplicateIds = [...document.querySelectorAll('[id]')]
    .map((element) => element.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  const unlabeled = [...document.querySelectorAll('button, input, select, textarea, a[href]')]
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return false;
      if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
      const labels = 'labels' in element ? element.labels : null;
      return !(element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || labels?.length || element.textContent?.trim() || element.getAttribute('title'));
    })
    .map((element) => element.outerHTML.slice(0, 180));
  const undersizedTargets = [...document.querySelectorAll('button, a.button, select, input:not([type="hidden"]), textarea')]
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return false;
      const target = element.matches('input[type="checkbox"], input[type="radio"], input[type="file"]') ? element.closest('label') : element;
      const targetRect = target?.getBoundingClientRect();
      return Boolean(targetRect && (targetRect.width < 44 || targetRect.height < 44));
    })
    .map((element) => ({ tag: element.tagName, name: element.getAttribute('name'), text: element.textContent?.trim().slice(0, 80), rect: element.getBoundingClientRect().toJSON() }));
  const invalidImageAlternatives = [...document.images]
    .filter((image) => !image.hasAttribute('alt'))
    .map((image) => image.currentSrc || image.src);
  const toggle = document.querySelector('.mobile-menu-toggle');
  return {
    duplicateIds: [...new Set(duplicateIds)],
    unlabeled,
    undersizedTargets,
    invalidImageAlternatives,
    menuClosed: toggle?.getAttribute('aria-expanded') === 'false',
    focusReturned: document.activeElement === toggle,
    landmarks: {
      header: document.querySelectorAll('header').length,
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('footer').length,
      nav: document.querySelectorAll('nav').length
    }
  };
});
report.accessibility = accessibility;
assert(accessibility.duplicateIds.length === 0, `Duplicate IDs: ${accessibility.duplicateIds.join(', ')}`);
assert(accessibility.unlabeled.length === 0, `Unlabeled controls: ${accessibility.unlabeled.join(' | ')}`);
assert(accessibility.undersizedTargets.length === 0, `Targets below 44px: ${JSON.stringify(accessibility.undersizedTargets)}`);
assert(accessibility.invalidImageAlternatives.length === 0, 'Images without alt attributes');
assert(accessibility.menuClosed && accessibility.focusReturned, 'Mobile menu Escape/focus return failed');
assert(accessibility.landmarks.main === 1 && accessibility.landmarks.header >= 1 && accessibility.landmarks.footer === 1, 'Landmark structure invalid');
assert((await accessibilityPage.locator('.file-picker__button').innerText()).toLocaleLowerCase('ru-RU') === 'выбрать файлы', 'File picker is not visibly localized');
const fileInput = accessibilityPage.locator('input[name="files[]"]');
const fileAccessibleName = await fileInput.getAttribute('aria-label');
assert(fileAccessibleName?.includes('Выбрать файлы'), 'File picker accessible name does not contain its exact visible action label');
const pointerChooserPromise = accessibilityPage.waitForEvent('filechooser');
await accessibilityPage.locator('.file-picker__button').click();
const pointerChooser = await pointerChooserPromise;
await pointerChooser.setFiles({ name: 'pointer-check.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 pointer') });
const pointerStatus = await accessibilityPage.locator('#files-status').innerText();
assert(pointerStatus.includes('pointer-check.pdf'), 'Pointer file selection was not announced in the visible live status');
await fileInput.setInputFiles([]);
await fileInput.focus();
const focusState = await accessibilityPage.locator('.file-picker__button').evaluate((element) => {
  const style = getComputedStyle(element);
  return { outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth) };
});
assert(focusState.outlineStyle !== 'none' && focusState.outlineWidth >= 2, 'Keyboard focus is not visibly forwarded to the file action');
const keyboardChooserPromise = accessibilityPage.waitForEvent('filechooser');
await accessibilityPage.keyboard.press('Enter');
const keyboardChooser = await keyboardChooserPromise;
await keyboardChooser.setFiles({ name: 'keyboard-check.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 keyboard') });
const keyboardStatus = await accessibilityPage.locator('#files-status').innerText();
assert(keyboardStatus.includes('keyboard-check.pdf'), 'Keyboard file selection was not announced in the visible live status');
report.accessibility.filePicker = { fileAccessibleName, pointerStatus, keyboardStatus, focusState };
await accessibilityContext.tracing.stop({ path: resolve(output, 'playwright-trace.zip') });
await accessibilityContext.close();

const lazyContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const lazyPage = await lazyContext.newPage();
monitor(lazyPage, 'lazy-bim');
const lazyImages = [];
lazyPage.on('request', (requested) => {
  if (requested.resourceType() === 'image') lazyImages.push(requested.url());
});
await lazyPage.goto(`${origin}/vahtovye-poselki/`, { waitUntil: 'networkidle' });
const firstBimAsset = 'a-modul-general-hero-empty-site-mobile.avif';
const requestedBeforeBim = lazyImages.some((url) => url.includes(firstBimAsset));
await lazyPage.locator('#bim').scrollIntoViewIfNeeded();
await lazyPage.waitForTimeout(750);
const requestedAfterBim = lazyImages.some((url) => url.includes(firstBimAsset));
report.lazyBim = { firstBimAsset, requestedBeforeBim, requestedAfterBim };
assert(!requestedBeforeBim, 'First BIM plate was downloaded during the initial far-above-fold route load');
assert(requestedAfterBim, 'First BIM plate did not load when the BIM chapter entered the viewport');
await lazyContext.close();

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
monitor(reducedPage, 'reduced-motion');
await reducedPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
const reduced = await reducedPage.evaluate(() => {
  const parseDurations = (value) => value.split(',').map((duration) => duration.trim().endsWith('ms') ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000);
  const animated = [...document.querySelectorAll('*')].flatMap((element) => {
    const style = getComputedStyle(element);
    return [...parseDurations(style.animationDuration), ...parseDurations(style.transitionDuration)].filter(Number.isFinite);
  });
  return {
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    maxDurationMs: Math.max(0, ...animated),
    heroStage: document.querySelector('.assembly')?.getAttribute('data-stage'),
    bimStage: document.querySelector('.bim__sequence')?.getAttribute('data-stage')
  };
});
report.reducedMotion = reduced;
assert(reduced.scrollBehavior === 'auto', 'Reduced motion did not disable smooth scrolling');
assert(reduced.maxDurationMs <= 0.011, `Reduced motion retained ${reduced.maxDurationMs}ms animation/transition`);
assert(reduced.heroStage === '3' && reduced.bimStage === '6', 'Reduced motion did not expose complete stable conclusions');
await reducedPage.screenshot({ path: resolve(output, 'reduced-motion.png'), fullPage: false });
await reducedContext.close();

async function runPerformanceProfile({ label, trials, cpuSlowdown, screenshot }) {
  const results = [];
  for (let trial = 1; trial <= trials; trial += 1) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await context.newPage();
  monitor(page, `performance-${label}-${trial}`);
  await page.addInitScript(() => {
    window.__aModulPerformance = { lcp: 0, lcpElement: '', cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      const entry = list.getEntries().at(-1);
      if (!entry) return;
      window.__aModulPerformance.lcp = entry.startTime;
      window.__aModulPerformance.lcpElement = entry.element?.outerHTML?.slice(0, 240) ?? '';
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__aModulPerformance.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__aModulPerformance.longTasks.push(entry.duration);
    }).observe({ type: 'longtask', buffered: true });
  });
  const imageRequests = new Map();
  page.on('request', (request) => {
    if (request.resourceType() !== 'image') return;
    imageRequests.set(request.url(), (imageRequests.get(request.url()) ?? 0) + 1);
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 1_600_000 / 8,
    uploadThroughput: 750_000 / 8,
    connectionType: 'cellular4g'
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuSlowdown });
  await page.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    const resources = performance.getEntriesByType('resource');
    return {
      ...window.__aModulPerformance,
      fcp,
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
      transferBytes: resources.reduce((total, entry) => total + (entry.transferSize || 0), 0),
      resourceCount: resources.length
    };
  });
  const duplicates = [...imageRequests.entries()].filter(([, count]) => count > 1).map(([url, count]) => ({ url, count }));
  const maxLongTask = Math.max(0, ...metrics.longTasks);
  const totalBlockingTime = metrics.longTasks.reduce((total, duration) => total + Math.max(0, duration - 50), 0);
  results.push({ trial, ...metrics, maxLongTask, totalBlockingTime, duplicateImageRequests: duplicates });
  if (trial === 1 && screenshot) await page.screenshot({ path: resolve(output, screenshot), fullPage: false });
  await context.close();
  }
  return results;
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const performanceTrials = await runPerformanceProfile({
  label: 'mobile-4g-acceptance',
  trials: 3,
  cpuSlowdown: 1,
  screenshot: 'performance-mobile-4g.png'
});
const stressTrials = await runPerformanceProfile({
  label: 'mobile-4g-cpu4x-stress',
  trials: 1,
  cpuSlowdown: 4,
  screenshot: 'performance-mobile-4g-cpu4x-stress.png'
});
report.performance = {
  methodology: 'Three-run mobile 4G acceptance profile at native test-runner CPU, plus a disclosed 4x CPU diagnostic stress run. Release thresholds apply to the acceptance profile; stress data is preserved without reclassifying it as a field device measurement.',
  profile: { viewport: '390x844@2x', latencyMs: 150, downloadMbps: 1.6, uploadMbps: 0.75, cpuSlowdown: 1, trials: 3 },
  trials: performanceTrials,
  median: {
    lcp: median(performanceTrials.map((item) => item.lcp)),
    cls: median(performanceTrials.map((item) => item.cls)),
    fcp: median(performanceTrials.map((item) => item.fcp)),
    ttfb: median(performanceTrials.map((item) => item.ttfb)),
    totalBlockingTime: median(performanceTrials.map((item) => item.totalBlockingTime))
  },
  stress: {
    profile: { viewport: '390x844@2x', latencyMs: 150, downloadMbps: 1.6, uploadMbps: 0.75, cpuSlowdown: 4, trials: 1, diagnosticOnly: true },
    trials: stressTrials
  }
};
assert(report.performance.median.lcp > 0 && report.performance.median.lcp < 2500, `Median mobile-4G LCP ${report.performance.median.lcp}ms is outside target`);
assert(report.performance.median.cls < 0.1, `Median CLS ${report.performance.median.cls} is outside target`);
assert(performanceTrials.every((item) => item.maxLongTask < 200 && item.totalBlockingTime < 200), 'Long main-thread stall detected');
assert(performanceTrials.every((item) => item.duplicateImageRequests.length === 0), 'Duplicate image downloads detected');
assert(stressTrials.every((item) => item.duplicateImageRequests.length === 0), 'Duplicate image downloads detected in CPU stress profile');

const productionFormContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const productionFormPage = await productionFormContext.newPage();
productionFormPage.on('pageerror', (error) => runtimeDefects.pageErrors.push(`production-form-failure: ${error.message}`));
productionFormPage.on('requestfailed', (request) => runtimeDefects.failedRequests.push(`production-form-failure: ${request.url()} (${request.failure()?.errorText})`));
await productionFormPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
const fullForm = productionFormPage.locator('.full-form');
await fullForm.locator('[name="objectType"]').selectOption('abk');
await fullForm.locator('[name="personnelCount"]').fill('48');
await fullForm.locator('[name="area"]').fill('125');
await fullForm.locator('[name="region"]').selectOption('moskva');
await fullForm.locator('[name="phone"]').fill('+7 900 000 00 00');
await fullForm.locator('[name="consent"]').check();
const crmResponsePromise = productionFormPage.waitForResponse((response) => response.url().endsWith('/api/leads') && response.request().method() === 'POST');
await fullForm.locator('button[type="submit"]').click();
const crmResponse = await crmResponsePromise;
await fullForm.locator('.form-status--error').waitFor({ state: 'visible' });
const productionFailure = await fullForm.evaluate((form) => ({
  message: form.querySelector('.form-status--error')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
  contactPreserved: form.querySelector('[name="phone"]')?.value === '+7 900 000 00 00',
  fakeSuccessVisible: Boolean(form.querySelector('.form-status--success'))
}));
report.productionFormFailure = { ...productionFailure, responseStatus: crmResponse.status(), expectedConsoleSignal: 'Chromium logs the intentional 503 resource response; this scenario separately asserts no page error or failed transport.' };
assert(crmResponse.status() === 503, `Production CRM configuration failure expected 503, received ${crmResponse.status()}`);
assert(productionFailure.message.includes('Приём заявок временно не настроен'), 'Production form did not expose the controlled CRM configuration error');
assert(productionFailure.contactPreserved, 'Production form did not preserve entered data after integration error');
assert(!productionFailure.fakeSuccessVisible, 'Production form showed fake success without a configured CRM webhook');
await productionFormContext.close();

const api = await request.newContext({ baseURL: origin });
const root = await api.get('/?utm_source=release&utm_campaign=milestone-d&yclid=release-yclid', { maxRedirects: 0 });
assert(root.status() === 307 && root.headers().location?.includes('utm_source=release') && root.headers().location?.includes('yclid=release-yclid'), 'Production root redirect lost attribution');
const invalidOrigin = await api.get('/robots.txt');
assert(invalidOrigin.status() === 200, 'Production robots route failed');
const invalidStandard = await api.post('/api/leads', {
  headers: { origin },
  multipart: {
    mode: 'standard', objectType: '<script>', capacityMetric: 'bogus', personnelCount: '48',
    region: 'outer-space', phone: 'x', consent: 'on'
  }
});
const invalidTender = await api.post('/api/leads', {
  headers: { origin },
  multipart: {
    mode: 'tender', tenderInvitation: 'true', company: 'QA', tenderName: 'QA tender',
    deadline: 'not-a-date', region: 'moon', phone: 'x', consent: 'on'
  }
});
report.invalidPayloads = { standard: invalidStandard.status(), tender: invalidTender.status() };
assert(invalidStandard.status() === 422, `Production invalid standard payload expected 422, received ${invalidStandard.status()}`);
assert(invalidTender.status() === 422, `Production invalid tender payload expected 422, received ${invalidTender.status()}`);
const oversize = await api.post('/api/leads', {
  headers: { origin },
  multipart: {
    objectType: 'shift',
    personnelCount: '48',
    region: 'other',
    email: 'release-qa@example.invalid',
    consent: 'on',
    'files[]': { name: 'body-limit-check.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(46 * 1024 * 1024) }
  }
});
report.bodySizeLimit = { payloadMiB: 46, expectedStatus: 413, actualStatus: oversize.status() };
assert(oversize.status() === 413, `BODY_SIZE_LIMIT smoke expected 413, received ${oversize.status()}`);
await api.dispose();

assert(runtimeDefects.consoleErrors.length === 0, `Console errors: ${runtimeDefects.consoleErrors.join(' | ')}`);
assert(runtimeDefects.consoleWarnings.length === 0, `Console warnings: ${runtimeDefects.consoleWarnings.join(' | ')}`);
assert(runtimeDefects.pageErrors.length === 0, `Page errors: ${runtimeDefects.pageErrors.join(' | ')}`);
assert(runtimeDefects.failedRequests.length === 0, `Failed requests: ${runtimeDefects.failedRequests.join(' | ')}`);

report.generatedAt = new Date().toISOString();
const result = { ...report, pass: assertions.length === 0, assertions, runtimeDefects };
await writeFile(resolve(output, 'release-results.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
await browser.close();
console.log(JSON.stringify({ pass: result.pass, assertions, performance: report.performance.median, runtimeDefects, generatedAt: report.generatedAt }, null, 2));
if (!result.pass) process.exitCode = 1;
