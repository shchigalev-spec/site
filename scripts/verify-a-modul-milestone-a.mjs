import { chromium, request } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const target = process.argv[2] ?? 'http://127.0.0.1:5175/modulnye-zdaniya/';
const output = resolve('reviews', 'a-modul-v2', 'milestone-a');
await mkdir(output, { recursive: true });

const assertions = [];
const runtimeDefects = { consoleErrors: [], pageErrors: [], failedRequests: [] };
const viewportResults = {};
const browser = await chromium.launch({ headless: true });

function assert(condition, message) {
  if (!condition) assertions.push(message);
}

function monitor(page, name) {
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeDefects.consoleErrors.push(`${name}: ${message.text()}`);
  });
  page.on('pageerror', (error) => runtimeDefects.pageErrors.push(`${name}: ${error.message}`));
  page.on('requestfailed', (failed) => {
    runtimeDefects.failedRequests.push(`${name}: ${failed.method()} ${failed.url()} — ${failed.failure()?.errorText ?? 'unknown'}`);
  });
}

async function inspect(page) {
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
  return page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };
    const box = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height };
    };
    const h1 = document.querySelector('h1');
    const primaryCta = document.querySelector('.hero__actions .button--primary');
    const ctaQualifier = document.querySelector('.hero__cta-note');
    const overflowElements = Array.from(document.body.querySelectorAll('*'))
      .filter((element) => visible(element))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
      .map(({ element, rect }) => ({
        selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className && typeof element.className === 'string' ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`,
        left: rect.left,
        right: rect.right
      }));
    const brokenImages = Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.currentSrc || image.src);
    const intrinsicImageDefects = Array.from(document.images)
      .filter((image) => !image.hasAttribute('width') || !image.hasAttribute('height'))
      .map((image) => image.currentSrc || image.src);
    const missingLabels = Array.from(document.querySelectorAll('input, select, textarea'))
      .filter((control) => control.getAttribute('type') !== 'hidden')
      .filter((control) => !control.closest('label') && !(control.id && document.querySelector(`label[for="${control.id}"]`)) && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby'))
      .map((control) => `${control.tagName.toLowerCase()}[name="${control.getAttribute('name') ?? ''}"]`);
    const smallTargets = Array.from(document.querySelectorAll('a, button, input, select'))
      .filter((element) => visible(element))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ element, rect }) => {
        if (element.matches('input[type="radio"]')) return false;
        return rect.width < 44 || rect.height < 44;
      })
      .map(({ element, rect }) => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 48) ?? '', width: rect.width, height: rect.height }));
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
    return {
      status: document.readyState,
      title: document.title,
      viewport: { width: innerWidth, height: innerHeight, clientWidth: document.documentElement.clientWidth },
      scrollWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      h1Count: document.querySelectorAll('h1').length,
      h1Visible: visible(h1),
      h1Box: box(h1),
      primaryCtaVisible: visible(primaryCta),
      primaryCtaBox: box(primaryCta),
      primaryCtaText: primaryCta?.textContent?.trim() ?? null,
      ctaQualifierVisible: visible(ctaQualifier),
      ctaQualifierBox: box(ctaQualifier),
      ctaQualifierText: ctaQualifier?.textContent?.trim() ?? null,
      canonical,
      overflowElements,
      brokenImages,
      intrinsicImageDefects,
      missingLabels,
      smallTargets,
      landmarks: {
        header: document.querySelectorAll('header').length,
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length
      },
      assemblyStage: document.querySelector('.assembly')?.getAttribute('data-stage') ?? null,
      activeStageText: document.querySelector('.assembly__stages button.active')?.textContent?.trim() ?? null
    };
  });
}

const viewports = [
  { name: 'desktop1440', width: 1440, height: 1000, screenshot: 'desktop-1440.png' },
  { name: 'tablet768', width: 768, height: 1024, screenshot: 'tablet-768.png' },
  { name: 'mobile390', width: 390, height: 844, screenshot: 'mobile-390.png' },
  { name: 'mobile320', width: 320, height: 568, screenshot: 'mobile-320.png' }
];

for (const config of viewports) {
  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
    hasTouch: config.width <= 768
  });
  if (config.name === 'desktop1440') {
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }
  const page = await context.newPage();
  monitor(page, config.name);
  const response = await page.goto(target, { waitUntil: 'networkidle' });
  assert(response?.status() === 200, `${config.name}: route status is ${response?.status() ?? 'missing'}, expected 200`);
  const metrics = await inspect(page);
  viewportResults[config.name] = metrics;
  assert(metrics.h1Count === 1, `${config.name}: expected exactly one H1, found ${metrics.h1Count}`);
  assert(metrics.h1Visible, `${config.name}: H1 is not visible`);
  assert(metrics.primaryCtaVisible, `${config.name}: primary CTA is not visible`);
  assert(metrics.primaryCtaBox?.top < config.height && metrics.primaryCtaBox?.bottom > 0, `${config.name}: primary CTA is outside the initial viewport`);
  assert(metrics.ctaQualifierVisible, `${config.name}: CTA qualification is not visible`);
  assert(metrics.ctaQualifierText === 'После получения основных исходных данных.', `${config.name}: CTA qualification is not exact`);
  assert(metrics.ctaQualifierBox?.top < config.height && metrics.ctaQualifierBox?.bottom > 0, `${config.name}: CTA qualification is outside the initial viewport`);
  assert(metrics.scrollWidth <= metrics.viewport.clientWidth, `${config.name}: document horizontal overflow ${metrics.scrollWidth} > ${metrics.viewport.clientWidth}`);
  assert(metrics.overflowElements.length === 0, `${config.name}: elements cross viewport bounds: ${JSON.stringify(metrics.overflowElements)}`);
  assert(metrics.brokenImages.length === 0, `${config.name}: broken images: ${metrics.brokenImages.join(', ')}`);
  assert(metrics.intrinsicImageDefects.length === 0, `${config.name}: images without intrinsic dimensions: ${metrics.intrinsicImageDefects.join(', ')}`);
  assert(metrics.missingLabels.length === 0, `${config.name}: unlabeled controls: ${metrics.missingLabels.join(', ')}`);
  assert(metrics.smallTargets.length === 0, `${config.name}: interactive targets below 44px: ${JSON.stringify(metrics.smallTargets)}`);
  assert(metrics.canonical === 'https://a-modul.ru/modulnye-zdaniya/', `${config.name}: invalid canonical ${metrics.canonical}`);
  await page.screenshot({ path: resolve(output, config.screenshot), fullPage: true });

  if (config.name === 'mobile390' || config.name === 'mobile320') {
    for (let stage = 0; stage < 4; stage += 1) {
      await page.locator('.assembly__stages button').nth(stage).click();
      await page.waitForTimeout(400);
      const selectedStage = await page.locator('.assembly').getAttribute('data-stage');
      assert(selectedStage === String(stage), `${config.name}: stage control ${stage} did not select its state`);
      if (config.name === 'mobile390' && stage === 2) {
        await page.locator('.assembly__viewport').screenshot({ path: resolve(output, 'mobile-stage-03.png') });
      }
      if (config.name === 'mobile390' && stage === 3) {
        await page.locator('.assembly__viewport').screenshot({ path: resolve(output, 'mobile-stage-04.png') });
      }
    }
  }

  if (config.name === 'desktop1440') {
    await page.screenshot({ path: resolve(output, 'start.png') });
    await page.locator('.assembly__play').evaluate((button) => button.click());
    await page.waitForTimeout(1700);
    const planningStage = await page.locator('.assembly').getAttribute('data-stage');
    assert(planningStage === '1', `desktop1440: expected planning stage 1, received ${planningStage}`);
    await page.screenshot({ path: resolve(output, 'planning-grid.png') });
    await page.waitForTimeout(1600);
    const middleStage = await page.locator('.assembly').getAttribute('data-stage');
    assert(middleStage === '2', `desktop1440: expected middle stage 2, received ${middleStage}`);
    await page.screenshot({ path: resolve(output, 'mid.png') });
    await page.waitForTimeout(1600);
    const finalStage = await page.locator('.assembly').getAttribute('data-stage');
    assert(finalStage === '3', `desktop1440: expected final stage 3, received ${finalStage}`);
    await page.screenshot({ path: resolve(output, 'end.png') });

    const form = page.locator('.brief__form');
    assert(!(await form.evaluate((node) => node.checkValidity())), 'desktop1440: empty mini-brief should be invalid');
    await page.locator('select[name="objectType"]').selectOption({ label: 'АБК' });
    await page.locator('input[name="area"]').fill('3200');
    await page.locator('input[name="region"]').fill('Камчатский край');
    await page.locator('input[name="commissioning"]').fill('2027-08');
    await form.locator('button[type="submit"]').click();
    const briefStatus = (await page.locator('.brief__status').textContent())?.trim() ?? '';
    const storedBrief = await page.evaluate(() => window.sessionStorage.getItem('a-modul-mini-brief'));
    assert(briefStatus.includes('Заявка не отправлена'), 'desktop1440: mini-brief lacks the honest no-submission status');
    assert(Boolean(storedBrief), 'desktop1440: validated mini-brief values were not carried in session storage');
    await page.screenshot({ path: resolve(output, 'brief-validated.png'), fullPage: false });

    await context.tracing.stop({ path: resolve(output, 'playwright-trace.zip') });
  }
  await context.close();
}

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: 'dark',
  reducedMotion: 'reduce',
  hasTouch: true
});
const reducedPage = await reducedContext.newPage();
monitor(reducedPage, 'reduced390');
const reducedResponse = await reducedPage.goto(target, { waitUntil: 'networkidle' });
assert(reducedResponse?.status() === 200, `reduced390: route status is ${reducedResponse?.status() ?? 'missing'}`);
const reducedMetrics = await inspect(reducedPage);
const reducedState = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  stage: document.querySelector('.assembly')?.getAttribute('data-stage'),
  completeVisible: document.querySelector('.assembly__plate--complete')?.classList.contains('visible') ?? false,
  playLabel: document.querySelector('.assembly__play')?.textContent?.trim() ?? ''
}));
assert(reducedState.preference, 'reduced390: reduced-motion preference did not match');
assert(reducedState.stage === '3' && reducedState.completeVisible, `reduced390: complete conclusion is missing: ${JSON.stringify(reducedState)}`);
assert(reducedState.playLabel.includes('Итог показан'), `reduced390: reduced-motion control label is incomplete: ${reducedState.playLabel}`);
assert(reducedMetrics.scrollWidth <= reducedMetrics.viewport.clientWidth, 'reduced390: horizontal overflow');
await reducedPage.screenshot({ path: resolve(output, 'reduced-motion.png'), fullPage: true });
await reducedContext.close();

const tenderContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const tenderPage = await tenderContext.newPage();
monitor(tenderPage, 'tender');
const tenderResponse = await tenderPage.goto(`${target}?mode=tender`, { waitUntil: 'networkidle' });
assert(tenderResponse?.status() === 200, `tender: route status is ${tenderResponse?.status() ?? 'missing'}`);
assert(await tenderPage.locator('.brief__mode').isVisible(), 'tender: tender diagnostic mode is not visible');
await tenderPage.locator('select[name="objectType"]').selectOption({ label: 'АБК' });
await tenderPage.locator('input[name="area"]').fill('1000');
await tenderPage.locator('input[name="region"]').fill('Сибирь');
await tenderPage.locator('input[name="commissioning"]').fill('2027-09');
await tenderPage.locator('.brief__form button[type="submit"]').click();
const tenderPayload = await tenderPage.evaluate(() => JSON.parse(window.sessionStorage.getItem('a-modul-mini-brief') ?? '{}'));
assert(tenderPayload.mode === 'tender', `tender: diagnostic intent was not persisted: ${JSON.stringify(tenderPayload)}`);
await tenderContext.close();

const api = await request.newContext();
const rootUrl = new URL('/', target).toString();
const rootResponse = await api.get(rootUrl, { maxRedirects: 0 });
const rootRedirect = { status: rootResponse.status(), location: rootResponse.headers().location ?? null };
assert([301, 302, 303, 307, 308].includes(rootRedirect.status), `root: expected redirect, received ${rootRedirect.status}`);
assert(rootRedirect.location === '/modulnye-zdaniya/', `root: unexpected redirect target ${rootRedirect.location}`);
await api.dispose();
await browser.close();

await sharp(resolve(output, 'start.png'))
  .composite([{ input: resolve(output, 'end.png'), blend: 'difference' }])
  .png()
  .toFile(resolve(output, 'diff-start-end.png'));

await sharp(resolve(output, 'mobile-stage-03.png'))
  .composite([{ input: resolve(output, 'mobile-stage-04.png'), blend: 'difference' }])
  .png()
  .toFile(resolve(output, 'diff-mobile-stage-03-04.png'));

assert(runtimeDefects.consoleErrors.length === 0, `console errors: ${runtimeDefects.consoleErrors.join(' | ')}`);
assert(runtimeDefects.pageErrors.length === 0, `page errors: ${runtimeDefects.pageErrors.join(' | ')}`);
assert(runtimeDefects.failedRequests.length === 0, `failed requests: ${runtimeDefects.failedRequests.join(' | ')}`);

const results = {
  milestone: 'A',
  target,
  capturedAt: new Date().toISOString(),
  rootRedirect,
  viewportResults,
  reducedMotion: { metrics: reducedMetrics, state: reducedState },
  runtimeDefects,
  assertions,
  pass: assertions.length === 0
};
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
if (assertions.length > 0) process.exitCode = 1;
