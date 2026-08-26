import { chromium, request } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const target = process.argv[2] ?? 'http://127.0.0.1:5175/modulnye-zdaniya/';
const output = resolve('reviews', 'a-modul-v2', 'milestone-b');
await mkdir(output, { recursive: true });

const assertions = [];
const runtimeDefects = { consoleErrors: [], pageErrors: [], failedRequests: [] };
const viewportResults = {};
const browser = await chromium.launch({ headless: true });

const requiredSections = ['#configurator', '#risk', '#logistics', '#finder', '#bim', '#factory', '#price-scope', '#case', '#seismic'];

function assert(condition, message) {
  if (!condition) assertions.push(message);
}

function monitor(page, name) {
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeDefects.consoleErrors.push(`${name}: ${message.text()}`);
  });
  page.on('pageerror', (error) => runtimeDefects.pageErrors.push(`${name}: ${error.message}`));
  page.on('requestfailed', (failed) => {
    const errorText = failed.failure()?.errorText ?? 'unknown';
    if (errorText.includes('ERR_ABORTED')) return;
    runtimeDefects.failedRequests.push(`${name}: ${failed.method()} ${failed.url()} — ${errorText}`);
  });
}

async function hydrateAll(page) {
  for (const selector of requiredSections) {
    await page.locator(selector).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(120);
  }
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
}

async function captureElement(page, selector, filename) {
  await page.locator('.skip-link').evaluate((element) => { element.style.visibility = 'hidden'; });
  await page.locator(selector).screenshot({ path: resolve(output, filename) });
  await page.locator('.skip-link').evaluate((element) => { element.style.visibility = ''; });
}

async function inspect(page) {
  return page.evaluate((sectionSelectors) => {
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
    const qualifier = document.querySelector('.hero__cta-note');
    const brokenImages = Array.from(document.images).filter((image) => image.complete && (image.naturalWidth === 0 || image.naturalHeight === 0)).map((image) => image.currentSrc || image.src);
    const intrinsicImageDefects = Array.from(document.images).filter((image) => !image.hasAttribute('width') || !image.hasAttribute('height')).map((image) => image.currentSrc || image.src);
    const missingLabels = Array.from(document.querySelectorAll('input, select, textarea'))
      .filter((control) => control.getAttribute('type') !== 'hidden')
      .filter((control) => !control.closest('label') && !(control.id && document.querySelector(`label[for="${control.id}"]`)) && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby'))
      .map((control) => `${control.tagName.toLowerCase()}[name="${control.getAttribute('name') ?? ''}"]`);
    const smallTargets = Array.from(document.querySelectorAll('a, button, input, select'))
      .filter((element) => visible(element))
      .filter((element) => !element.matches('input[type="radio"], input[type="checkbox"]'))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 44 || rect.height < 44)
      .map(({ element, rect }) => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 48) ?? '', width: rect.width, height: rect.height }));
    const finderVisual = document.querySelector('.finder__visual');
    const finderDisclosure = finderVisual?.querySelector('.visualization-label');
    const color = (value) => value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
    const luminance = (rgb) => {
      const channels = rgb.map((value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const ctaStyle = primaryCta ? getComputedStyle(primaryCta) : null;
    const ctaContrast = ctaStyle ? (() => {
      const foreground = luminance(color(ctaStyle.color));
      const background = luminance(color(ctaStyle.backgroundColor));
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    })() : 0;
    return {
      viewport: { width: innerWidth, height: innerHeight, clientWidth: document.documentElement.clientWidth },
      scrollWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      h1Count: document.querySelectorAll('h1').length,
      h1Visible: visible(h1),
      h1Box: box(h1),
      primaryCtaVisible: visible(primaryCta),
      primaryCtaBox: box(primaryCta),
      qualifierVisible: visible(qualifier),
      qualifierBox: box(qualifier),
      qualifierText: qualifier?.textContent?.trim() ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      brokenImages,
      intrinsicImageDefects,
      missingLabels,
      smallTargets,
      sections: Object.fromEntries(sectionSelectors.map((selector) => [selector, visible(document.querySelector(selector))])),
      priceRows: document.querySelectorAll('.price-scope__matrix .matrix__row').length,
      priceHeaderVisible: visible(document.querySelector('.matrix__head')),
      visualizationLabels: document.querySelectorAll('.visualization-label').length,
      finderDisclosure: { visual: box(finderVisual), label: box(finderDisclosure), parentClass: finderDisclosure?.parentElement?.className ?? '' },
      ctaContrast
    };
  }, requiredSections);
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
  if (config.name === 'desktop1440') await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  monitor(page, config.name);
  const response = await page.goto(target, { waitUntil: 'networkidle' });
  assert(response?.status() === 200, `${config.name}: route status ${response?.status() ?? 'missing'}`);
  const initial = await inspect(page);
  assert(initial.h1Count === 1 && initial.h1Visible, `${config.name}: expected one visible H1`);
  assert(initial.primaryCtaVisible && initial.primaryCtaBox?.top < config.height, `${config.name}: primary CTA outside initial viewport`);
  assert(initial.qualifierVisible && initial.qualifierBox?.top < config.height, `${config.name}: CTA qualifier outside initial viewport`);
  assert(initial.qualifierText === 'После получения основных исходных данных.', `${config.name}: CTA qualifier is not exact`);
  assert(initial.canonical === 'https://a-modul.ru/modulnye-zdaniya/', `${config.name}: canonical ${initial.canonical}`);

  await hydrateAll(page);
  const metrics = await inspect(page);
  viewportResults[config.name] = { initial, hydrated: metrics };
  assert(metrics.scrollWidth <= metrics.viewport.clientWidth, `${config.name}: horizontal overflow ${metrics.scrollWidth} > ${metrics.viewport.clientWidth}`);
  assert(metrics.brokenImages.length === 0, `${config.name}: broken images ${metrics.brokenImages.join(', ')}`);
  assert(metrics.intrinsicImageDefects.length === 0, `${config.name}: missing intrinsic image sizes ${metrics.intrinsicImageDefects.join(', ')}`);
  assert(metrics.missingLabels.length === 0, `${config.name}: unlabeled controls ${metrics.missingLabels.join(', ')}`);
  assert(metrics.smallTargets.length === 0, `${config.name}: targets below 44px ${JSON.stringify(metrics.smallTargets)}`);
  assert(Object.values(metrics.sections).every(Boolean), `${config.name}: missing milestone sections ${JSON.stringify(metrics.sections)}`);
  assert(metrics.priceRows === 9, `${config.name}: price matrix row count ${metrics.priceRows}`);
  if (config.width <= 820) assert(!metrics.priceHeaderVisible, `${config.name}: duplicate mobile price header is visible`);
  assert(metrics.visualizationLabels >= 4, `${config.name}: generated visual disclosures missing`);
  assert(metrics.finderDisclosure.parentClass === 'finder__visual', `${config.name}: finder disclosure is not attached to image wrapper`);
  assert(metrics.finderDisclosure.label && metrics.finderDisclosure.visual && metrics.finderDisclosure.label.bottom <= metrics.finderDisclosure.visual.bottom && metrics.finderDisclosure.label.left >= metrics.finderDisclosure.visual.left && metrics.finderDisclosure.label.right <= metrics.finderDisclosure.visual.right, `${config.name}: finder disclosure escapes image ${JSON.stringify(metrics.finderDisclosure)}`);
  assert(metrics.ctaContrast >= 4.5, `${config.name}: primary CTA contrast ${metrics.ctaContrast.toFixed(2)}:1`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: resolve(output, config.screenshot), fullPage: true });

  if (config.name === 'desktop1440') {
    await page.locator('.hero__actions .button--ghost').click();
    await page.waitForURL(/mode=tender/);
    assert(await page.locator('.brief__mode').isVisible(), 'tender: actual hero CTA did not switch the mounted brief mode');
    assert(await page.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-configurator') ?? '{}').mode) === 'tender', 'tender: mode missing from single shared payload');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('.hero__actions .button--primary').click();
    await page.waitForURL(/mode=standard/);
    assert((await page.locator('.brief__mode').count()) === 0, 'standard: primary hero CTA inherited tender mode');
    assert(await page.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-configurator') ?? '{}').mode) === 'standard', 'standard: explicit primary intent did not reset shared mode');

    await page.locator('.assembly__play').click();
    assert(await page.locator('.assembly__play').evaluate((button) => document.activeElement === button), 'hero autoplay: focus did not remain on the operable stop control');
    await page.locator('.assembly__play').click();

    await page.locator('.choice-grid--types button').nth(2).click();
    await page.locator('.choice-grid--capacity button').last().click();
    await page.locator('.configurator__custom input').fill('420');
    await page.locator('.configurator__region select').selectOption('siberia');
    await page.locator('.zone-grid label').first().click();
    await page.locator('.choice-grid--capacity button.active').focus();
    const activeChoiceFocus = await page.locator('.choice-grid--capacity button.active').evaluate((button) => getComputedStyle(button).boxShadow);
    assert(activeChoiceFocus.includes('6px') && activeChoiceFocus.includes('rgb(23, 22, 26)'), `focus: selected light-surface choice lost outer graphite ring ${activeChoiceFocus}`);
    const configuratorPayload = await page.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-configurator') ?? '{}'));
    assert(configuratorPayload.objectType === 'abk' && configuratorPayload.metric === 'workplaces' && configuratorPayload.capacity === 'custom' && configuratorPayload.customCapacity === '420' && configuratorPayload.region === 'siberia', `configurator: invalid typed carry-forward ${JSON.stringify(configuratorPayload)}`);
    assert((await page.locator('.logistics__result h3').textContent())?.includes('Сибирь'), 'handoff: configurator region did not update logistics immediately');
    await page.locator('.configurator__output .button').click();
    assert(await page.locator('.brief__form select[name="objectType"]').inputValue() === 'abk', 'handoff: object type did not reach diagnosis');
    assert(await page.locator('.brief__form input[name="workplaces"]').inputValue() === '420', 'handoff: capacity and metric did not reach diagnosis');
    assert(await page.locator('.brief__form select[name="region"]').inputValue() === 'siberia', 'handoff: region did not reach diagnosis');
    await captureElement(page, '#configurator', 'configurator-output.png');

    const typeSemantics = [
      { index: 0, term: 'Численность', unit: 'человек' },
      { index: 1, term: 'Численность', unit: 'человек' },
      { index: 2, term: 'Рабочие места', unit: 'рабочих мест' },
      { index: 3, term: 'Площадь', unit: 'м²' }
    ];
    for (const expected of typeSemantics) {
      await page.locator('.choice-grid--types button').nth(expected.index).click();
      const output = await page.locator('.configurator__output dl div').first().textContent();
      assert(output?.includes(expected.term) && output?.includes(expected.unit), `configurator: invalid type metric at index ${expected.index}: ${output}`);
    }
    await page.getByRole('button', { name: 'Персонал', exact: true }).click();
    assert((await page.locator('.configurator__output dl div').first().textContent())?.includes('человек'), 'configurator: generic building personnel basis missing');
    for (const label of await page.locator('.zone-grid label').all()) await label.click();
    assert((await page.locator('.output__missing').textContent())?.includes('функциональный состав'), 'configurator: empty composition is not surfaced as missing');
    await page.locator('.choice-grid--types button').nth(2).click();
    await page.locator('.choice-grid--capacity button').last().click();
    await page.locator('.configurator__custom input').fill('420');
    await page.locator('.configurator__region select').selectOption('siberia');

    await page.locator('.risk__chain button').first().focus();
    await page.keyboard.press('ArrowRight');
    assert(await page.locator('.risk__chain button').nth(1).getAttribute('aria-selected') === 'true', 'risk: ArrowRight did not move the active tab');
    for (let index = 0; index < 9; index += 1) await page.locator('.risk__chain button').nth(index).click();
    assert((await page.locator('.risk__chain button[aria-selected="true"]').count()) === 1, 'risk: active tab is not unique');
    assert((await page.locator('#risk-panel').getAttribute('aria-labelledby'))?.startsWith('risk-tab-'), 'risk: tabpanel relationship missing');
    await captureElement(page, '#risk', 'risk-active.png');

    await page.getByRole('button', { name: 'Дальний Восток', exact: true }).click();
    assert((await page.locator('.logistics__result h3').textContent())?.includes('Дальний Восток'), 'logistics: selected destination not reflected');
    assert(await page.locator('.configurator__region select').inputValue() === 'far-east', 'handoff: logistics region did not update configurator');
    assert(await page.locator('.brief__form select[name="region"]').inputValue() === 'far-east', 'handoff: logistics region did not update diagnosis');
    await page.waitForTimeout(1300);
    await captureElement(page, '#logistics', 'logistics-route.png');

    await page.locator('.finder__filters label').nth(0).locator('select').selectOption('far-east');
    await page.locator('.finder__filters label').nth(1).locator('select').selectOption('mining');
    await page.locator('.finder__filters label').nth(2).locator('select').selectOption('shift');
    await page.locator('.finder__filters label').nth(4).locator('select').selectOption('seismic');
    await page.locator('.finder__filters label').nth(5).locator('select').selectOption('mixed');
    assert((await page.locator('.finder__case-copy h3').textContent())?.includes('Вахтовый посёлок'), 'finder: verified exact analogue missing');
    assert((await page.locator('.finder__difference').textContent())?.includes('тип поставки'), 'finder: unpublished delivery taxonomy was treated as an exact fact');
    await page.locator('.finder__filters label').nth(1).locator('select').selectOption('energy');
    assert((await page.locator('.finder__difference').textContent())?.includes('отрасль'), 'finder: no-match difference is not explicit');
    await captureElement(page, '#finder', 'finder-filtered.png');

    await page.locator('.bim__stages button').nth(0).click();
    await page.locator('.bim__play').click();
    assert(await page.locator('.bim__play').evaluate((button) => document.activeElement === button), 'bim autoplay: focus did not remain on the operable stop control');
    for (let stage = 1; stage < 7; stage += 1) {
      await page.waitForTimeout(1650);
      const liveStage = await page.locator('.bim__sequence').getAttribute('data-stage');
      assert(liveStage === String(stage), `bim: expected autoplay stage ${stage}, received ${liveStage}`);
    }
    await page.waitForTimeout(800);
    assert((await page.locator('.bim__sequence').getAttribute('data-stage')) === '6', 'bim: final state did not hold');
    await page.locator('.bim__stages button').nth(0).click();
    await page.waitForTimeout(400);
    await captureElement(page, '.bim__sequence', 'bim-start.png');
    await page.locator('.bim__stages button').nth(3).click();
    await page.waitForTimeout(400);
    await captureElement(page, '.bim__sequence', 'bim-mid.png');
    await page.locator('.bim__stages button').nth(6).click();
    await page.waitForTimeout(400);
    await captureElement(page, '.bim__sequence', 'bim-end.png');

    assert((await page.locator('.factory__stages button').allTextContents()).map((text) => text.replace(/^\d+/, '').trim()).join('|') === 'Металл|Каркас|Ограждение|Инженерия|Отделка|Контроль качества|Отгрузка', 'factory: required seven-stage sequence is incomplete');
    await page.locator('.factory__stages button').first().focus();
    await page.keyboard.press('End');
    assert(await page.locator('.factory__stages button').last().getAttribute('aria-selected') === 'true', 'factory: End did not move to final tab');
    for (let index = 0; index < 7; index += 1) await page.locator('.factory__stages button').nth(index).click();
    assert((await page.locator('.factory__stages button[aria-selected="true"]').count()) === 1, 'factory: active stage is not unique');
    assert((await page.locator('#factory-panel').getAttribute('aria-labelledby'))?.startsWith('factory-tab-'), 'factory: tabpanel relationship missing');
    await captureElement(page, '#factory', 'factory-stage.png');
    await captureElement(page, '#price-scope', 'price-scope.png');
    await captureElement(page, '#case', 'dominant-case.png');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('.hero__actions .button--ghost').click();
    await page.locator('.brief__form input[name="workplaces"]').fill('125');
    await page.locator('.brief__form input[name="commissioning"]').fill('2027-09');
    let persistedContext = await page.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-configurator') ?? '{}'));
    assert(persistedContext.mode === 'tender' && persistedContext.commissioning === '2027-09', `tender: valid context not persisted ${JSON.stringify(persistedContext)}`);
    await page.locator('.brief__form input[name="commissioning"]').fill('');
    await page.getByRole('button', { name: 'Урал', exact: true }).click();
    assert(await page.locator('.brief__form input[name="commissioning"]').inputValue() === '', 'commissioning: unrelated region change resurrected cleared month');
    persistedContext = await page.evaluate(() => JSON.parse(sessionStorage.getItem('a-modul-configurator') ?? '{}'));
    assert(persistedContext.commissioning === '', `commissioning: cleared month remains stale in payload ${JSON.stringify(persistedContext)}`);
    await page.goto(target, { waitUntil: 'networkidle' });
    assert(await page.locator('.brief__mode').isVisible(), 'tender: persisted mode disappeared on base navigation/reload');
    assert(await page.locator('.brief__form input[name="commissioning"]').inputValue() === '', 'commissioning: cleared month returned after reload');
    await page.locator('.hero__actions .button--primary').click();
    await page.waitForURL(/mode=standard/);
    await page.locator('.brief__mode').waitFor({ state: 'detached' });
    assert((await page.locator('.brief__mode').count()) === 0, 'standard: explicit standard diagnosis did not clear persisted tender mode');

    await page.locator('.brief__form select[name="objectType"]').selectOption('');
    await page.locator('.brief__form input[name="workplaces"]').fill('');
    await page.locator('.brief__form select[name="region"]').selectOption('');
    await page.locator('.brief__form input[name="commissioning"]').fill('');
    await page.locator('.brief__form button[type="submit"]').click();
    for (const selector of ['select[name="objectType"]', 'input[name="workplaces"]', 'select[name="region"]', 'input[name="commissioning"]']) {
      const control = page.locator(`.brief__form ${selector}`);
      assert(await control.getAttribute('aria-invalid') === 'true', `brief errors: ${selector} is not marked invalid`);
      const describedBy = await control.getAttribute('aria-describedby');
      assert(Boolean(describedBy) && Boolean((await page.locator(`#${describedBy}`).textContent())?.trim()), `brief errors: ${selector} lacks a persistent associated message`);
    }

    await context.tracing.stop({ path: resolve(output, 'playwright-trace.zip') });
  }
  await context.close();
}

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', reducedMotion: 'reduce', hasTouch: true });
const reducedPage = await reducedContext.newPage();
monitor(reducedPage, 'reduced390');
const reducedResponse = await reducedPage.goto(target, { waitUntil: 'networkidle' });
assert(reducedResponse?.status() === 200, `reduced390: route status ${reducedResponse?.status() ?? 'missing'}`);
await reducedPage.locator('#bim').evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
const reducedState = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  heroStage: document.querySelector('.assembly')?.getAttribute('data-stage'),
  bimStage: document.querySelector('.bim__sequence')?.getAttribute('data-stage'),
  bimLabel: document.querySelector('.bim__play')?.textContent?.trim() ?? '',
  routeAnimation: getComputedStyle(document.querySelector('.map__route')).animationDuration,
  plateTransition: getComputedStyle(document.querySelector('.bim__plate')).transitionDuration
}));
assert(reducedState.preference, 'reduced390: media preference missing');
assert(reducedState.heroStage === '3', `reduced390: hero conclusion missing ${JSON.stringify(reducedState)}`);
assert(reducedState.bimStage === '6' && reducedState.bimLabel.includes('Итог показан'), `reduced390: BIM conclusion incomplete ${JSON.stringify(reducedState)}`);
assert(Number.parseFloat(reducedState.routeAnimation) < 0.01 && Number.parseFloat(reducedState.plateTransition) < 0.01, `reduced390: motion not collapsed ${JSON.stringify(reducedState)}`);
await captureElement(reducedPage, '.bim__sequence', 'reduced-motion.png');
await reducedContext.close();

const api = await request.newContext();
const rootResponse = await api.get(new URL('/', target).toString(), { maxRedirects: 0 });
const rootRedirect = { status: rootResponse.status(), location: rootResponse.headers().location ?? null };
assert([301, 302, 303, 307, 308].includes(rootRedirect.status), `root: expected redirect, received ${rootRedirect.status}`);
assert(rootRedirect.location === '/modulnye-zdaniya/', `root: unexpected redirect ${rootRedirect.location}`);
await api.dispose();
await browser.close();

await sharp(resolve(output, 'bim-start.png')).composite([{ input: resolve(output, 'bim-end.png'), blend: 'difference' }]).png().toFile(resolve(output, 'diff-bim-start-end.png'));

assert(runtimeDefects.consoleErrors.length === 0, `console errors: ${runtimeDefects.consoleErrors.join(' | ')}`);
assert(runtimeDefects.pageErrors.length === 0, `page errors: ${runtimeDefects.pageErrors.join(' | ')}`);
assert(runtimeDefects.failedRequests.length === 0, `failed requests: ${runtimeDefects.failedRequests.join(' | ')}`);

const results = {
  milestone: 'B',
  target,
  capturedAt: new Date().toISOString(),
  rootRedirect,
  viewportResults,
  reducedMotion: reducedState,
  runtimeDefects,
  assertions,
  pass: assertions.length === 0
};
await writeFile(resolve(output, 'qa-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
if (assertions.length > 0) process.exitCode = 1;
