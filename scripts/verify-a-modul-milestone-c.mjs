import { chromium, request } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const origin = process.argv[2] ?? 'http://127.0.0.1:5175';
const evidenceFolder = process.argv[3] ?? 'milestone-c';
const output = resolve('reviews', 'a-modul-v2', evidenceFolder);
await mkdir(output, { recursive: true });

const assertions = [];
const runtimeDefects = { consoleErrors: [], consoleWarnings: [], pageErrors: [], failedRequests: [] };
const expectedFailureSignals = [];
const results = { routes: {}, viewports: {}, variants: {}, forms: {}, focusOrder: {}, motion: {}, routeFinals: {}, seo: {}, reducedMotion: {} };
const primaryRoutes = [
  '/modulnye-zdaniya/',
  '/vahtovye-poselki/',
  '/modulnye-ofisy-abk/',
  '/modulnye-obshchezhitiya/'
];
const regionExpectations = {
  moskva: 'moskva', krasnoyarsk: 'krasnoyarsk', ural: 'ural', 'dalniy-vostok': 'far-east',
  sibir: 'siberia', kurgan: 'kurgan', rossiya: 'russia'
};
const variants = [
  ...['kpp', 'stolovaya', 'bpk', 'prorabskaya', 'office', 'abk', 'other'].map((type) => `/modulnye-zdaniya/?type=${type}`),
  ...Object.keys(regionExpectations).map((region) => `/modulnye-zdaniya/?region=${region}`),
  '/vahtovye-poselki/?region=dalniy-vostok',
  '/modulnye-obshchezhitiya/?region=sibir',
  '/modulnye-zdaniya/?mode=tender',
  '/modulnye-zdaniya/?mode=leasing'
];

function assert(condition, message) {
  if (!condition) assertions.push(message);
}

function monitor(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'warning') {
      runtimeDefects.consoleWarnings.push(`${label}: ${message.text()}`);
      return;
    }
    if (message.type() !== 'error') return;
    if (label === 'forms' && (message.text().includes('503') || message.text().includes('422'))) {
      expectedFailureSignals.push(`${label}: ${message.text()}`);
      return;
    }
    runtimeDefects.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => runtimeDefects.pageErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (failed) => {
    const error = failed.failure()?.errorText ?? 'unknown';
    if (!error.includes('ERR_ABORTED')) runtimeDefects.failedRequests.push(`${label}: ${failed.method()} ${failed.url()} — ${error}`);
  });
}

async function primeLazyImages(page) {
  await page.evaluate(async () => {
    const step = Math.max(640, Math.round(innerHeight * 0.8));
    for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
      window.scrollTo({ top, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(180);
}

async function inspect(page) {
  await page.waitForFunction(() => document.querySelector('img')?.complete === true);
  return page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
    };
    const h1 = document.querySelector('h1');
    const cta = document.querySelector('.hero__actions .button--primary');
    const structured = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((node) => {
      try {
        const parsed = JSON.parse(node.textContent || '{}');
        return parsed['@graph']?.map((item) => item['@type']) ?? [parsed['@type']];
      } catch { return ['INVALID_JSON']; }
    }).filter(Boolean);
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
      structured,
      h1: h1?.textContent?.trim() ?? '',
      h1Count: document.querySelectorAll('h1').length,
      h1Visible: visible(h1),
      ctaVisible: visible(cta),
      ctaTop: cta?.getBoundingClientRect().top ?? null,
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowElements: [...document.querySelectorAll('body *')]
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1))
        .slice(0, 12)
        .map(({ element, rect }) => ({
          selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.classList.length ? `.${[...element.classList].join('.')}` : ''}`,
          left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width)
        })),
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
      intrinsicImageDefects: [...document.images].filter((image) => !image.hasAttribute('width') || !image.hasAttribute('height')).map((image) => image.currentSrc || image.src),
      unlabeledControls: [...document.querySelectorAll('input, select, textarea')]
        .filter((control) => control.getAttribute('type') !== 'hidden')
        .filter((control) => !control.closest('label') && !(control.id && document.querySelector(`label[for="${control.id}"]`)) && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby'))
        .map((control) => `${control.tagName}:${control.getAttribute('name') ?? ''}`),
      overlay: Boolean(document.querySelector('.vite-error-overlay, #webpack-dev-server-client-overlay, [data-nextjs-dialog]')),
      textLength: document.body.innerText.trim().length
    };
  });
}

async function waitForFormStatus(page) {
  await page.waitForFunction(() => document.querySelector('.form-status--success, .form-status--error'));
  return page.locator('.form-status').evaluate((element) => ({
    kind: element.classList.contains('form-status--success') ? 'success' : 'error',
    text: element.textContent?.trim() ?? ''
  }));
}

async function submitFormAndRead(page) {
  const responsePromise = page.waitForResponse((response) => response.url().includes('/api/leads') && response.request().method() === 'POST', { timeout: 5000 }).catch(() => null);
  await page.locator('form.full-form button[type="submit"]').click();
  const response = await responsePromise;
  await page.waitForTimeout(150);
  const status = await waitForFormStatus(page);
  return {
    status,
    response: response ? { status: response.status(), body: await response.text() } : null
  };
}

const browser = await chromium.launch({ headless: true });
const api = await request.newContext({ baseURL: origin });

for (const route of primaryRoutes) {
  const response = await api.get(route);
  results.routes[route] = { status: response.status() };
  assert(response.status() === 200, `${route}: expected 200, got ${response.status()}`);
}

for (const path of variants) {
  console.log(`[variant] ${path}`);
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  monitor(page, path);
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  const state = await inspect(page);
  results.variants[path] = { status: response?.status(), h1: state.h1, canonical: state.canonical, robots: state.robots };
  assert(response?.status() === 200, `${path}: expected 200`);
  assert(state.h1Visible && state.h1Count === 1, `${path}: expected one visible H1`);
  assert(state.canonical.endsWith(primaryRoutes.find((route) => path.startsWith(route)) ?? '/modulnye-zdaniya/'), `${path}: canonical does not point to base route`);
  assert(state.robots === 'noindex,follow', `${path}: query variant must be noindex,follow`);
  if (path.includes('?type=') || path.includes('?region=')) {
    const primaryCta = page.locator('.hero__actions .button--primary');
    const primaryHref = await primaryCta.count() ? await primaryCta.getAttribute('href') : null;
    assert(await primaryCta.count() === 1, `${path}: diagnosis CTA is missing`);
    const variantKey = path.includes('?type=') ? 'type=' : 'region=';
    assert(primaryHref?.includes(variantKey), `${path}: diagnosis CTA dropped landing context`);
  }
  const regionSlug = new URL(`${origin}${path}`).searchParams.get('region');
  if (regionSlug) {
    const expected = regionExpectations[regionSlug];
    const miniRegion = page.locator('#project-brief select[name="region"]');
    if (await miniRegion.count()) {
      assert(await miniRegion.inputValue() === expected, `${path}: mini-brief lost exact region`);
    }
    const fullRegion = page.locator('form.full-form select[name="region"]');
    assert(await fullRegion.count() === 1, `${path}: full form region control is missing`);
    if (await fullRegion.count()) {
      assert(await fullRegion.inputValue() === expected, `${path}: full form lost exact region`);
    }
  }
  const typeSlug = new URL(`${origin}${path}`).searchParams.get('type');
  if (typeSlug) {
    assert((await page.locator('.brief__mode').first().innerText()).length > 0, `${path}: exact type intent is not visible in brief`);
    assert((await page.locator('.full-brief__intro').innerText()).includes('Контекст рекламного запроса'), `${path}: exact type intent is not visible in full form`);
  }
  await page.close();
}

const unpersonalized = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await unpersonalized.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
assert(await unpersonalized.locator('#project-brief select[name="region"]').inputValue() === '', 'Unpersonalized mini-brief invents a region');
assert(await unpersonalized.locator('form.full-form select[name="region"]').inputValue() === '', 'Unpersonalized full form invents a region');
assert(await unpersonalized.locator('#project-brief select[name="objectType"]').inputValue() === '', 'Unpersonalized mini-brief invents an object type');
assert(await unpersonalized.locator('form.full-form select[name="objectType"]').inputValue() === '', 'Unpersonalized full form invents an object type');
const tenderHeroHref = await unpersonalized.locator('.hero__actions .button--ghost').getAttribute('href');
assert(tenderHeroHref?.includes('mode=tender') && tenderHeroHref.endsWith('#full-brief'), 'Hero tender CTA does not land on the dedicated tender form');
await unpersonalized.close();

const routeContextPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await routeContextPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await routeContextPage.locator('.desktop-nav a[href="/modulnye-ofisy-abk/"]').click();
await routeContextPage.waitForURL('**/modulnye-ofisy-abk/');
assert(await routeContextPage.locator('#project-brief select[name="objectType"]').inputValue() === 'abk', 'Untouched general default did not switch to office route context');
await routeContextPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await routeContextPage.locator('#project-brief select[name="objectType"]').selectOption('dorm');
await routeContextPage.locator('.desktop-nav a[href="/modulnye-ofisy-abk/"]').click();
await routeContextPage.waitForURL('**/modulnye-ofisy-abk/');
assert(await routeContextPage.locator('#project-brief select[name="objectType"]').inputValue() === 'dorm', 'Explicit user object choice was lost during route navigation');
await routeContextPage.close();

const regionOnlyContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const regionOnlyPage = await regionOnlyContext.newPage();
await regionOnlyPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await regionOnlyPage.locator('#project-brief select[name="region"]').selectOption('moskva');
await regionOnlyPage.locator('.desktop-nav a[href="/modulnye-ofisy-abk/"]').click();
await regionOnlyPage.waitForURL('**/modulnye-ofisy-abk/');
assert(await regionOnlyPage.locator('#project-brief select[name="objectType"]').inputValue() === 'abk', 'Region-only edit blocked office route object default');
assert(await regionOnlyPage.locator('form.full-form select[name="objectType"]').inputValue() === 'abk', 'Region-only edit blocked office full-form object default');
assert(await regionOnlyPage.locator('#project-brief select[name="region"]').inputValue() === 'moskva', 'Region-only edit was not preserved across routes');
await regionOnlyContext.close();

const capacityOnlyContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const capacityOnlyPage = await capacityOnlyContext.newPage();
await capacityOnlyPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await capacityOnlyPage.locator('#project-brief input[name="people"]').fill('321');
await capacityOnlyPage.locator('.desktop-nav a[href="/modulnye-ofisy-abk/"]').click();
await capacityOnlyPage.waitForURL('**/modulnye-ofisy-abk/');
assert(await capacityOnlyPage.locator('#project-brief select[name="objectType"]').inputValue() === 'abk', 'Capacity-only edit blocked office route object default');
assert(await capacityOnlyPage.locator('#project-brief input[name="workplaces"]').inputValue() === '321', 'Capacity-only edit was not preserved across routes');
assert(await capacityOnlyPage.locator('form.full-form input[name="personnelCount"]').inputValue() === '321', 'Capacity-only edit did not reach the office full form');
await capacityOnlyContext.close();

const zoneProvenanceContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const zoneProvenancePage = await zoneProvenanceContext.newPage();
await zoneProvenancePage.goto(`${origin}/vahtovye-poselki/`, { waitUntil: 'networkidle' });
await zoneProvenancePage.locator('#configurator .zone-grid label', { hasText: 'Столовая' }).locator('input').uncheck();
await zoneProvenancePage.locator('.desktop-nav a[href="/modulnye-ofisy-abk/"]').click();
await zoneProvenancePage.waitForURL('**/modulnye-ofisy-abk/');
const routeChangedZones = await zoneProvenancePage.locator('form.full-form input[name="functionalZones[]"]').evaluateAll((inputs) => inputs.map((input) => input.value));
assert(routeChangedZones.includes('Рабочие места') && !routeChangedZones.includes('Общежития') && !routeChangedZones.includes('БПК'), 'Route object change retained functional zones from the previous object type');
await zoneProvenanceContext.close();

const plannerContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const plannerPage = await plannerContext.newPage();
let plannerPost = '';
plannerPage.on('request', (request) => {
  if (request.url().includes('/api/leads') && request.method() === 'POST') plannerPost = request.postDataBuffer()?.toString('utf8') ?? '';
});
await plannerPage.goto(`${origin}/modulnye-ofisy-abk/`, { waitUntil: 'networkidle' });
await plannerPage.locator('form.full-form input[name="phone"]').fill('+7 904 444 55 66');
await plannerPage.locator('form.full-form textarea[name="comment"]').fill('Контакт и комментарий должны сохраниться');
await plannerPage.locator('#route-planner .choice-grid--capacity button', { hasText: '300' }).click();
await plannerPage.locator('#route-planner .zone-grid label', { hasText: 'Переговорные' }).locator('input').uncheck();
await plannerPage.locator('#route-planner .button--primary').click();
assert(await plannerPage.locator('#project-brief input[name="workplaces"]').inputValue() === '300', 'Route planner scale did not reach the mini-brief');
assert(await plannerPage.locator('form.full-form input[name="personnelCount"]').inputValue() === '300', 'Explicit route-planner transfer did not override stale project fields after full-form interaction');
assert(await plannerPage.locator('form.full-form input[name="phone"]').inputValue() === '+7 904 444 55 66', 'Explicit route-planner transfer cleared the contact field');
assert(await plannerPage.locator('form.full-form textarea[name="comment"]').inputValue() === 'Контакт и комментарий должны сохраниться', 'Explicit route-planner transfer cleared the comment');
const transferredZones = await plannerPage.locator('form.full-form input[name="functionalZones[]"]').evaluateAll((inputs) => inputs.map((input) => input.value));
assert(transferredZones.length > 0 && !transferredZones.includes('Переговорные'), 'Route planner composition did not reach the lead form');
await plannerPage.locator('form.full-form select[name="region"]').selectOption('moskva');
await plannerPage.locator('form.full-form input[name="consent"]').check();
await plannerPage.locator('form.full-form button[type="submit"]').click();
await plannerPage.locator('.form-status--success').waitFor();
assert(plannerPost.includes('functionalZones[]') && plannerPost.includes('Рабочие места') && !plannerPost.includes('Переговорные') && plannerPost.includes('300'), 'Posted CRM contract lost the explicit route-planner scale or composition');
await plannerContext.close();

const configuratorTransferContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const configuratorTransferPage = await configuratorTransferContext.newPage();
await configuratorTransferPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await configuratorTransferPage.locator('form.full-form input[name="phone"]').fill('+7 905 111 22 33');
await configuratorTransferPage.locator('#configurator .choice-grid--types button', { hasText: 'Офис / АБК' }).click();
await configuratorTransferPage.locator('#configurator .choice-grid--capacity button', { hasText: '300' }).click();
await configuratorTransferPage.locator('#configurator .zone-grid label', { hasText: 'Переговорные' }).locator('input').uncheck();
await configuratorTransferPage.locator('#configurator .button--primary').click();
assert(await configuratorTransferPage.locator('form.full-form select[name="objectType"]').inputValue() === 'abk', 'Explicit configurator transfer did not update the full-form object after interaction');
assert(await configuratorTransferPage.locator('form.full-form input[name="personnelCount"]').inputValue() === '300', 'Explicit configurator transfer did not update the full-form capacity after interaction');
assert(await configuratorTransferPage.locator('form.full-form input[name="phone"]').inputValue() === '+7 905 111 22 33', 'Explicit configurator transfer cleared the contact field');
const configuratorZones = await configuratorTransferPage.locator('form.full-form input[name="functionalZones[]"]').evaluateAll((inputs) => inputs.map((input) => input.value));
assert(configuratorZones.includes('Рабочие места') && !configuratorZones.includes('Переговорные'), 'Explicit configurator transfer did not serialize its zone composition');
await configuratorTransferContext.close();

const formObjectContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const formObjectPage = await formObjectContext.newPage();
let formObjectPost = '';
formObjectPage.on('request', (request) => {
  if (request.url().includes('/api/leads') && request.method() === 'POST') formObjectPost = request.postDataBuffer()?.toString('utf8') ?? '';
});
await formObjectPage.goto(`${origin}/modulnye-ofisy-abk/`, { waitUntil: 'networkidle' });
await formObjectPage.locator('form.full-form select[name="objectType"]').selectOption('dorm');
const switchedZones = await formObjectPage.locator('form.full-form input[name="functionalZones[]"]').evaluateAll((inputs) => inputs.map((input) => input.value));
assert(switchedZones.includes('Жилые блоки') && !switchedZones.includes('Рабочие места') && !switchedZones.includes('Переговорные'), 'Full-form object switch retained incompatible functional zones');
await formObjectPage.locator('form.full-form select[name="region"]').selectOption('moskva');
await formObjectPage.locator('form.full-form input[name="phone"]').fill('+7 905 777 88 99');
await formObjectPage.locator('form.full-form input[name="consent"]').check();
await formObjectPage.locator('form.full-form button[type="submit"]').click();
await formObjectPage.locator('.form-status--success').waitFor();
assert(formObjectPost.includes('dorm') && formObjectPost.includes('Жилые блоки') && !formObjectPost.includes('Рабочие места') && !formObjectPost.includes('Переговорные'), 'Posted CRM contract combined the selected object with stale zones');
await formObjectContext.close();

const rootAttributionContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const rootAttributionPage = await rootAttributionContext.newPage();
await rootAttributionPage.goto(`${origin}/?utm_source=yandex&utm_campaign=root-test&yclid=abc123`, { waitUntil: 'networkidle' });
const rootAttribution = await rootAttributionPage.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-attribution-v1') || '{}'));
assert(rootAttribution.utm_source === 'yandex' && rootAttribution.utm_campaign === 'root-test' && rootAttribution.yclid === 'abc123', 'Root redirect discarded campaign attribution');
await rootAttributionContext.close();

const tenderSsr = await api.get('/modulnye-zdaniya/?mode=tender');
const tenderHtml = await tenderSsr.text();
assert(tenderHtml.includes('Название тендера') && !tenderHtml.includes('Стадия проекта'), 'Tender mode is not server-rendered on first response');

const viewports = [
  { name: 'desktop1440', width: 1440, height: 1000 },
  { name: 'tablet768', width: 768, height: 1024 },
  { name: 'mobile390', width: 390, height: 844 },
  { name: 'mobile320', width: 320, height: 568 }
];

for (const viewport of viewports) {
  results.viewports[viewport.name] = {};
  for (const route of primaryRoutes) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.width <= 768 });
    if (viewport.name === 'desktop1440' && route === primaryRoutes[0]) await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    const page = await context.newPage();
    monitor(page, `${viewport.name}:${route}`);
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    const state = await inspect(page);
    results.viewports[viewport.name][route] = state;
    assert(response?.status() === 200, `${viewport.name}:${route}: expected 200`);
    assert(state.textLength > 500 && !state.overlay, `${viewport.name}:${route}: blank page or error overlay`);
    assert(state.h1Count === 1 && state.h1Visible, `${viewport.name}:${route}: H1 missing`);
    assert(state.ctaVisible && state.ctaTop !== null && state.ctaTop < viewport.height, `${viewport.name}:${route}: primary CTA outside initial viewport`);
    assert(state.scrollWidth <= state.width, `${viewport.name}:${route}: horizontal overflow ${state.scrollWidth - state.width}px`);
    assert(state.brokenImages.length === 0, `${viewport.name}:${route}: broken images ${state.brokenImages.join(', ')}`);
    assert(state.intrinsicImageDefects.length === 0, `${viewport.name}:${route}: images without intrinsic dimensions`);
    assert(state.unlabeledControls.length === 0, `${viewport.name}:${route}: unlabeled controls ${state.unlabeledControls.join(', ')}`);
    assert(state.title && state.description && state.ogTitle && state.ogImage, `${viewport.name}:${route}: incomplete metadata`);
    assert(['Organization', 'ProfessionalService', 'Service', 'BreadcrumbList', 'FAQPage'].every((type) => state.structured.includes(type)), `${viewport.name}:${route}: incomplete structured data`);

    if (viewport.name === 'desktop1440' || viewport.name === 'mobile390' || (route === primaryRoutes[0] && viewport.name === 'mobile320')) await primeLazyImages(page);
    if (viewport.name === 'desktop1440') await page.screenshot({ path: resolve(output, route === primaryRoutes[0] ? 'desktop-1440.png' : `route-${route.split('/').filter(Boolean)[0]}-desktop.png`), fullPage: true });
    if (viewport.name === 'mobile390') {
      const routeSlug = route.split('/').filter(Boolean)[0];
      await page.screenshot({ path: resolve(output, route === primaryRoutes[0] ? 'mobile-390.png' : `route-${routeSlug}-mobile-full.png`), fullPage: true });
    }
    if (viewport.name === 'desktop1440' || viewport.name === 'mobile390') {
      const routeSlug = route.split('/').filter(Boolean)[0];
      const story = page.locator('.route-visuals__workspace');
      const tabs = story.locator('.route-visuals__tabs button');
      await story.scrollIntoViewIfNeeded();
      await tabs.last().click();
      const finalImage = story.locator('.route-visuals__visual img');
      await finalImage.waitFor({ state: 'visible' });
      await finalImage.evaluate((image) => image.complete && image.naturalWidth > 0
        ? true
        : new Promise((resolve) => image.addEventListener('load', () => resolve(true), { once: true })));
      const finalState = await finalImage.evaluate((image) => ({
        src: image.getAttribute('src') ?? '',
        currentSrc: image.currentSrc,
        alt: image.getAttribute('alt') ?? '',
        stage: image.closest('.route-visuals__visual')?.getAttribute('data-active-stage') ?? ''
      }));
      results.routeFinals[`${viewport.name}:${route}`] = { count: await tabs.count(), ...finalState };
      assert(finalState.src.includes('-final-desktop.webp'), `${viewport.name}:${route}: story does not end in a distinct final asset`);
      assert(finalState.alt.length > 20, `${viewport.name}:${route}: final story image needs a descriptive alternative`);
      await page.locator('.skip-link').evaluate((element) => element.style.setProperty('display', 'none', 'important'));
      await story.screenshot({ path: resolve(output, `route-${routeSlug}-final-${viewport.name}.png`) });
    }
    if (route === primaryRoutes[0] && viewport.name === 'mobile320') await page.screenshot({ path: resolve(output, 'mobile-320.png'), fullPage: true });
    if (viewport.width <= 768) {
      const routeSlug = route.split('/').filter(Boolean)[0];
      await page.screenshot({ path: resolve(output, `hero-${routeSlug}-${viewport.name}.png`), fullPage: false });
    }
    if (viewport.width <= 390 && route === primaryRoutes[0]) {
      const toggle = page.locator('.mobile-menu-toggle');
      assert(await toggle.isVisible(), `${viewport.name}: mobile menu toggle not visible`);
      await toggle.click();
      assert(await page.locator('#mobile-menu').isVisible(), `${viewport.name}: mobile menu did not open`);
      await page.keyboard.press('Escape');
      assert(await toggle.evaluate((node) => document.activeElement === node), `${viewport.name}: menu focus did not return to trigger`);
    }
    if (viewport.name === 'desktop1440' && route === primaryRoutes[0]) await context.tracing.stop({ path: resolve(output, 'playwright-trace.zip') });
    await context.close();
  }
}

const uniqueTitles = new Set(Object.values(results.viewports.desktop1440).map((item) => item.title));
const uniqueH1 = new Set(Object.values(results.viewports.desktop1440).map((item) => item.h1));
assert(uniqueTitles.size === primaryRoutes.length, 'Primary routes must have unique titles');
assert(uniqueH1.size === primaryRoutes.length, 'Primary routes must have unique H1s');

const officeHtml = await (await api.get('/modulnye-ofisy-abk/')).text();
assert(officeHtml.includes('Эр Ликид Кузбасс') && officeHtml.includes('427 м²') && officeHtml.includes('28 модулей'), 'Office/ABK route does not expose the verified realized case');
const proofHtml = await (await api.get('/vahtovye-poselki/')).text();
assert(proofHtml.includes('обсерватор') && !proofHtml.includes('изолятор'), 'Kamchatka proof does not use the official obсерватор terminology');

for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
  results.focusOrder[viewport.name] = {};
  for (const mode of ['standard', 'tender', 'leasing']) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    monitor(page, `focus-${viewport.name}-${mode}`);
    await page.goto(`${origin}/modulnye-zdaniya/?mode=${mode}`, { waitUntil: 'networkidle' });
    await page.locator('form.full-form button[type="submit"]').click();
    await page.waitForTimeout(700);
    const focusState = await page.evaluate(() => {
      const active = document.activeElement;
      const rect = active?.getBoundingClientRect();
      return {
        name: active?.getAttribute('name') ?? '',
        inViewport: Boolean(rect && rect.top >= 0 && rect.bottom <= innerHeight),
        scrollY
      };
    });
    results.focusOrder[viewport.name][mode] = focusState;
    const expected = mode === 'tender' ? 'company' : 'objectType';
    assert(focusState.name === expected, `${viewport.name}:${mode}: empty form focused ${focusState.name || 'nothing'} instead of ${expected}`);
    assert(focusState.inViewport, `${viewport.name}:${mode}: first invalid field is outside the visible viewport after focus`);
    await context.close();
  }
}

const motionContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
await motionContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
const motionPage = await motionContext.newPage();
monitor(motionPage, 'motion');
await motionPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
const assembly = motionPage.locator('.assembly');
await assembly.screenshot({ path: resolve(output, 'start.png') });
await assembly.locator('.assembly__play').click();
await motionPage.waitForFunction(() => document.querySelector('.assembly')?.getAttribute('data-stage') === '2');
await assembly.screenshot({ path: resolve(output, 'mid.png') });
await motionPage.waitForFunction(() => document.querySelector('.assembly')?.getAttribute('data-stage') === '3');
await assembly.screenshot({ path: resolve(output, 'end.png') });
await assembly.locator('.assembly__play').click();
await motionPage.waitForFunction(() => document.querySelector('.assembly')?.getAttribute('data-stage') === '1');
await motionPage.locator('#project-brief').scrollIntoViewIfNeeded();
await motionPage.waitForTimeout(200);
const heroPausedStage = await assembly.getAttribute('data-stage');
await motionPage.waitForTimeout(1800);
assert(await assembly.getAttribute('data-stage') === heroPausedStage, 'Hero sequence continued while outside its viewport');

const bim = motionPage.locator('#bim');
const bimSequence = motionPage.locator('.bim__sequence');
await bim.scrollIntoViewIfNeeded();
await motionPage.waitForTimeout(250);
await bimSequence.screenshot({ path: resolve(output, 'bim-motion-start.png') });
await bim.locator('.bim__play').click();
await motionPage.waitForFunction(() => document.querySelector('.bim__sequence')?.getAttribute('data-stage') === '3', null, { timeout: 10_000 });
await bimSequence.screenshot({ path: resolve(output, 'bim-motion-mid.png') });
await motionPage.waitForFunction(() => document.querySelector('.bim__sequence')?.getAttribute('data-stage') === '6', null, { timeout: 12_000 });
await bimSequence.screenshot({ path: resolve(output, 'bim-motion-end.png') });
await bim.locator('.bim__play').click();
await motionPage.waitForFunction(() => document.querySelector('.bim__sequence')?.getAttribute('data-stage') === '1');
await motionPage.locator('h1').scrollIntoViewIfNeeded();
await motionPage.waitForTimeout(200);
const bimPausedStage = await motionPage.locator('.bim__sequence').getAttribute('data-stage');
await motionPage.waitForTimeout(1800);
assert(await motionPage.locator('.bim__sequence').getAttribute('data-stage') === bimPausedStage, 'BIM sequence continued while outside its viewport');
results.motion = { hero: { start: 0, mid: 2, end: 3, pausedOffscreenAt: Number(heroPausedStage) }, bim: { start: 0, mid: 3, end: 6, pausedOffscreenAt: Number(bimPausedStage) } };

const factory = motionPage.locator('#factory');
const factoryVisual = factory.locator('.factory__visual');
await factory.scrollIntoViewIfNeeded();
await motionPage.locator('.skip-link').evaluate((element) => element.style.setProperty('transform', 'translateY(-180%)', 'important'));
const factoryFrames = [];
for (const [name, index] of [['start', 0], ['mid', 3], ['end', 6]]) {
  await factory.locator('.factory__stages button').nth(index).evaluate((element) => element.click());
  await motionPage.waitForFunction((stage) => {
    const visual = document.querySelector('.factory__visual');
    const image = visual?.querySelector('img');
    return visual?.getAttribute('data-active-stage') === String(stage) && image?.complete && image.naturalWidth > 0;
  }, index);
  await motionPage.waitForTimeout(360);
  const path = resolve(output, `factory-motion-${name}.png`);
  await factoryVisual.screenshot({ path });
  factoryFrames.push({ name, stage: index, source: await factoryVisual.locator('img').getAttribute('src') });
}
results.motion.factory = { frames: factoryFrames, controlledByUser: true, loop: false };
await motionContext.tracing.stop({ path: resolve(output, 'motion-trace.zip') });
await motionContext.close();

const observedEvents = [];
const formContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await formContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
await formContext.exposeBinding('captureAModulEvent', (_, detail) => observedEvents.push(detail));
await formContext.addInitScript(() => {
  window.addEventListener('a-modul:analytics', (event) => window.captureAModulEvent(event.detail));
});
const formPage = await formContext.newPage();
monitor(formPage, 'forms');
await formPage.goto(`${origin}/modulnye-zdaniya/?utm_source=qa&utm_campaign=milestone-c&yclid=qa-yclid`, { waitUntil: 'networkidle' });

for (const selector of ['.hero__actions .button--primary', '.hero__actions .button--ghost']) {
  await formPage.locator(selector).evaluate((element) => {
    element.addEventListener('click', (event) => event.preventDefault(), { once: true });
    element.click();
  });
}
await formPage.locator('#project-brief select[name="objectType"]').selectOption('abk');
await formPage.locator('#project-brief input[name="workplaces"]').fill('120');
await formPage.locator('#project-brief select[name="region"]').selectOption('moskva');
await formPage.locator('#project-brief input[name="commissioning"]').fill('2026-12');
await formPage.locator('#project-brief button[type="submit"]').click();

await formPage.locator('#configurator .choice-grid--types button').nth(2).click();
await formPage.locator('#configurator .button').click();
await formPage.locator('#finder select').first().selectOption('far-east');
await formPage.locator('#finder .button').click();
await formPage.locator('#logistics .logistics__destinations button').first().click();
await formPage.waitForTimeout(550);
await formPage.locator('#bim .bim__stages button').last().click();
await formPage.locator('#factory .factory__stages button').last().click();
await formPage.locator('#price-scope').scrollIntoViewIfNeeded();
await formPage.waitForTimeout(300);
await formPage.locator('#price-scope .button').evaluate((element) => {
  element.addEventListener('click', (event) => event.preventDefault(), { once: true });
  element.click();
});
for (const selector of ['.site-footer a[href^="tel:"]', '.site-footer a[href^="mailto:"]']) {
  await formPage.locator(selector).evaluate((element) => {
    element.addEventListener('click', (event) => event.preventDefault(), { once: true });
    element.click();
  });
}
await formPage.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await formPage.waitForTimeout(300);

await formPage.locator('#full-brief').scrollIntoViewIfNeeded();
await formPage.locator('.skip-link').evaluate((element) => { element.style.visibility = 'hidden'; });
await formPage.locator('#full-brief').screenshot({ path: resolve(output, 'form-start.png') });
await formPage.locator('form.full-form input[name="personnelCount"]').fill('321');
await formPage.locator('form.full-form input[name="area"]').fill('123.45');
await formPage.locator('form.full-form input[name="desiredCommissioningDate"]').fill('2027-08');
await formPage.locator('form.full-form select[name="projectStage"]').selectOption('Идея');
await formPage.locator('form.full-form button[type="submit"]').click();
await formPage.locator('#full-brief').screenshot({ path: resolve(output, 'form-mid.png') });
assert(await formPage.locator('.form-status--error').isVisible(), 'Standard form validation state not visible');
assert(await formPage.locator('form.full-form input[name="personnelCount"]').inputValue() === '321', 'Client validation reset personnel count');
assert(await formPage.locator('form.full-form input[name="area"]').inputValue() === '123.45', 'Client validation reset area');
assert(await formPage.locator('form.full-form input[name="desiredCommissioningDate"]').inputValue() === '2027-08', 'Client validation reset commissioning date');
assert(await formPage.locator('form.full-form select[name="projectStage"]').inputValue() === 'Идея', 'Client validation reset project stage');
await formPage.locator('input[name="phone"]').fill('+7 900 000 00 00');
await formPage.locator('input[name="consent"]').check();
await formPage.locator('input[name="files[]"]').setInputFiles({ name: 'brief.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 QA') });
const standardSubmission = await submitFormAndRead(formPage);
const standardStatus = standardSubmission.status;
results.forms.standardResponse = standardSubmission.response;
assert(standardStatus.kind === 'success', `Standard form did not succeed: ${standardStatus.text}`);
await formPage.locator('#full-brief').screenshot({ path: resolve(output, 'form-end.png') });
const successCopy = standardStatus.kind === 'success' ? standardStatus.text : '';
assert(successCopy.includes('Заявка принята.') && successCopy.includes('Менеджер уточнит исходные данные.') && successCopy.includes('Предварительное КП подготовим в течение одного рабочего дня после получения необходимых вводных.'), 'Exact confirmed-success copy missing');

const attribution = await formPage.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-attribution-v1') || '{}'));
assert(attribution.utm_source === 'qa' && attribution.utm_campaign === 'milestone-c' && attribution.yclid === 'qa-yclid', 'UTM/yclid persistence failed');
assert(attribution.landing_variant === '/modulnye-zdaniya/', 'First-touch landing_variant was overwritten');
results.forms.standardSuccess = true;
results.forms.attribution = attribution;

await formPage.route('**/api/leads', (route) => route.continue({ headers: { ...route.request().headers(), 'x-a-modul-mock-result': 'failure' } }));
await formPage.goto(`${origin}/modulnye-zdaniya/?mode=leasing`, { waitUntil: 'networkidle' });
await formPage.locator('#full-brief').scrollIntoViewIfNeeded();
await formPage.locator('form.full-form select[name="objectType"]').selectOption('abk');
await formPage.locator('select[name="region"]').last().selectOption('moskva');
await formPage.locator('form.full-form input[name="personnelCount"]').fill('222');
await formPage.locator('form.full-form input[name="area"]').fill('456.78');
await formPage.locator('form.full-form input[name="desiredCommissioningDate"]').fill('2027-09');
await formPage.locator('form.full-form select[name="projectStage"]').selectOption('Есть проект');
await formPage.locator('form.full-form textarea[name="comment"]').fill('QA preserved comment');
await formPage.locator('input[name="phone"]').fill('+7 901 111 22 33');
await formPage.locator('input[name="consent"]').check();
await formPage.locator('input[name="files[]"]').setInputFiles({ name: 'failure-brief.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 QA') });
await formPage.locator('form.full-form button[type="submit"]').click();
await formPage.locator('.form-status--error').waitFor();
assert(await formPage.locator('input[name="phone"]').inputValue() === '+7 901 111 22 33', 'Server failure did not preserve form state');
assert(await formPage.locator('form.full-form input[name="personnelCount"]').inputValue() === '222', 'Server failure reset personnel count');
assert(await formPage.locator('form.full-form input[name="area"]').inputValue() === '456.78', 'Server failure reset area');
assert(await formPage.locator('form.full-form input[name="desiredCommissioningDate"]').inputValue() === '2027-09', 'Server failure reset commissioning date');
assert(await formPage.locator('form.full-form select[name="projectStage"]').inputValue() === 'Есть проект', 'Server failure reset project stage');
assert(await formPage.locator('form.full-form textarea[name="comment"]').inputValue() === 'QA preserved comment', 'Server failure reset comment');
assert(await formPage.locator('input[name="files[]"]').evaluate((input) => input.files?.length) === 1, 'Server failure cleared attachment');
await formPage.locator('#full-brief').screenshot({ path: resolve(output, 'leasing-error.png') });
assert(await formPage.locator('input[name="leasingInterest"]').isChecked(), 'Leasing intent not preselected');
results.forms.serverFailurePreservesState = true;
await formPage.unroute('**/api/leads');

await formPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await formPage.locator('input[type="checkbox"][name="tenderInvitation"]').click({ noWaitAfter: true });
await formPage.locator('input[name="tenderName"]').waitFor();
await formPage.waitForFunction(() => new URL(location.href).searchParams.get('mode') === 'tender');
assert(await formPage.locator('input[name="tenderName"]').isVisible(), 'Tender checkbox did not switch to the dedicated form');

await formPage.goto(`${origin}/modulnye-zdaniya/?mode=tender`, { waitUntil: 'networkidle' });
assert(await formPage.locator('input[name="tenderName"]').isVisible(), 'Tender mode did not switch fields');
await formPage.locator('#full-brief').screenshot({ path: resolve(output, 'tender.png') });
await formPage.locator('input[name="company"]').fill('QA');
await formPage.locator('input[name="tenderName"]').fill('QA tender');
await formPage.locator('input[name="deadline"]').fill('2026-09-30');
await formPage.locator('form.full-form select[name="region"]').selectOption('moskva');
await formPage.locator('input[name="phone"]').fill('+7 902 222 33 44');
await formPage.locator('input[name="consent"]').check();
const tenderSubmission = await submitFormAndRead(formPage);
const tenderStatus = tenderSubmission.status;
results.forms.tenderResponse = tenderSubmission.response;
assert(tenderStatus.kind === 'success', `Tender form did not succeed: ${tenderStatus.text}`);
results.forms.tenderSuccess = tenderStatus.kind === 'success';

await formPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await formPage.locator('form.full-form select[name="objectType"]').selectOption('abk');
await formPage.locator('form.full-form select[name="region"]').selectOption('moskva');
await formPage.locator('form.full-form input[name="personnelCount"]').fill('1.5');
await formPage.locator('form.full-form input[name="phone"]').fill('+7 903 333 44 55');
await formPage.locator('form.full-form input[name="consent"]').check();
await formPage.locator('form.full-form button[type="submit"]').click();
await formPage.locator('.form-status--error').waitFor();
assert(await formPage.locator('form.full-form input[name="personnelCount"]').getAttribute('aria-invalid') === 'true', 'Server personnelCount error not mapped to visible capacity field');
assert((await formPage.locator('#personnel-count-error').innerText()).length > 0, 'Mapped server capacity error is not visible');

await formPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await formPage.locator('form.full-form select[name="objectType"]').selectOption('abk');
await formPage.locator('form.full-form select[name="region"]').selectOption('moskva');
await formPage.locator('form.full-form input[name="personnelCount"]').fill('5');
await formPage.locator('form.full-form input[name="company"]').evaluate((input) => { input.value = 'C'.repeat(241); input.dispatchEvent(new Event('input', { bubbles: true })); });
await formPage.locator('form.full-form input[name="phone"]').fill('+7 903 333 44 55');
await formPage.locator('form.full-form textarea[name="comment"]').evaluate((input) => { input.value = 'X'.repeat(4001); input.dispatchEvent(new Event('input', { bubbles: true })); });
await formPage.locator('form.full-form input[name="consent"]').check();
await formPage.locator('form.full-form button[type="submit"]').click();
await formPage.locator('.form-status--error').waitFor();
for (const [name, errorId] of [['company', 'company-error'], ['comment', 'comment-error']]) {
  assert(await formPage.locator(`form.full-form [name="${name}"]`).getAttribute('aria-invalid') === 'true', `Server ${name} error is not programmatically exposed`);
  assert((await formPage.locator(`#${errorId}`).innerText()).length > 0, `Server ${name} error is not visibly described`);
}
await formPage.locator('#full-brief').screenshot({ path: resolve(output, 'server-validation.png') });

await formPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
await formPage.locator('form.full-form select[name="objectType"]').selectOption('abk');
await formPage.locator('form.full-form select[name="region"]').selectOption('moskva');
await formPage.locator('form.full-form input[name="personnelCount"]').fill('5');
await formPage.locator('form.full-form input[name="phone"]').fill('x');
await formPage.locator('form.full-form input[name="consent"]').check();
await formPage.locator('form.full-form button[type="submit"]').click();
assert(await formPage.locator('form.full-form input[name="phone"]').getAttribute('aria-invalid') === 'true', 'Client phone error is not programmatically exposed');
assert((await formPage.locator('#phone-error').innerText()).includes('10 до 15 цифр'), 'Client phone plausibility error is not visible');
assert(await formPage.locator('form.full-form input[name="phone"]').evaluate((input) => document.activeElement === input), 'Client phone error did not focus the invalid phone field');

await formPage.evaluate(() => {
  sessionStorage.setItem('a-modul-attribution-v1', JSON.stringify({
    utm_source: 'safe',
    route: '/modulnye-zdaniya/',
    name: 'Sensitive Name',
    phone: '123',
    email: 'secret@example.test',
    company: 'Secret Company',
    filename: 'secret.pdf',
    comment: 'private',
    arbitrary: 'poison'
  }));
});
await formPage.locator('.site-footer a[href^="tel:"]').evaluate((element) => {
  element.addEventListener('click', (event) => event.preventDefault(), { once: true });
  element.click();
});
const poisonedEvent = observedEvents.at(-1) ?? {};
for (const forbiddenKey of ['name', 'phone', 'email', 'company', 'filename', 'comment', 'arbitrary']) {
  assert(!(forbiddenKey in poisonedEvent), `Poisoned session attribution leaked ${forbiddenKey} into analytics`);
}
results.forms.poisonedAttributionSanitized = !['name', 'phone', 'email', 'company', 'filename', 'comment', 'arbitrary'].some((key) => key in poisonedEvent);

const requiredEvents = [
  'page_view', 'hero_brief_start', 'hero_brief_complete', 'object_type_select', 'capacity_select', 'region_select',
  'commissioning_date_select', 'configurator_start', 'configurator_complete', 'case_filter_change', 'case_open',
  'logistics_map_start', 'logistics_route_complete', 'bim_interaction_start', 'bim_interaction_complete',
  'production_sequence_start', 'production_sequence_complete', 'price_scope_open', 'leasing_click', 'tender_start',
  'tender_submit_success', 'form_start', 'file_attach', 'form_validation_error', 'form_submit_success',
  'form_submit_error', 'phone_click', 'email_click', 'scroll_50', 'scroll_90'
];
const eventNames = observedEvents.map((event) => event.event);
for (const event of requiredEvents) assert(eventNames.includes(event), `Required analytics event not emitted: ${event}`);
const serializedEvents = JSON.stringify(observedEvents);
for (const forbidden of ['+7 900 000 00 00', '+7 901 111 22 33', '+7 902 222 33 44', '+7 903 333 44 55', 'brief.pdf', 'QA tender']) {
  assert(!serializedEvents.includes(forbidden), `PII or filename leaked into analytics: ${forbidden}`);
}
results.forms.analyticsEvents = [...new Set(eventNames)];
await formContext.tracing.stop({ path: resolve(output, 'conversion-trace.zip') });
await formContext.close();

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const reducedPage = await reducedContext.newPage();
monitor(reducedPage, 'reduced-motion');
await reducedPage.goto(`${origin}/modulnye-zdaniya/`, { waitUntil: 'networkidle' });
const reducedState = await reducedPage.evaluate(() => ({
  scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  transition: getComputedStyle(document.querySelector('.assembly__plate')).transitionDuration,
  heroStage: document.querySelector('.assembly')?.getAttribute('data-stage'),
  bimStage: document.querySelector('.bim__sequence')?.getAttribute('data-stage')
}));
results.reducedMotion = reducedState;
assert(reducedState.scrollBehavior === 'auto', 'Reduced motion must disable smooth scrolling');
assert(reducedState.heroStage === '3' && reducedState.bimStage === '6', 'Reduced motion must expose the completed Hero and BIM states');
await reducedPage.locator('.assembly').scrollIntoViewIfNeeded();
await reducedPage.locator('.assembly').screenshot({ path: resolve(output, 'reduced-motion-hero.png') });
await reducedPage.locator('#bim').scrollIntoViewIfNeeded();
await reducedPage.locator('.bim__plate.visible img').waitFor({ state: 'visible' });
await reducedPage.locator('.bim__sequence').screenshot({ path: resolve(output, 'reduced-motion-bim.png') });
await reducedContext.close();

const sitemap = await api.get('/sitemap.xml');
const sitemapText = await sitemap.text();
const sitemapLocs = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
results.seo.sitemapLocs = sitemapLocs;
assert(sitemap.status() === 200 && sitemapLocs.length === 4, 'Sitemap must expose exactly four primary routes');
assert(sitemapLocs.every((loc) => !loc.includes('?')) && primaryRoutes.every((route) => sitemapLocs.some((loc) => loc.endsWith(route))), 'Sitemap contains a query or misses a primary route');
const robots = await api.get('/robots.txt');
const robotsText = await robots.text();
assert(robots.status() === 200 && robotsText.includes('Sitemap:'), 'robots.txt invalid');
const privacy = await api.get('/privacy-policy/');
assert(privacy.status() === 200, 'Privacy route must return 200');
const missing = await api.get('/definitely-missing-route/');
assert(missing.status() === 404, 'Missing route must return 404');

const invalidStandard = await api.post('/api/leads', {
  multipart: {
    mode: 'standard', objectType: '<script>', capacityMetric: 'bogus', personnelCount: '12',
    region: 'outer-space', projectStage: 'already promised', phone: 'x', consent: 'on',
    typeVariant: 'poison', regionSlug: 'moon', landing_variant: 'type:poison'
  }
});
assert(invalidStandard.status() === 422, `Invalid standard taxonomy expected 422, received ${invalidStandard.status()}`);
const invalidTender = await api.post('/api/leads', {
  multipart: {
    mode: 'tender', tenderInvitation: 'true', company: 'QA', tenderName: 'QA tender',
    deadline: 'not-a-date', region: 'moon', phone: 'x', consent: 'on'
  }
});
assert(invalidTender.status() === 422, `Invalid tender taxonomy expected 422, received ${invalidTender.status()}`);
results.forms.invalidPayloads = { standard: invalidStandard.status(), tender: invalidTender.status() };

await api.dispose();
await browser.close();

async function createDiff(startName, endName, outputName) {
  const startPath = resolve(output, startName);
  const endPath = resolve(output, endName);
  const [startMeta, endMeta] = await Promise.all([sharp(startPath).metadata(), sharp(endPath).metadata()]);
  const diffWidth = Math.max(startMeta.width ?? 0, endMeta.width ?? 0);
  const diffHeight = Math.max(startMeta.height ?? 0, endMeta.height ?? 0);
  const normalizeForDiff = async (path, metadata) => sharp(path)
    .extend({
      right: diffWidth - (metadata.width ?? diffWidth),
      bottom: diffHeight - (metadata.height ?? diffHeight),
      background: { r: 0, g: 0, b: 0 }
    })
    .png()
    .toBuffer();
  const [startDiffBase, endDiffLayer] = await Promise.all([
    normalizeForDiff(startPath, startMeta),
    normalizeForDiff(endPath, endMeta)
  ]);
  await sharp(startDiffBase)
    .composite([{ input: endDiffLayer, blend: 'difference' }])
    .png()
    .toFile(resolve(output, outputName));
}

await createDiff('start.png', 'end.png', 'diff-start-end.png');
await createDiff('bim-motion-start.png', 'bim-motion-end.png', 'diff-bim-start-end.png');
await createDiff('factory-motion-start.png', 'factory-motion-end.png', 'diff-factory-start-end.png');
await createDiff('form-start.png', 'form-end.png', 'diff-form-start-end.png');

const reducedPaths = ['reduced-motion-hero.png', 'reduced-motion-bim.png'].map((name) => resolve(output, name));
const reducedMetadata = await Promise.all(reducedPaths.map((path) => sharp(path).metadata()));
const reducedWidth = Math.max(...reducedMetadata.map((metadata) => metadata.width ?? 390));
const reducedGap = 12;
const reducedHeight = reducedMetadata.reduce((total, metadata) => total + (metadata.height ?? 1), reducedGap);
const reducedBuffers = await Promise.all(reducedPaths.map((path) => sharp(path).png().toBuffer()));
await sharp({ create: { width: reducedWidth, height: reducedHeight, channels: 3, background: { r: 23, g: 22, b: 26 } } })
  .composite(reducedBuffers.map((input, index) => ({ input, left: 0, top: index === 0 ? 0 : (reducedMetadata[0].height ?? 1) + reducedGap })))
  .png()
  .toFile(resolve(output, 'reduced-motion.png'));

const statePaths = ['form-start.png', 'form-mid.png', 'form-end.png'].map((name) => resolve(output, name));
const stateMetadata = await Promise.all(statePaths.map((path) => sharp(path).metadata()));
const stateWidth = 480;
const stateHeights = stateMetadata.map((metadata) => Math.round((metadata.height ?? 1) * stateWidth / (metadata.width ?? stateWidth)));
const stateHeight = Math.max(...stateHeights);
const stateBuffers = await Promise.all(statePaths.map((path, index) => sharp(path)
  .resize({ width: stateWidth })
  .extend({ bottom: stateHeight - stateHeights[index], background: { r: 20, g: 17, b: 22 } })
  .webp({ quality: 82 })
  .toBuffer()));
await sharp({ create: { width: stateWidth * 3, height: stateHeight, channels: 3, background: { r: 20, g: 17, b: 22 } } })
  .composite(stateBuffers.map((input, index) => ({ input, left: index * stateWidth, top: 0 })))
  .webp({ quality: 84 })
  .toFile(resolve(output, 'form-states.webp'));

assert(runtimeDefects.consoleErrors.length === 0, `Console errors: ${runtimeDefects.consoleErrors.join(' | ')}`);
assert(runtimeDefects.consoleWarnings.length === 0, `Console warnings: ${runtimeDefects.consoleWarnings.join(' | ')}`);
assert(runtimeDefects.pageErrors.length === 0, `Page errors: ${runtimeDefects.pageErrors.join(' | ')}`);
assert(runtimeDefects.failedRequests.length === 0, `Failed requests: ${runtimeDefects.failedRequests.join(' | ')}`);

const report = {
  generatedAt: new Date().toISOString(),
  origin,
  pass: assertions.length === 0,
  assertions,
  runtimeDefects,
  expectedFailureSignals,
  results
};
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ pass: report.pass, assertions: report.assertions, runtimeDefects, generatedAt: report.generatedAt }, null, 2));
if (!report.pass) process.exitCode = 1;
