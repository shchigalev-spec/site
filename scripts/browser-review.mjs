import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const routes = [
  '/', '/shumoizolyatsiya-kvartiry/', '/shumoizolyatsiya-sten/',
  '/shumoizolyatsiya-potolka/', '/shumoizolyatsiya-pola/',
  '/shumoizolyatsiya-ot-sosedey/', '/shumoizolyatsiya-v-novostroyke/',
  '/shumoizolyatsiya-v-gotovoy-kvartire/', '/diagnostika-shuma/',
  '/cases/', '/cases/58-39-db/', '/cases/impact-noise-minus-16-db/',
  '/cases/64-43-db/', '/privacy/', '/privacy-policy/', '/sitemap.xml', '/robots.txt'
];
const concepts = [
  { name: 'tech', origin: 'http://127.0.0.1:5173' },
  { name: 'engineering', origin: 'http://127.0.0.1:5174' }
].filter((concept) => !process.env.REVIEW_CONCEPT || process.env.REVIEW_CONCEPT === concept.name);
const results = { startedAt: new Date().toISOString(), concepts: {}, failures: [] };

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function loadLazyImages(page) {
  const images = await page.locator('img').all();
  for (const image of images) {
    await image.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(60);
  }
  await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 15_000 });
  const broken = await page.locator('img').evaluateAll((nodes) => nodes
    .filter((image) => !image.complete || image.naturalWidth === 0)
    .map((image) => image.currentSrc || image.src));
  check(broken.length === 0, `Broken images: ${broken.join(', ')}`);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    scrollTo(0, 0);
  });
  await page.waitForFunction(() => scrollY === 0);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.waitForTimeout(420);
}

async function validateRoutes(request, concept) {
  const statuses = {};
  for (const route of routes) {
    const response = await request.get(`${concept.origin}${route}`);
    statuses[route] = response.status();
    check(response.ok(), `${concept.name} ${route} returned ${response.status()}`);
  }
  return statuses;
}

async function reviewTech(page, output) {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const heroStates = page.locator('.state-index button');
  check(await heroStates.count() === 4, 'Tech hero must expose four states');
  for (let index = 0; index < 4; index += 1) {
    await heroStates.nth(index).click();
    await page.waitForTimeout(180);
    check(await page.locator('.hero').getAttribute('data-state') === String(index), `Tech hero state ${index} did not activate`);
    await page.screenshot({ path: path.join(output, `hero-state-${index}.png`) });
  }

  const noiseTabs = page.locator('[role="tablist"][aria-label="Выберите тип шума"] button');
  check(await noiseTabs.count() === 6, 'Tech noise deck must have six states');
  const initialNoise = await page.locator('.deck-stage').getAttribute('data-noise');
  await noiseTabs.nth(5).click();
  check(await noiseTabs.nth(5).getAttribute('aria-selected') === 'true', 'Tech sixth noise state not selected');
  check(await page.locator('.deck-stage').getAttribute('data-noise') !== initialNoise, 'Tech noise visual context did not change');
  await noiseTabs.nth(5).focus();
  await page.keyboard.press('ArrowLeft');
  check(await noiseTabs.nth(4).getAttribute('aria-selected') === 'true', 'Tech keyboard noise selection failed');

  const pathButtons = page.locator('.path-controls button');
  check(await pathButtons.count() === 6, 'Tech x-ray must have six selectable paths');
  await pathButtons.nth(4).click();
  check(await pathButtons.nth(4).getAttribute('aria-pressed') === 'true', 'Tech x-ray path did not activate');

  const range = page.locator('#assembly-range');
  await range.fill('74');
  check(await range.inputValue() === '74', 'Tech construction assembly range failed');

  const stageTabs = page.locator('.stage-tabs button');
  check(await stageTabs.count() === 3, 'Tech renovation stages must have three states');
  const stageSection = page.locator('.stages');
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const [progress, expected] of [[0.02, 'new-build'], [0.38, 'renovation'], [0.74, 'finished']]) {
    await stageSection.evaluate((node, value) => {
      const top = node.getBoundingClientRect().top + scrollY;
      scrollTo(0, top + Math.max(1, node.offsetHeight - innerHeight) * value);
    }, progress);
    await page.waitForTimeout(180);
    check(await stageSection.getAttribute('data-stage') === expected, `Tech renovation scroll state ${expected} failed`);
  }
  await stageTabs.nth(2).click();
  check(await stageTabs.nth(2).getAttribute('aria-selected') === 'true', 'Tech finished-apartment state failed');

  const scenarioSelects = page.locator('.scenario-controls select');
  check(await scenarioSelects.count() === 6, 'Tech scenario must expose six structured inputs');
  const scenarioBefore = await page.locator('.scenario-output').innerText();
  await scenarioSelects.nth(0).selectOption({ index: 2 });
  await scenarioSelects.nth(2).selectOption({ index: 2 });
  const scenarioAfter = await page.locator('.scenario-output').innerText();
  check(scenarioAfter !== scenarioBefore, 'Tech scenario output did not change');

  await loadLazyImages(page);
  await page.evaluate(() => scrollTo(0, 0));
}

async function submitTechForm(page) {
  await page.goto('http://127.0.0.1:5173/diagnostika-shuma/', { waitUntil: 'networkidle' });
  const form = page.locator('form').last();
  await form.locator('button[type="submit"]').click();
  check(await form.evaluate((node) => !node.checkValidity()), 'Tech invalid form unexpectedly valid');
  await form.locator('select[name="heard"]').selectOption({ index: 1 });
  await form.locator('select[name="direction"]').selectOption({ index: 1 });
  await form.locator('input[name="timing"]').fill('вечером и ночью');
  await form.locator('input[name="rooms"]').fill('спальня');
  await form.locator('input[name="stage"]').first().check();
  await form.locator('input[name="name"]').fill('Тест браузера');
  await form.locator('input[name="phone"]').fill('+7 999 000 00 00');
  await form.locator('input[name="consent"]').check();
  await form.locator('input[type="file"]').setInputFiles({ name: 'plan.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 browser review') });
  check(await form.evaluate((node) => node.checkValidity()), `Tech completed form is invalid: ${await form.locator(':invalid').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('name') || node.tagName).join(', '))}`);
  const responsePromise = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().includes('/diagnostika-shuma'), { timeout: 15_000 });
  await form.locator('button[type="submit"]').click();
  const response = await responsePromise;
  check(response.status() < 400, `Tech valid form returned ${response.status()}`);
  await page.locator('.form-message.success').waitFor({ timeout: 15_000 });
}

async function reviewEngineering(page, output) {
  await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
  const hero = page.locator('.hero-scroll');
  const heroBox = await hero.boundingBox();
  check(Boolean(heroBox), 'Engineering hero missing');
  await page.screenshot({ path: path.join(output, 'hero-start.png') });
  await page.evaluate((distance) => scrollTo(0, distance), Math.round((heroBox?.height ?? 1600) * .42));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(output, 'hero-mid.png') });
  await page.evaluate((distance) => scrollTo(0, distance), Math.round((heroBox?.height ?? 1600) * .72));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(output, 'hero-end.png') });
  const progress = await hero.evaluate((node) => Number(getComputedStyle(node).getPropertyValue('--hero-progress')));
  check(progress > .3, 'Engineering hero cutaway did not progress on scroll');

  const symptomTabs = page.locator('.symptom-index [role="tab"]');
  check(await symptomTabs.count() === 6, 'Engineering symptom index must have six states');
  await symptomTabs.nth(5).click();
  check(await symptomTabs.nth(5).getAttribute('aria-selected') === 'true', 'Engineering sixth symptom failed');
  await symptomTabs.nth(5).focus();
  await page.keyboard.press('ArrowUp');
  check(await symptomTabs.nth(4).getAttribute('aria-selected') === 'true', 'Engineering keyboard symptom selection failed');

  const transmission = page.locator('.transmission-controls button');
  check(await transmission.count() === 6, 'Engineering path drawing must have six states');
  const pathBefore = await page.locator('.transmission-caption').innerText();
  await transmission.nth(2).click();
  check(await page.locator('.transmission-caption').innerText() !== pathBefore, 'Engineering path annotation did not change');

  const layerTabs = page.locator('.layer-tabs button');
  check(await layerTabs.count() === 3, 'Engineering layer detail must have three nodes');
  await layerTabs.nth(2).click();
  const layerStage = page.locator('.layer-stage');
  if (await layerStage.getAttribute('aria-pressed') !== 'true') await layerStage.click();
  check(await layerStage.getAttribute('aria-pressed') === 'true', 'Engineering layer expansion failed');

  const briefBefore = await page.locator('.brief-summary').innerText();
  await page.locator('#brief-noise').selectOption({ index: 2 });
  await page.locator('#brief-stage').selectOption({ index: 2 });
  await page.getByRole('button', { name: 'Сформировать предварительный сценарий' }).click();
  check(await page.locator('.brief-summary').innerText() !== briefBefore, 'Engineering brief output did not change');

  const faqButtons = page.locator('.faq-item > button');
  check(await faqButtons.count() >= 6, 'Engineering FAQ is incomplete');
  await faqButtons.nth(1).click();
  check(await faqButtons.nth(1).getAttribute('aria-expanded') === 'true', 'Engineering FAQ did not open');

  await loadLazyImages(page);
  await page.evaluate(() => scrollTo(0, 0));
}

async function submitEngineeringForm(page) {
  await page.goto('http://127.0.0.1:5174/diagnostika-shuma/', { waitUntil: 'networkidle' });
  const form = page.locator('.diagnosis-form');
  await form.locator('button[type="submit"]').click();
  check(await form.evaluate((node) => !node.checkValidity()), 'Engineering invalid form unexpectedly valid');
  await form.locator('textarea[name="heard"]').fill('Шаги и удары сверху');
  await form.locator('input[name="direction"]').fill('сверху');
  await form.locator('input[name="timing"]').fill('вечером');
  await form.locator('input[name="rooms"]').fill('спальня');
  await form.locator('select[name="stage"]').selectOption({ index: 1 });
  await form.locator('input[name="name"]').fill('Тест браузера');
  await form.locator('input[name="phone"]').fill('+7 999 000 00 00');
  await form.locator('input[name="consent"]').check();
  await form.locator('input[type="file"]').setInputFiles({ name: 'audio.mp3', mimeType: 'audio/mpeg', buffer: Buffer.from('ID3 browser review') });
  await form.locator('button[type="submit"]').click();
  await page.locator('.form-status.success').waitFor({ timeout: 15_000 });
}

const browser = await chromium.launch();
try {
  const request = await browser.newPage();
  for (const concept of concepts) {
    const output = path.resolve('reviews', concept.name, 'final');
    await fs.mkdir(output, { recursive: true });
    const report = { routes: {}, desktop: {}, mobile: {}, reducedMotion: {} };
    results.concepts[concept.name] = report;
    try {
      report.routes = await validateRoutes(request.request, concept);
      const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      const consoleErrors = [];
      desktop.on('console', (message) => message.type() === 'error' && consoleErrors.push(message.text()));
      desktop.on('pageerror', (error) => consoleErrors.push(error.message));
      if (concept.name === 'tech') {
        await reviewTech(desktop, output);
        await submitTechForm(desktop);
        await desktop.goto(concept.origin, { waitUntil: 'networkidle' });
        await loadLazyImages(desktop);
      } else {
        await reviewEngineering(desktop, output);
        await submitEngineeringForm(desktop);
        await desktop.goto(concept.origin, { waitUntil: 'networkidle' });
        await loadLazyImages(desktop);
      }
      const overflow = await desktop.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const overflowNodes = overflow > 1 ? await desktop.locator('body *').evaluateAll((nodes) => nodes
        .map((node) => ({ node, rect: node.getBoundingClientRect() }))
        .filter(({ rect }) => rect.right > innerWidth + 1 || rect.left < -1)
        .slice(0, 16)
        .map(({ node, rect }) => `${node.tagName.toLowerCase()}.${node.className || ''} [${Math.round(rect.left)},${Math.round(rect.right)}]`)) : [];
      check(overflow <= 1, `${concept.name} desktop horizontal overflow: ${overflow}px; ${overflowNodes.join(' | ')}`);
      check(consoleErrors.length === 0, `${concept.name} console errors: ${consoleErrors.join(' | ')}`);
      await desktop.screenshot({ path: path.join(output, 'desktop-1440.png'), fullPage: true });
      report.desktop = { passed: true, overflow, consoleErrors };
      await desktop.close();

      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      const mobileErrors = [];
      mobile.on('console', (message) => message.type() === 'error' && mobileErrors.push(message.text()));
      mobile.on('pageerror', (error) => mobileErrors.push(error.message));
      await mobile.goto(concept.origin, { waitUntil: 'networkidle' });
      await loadLazyImages(mobile);
      const mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(mobileOverflow <= 1, `${concept.name} mobile horizontal overflow: ${mobileOverflow}px`);
      check(mobileErrors.length === 0, `${concept.name} mobile console errors: ${mobileErrors.join(' | ')}`);
      await mobile.screenshot({ path: path.join(output, 'mobile-390.png'), fullPage: true });
      report.mobile = { passed: true, overflow: mobileOverflow, consoleErrors: mobileErrors };
      await mobile.close();

      const reduced = await browser.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' });
      await reduced.goto(concept.origin, { waitUntil: 'networkidle' });
      check(await reduced.locator('h1').isVisible(), `${concept.name} reduced-motion H1 missing`);
      check(await reduced.getByRole('link', { name: /диагност/i }).first().isVisible(), `${concept.name} reduced-motion CTA missing`);
      await reduced.screenshot({ path: path.join(output, 'reduced-motion.png'), fullPage: false });
      report.reducedMotion = { passed: true };
      await reduced.close();
    } catch (error) {
      report.error = error.message;
      results.failures.push(`${concept.name}: ${error.message}`);
    }
  }
  await request.close();
} finally {
  await browser.close();
}
results.finishedAt = new Date().toISOString();
await fs.writeFile(path.resolve('reviews', 'browser-review.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.failures.length) process.exitCode = 1;
