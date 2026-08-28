import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.A_MODUL_URL || 'http://127.0.0.1:5175/modulnye-zdaniya/';
const evidenceDir = path.resolve('reviews/a-modul-v2/visual-simplification');
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
const routeResults = [];

async function verifyViewport(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  if (!response?.ok()) throw new Error(`${width}px route status: ${response?.status()}`);
  await page.locator('h1').waitFor({ state: 'visible' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);

  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
    h1Visible: Boolean(document.querySelector('h1')?.getBoundingClientRect().height),
    ctaVisible: Boolean(document.querySelector('.hero__actions .button')?.getBoundingClientRect().height),
    forbidden: ['.assembly__hud', '.assembly__stages', '.assembly__caption', '.assembly__structure', '.assembly__measure', '.hero__context', '.logistics', '.finder', '.factory', '.dominant-case']
      .filter((selector) => document.querySelector(selector)),
    heroPlates: document.querySelectorAll('.assembly__plate').length,
    visibleLabels: [...document.querySelectorAll('.visualization-label')].filter((node) => getComputedStyle(node).display !== 'none').length,
    fullBriefDefault: getComputedStyle(document.querySelector('#full-brief')).display
  }));

  if (state.overflow > 1) throw new Error(`${width}px horizontal overflow: ${state.overflow}`);
  if (state.brokenImages.length) throw new Error(`${width}px broken images: ${state.brokenImages.join(', ')}`);
  if (!state.h1Visible || !state.ctaVisible) throw new Error(`${width}px hero content is not visible`);
  if (state.forbidden.length) throw new Error(`${width}px forbidden blocks remain: ${state.forbidden.join(', ')}`);
  if (state.heroPlates !== 4) throw new Error(`${width}px hero has ${state.heroPlates} plates instead of 4`);
  if (state.visibleLabels) throw new Error(`${width}px visual labels remain visible`);
  if (state.fullBriefDefault !== 'none') throw new Error(`${width}px full form is still in the normal page flow`);
  if (errors.length) throw new Error(`${width}px browser errors: ${errors.join(' | ')}`);

  if (width === 1440) {
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(100);
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    if (!heroBox) throw new Error('Hero was not rendered');
    const range = Math.max((await hero.evaluate((node) => node.offsetHeight)) - height, 1);
    const progress = [];
    const stageStates = [];
    const opacityStates = [];
    for (const [index, ratio] of [0, .25, .5, .75, 1].entries()) {
      await page.evaluate(({ top, offset }) => window.scrollTo(0, top + offset), { top: heroBox.y, offset: range * ratio });
      await page.waitForTimeout(90);
      progress.push(Number(await page.locator('.assembly').getAttribute('data-progress')));
      stageStates.push(Number(await page.locator('.assembly').getAttribute('data-stage')));
      opacityStates.push(await page.locator('.assembly__plate').evaluateAll((plates) => plates.map((plate) => Number(getComputedStyle(plate).opacity))));
      if (index === 0 || index === 2 || index === 4) {
        await page.screenshot({ path: path.join(evidenceDir, `hero-${index === 0 ? 'start' : index === 2 ? 'mid' : 'end'}-1440.png`) });
      }
    }
    if (progress.some((value, index) => index && value < progress[index - 1])) throw new Error(`Hero progress is not monotonic: ${progress.join(', ')}`);
    if (progress.at(-1) - progress[0] < 80) throw new Error(`Hero reveal range is too small: ${progress.join(', ')}`);
    if (![0, 1, 2, 3].every((stage) => stageStates.includes(stage))) throw new Error(`Not all hero stages are reached: stages=${stageStates.join(', ')} progress=${progress.join(', ')}`);
    if (opacityStates[2].filter((opacity) => opacity > .05).length !== 2) throw new Error(`Hero midpoint is not a crossfade: ${opacityStates[2].join(', ')}`);

    await page.locator('#configurator').scrollIntoViewIfNeeded();
    const typeButtons = page.locator('.configurator__type button');
    const heights = [];
    for (let index = 0; index < await typeButtons.count(); index += 1) {
      await typeButtons.nth(index).click();
      await page.waitForTimeout(50);
      heights.push(await page.locator('#configurator').evaluate((node) => node.getBoundingClientRect().height));
    }
    if (Math.max(...heights) - Math.min(...heights) > 2) throw new Error(`Configurator height changes: ${heights.join(', ')}`);
    await page.screenshot({ path: path.join(evidenceDir, 'configurator-stable-1440.png') });

    await page.locator('#client-proof').scrollIntoViewIfNeeded();
    const logoSizes = await page.locator('.client-proof__logos img').evaluateAll((images) => images.map((image) => image.getBoundingClientRect()));
    if (logoSizes.some((box) => box.width < 90 || box.height < 24)) throw new Error('One or more client logos are still too small');
    await page.screenshot({ path: path.join(evidenceDir, 'client-logo-wall-1440.png') });

    await page.locator('#project-team').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(evidenceDir, 'project-team-light-1440.png') });

    await page.evaluate(() => { location.hash = 'full-brief'; });
    const targetedDisplay = await page.locator('#full-brief').evaluate((node) => getComputedStyle(node).display);
    if (targetedDisplay === 'none') throw new Error('On-demand full form does not open from its anchor');
  } else {
    await page.screenshot({ path: path.join(evidenceDir, `hero-${width}.png`) });
  }

  results.push({ width, height, ...state });
  await page.close();
}

try {
  for (const viewport of [[1440, 900], [768, 900], [390, 844], [320, 800]]) await verifyViewport(...viewport);

  for (const route of ['/vahtovye-poselki/', '/modulnye-ofisy-abk/', '/modulnye-obshchezhitiya/']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: 'domcontentloaded' });
    await page.locator('h1').waitFor({ state: 'visible' });
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      removedBlocks: document.querySelectorAll('.logistics, .factory, .dominant-case').length,
      visibleLabels: [...document.querySelectorAll('.visualization-label')].filter((node) => getComputedStyle(node).display !== 'none').length,
      heroContext: document.querySelectorAll('.hero__context').length,
      fullBriefDefault: getComputedStyle(document.querySelector('#full-brief')).display
    }));
    if (!response?.ok() || state.overflow > 1 || state.removedBlocks || state.visibleLabels || state.heroContext || state.fullBriefDefault !== 'none') {
      throw new Error(`${route} failed: ${JSON.stringify({ status: response?.status(), ...state })}`);
    }
    routeResults.push({ route, status: response.status(), ...state });
    await page.close();
  }

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await reduced.locator('h1').waitFor({ state: 'visible' });
  const reducedState = await reduced.locator('.assembly').evaluate((node) => ({
    progress: node.getAttribute('data-progress'),
    position: getComputedStyle(node).position,
    plateOpacities: [...node.querySelectorAll('.assembly__plate')].map((plate) => getComputedStyle(plate).opacity)
  }));
  if (reducedState.plateOpacities.at(-1) !== '1') throw new Error(`Reduced motion hero is incomplete: ${JSON.stringify(reducedState)}`);
  await reduced.screenshot({ path: path.join(evidenceDir, 'hero-reduced-motion-1440.png') });
  await reduced.close();
  console.log(JSON.stringify({ pass: true, results, routeResults, reducedState }, null, 2));
} finally {
  await browser.close();
}
