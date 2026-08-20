import { chromium, devices } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = {};
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (!argument.startsWith('--')) continue;
  const [rawKey, ...inlineValue] = argument.slice(2).split('=');
  if (inlineValue.length) {
    args[rawKey] = inlineValue.join('=');
  } else if (process.argv[index + 1] && !process.argv[index + 1].startsWith('--')) {
    args[rawKey] = process.argv[index + 1];
    index += 1;
  } else {
    args[rawKey] = true;
  }
}

const origin = String(args.origin || process.env.TECH_ORIGIN || 'http://127.0.0.1:5173');
const slice = String(args.slice || '00').padStart(2, '0');
const output = path.resolve('reviews', 'tech-v2', `slice-${slice}`);
const routes = [
  '/',
  '/shumoizolyatsiya-kvartiry/',
  '/shumoizolyatsiya-sten/',
  '/shumoizolyatsiya-potolka/',
  '/shumoizolyatsiya-pola/',
  '/shumoizolyatsiya-ot-sosedey/',
  '/shumoizolyatsiya-v-novostroyke/',
  '/shumoizolyatsiya-v-gotovoy-kvartire/',
  '/diagnostika-shuma/',
  '/cases/',
  '/cases/58-39-db/',
  '/cases/impact-noise-minus-16-db/',
  '/cases/64-43-db/',
  '/privacy-policy/',
  '/privacy/',
  '/sitemap.xml',
  '/robots.txt'
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = {
  capturedAt: new Date().toISOString(),
  origin,
  slice,
  routes: {},
  desktop: {},
  mobile: {},
  pathLab: {},
  construction: {},
  renovation: {},
  measuredEvidence: {},
  scenarioConversion: {},
  serviceFamilies: {},
  mandatoryViewports: {},
  reducedMotion: {},
  failures: []
};

function collectErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    const reason = request.failure()?.errorText || 'unknown';
    if (reason !== 'net::ERR_ABORTED') errors.push(`requestfailed: ${request.url()} — ${reason}`);
  });
  return errors;
}

async function settleImages(page) {
  const images = await page.locator('img').all();
  for (const image of images) {
    if (!(await image.isVisible().catch(() => false))) continue;
    await image.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(30);
    await image.evaluate((node) => {
      if (node.complete) return true;
      return Promise.race([
        new Promise((resolve) => {
          node.addEventListener('load', () => resolve(true), { once: true });
          node.addEventListener('error', () => resolve(false), { once: true });
        }),
        new Promise((resolve) => setTimeout(() => resolve(false), 4_000))
      ]);
    }).catch(() => false);
  }
  const broken = await page.locator('img').evaluateAll((nodes) => nodes
    .filter((image) => image.getClientRects().length > 0 && (!image.complete || image.naturalWidth === 0))
    .map((image) => image.currentSrc || image.src));
  await page.evaluate(() => {
    document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
    scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(250);
  return broken;
}

async function captureFullPageOrViewport(page, fileName) {
  const target = path.join(output, fileName);
  await page.screenshot({ path: target });
  return 'viewport overview; full story captured in named state frames';
}

async function horizontalOverflow(page) {
  return page.evaluate(() => ({
    amount: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    nodes: [...document.querySelectorAll('body *')]
      .map((node) => ({ node, rect: node.getBoundingClientRect() }))
      .filter(({ rect }) => rect.right > document.documentElement.clientWidth + 1 || rect.left < -1)
      .slice(0, 20)
      .map(({ node, rect }) => `${node.tagName.toLowerCase()}.${node.className || ''} [${Math.round(rect.left)}, ${Math.round(rect.right)}]`)
  }));
}

async function ensureDeferredChapter(page, hostSelector, contentSelector) {
  if (await page.locator(contentSelector).count()) return;
  const host = page.locator(hostSelector).first();
  await host.waitFor({ state: 'attached', timeout: 10_000 });
  await host.scrollIntoViewIfNeeded();
  await page.locator(contentSelector).waitFor({ state: 'visible', timeout: 20_000 });
  await page.waitForTimeout(120);
}

async function hydrateDeferredStory(page) {
  const chapters = [
    ['#noise-path-lab', '.path-lab'],
    ['#construction', '.construction-decision'],
    ['#renovation-morph', '.renovation-morph'],
    ['#cases', '#measured-evidence'],
    ['#scenario-v2', '#scenario'],
    ['[data-deferred-chapter="quality"]', '.quality'],
    ['#home-short-form', '#home-short-form-panel']
  ];
  for (const [host, content] of chapters) await ensureDeferredChapter(page, host, content);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(160);
}

async function captureHeroFrames(page, prefix = '') {
  const hero = page.locator('.hero, [data-v2-hero]').first();
  if (!(await hero.count())) throw new Error('Hero scene was not found');
  const fractions = [
    ['start', 0],
    ['quarter', 0.25],
    ['mid', 0.5],
    ['three-quarter', 0.75],
    ['end', 1]
  ];
  const bounds = await hero.evaluate((node) => {
    const top = node.getBoundingClientRect().top + scrollY;
    return { top, distance: Math.max(1, node.scrollHeight - innerHeight) };
  });
  for (const [name, fraction] of fractions) {
    await page.evaluate(({ top, distance, fraction }) => scrollTo(0, top + distance * fraction), {
      ...bounds,
      fraction
    });
    await page.waitForTimeout(520);
    await page.screenshot({ path: path.join(output, `${prefix}${name}.png`) });
  }
  await page.evaluate(() => scrollTo(0, 0));
}

async function captureMandatoryViewport(width, height, name) {
  const context = await browser.newContext({
    viewport: { width, height },
    screen: { width, height },
    isMobile: width < 768,
    hasTouch: width < 768
  });
  const page = await context.newPage();
  const errors = collectErrors(page);
  await page.goto(origin, { waitUntil: 'networkidle' });
  const hero = page.locator('.hero, [data-v2-hero]').first();
  const bounds = await hero.evaluate((node) => {
    const top = node.getBoundingClientRect().top + scrollY;
    return { top, distance: Math.max(1, node.scrollHeight - innerHeight) };
  });
  await page.screenshot({ path: path.join(output, `${name}-start.png`) });
  await page.evaluate(({ top, distance }) => scrollTo(0, top + distance), bounds);
  await page.waitForTimeout(620);
  await page.screenshot({ path: path.join(output, `${name}-final.png`) });
  const geometry = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.getBoundingClientRect();
    const candidates = [...document.querySelectorAll('.diagnostic-rail li.active, .local-assembly')]
      .filter((node) => {
        const style = getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.04;
      })
      .map((node) => ({
        selector: node.matches('.local-assembly') ? '.local-assembly' : '.diagnostic-rail li.active',
        rect: node.getBoundingClientRect().toJSON()
      }));
    const h1Rect = h1?.toJSON() || null;
    const collisions = h1Rect ? candidates.filter(({ rect }) => !(
      rect.right <= h1Rect.left || rect.left >= h1Rect.right || rect.bottom <= h1Rect.top || rect.top >= h1Rect.bottom
    )).map(({ selector }) => selector) : [];
    return { h1: h1Rect, candidates, collisions };
  });
  await context.close();
  return { width, height, errors, geometry };
}

async function verifyPathLabDesktop(page) {
  await ensureDeferredChapter(page, '#noise-path-lab', '.path-lab');
  const section = page.locator('.path-lab');
  if (!(await section.count())) return { present: false };
  const tabs = section.locator('.symptom-rail [role="tab"]');
  const stateCount = await tabs.count();
  const states = [];
  const expectedStates = ['impact', 'voices', 'bass', 'lift', 'road', 'ventilation'];
  for (let index = 0; index < stateCount; index += 1) {
    await tabs.nth(index).click();
    await page.waitForFunction((expected) => {
      const lab = document.querySelector('.path-lab');
      return lab?.getAttribute('data-noise') === expected && lab.getAnimations({ subtree: true }).every((animation) => animation.playState !== 'running');
    }, expectedStates[index], { timeout: 3000 });
    const key = await section.getAttribute('data-noise');
    states.push(key);
    await section.locator('.model-panel').screenshot({ path: path.join(output, `path-state-0${index + 1}.png`) });
  }
  const transitionDurationMs = await page.evaluate(() => new Promise((resolve, reject) => {
    const lab = document.querySelector('.path-lab');
    const firstTab = lab?.querySelector('.symptom-rail [role="tab"]');
    if (!(lab instanceof HTMLElement) || !(firstTab instanceof HTMLButtonElement)) {
      reject(new Error('Path Lab transition target is unavailable'));
      return;
    }
    const startedAt = performance.now();
    firstTab.click();
    const inspect = () => {
      const settled = lab.getAttribute('data-noise') === 'impact' && lab.getAnimations({ subtree: true }).every((animation) => animation.playState !== 'running');
      if (settled) {
        resolve(Math.round(performance.now() - startedAt));
        return;
      }
      if (performance.now() - startedAt > 2500) {
        reject(new Error('Path Lab transition did not settle within 2500ms'));
        return;
      }
      requestAnimationFrame(inspect);
    };
    requestAnimationFrame(inspect);
  }));
  await tabs.last().focus();
  await tabs.last().press('Home');
  await page.waitForTimeout(1120);
  const homeKey = await section.getAttribute('data-noise');
  await section.locator('.symptom-rail [role="tab"]').first().press('ArrowRight');
  await page.waitForTimeout(1120);
  const arrowKey = await section.getAttribute('data-noise');
  await section.locator('.symptom-rail [role="tab"]').nth(2).click();
  await page.waitForTimeout(1120);
  const persistenceBeforeReload = await page.evaluate(() => ({
    query: new URL(location.href).searchParams.get('noise'),
    session: sessionStorage.getItem('tech:v2:noise')
  }));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ensureDeferredChapter(page, '#noise-path-lab', '.path-lab');
  await page.waitForFunction(() => document.querySelector('.path-lab')?.getAttribute('data-noise') === 'bass', null, { timeout: 10_000 });
  await page.waitForFunction(() => {
    const lab = document.querySelector('.path-lab');
    return lab ? lab.getAnimations({ subtree: true }).every((animation) => animation.playState !== 'running') : false;
  }, null, { timeout: 5_000 });
  const persistedKey = await page.locator('.path-lab').getAttribute('data-noise');
  await page.locator('.path-lab').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1120);
  const runningAnimations = await page.locator('.path-lab').evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  const scenarioNoise = await page.evaluate(() => {
    try { return JSON.parse(sessionStorage.getItem('tech:v2:scenario') || '{}').input?.noise || ''; }
    catch { return ''; }
  });
  await ensureDeferredChapter(page, '#scenario-v2', '#scenario');
  await page.locator('#scenario').screenshot({ path: path.join(output, 'scenario-persisted-context.png') });
  const diagnosisPage = await page.context().newPage();
  const diagnosisErrors = collectErrors(diagnosisPage);
  await diagnosisPage.goto(`${origin}/diagnostika-shuma/?noise=bass`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await diagnosisPage.locator('select[name="heard"]').waitFor({ state: 'visible', timeout: 20_000 });
  await diagnosisPage.waitForFunction(() => document.querySelector('select[name="heard"]')?.value === 'Бас и музыка', null, { timeout: 10_000 });
  await diagnosisPage.locator('.context-frame').waitFor({ state: 'visible', timeout: 10_000 });
  const diagnosisNoise = await diagnosisPage.locator('select[name="heard"]').inputValue();
  const diagnosisContextVisible = await diagnosisPage.locator('.context-frame').isVisible();
  const diagnosisContextText = diagnosisContextVisible ? await diagnosisPage.locator('.context-frame').innerText() : '';
  if (diagnosisContextVisible) {
    await diagnosisPage.locator('.context-frame').scrollIntoViewIfNeeded();
    await diagnosisPage.screenshot({ path: path.join(output, 'diagnosis-persisted-context.png') });
  }
  await diagnosisPage.close();
  return {
    present: true,
    stateCount,
    states,
    transitionDurationMs,
    homeKey,
    arrowKey,
    persistenceBeforeReload,
    persistedKey,
    runningAnimations,
    downstream: { scenarioNoise, diagnosisNoise, diagnosisContextVisible, diagnosisContextText, diagnosisErrors }
  };
}

async function verifyPathLabMobile(page) {
  await ensureDeferredChapter(page, '#noise-path-lab', '.path-lab');
  const section = page.locator('.path-lab');
  if (!(await section.count())) return { present: false };
  await section.locator('.mobile-stepper select').selectOption('4');
  await page.waitForTimeout(1120);
  const selectedByDirectControl = await section.getAttribute('data-noise');
  await section.locator('.mobile-stepper button').last().tap();
  await page.waitForTimeout(1120);
  const selectedByNext = await section.getAttribute('data-noise');
  const stepText = await section.locator('.mobile-stepper > span').innerText();
  await section.screenshot({ path: path.join(output, 'mobile-path-lab.png') });
  return { present: true, selectedByDirectControl, selectedByNext, stepText };
}

async function verifyConstructionDesktop(page) {
  await ensureDeferredChapter(page, '#construction', '.construction-decision');
  const section = page.locator('.construction-decision');
  if (!(await section.count())) return { present: false };
  const tabs = section.locator('.context-tabs [role="tab"]');
  const contextCount = await tabs.count();
  const contexts = [];
  const finalSteps = [];
  for (let index = 0; index < contextCount; index += 1) {
    await tabs.nth(index).click();
    await page.waitForTimeout(2100);
    contexts.push(await section.getAttribute('data-context'));
    finalSteps.push(await section.getAttribute('data-step'));
    await section.locator('.decision-shell').screenshot({ path: path.join(output, `construction-${await section.getAttribute('data-context')}.png`) });
  }
  await tabs.last().focus();
  await tabs.last().press('Home');
  await page.waitForTimeout(80);
  const homeContext = await section.getAttribute('data-context');
  await section.locator('.context-tabs [role="tab"]').first().press('ArrowRight');
  await page.waitForTimeout(80);
  const arrowContext = await section.getAttribute('data-context');
  const datum = section.locator('.datum-rail button');
  await datum.nth(3).click();
  const bridgeStep = await section.getAttribute('data-step');
  await datum.last().click();
  const controlledStep = await section.getAttribute('data-step');
  await page.waitForTimeout(360);
  const runningAnimations = await section.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  return { present: true, contextCount, contexts, finalSteps, homeContext, arrowContext, bridgeStep, controlledStep, runningAnimations };
}

async function verifyConstructionMobile(page) {
  await ensureDeferredChapter(page, '#construction', '.construction-decision');
  const section = page.locator('.construction-decision');
  if (!(await section.count())) return { present: false };
  const tabs = section.locator('.context-tabs [role="tab"]');
  await tabs.last().tap();
  await page.waitForTimeout(2100);
  const context = await section.getAttribute('data-context');
  const controls = section.locator('.mobile-model-controls button');
  const controlGroupRole = await section.locator('.mobile-model-controls').getAttribute('role');
  await controls.nth(1).tap();
  const expandedStep = await section.getAttribute('data-step');
  const expandedPressed = await controls.evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-pressed')));
  await controls.nth(2).tap();
  const bridgeStep = await section.getAttribute('data-step');
  const bridgePressed = await controls.evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-pressed')));
  await controls.nth(3).tap();
  const controlledStep = await section.getAttribute('data-step');
  const controlledPressed = await controls.evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-pressed')));
  await section.locator('.decision-shell').screenshot({ path: path.join(output, 'mobile-construction-floor.png') });
  return { present: true, context, controlGroupRole, expandedStep, expandedPressed, bridgeStep, bridgePressed, controlledStep, controlledPressed };
}

async function verifyRenovationDesktop(page) {
  await ensureDeferredChapter(page, '#renovation-morph', '.renovation-morph');
  const section = page.locator('.renovation-morph');
  if (!(await section.count())) return { present: false };
  await page.evaluate(() => document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important'));
  const layerCount = await section.locator('.desktop-sequence .stage-plate').count();
  const localMaskCount = await section.locator('.desktop-sequence .local-zone').count();
  let decodedPlates = false;
  const sectionHeightSvh = await section.evaluate((node) => Math.round(node.getBoundingClientRect().height / innerHeight * 100));
  await section.evaluate((node) => {
    const top = node.getBoundingClientRect().top + scrollY;
    const range = Math.max(1, node.getBoundingClientRect().height - innerHeight);
    scrollTo({ top: top + range * 0.25, behavior: 'instant' });
  });
  await page.waitForTimeout(120);
  const localMaskClipPaths = await section.locator('.renovation-layer .local-zone img').evaluateAll((images) => images.map((image) => getComputedStyle(image).clipPath));
  const uniqueLocalMaskClipPaths = new Set(localMaskClipPaths).size;
  await section.locator('.desktop-sequence').screenshot({ path: path.join(output, 'renovation-local-masks.png') });
  await section.evaluate((node) => {
    const top = node.getBoundingClientRect().top + scrollY;
    const range = Math.max(1, node.getBoundingClientRect().height - innerHeight);
    scrollTo({ top: top + range * 0.32, behavior: 'instant' });
  });
  await page.waitForTimeout(40);
  const textTransitionAnimations = await section.locator('.stage-narrative').evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  await page.waitForTimeout(320);
  const states = [];
  const reveals = [];
  for (const [index, progress] of [0, 0.5, 1].entries()) {
    await section.evaluate((node, value) => {
      const top = node.getBoundingClientRect().top + scrollY;
      const range = Math.max(1, node.getBoundingClientRect().height - innerHeight);
      scrollTo({ top: top + range * value, behavior: 'instant' });
    }, progress);
    if (index === 2) {
      await page.waitForFunction(() => [...document.querySelectorAll('.renovation-morph .desktop-sequence .stage-plate img')].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 20_000 });
      decodedPlates = true;
    }
    await page.waitForTimeout(520);
    states.push(await section.getAttribute('data-stage'));
    reveals.push(await section.evaluate((node) => ({
      renovation: getComputedStyle(node).getPropertyValue('--renovation-reveal').trim(),
      finished: getComputedStyle(node).getPropertyValue('--finished-reveal').trim()
    })));
    await section.locator('.desktop-sequence').screenshot({ path: path.join(output, `renovation-${['newbuild', 'renovation', 'finished'][index]}.png`) });
  }
  const ctaTargets = await section.locator('.desktop-sequence a.button').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const runningAnimations = await section.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  return { present: true, layerCount, localMaskCount, localMaskClipPaths, uniqueLocalMaskClipPaths, textTransitionAnimations, decodedPlates, sectionHeightSvh, states, reveals, ctaTargets, runningAnimations };
}

async function verifyRenovationMobile(page) {
  await ensureDeferredChapter(page, '#renovation-morph', '.renovation-morph');
  const section = page.locator('.renovation-morph');
  if (!(await section.count())) return { present: false };
  const frames = section.locator('.mobile-frame');
  const frameCount = await frames.count();
  const states = await frames.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-mobile-stage')));
  let decodedPlates = false;
  const ctaTargets = await frames.locator('a.button').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const controls = section.locator('.mobile-progress button');
  const targetRects = await controls.evaluateAll((buttons) => buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  }));
  const selected = [];
  for (let index = 0; index < await controls.count(); index += 1) {
    await controls.nth(index).tap();
    await page.waitForTimeout(520);
    selected.push(await controls.evaluateAll((buttons) => buttons.findIndex((button) => button.getAttribute('aria-current') === 'step')));
    await frames.nth(index).screenshot({ path: path.join(output, `mobile-renovation-${states[index]}.png`) });
  }
  await page.waitForFunction(() => [...document.querySelectorAll('.renovation-morph .mobile-frame img')].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 20_000 });
  decodedPlates = true;
  return { present: true, frameCount, states, decodedPlates, ctaTargets, controlCount: await controls.count(), targetRects, selected };
}

async function settleEvidenceGraph(graph, page) {
  await page.waitForFunction((node) => ['waiting', 'animating', 'complete'].includes(node.dataset.graphState), await graph.elementHandle(), { timeout: 4_000 });
  await graph.scrollIntoViewIfNeeded();
  await page.waitForFunction((node) => ['animating', 'complete'].includes(node.dataset.graphState), await graph.elementHandle(), { timeout: 4_000 });
  await page.waitForTimeout(90);
  const stateDuringEntry = await graph.getAttribute('data-graph-state');
  const animationsDuringEntry = await graph.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  await page.waitForFunction((node) => node.dataset.graphState === 'complete', await graph.elementHandle(), { timeout: 4_000 });
  await page.waitForTimeout(120);
  const animationsAfterCompletion = await graph.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  return { stateDuringEntry, animationsDuringEntry, animatedOnce: await graph.getAttribute('data-graph-animated') === 'true', finalState: await graph.getAttribute('data-graph-state'), animationsAfterCompletion };
}

async function verifyMeasuredEvidenceDesktop(page) {
  await page.goto(origin, { waitUntil: 'networkidle' });
  await ensureDeferredChapter(page, '#cases', '#measured-evidence');
  await page.evaluate(() => document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important'));
  const section = page.locator('#measured-evidence');
  if (!(await section.count())) return { present: false };
  const dominantCount = await section.locator('.dominant-case').count();
  const supportingCount = await section.locator('.support-case').count();
  const graphTypes = await section.locator('.evidence-graph').evaluateAll((nodes) => nodes.map((node) => ['envelope', 'peak', 'band'].find((type) => node.classList.contains(type)) || 'unknown'));
  const visibleNumbers = await section.locator('.evidence-graph figcaption b').allTextContents();
  const disclaimerCount = await section.getByText('Иллюстративная визуализация, не фотография объекта заказчика.', { exact: true }).count();
  const disclaimerHiddenCount = await section.getByText('Иллюстративная визуализация, не фотография объекта заказчика.', { exact: true }).evaluateAll((nodes) => nodes.filter((node) => node.closest('[aria-hidden="true"]')).length);
  const detailLabels = await section.locator('.evidence-ledger dt').allTextContents();
  const caseTargets = await section.locator('a[href^="/cases/"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const diagnosisTargets = await section.locator('a.button').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const graphRuns = [];
  const graphs = section.locator('.evidence-graph');
  for (let index = 0; index < await graphs.count(); index += 1) {
    await page.goto(origin, { waitUntil: 'networkidle' });
    await ensureDeferredChapter(page, '#cases', '#measured-evidence');
    graphRuns.push(await settleEvidenceGraph(graphs.nth(index), page));
  }
  for (let index = 0; index < await graphs.count(); index += 1) await graphs.nth(index).scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('#measured-evidence .evidence-graph')].every((node) => node.dataset.graphState === 'complete'), null, { timeout: 5_000 });
  await section.locator('.dominant-case').screenshot({ path: path.join(output, 'measured-dominant.png') });
  await section.locator('.supporting-grid').screenshot({ path: path.join(output, 'measured-supporting.png') });
  const dominantHeightSvh = await section.locator('.dominant-case').evaluate((node) => Math.round(node.getBoundingClientRect().height / innerHeight * 100));
  return { present: true, dominantCount, supportingCount, graphTypes, visibleNumbers, disclaimerCount, disclaimerHiddenCount, detailLabels, caseTargets, diagnosisTargets, graphRuns, dominantHeightSvh };
}

async function verifyMeasuredEvidenceMobile(page) {
  await ensureDeferredChapter(page, '#cases', '#measured-evidence');
  const section = page.locator('#measured-evidence');
  if (!(await section.count())) return { present: false };
  const dominant = section.locator('.dominant-case');
  await dominant.scrollIntoViewIfNeeded();
  await page.waitForTimeout(220);
  const collision = await dominant.evaluate((node) => {
    const label = node.querySelector('.illustrative-label')?.getBoundingClientRect();
    const eyebrow = node.querySelector('.dominant-result > .mono')?.getBoundingClientRect();
    if (!label || !eyebrow) return false;
    return !(label.right <= eyebrow.left || label.left >= eyebrow.right || label.bottom <= eyebrow.top || label.top >= eyebrow.bottom);
  });
  await dominant.screenshot({ path: path.join(output, 'mobile-measured-dominant.png') });
  await section.locator('.supporting-grid').scrollIntoViewIfNeeded();
  await page.waitForTimeout(220);
  await section.locator('.supporting-grid').screenshot({ path: path.join(output, 'mobile-measured-supporting.png') });
  const results = await section.locator('.dominant-result h3, .support-copy h3').allTextContents();
  const graphCount = await section.locator('.evidence-graph').count();
  return { present: true, collision, results, graphCount };
}

async function verifyCaseRoutes() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const items = {};
  for (const slug of ['58-39-db', 'impact-noise-minus-16-db', '64-43-db']) {
    const page = await context.newPage();
    const errors = collectErrors(page);
    await page.goto(`${origin}/cases/${slug}/?utm_source=slice08-review&utm_medium=audit`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important'));
    const panel = page.locator('.known-unknown-panel');
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(160);
    const knownCount = await panel.locator('.known li').count();
    const unknownCount = await panel.locator('.unknown li').count();
    const panelHeadings = await panel.locator('h3').allTextContents();
    await panel.screenshot({ path: path.join(output, `case-${slug}-known-unknown.png`) });
    const graph = page.locator('.result-object .evidence-graph');
    const graphRun = await settleEvidenceGraph(graph, page);
    await page.locator('.case-reconstruction').screenshot({ path: path.join(output, `case-${slug}-evidence.png`) });
    const ledgerCount = await page.locator('.case-ledger > div').count();
    const graphType = await graph.evaluate((node) => ['envelope', 'peak', 'band'].find((type) => node.classList.contains(type)) || 'unknown');
    const limitationVisible = await page.locator('.limitations').isVisible();
    const disclaimerCount = await page.getByText('Иллюстративная визуализация, не фотография объекта заказчика.', { exact: true }).count();
    const ctaTarget = await page.locator('.case-cta a.button').getAttribute('href');
    const metadata = await page.evaluate(() => {
      const structuredData = JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || '{}');
      return {
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
        structuredUrl: structuredData.url || ''
      };
    });
    const overflow = await horizontalOverflow(page);
    items[slug] = { knownCount, unknownCount, panelHeadings, ledgerCount, graphType, graphRun, limitationVisible, disclaimerCount, ctaTarget, metadata, overflow, errors };
    await page.close();
  }
  await context.close();

  const mobileContext = await browser.newContext({ ...devices['Pixel 5'], viewport: { width: 390, height: 844 }, screen: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();
  const mobileErrors = collectErrors(mobilePage);
  await mobilePage.goto(`${origin}/cases/58-39-db/`, { waitUntil: 'networkidle' });
  const mobilePanel = mobilePage.locator('.known-unknown-panel');
  await mobilePanel.scrollIntoViewIfNeeded();
  await mobilePanel.screenshot({ path: path.join(output, 'case-58-39-mobile-known-unknown.png') });
  const mobileOverflow = await horizontalOverflow(mobilePage);
  const mobile = { panelVisible: await mobilePanel.isVisible(), overflow: mobileOverflow, errors: mobileErrors };
  await mobileContext.close();
  return { items, mobile };
}

async function verifyServiceFamilies() {
  const definitions = [
    { slug: 'shumoizolyatsiya-sten', family: 'surface', surface: 'wall' },
    { slug: 'shumoizolyatsiya-potolka', family: 'surface', surface: 'ceiling' },
    { slug: 'shumoizolyatsiya-pola', family: 'surface', surface: 'floor' },
    { slug: 'shumoizolyatsiya-kvartiry', family: 'situation' },
    { slug: 'shumoizolyatsiya-ot-sosedey', family: 'situation' },
    { slug: 'shumoizolyatsiya-v-novostroyke', family: 'situation' },
    { slug: 'shumoizolyatsiya-v-gotovoy-kvartire', family: 'situation' },
    { slug: 'diagnostika-shuma', family: 'diagnosis' }
  ];
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const items = {};
  for (const definition of definitions) {
    const page = await desktopContext.newPage();
    const errors = collectErrors(page);
    await page.goto(`${origin}/${definition.slug}/?utm_source=slice07-review`, { waitUntil: 'networkidle' });
    const brokenImages = await settleImages(page);
    await page.screenshot({ path: path.join(output, `service-${definition.slug}-desktop.png`) });
    let interaction = {};
    if (definition.family === 'surface') {
      await page.getByRole('button', { name: 'Фланговый путь' }).click();
      await page.waitForTimeout(900);
      interaction = await page.evaluate(() => ({
        state: document.querySelector('.route-console')?.getAttribute('data-route-mode'),
        pressed: [...document.querySelectorAll('.route-switch button')].filter((button) => button.getAttribute('aria-pressed') === 'true').map((button) => button.textContent.trim()),
        readout: document.querySelector('.route-readout')?.textContent.replace(/\s+/g, ' ').trim()
      }));
    } else if (definition.family === 'situation') {
      await page.locator('.phase-controls button').nth(2).click();
      await page.waitForTimeout(650);
      interaction = await page.evaluate(() => ({
        state: document.querySelector('.decision-console')?.getAttribute('data-decision-phase'),
        pressed: [...document.querySelectorAll('.phase-controls button')].filter((button) => button.getAttribute('aria-pressed') === 'true').map((button) => button.textContent.replace(/\s+/g, ' ').trim()),
        readout: document.querySelector('.phase-readout')?.textContent.replace(/\s+/g, ' ').trim()
      }));
    } else {
      await page.locator('.stage-buttons button').nth(3).click();
      await page.waitForTimeout(650);
      interaction = await page.evaluate(() => ({
        state: document.querySelector('.diagnosis-console')?.getAttribute('data-diagnosis-stage'),
        pressed: [...document.querySelectorAll('.stage-buttons button')].filter((button) => button.getAttribute('aria-pressed') === 'true').map((button) => button.textContent.replace(/\s+/g, ' ').trim()),
        readout: document.querySelector('.stage-output')?.textContent.replace(/\s+/g, ' ').trim()
      }));
    }
    const inspection = await page.evaluate(() => {
      const familyNode = document.querySelector('[data-service-family]');
      const mainImage = document.querySelector('main img');
      const canonical = document.querySelector('link[rel="canonical"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const structuredData = JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || '{}');
      const heroGeometryNode = document.querySelector('.surface-hero .hero-plate, .situation-hero .hero-plate, .diagnostic-route-hero .signal-rail');
      const heroCopyNode = document.querySelector('.surface-hero .hero-copy, .situation-hero .hero-copy, .diagnostic-route-hero h1');
      const rect = (node) => node ? { width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height), left: Math.round(node.getBoundingClientRect().left), top: Math.round(node.getBoundingClientRect().top) } : null;
      return {
        family: familyNode?.getAttribute('data-service-family'),
        slug: document.querySelector('[data-service-slug]')?.getAttribute('data-service-slug') || null,
        surface: document.querySelector('[data-surface]')?.getAttribute('data-surface') || null,
        diagram: document.querySelector('[data-surface-diagram]')?.getAttribute('data-surface-diagram') || null,
        h1Count: document.querySelectorAll('h1').length,
        h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim(),
        imageSrc: mainImage?.getAttribute('src') || null,
        imageReady: mainImage ? mainImage.complete && mainImage.naturalWidth > 0 : true,
        canonical: canonical?.getAttribute('href') || null,
        ogImage: ogImage?.getAttribute('content') || null,
        ogUrl: ogUrl?.getAttribute('content') || null,
        ogType: ogType?.getAttribute('content') || null,
        structuredUrl: structuredData.url || null,
        jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
        commercialHeadingUsesShumo: familyNode?.getAttribute('data-service-family') === 'diagnosis' || /шумоизоляц/i.test(document.querySelector('h1')?.textContent || ''),
        visibleCopyUsesZvuko: /звукоизоляц/i.test(document.querySelector('main')?.innerText || ''),
        heroGeometry: { visual: rect(heroGeometryNode), copy: rect(heroCopyNode) },
        diagnosisTargets: [...document.querySelectorAll('main a[href="/diagnostika-shuma/"]')].length,
        directRouteCount: document.querySelectorAll('.route-switch button').length,
        stageConstraintCount: document.querySelectorAll('.constraints li').length,
        relatedCaseCount: document.querySelectorAll('.case-link').length,
        faqCount: document.querySelectorAll('.service-faq details').length,
        situationPhaseCount: document.querySelectorAll('.phase-controls button').length,
        decisionRiskCount: document.querySelectorAll('.decision-grid aside').length,
        likelyPathCount: document.querySelectorAll('.paths-grid > div:first-child li').length,
        interventionConstraintCount: document.querySelectorAll('.paths-grid > div:last-child li').length,
        relatedSurfaceCount: document.querySelectorAll('.related-grid nav a').length,
        diagnosisStageCount: document.querySelectorAll('.stage-buttons button').length,
        diagnosisLimitationCount: document.querySelectorAll('.diagnosis-opening aside').length,
        fullFormCount: document.querySelectorAll('#diagnostic-form').length,
        fullFormProgressCount: document.querySelectorAll('#diagnostic-form .form-progress button').length,
        visibleFieldsetCount: [...document.querySelectorAll('#diagnostic-form fieldset')].filter((node) => getComputedStyle(node).display !== 'none').length,
        runningAnimations: document.getAnimations().filter((animation) => animation.playState === 'running').length,
        infiniteAnimations: [...document.querySelectorAll('body *')].filter((node) => getComputedStyle(node).animationIterationCount.split(',').some((value) => value.trim() === 'infinite')).length,
        overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
      };
    });
    items[definition.slug] = { expected: definition, errors, brokenImages, interaction, ...inspection };
    await page.close();
  }
  await desktopContext.close();

  const mobileContext = await browser.newContext({ ...devices['Pixel 5'], viewport: { width: 390, height: 844 }, screen: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobile = {};
  for (const slug of ['shumoizolyatsiya-sten', 'shumoizolyatsiya-v-novostroyke', 'diagnostika-shuma']) {
    const page = await mobileContext.newPage();
    const errors = collectErrors(page);
    await page.goto(`${origin}/${slug}/`, { waitUntil: 'networkidle' });
    const brokenImages = await settleImages(page);
    await page.screenshot({ path: path.join(output, `service-${slug}-mobile.png`) });
    const inspection = await page.evaluate(() => ({
      family: document.querySelector('[data-service-family]')?.getAttribute('data-service-family'),
      h1Visible: Boolean(document.querySelector('h1')?.getClientRects().length),
      imageReady: [...document.querySelectorAll('main img')].every((image) => image.complete && image.naturalWidth > 0),
      targetSizes: [...document.querySelectorAll('.route-switch button, .phase-controls button, .stage-buttons button')].map((node) => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) })),
      clientWidth: document.documentElement.clientWidth,
      innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    }));
    mobile[slug] = { errors, brokenImages, ...inspection };
    await page.close();
  }
  await mobileContext.close();
  return { items, mobile };
}

async function verifyScenarioConversionDesktop(page) {
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => sessionStorage.removeItem('tech:v2:scenario'));
  await page.reload({ waitUntil: 'networkidle' });
  await ensureDeferredChapter(page, '#scenario-v2', '#scenario');
  const scenario = page.locator('#scenario');
  await scenario.scrollIntoViewIfNeeded();
  await scenario.screenshot({ path: path.join(output, 'scenario-step-01.png') });
  const initialQuestionCount = await scenario.locator('.question h3:visible').count();
  const steps = [await scenario.getAttribute('data-step')];
  const hypotheses = [await scenario.locator('.route-status > strong').innerText()];
  await scenario.getByRole('button', { name: /Топот сверху/ }).click();
  steps.push(await scenario.getAttribute('data-step'));
  await scenario.getByRole('button', { name: '← Назад' }).click();
  const backStep = await scenario.getAttribute('data-step');
  await scenario.getByRole('button', { name: /Топот сверху/ }).click();
  await scenario.getByRole('button', { name: 'Сверху', exact: true }).click();
  hypotheses.push(await scenario.locator('.route-status > strong').innerText());
  await scenario.getByRole('button', { name: 'Ремонт идёт', exact: true }).click();
  await scenario.getByRole('button', { name: 'Спальня', exact: true }).click();
  await scenario.getByRole('button', { name: 'Потолок', exact: true }).click();
  await scenario.getByRole('button', { name: 'Баланс', exact: true }).click();
  const finalStep = await scenario.getAttribute('data-step');
  await scenario.getByLabel('Комментарий необязательно').fill('Сильнее ночью, отделка частично готова');
  await scenario.getByRole('button', { name: /Собрать предварительный вывод/ }).click();
  await page.waitForTimeout(900);
  const complete = await scenario.getAttribute('data-complete');
  const outputLabels = await scenario.locator('.scenario-output strong').allTextContents();
  const runningAnimations = await scenario.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  const persisted = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tech:v2:scenario') || '{}'));
  await scenario.screenshot({ path: path.join(output, 'scenario-complete.png') });
  await scenario.getByRole('link', { name: /Продолжить в диагностике/ }).click();
  await page.waitForURL(/\/diagnostika-shuma\/?$/);
  await page.locator('#diagnostic-form').waitFor({ state: 'visible' });
  const fullForm = page.locator('#diagnostic-form form');
  const fullVisibleFieldsets = await fullForm.locator('fieldset:visible').count();
  const fullProgressCount = await page.locator('#diagnostic-form .form-progress > button').count();
  const carried = {
    heard: await fullForm.locator('[name="heard"]').inputValue(),
    direction: await fullForm.locator('[name="direction"]').inputValue(),
    rooms: await fullForm.locator('[name="rooms"]').inputValue(),
    stage: await fullForm.locator('[name="stage"]:checked').inputValue(),
    path: await fullForm.locator('[name="path"]').inputValue(),
    priority: await fullForm.locator('[name="spaceLoss"]').inputValue(),
    comment: await fullForm.locator('[name="comment"]').inputValue(),
    sourceContext: await fullForm.locator('[name="sourceContext"]').inputValue()
  };
  await fullForm.locator('[name="timing"]').fill('Ночью');
  await fullForm.getByRole('button', { name: /Дальше: объект/ }).click();
  const fullStepTwoVisible = await fullForm.locator('fieldset[data-step="1"]:visible').count();
  const fullStageRadio = fullForm.locator('[name="stage"]').first();
  await fullStageRadio.focus();
  const fullStageFocus = await fullStageRadio.evaluate((input) => {
    const style = getComputedStyle(input.nextElementSibling);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await ensureDeferredChapter(page, '[data-deferred-chapter="quality"]', '.quality');
  await ensureDeferredChapter(page, '#home-short-form', '#home-short-form-panel');
  const quality = page.locator('.quality');
  const qualityControls = quality.locator('.sequence-state button');
  for (let index = 1; index < 4; index += 1) await qualityControls.nth(index).click();
  await page.waitForTimeout(900);
  const qualityReveals = await quality.getAttribute('data-reveals');
  const qualityRunningAnimations = await quality.evaluate((node) => node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length);
  const qualityImageDecoded = await quality.locator('img').evaluate((image) => image.complete && image.naturalWidth > 0);
  await quality.locator('.quality-sequence').screenshot({ path: path.join(output, 'quality-sequence.png') });
  const faqCount = await page.locator('.faq-list details').count();
  const shortForm = page.locator('#home-short-form form');
  const shortFieldNames = await shortForm.locator('input:not([type="hidden"]):not([name="consent"]):not([name="files"]), select').evaluateAll((controls) => [...new Set(controls.map((control) => control.getAttribute('name')).filter(Boolean))]);
  const advancedFileCount = await shortForm.locator('details.advanced input[type="file"]').count();
  const quietImageDecoded = await page.locator('#home-short-form .quiet-plate img').evaluate((image) => image.complete && image.naturalWidth > 0);
  await shortForm.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, 'conversion-close.png') });
  return { present: true, initialQuestionCount, steps, backStep, finalStep, hypotheses, complete, outputLabels, runningAnimations, persisted, fullVisibleFieldsets, fullProgressCount, carried, fullStepTwoVisible, fullStageFocus, qualityReveals, qualityRunningAnimations, qualityImageDecoded, faqCount, shortFieldNames, advancedFileCount, quietImageDecoded };
}

async function verifyScenarioConversionMobile(page) {
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => sessionStorage.removeItem('tech:v2:scenario'));
  await page.reload({ waitUntil: 'networkidle' });
  const hero = page.locator('[data-v2-hero]');
  const heroBottom = await hero.evaluate((node) => node.getBoundingClientRect().bottom + scrollY);
  await page.evaluate((top) => scrollTo(0, top + 80), heroBottom);
  await page.waitForTimeout(240);
  const sticky = page.locator('.mobile-sticky');
  const stickyAfterHero = { hidden: await sticky.getAttribute('aria-hidden'), tabindex: await sticky.getAttribute('tabindex') };
  const menu = page.locator('.menu-trigger');
  await menu.tap();
  await page.waitForTimeout(240);
  const stickyWithMenu = await sticky.evaluate((node) => ({ opacity: getComputedStyle(node).opacity, pointerEvents: getComputedStyle(node).pointerEvents, hidden: node.getAttribute('aria-hidden'), tabindex: node.getAttribute('tabindex') }));
  await page.keyboard.press('Escape');
  await ensureDeferredChapter(page, '#scenario-v2', '#scenario');
  const scenario = page.locator('#scenario');
  await scenario.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  const stickyOnScenario = await sticky.getAttribute('aria-hidden');
  const questionCount = await scenario.locator('.question h3:visible').count();
  const answerTargets = await scenario.locator('.answers button:visible').evaluateAll((nodes) => nodes.map((node) => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) })));
  await scenario.screenshot({ path: path.join(output, 'mobile-scenario-question.png') });
  await ensureDeferredChapter(page, '#home-short-form', '#home-short-form-panel');
  const shortForm = page.locator('#home-short-form form');
  await shortForm.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  const stickyOnForm = await sticky.getAttribute('aria-hidden');
  const shortFormTargets = await shortForm.locator('input:visible:not([type="checkbox"]), select:visible, button:visible, summary:visible, label.consent:visible').evaluateAll((nodes) => nodes.map((node) => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height), name: node.getAttribute('name') || (node.matches('label.consent') ? 'consent-label' : node.tagName.toLowerCase()) })));
  const shortStageRadio = shortForm.locator('[name="stage"]').first();
  await shortStageRadio.focus();
  const shortStageFocus = await shortStageRadio.evaluate((input) => {
    const style = getComputedStyle(input.nextElementSibling);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  const overflow = await horizontalOverflow(page);
  await page.screenshot({ path: path.join(output, 'mobile-conversion-form.png') });
  await shortForm.locator('a.full-link').click();
  await page.waitForURL(/\/diagnostika-shuma\/?$/);
  const stickyAfterNavigation = {
    count: await page.locator('.mobile-sticky').count(),
    deadTargetCount: await page.locator('.mobile-sticky[href="#home-short-form"]').count()
  };
  return { present: true, stickyAfterHero, stickyWithMenu, stickyOnScenario, stickyOnForm, stickyAfterNavigation, questionCount, answerTargets, shortFormTargets, shortStageFocus, overflow };
}

try {
  const requestContext = await browser.newContext();
  const requestPage = await requestContext.newPage();
  for (const route of routes) {
    const response = await requestPage.request.get(`${origin}${route}`);
    report.routes[route] = response.status();
    if (!response.ok()) report.failures.push(`route ${route}: HTTP ${response.status()}`);
  }
  await requestContext.close();

  const videoDirectory = path.join(output, '.video');
  await fs.mkdir(videoDirectory, { recursive: true });
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    recordVideo: { dir: videoDirectory, size: { width: 1440, height: 1000 } }
  });
  const desktop = await desktopContext.newPage();
  const desktopErrors = collectErrors(desktop);
  await desktop.goto(origin, { waitUntil: 'networkidle' });
  const desktopBroken = await settleImages(desktop);
  const desktopOverview = await captureFullPageOrViewport(desktop, 'desktop-1440.png');
  await captureHeroFrames(desktop);
  const hero = desktop.locator('.hero, [data-v2-hero]').first();
  const heroBounds = await hero.evaluate((node) => {
    const top = node.getBoundingClientRect().top + scrollY;
    return { top, distance: Math.max(1, node.scrollHeight - innerHeight) };
  });
  for (let step = 0; step <= 28; step += 1) {
    await desktop.evaluate(({ top, distance, progress }) => scrollTo(0, top + distance * progress), {
      ...heroBounds,
      progress: step / 28
    });
    await desktop.waitForTimeout(70);
  }
  await desktop.waitForTimeout(700);
  await hydrateDeferredStory(desktop);
  report.pathLab.desktop = await verifyPathLabDesktop(desktop);
  report.construction.desktop = await verifyConstructionDesktop(desktop);
  report.renovation.desktop = await verifyRenovationDesktop(desktop);
  report.measuredEvidence.desktop = await verifyMeasuredEvidenceDesktop(desktop);
  report.scenarioConversion.desktop = await verifyScenarioConversionDesktop(desktop);
  const desktopOverflow = await horizontalOverflow(desktop);
  report.desktop = { errors: desktopErrors, brokenImages: desktopBroken, overflow: desktopOverflow, overview: desktopOverview };
  report.failures.push(...desktopErrors, ...desktopBroken.map((src) => `broken image: ${src}`));
  if (desktopOverflow.amount > 1) report.failures.push(`desktop overflow: ${desktopOverflow.amount}px`);
  const video = desktop.video();
  await desktop.close();
  await desktopContext.close();
  if (video) await video.saveAs(path.join(output, 'motion.webm'));
  await fs.rm(videoDirectory, { recursive: true, force: true });

  const mobileContext = await browser.newContext({
    ...devices['Pixel 5'],
    viewport: { width: 390, height: 844 },
    screen: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobile = await mobileContext.newPage();
  const mobileErrors = collectErrors(mobile);
  await mobile.goto(origin, { waitUntil: 'networkidle' });
  const mobileBroken = await settleImages(mobile);
  const mobileOverview = await captureFullPageOrViewport(mobile, 'mobile-390.png');
  await captureHeroFrames(mobile, 'mobile-');
  await hydrateDeferredStory(mobile);
  report.pathLab.mobile = await verifyPathLabMobile(mobile);
  report.construction.mobile = await verifyConstructionMobile(mobile);
  report.renovation.mobile = await verifyRenovationMobile(mobile);
  report.measuredEvidence.mobile = await verifyMeasuredEvidenceMobile(mobile);
  report.scenarioConversion.mobile = await verifyScenarioConversionMobile(mobile);
  await mobile.goto(origin, { waitUntil: 'networkidle' });
  const touchInteractions = [];
  const heroStateButtons = mobile.locator('.state-controls button:visible, .state-index button:visible');
  if (await heroStateButtons.count() >= 2) {
    await heroStateButtons.nth(1).tap();
    await mobile.waitForTimeout(700);
    const heroElement = mobile.locator('.hero');
    const stateAfterTap = await heroElement.getAttribute((await heroElement.getAttribute('data-mobile-phase')) !== null ? 'data-mobile-phase' : 'data-state');
    if (stateAfterTap !== '1') report.failures.push(`touch: hero state tap resolved to ${stateAfterTap || 'null'}, expected 1`);
    else touchInteractions.push('hero state control tapped and state 1 asserted');
  }
  const menuTrigger = mobile.locator('.menu-trigger');
  if (await menuTrigger.count()) {
    await menuTrigger.tap();
    const opened = await menuTrigger.getAttribute('aria-expanded');
    if (opened !== 'true') report.failures.push('touch: menu did not open after tap');
    else touchInteractions.push('menu opened by tap');
    const firstMenuLink = mobile.locator('#site-menu a').first();
    await firstMenuLink.tap();
    await mobile.waitForTimeout(120);
    const closed = await menuTrigger.getAttribute('aria-expanded');
    if (closed !== 'false') report.failures.push('touch: menu did not close after tapping a navigation link');
    else touchInteractions.push('menu navigation link tapped and menu close asserted');
  }
  const mobileOverflow = await horizontalOverflow(mobile);
  report.mobile = {
    errors: mobileErrors,
    brokenImages: mobileBroken,
    overflow: mobileOverflow,
    overview: mobileOverview,
    touch: touchInteractions.length >= 3,
    touchInteractions
  };
  report.failures.push(...mobileErrors, ...mobileBroken.map((src) => `mobile broken image: ${src}`));
  if (report.pathLab.desktop.present) {
    if (report.pathLab.desktop.stateCount !== 6 || new Set(report.pathLab.desktop.states).size !== 6) report.failures.push('path lab: all six desktop states were not captured');
    if (report.pathLab.desktop.transitionDurationMs < 700 || report.pathLab.desktop.transitionDurationMs > 1100) report.failures.push(`path lab: measured transition ${report.pathLab.desktop.transitionDurationMs}ms is outside 700–1100ms`);
    if (report.pathLab.desktop.homeKey !== 'impact' || report.pathLab.desktop.arrowKey !== 'voices') report.failures.push('path lab: keyboard Home/ArrowRight semantics failed');
    if (report.pathLab.desktop.persistenceBeforeReload.query !== 'bass' || report.pathLab.desktop.persistenceBeforeReload.session !== 'bass' || report.pathLab.desktop.persistedKey !== 'bass') report.failures.push('path lab: URL/session persistence failed');
    if (report.pathLab.desktop.downstream.scenarioNoise !== 'bass' || report.pathLab.desktop.downstream.diagnosisNoise !== 'Бас и музыка' || !report.pathLab.desktop.downstream.diagnosisContextVisible) report.failures.push('path lab: downstream scenario/diagnosis hydration failed');
    report.failures.push(...report.pathLab.desktop.downstream.diagnosisErrors);
    if (report.pathLab.desktop.runningAnimations) report.failures.push(`path lab: ${report.pathLab.desktop.runningAnimations} animations still running after route completion`);
  }
  if (report.pathLab.mobile.present && (report.pathLab.mobile.selectedByDirectControl !== 'road' || report.pathLab.mobile.selectedByNext !== 'ventilation')) report.failures.push('path lab: mobile direct/next selection failed');
  if (report.construction.desktop.present) {
    if (report.construction.desktop.contextCount !== 3 || new Set(report.construction.desktop.contexts).size !== 3 || report.construction.desktop.finalSteps.some((step) => step !== '7')) report.failures.push('construction: three contexts did not complete and hold');
    if (report.construction.desktop.homeContext !== 'wall' || report.construction.desktop.arrowContext !== 'ceiling') report.failures.push('construction: context keyboard semantics failed');
    if (report.construction.desktop.bridgeStep !== '3' || report.construction.desktop.controlledStep !== '7') report.failures.push('construction: datum controls failed');
    if (report.construction.desktop.runningAnimations) report.failures.push(`construction: ${report.construction.desktop.runningAnimations} animations still running after final hold`);
  }
  if (report.construction.mobile.present && (report.construction.mobile.context !== 'floor' || report.construction.mobile.expandedStep !== '1' || report.construction.mobile.bridgeStep !== '3' || report.construction.mobile.controlledStep !== '7')) report.failures.push('construction: mobile context/state controls failed');
  if (report.construction.mobile.present && (report.construction.mobile.controlGroupRole !== 'group' || report.construction.mobile.expandedPressed?.[1] !== 'true' || report.construction.mobile.bridgePressed?.[2] !== 'true' || report.construction.mobile.controlledPressed?.[3] !== 'true')) report.failures.push('construction: mobile selected state is not exposed semantically');
  if (report.renovation.desktop.present) {
    if (report.renovation.desktop.layerCount !== 3 || !report.renovation.desktop.decodedPlates) report.failures.push('renovation: three decoded desktop plates were not present');
    if (report.renovation.desktop.localMaskCount < 8 || report.renovation.desktop.uniqueLocalMaskClipPaths < 3) report.failures.push(`renovation: local reveal zones were not distinct (${report.renovation.desktop.localMaskCount} masks, ${report.renovation.desktop.uniqueLocalMaskClipPaths} clip paths)`);
    if (report.renovation.desktop.textTransitionAnimations < 1) report.failures.push('renovation: no finite narrative text transition was observed');
    if (report.renovation.desktop.sectionHeightSvh < 185 || report.renovation.desktop.sectionHeightSvh > 215) report.failures.push(`renovation: desktop range ${report.renovation.desktop.sectionHeightSvh}svh is outside 185–215svh`);
    if (report.renovation.desktop.states.join(',') !== 'newbuild,renovation,finished') report.failures.push(`renovation: desktop sequence resolved to ${report.renovation.desktop.states.join(',')}`);
    if (report.renovation.desktop.ctaTargets.some((href) => href !== '/diagnostika-shuma/')) report.failures.push('renovation: desktop CTA does not lead to diagnosis');
    if (report.renovation.desktop.runningAnimations) report.failures.push(`renovation: ${report.renovation.desktop.runningAnimations} animations remain after final hold`);
  }
  if (report.renovation.mobile.present) {
    if (report.renovation.mobile.frameCount !== 3 || report.renovation.mobile.states.join(',') !== 'newbuild,renovation,finished' || !report.renovation.mobile.decodedPlates) report.failures.push('renovation: mobile does not expose three decoded cinematic frames');
    if (report.renovation.mobile.controlCount !== 3 || report.renovation.mobile.selected.join(',') !== '0,1,2') report.failures.push(`renovation: mobile frame controls resolved to ${report.renovation.mobile.selected.join(',')}`);
    if (report.renovation.mobile.targetRects.some((rect) => rect.width < 44 || rect.height < 44)) report.failures.push(`renovation: mobile frame controls below 44px (${report.renovation.mobile.targetRects.map((rect) => `${rect.width}x${rect.height}`).join(', ')})`);
    if (report.renovation.mobile.ctaTargets.some((href) => href !== '/diagnostika-shuma/')) report.failures.push('renovation: mobile CTA does not lead to diagnosis');
  }
  if (report.measuredEvidence.desktop.present) {
    const measured = report.measuredEvidence.desktop;
    if (measured.dominantCount !== 1 || measured.supportingCount !== 2) report.failures.push(`measured evidence: expected one dominant and two supporting cases, found ${measured.dominantCount}/${measured.supportingCount}`);
    if (measured.graphTypes.join(',') !== 'envelope,peak,band') report.failures.push(`measured evidence: graph types resolved to ${measured.graphTypes.join(',')}`);
    if (measured.visibleNumbers.join(',') !== '58 dB,39 dB,71 dB,−16 dB,64 dB,43 dB') report.failures.push(`measured evidence: visible graph numbers resolved to ${measured.visibleNumbers.join(',')}`);
    if (measured.disclaimerCount !== 3 || measured.disclaimerHiddenCount !== 0) report.failures.push(`measured evidence: illustrative disclaimers total ${measured.disclaimerCount}, hidden ${measured.disclaimerHiddenCount}`);
    if (measured.detailLabels.length < 6) report.failures.push(`measured evidence: dominant case exposes only ${measured.detailLabels.length} detail labels`);
    if (measured.caseTargets.length !== 3 || measured.caseTargets.some((href) => !href?.startsWith('/cases/'))) report.failures.push('measured evidence: all three case links were not present');
    if (measured.diagnosisTargets.some((href) => href !== '/diagnostika-shuma/')) report.failures.push('measured evidence: diagnosis CTA target is incorrect');
    if (measured.graphRuns.some((run) => !run.animatedOnce || run.finalState !== 'complete' || run.animationsAfterCompletion !== 0)) report.failures.push('measured evidence: graphs did not animate once and settle');
    if (measured.dominantHeightSvh > 150) report.failures.push(`measured evidence: dominant case is ${measured.dominantHeightSvh}svh`);
  }
  if (report.measuredEvidence.mobile.present) {
    if (report.measuredEvidence.mobile.collision) report.failures.push('measured evidence: mobile illustration label overlaps dominant case eyebrow');
    if (report.measuredEvidence.mobile.graphCount !== 3 || report.measuredEvidence.mobile.results.length !== 3) report.failures.push('measured evidence: mobile does not expose three complete case summaries');
  }
  if (report.scenarioConversion.desktop.present) {
    const flow = report.scenarioConversion.desktop;
    if (flow.initialQuestionCount !== 1 || flow.backStep !== '1' || flow.finalStep !== '7' || flow.complete !== 'true') report.failures.push('scenario: one-question progression, back, or completion state failed');
    if (flow.runningAnimations || flow.qualityRunningAnimations) report.failures.push(`scenario/conversion: ${flow.runningAnimations + flow.qualityRunningAnimations} animations remain after final hold`);
    if (!flow.persisted.complete || flow.persisted.input?.noise !== 'impact' || flow.persisted.input?.path !== 'ceiling') report.failures.push('scenario: session persistence is incomplete');
    if (flow.outputLabels.join(',') !== 'Зоны осмотра,Масштаб вмешательства,Важные неизвестные,Следующий шаг') report.failures.push(`scenario: result labels resolved to ${flow.outputLabels.join(',')}`);
    if (flow.fullVisibleFieldsets !== 1 || flow.fullProgressCount !== 4 || flow.fullStepTwoVisible !== 1) report.failures.push('full form: progressive one-step flow failed');
    if (flow.fullStageFocus.outlineStyle === 'none' || flow.fullStageFocus.outlineWidth === '0px') report.failures.push('full form: radio card lacks visible focus state');
    if (flow.carried.heard !== 'Топот и ударный шум сверху' || flow.carried.direction !== 'above' || flow.carried.rooms !== 'Спальня' || flow.carried.stage !== 'renovation' || flow.carried.path !== 'ceiling' || flow.carried.priority !== 'balanced' || !flow.carried.sourceContext) report.failures.push('full form: scenario context did not carry across');
    if (flow.qualityReveals !== '4' || !flow.qualityImageDecoded || !flow.quietImageDecoded) report.failures.push('quality/conversion: four checks or raster plates failed');
    if (flow.faqCount !== 7) report.failures.push(`FAQ: expected 7 items, found ${flow.faqCount}`);
    if (flow.shortFieldNames.sort().join(',') !== 'email,heard,name,phone,stage') report.failures.push(`short form: primary fields resolved to ${flow.shortFieldNames.join(',')}`);
    if (flow.advancedFileCount !== 1) report.failures.push('short form: expandable advanced file input is missing');
  }
  if (report.scenarioConversion.mobile.present) {
    const flow = report.scenarioConversion.mobile;
    if (flow.stickyAfterHero.hidden !== 'false' || flow.stickyAfterHero.tabindex !== '0') report.failures.push('mobile sticky CTA: not visible/focusable after hero');
    if (flow.stickyWithMenu.opacity !== '0' || flow.stickyWithMenu.pointerEvents !== 'none' || flow.stickyWithMenu.hidden !== 'true' || flow.stickyWithMenu.tabindex !== '-1') report.failures.push('mobile sticky CTA: remains visible to pointer, keyboard, or accessibility tree with menu open');
    if (flow.stickyOnScenario !== 'true' || flow.stickyOnForm !== 'true') report.failures.push('mobile sticky CTA: overlaps scenario or final form');
    if (flow.stickyAfterNavigation.count || flow.stickyAfterNavigation.deadTargetCount) report.failures.push('mobile sticky CTA: survives client-side navigation away from homepage');
    if (flow.questionCount !== 1 || flow.answerTargets.some((rect) => rect.width < 44 || rect.height < 44)) report.failures.push('scenario mobile: question or answer target sizing failed');
    if (flow.shortFormTargets.some((rect) => rect.width < 44 || rect.height < 44)) report.failures.push(`short form mobile: control below 44px (${flow.shortFormTargets.map((rect) => `${rect.name}:${rect.width}x${rect.height}`).join(', ')})`);
    if (flow.shortStageFocus.outlineStyle === 'none' || flow.shortStageFocus.outlineWidth === '0px') report.failures.push('short form: radio card lacks visible focus state');
    if (flow.overflow.amount > 1) report.failures.push(`scenario/conversion mobile overflow: ${flow.overflow.amount}px`);
  }
  if (mobileOverflow.amount > 1) report.failures.push(`mobile overflow: ${mobileOverflow.amount}px`);
  await mobileContext.close();

  report.measuredEvidence.caseRoutes = await verifyCaseRoutes();
  const expectedCaseGraphTypes = { '58-39-db': 'envelope', 'impact-noise-minus-16-db': 'peak', '64-43-db': 'band' };
  for (const [slug, item] of Object.entries(report.measuredEvidence.caseRoutes.items)) {
    report.failures.push(...item.errors.map((error) => `case ${slug}: ${error}`));
    if (item.knownCount < 1 || item.unknownCount < 1 || item.panelHeadings.join(',') !== 'Известно,Неизвестно') report.failures.push(`case ${slug}: Known / Unknown panel is incomplete`);
    if (item.ledgerCount !== 5 || !item.limitationVisible || item.disclaimerCount < 1) report.failures.push(`case ${slug}: evidence chain, limitation, or disclaimer is incomplete`);
    if (item.graphType !== expectedCaseGraphTypes[slug] || !item.graphRun.animatedOnce || item.graphRun.finalState !== 'complete' || item.graphRun.animationsAfterCompletion !== 0) report.failures.push(`case ${slug}: finite ${expectedCaseGraphTypes[slug]} graph failed`);
    if (item.ctaTarget !== '/diagnostika-shuma/') report.failures.push(`case ${slug}: CTA does not lead to diagnosis`);
    if (!item.metadata.canonical || item.metadata.ogUrl !== item.metadata.canonical || item.metadata.structuredUrl !== item.metadata.canonical || item.metadata.ogUrl.includes('?') || item.metadata.structuredUrl.includes('?')) report.failures.push(`case ${slug}: canonical, og:url, and structured-data URL are not stable`);
    if (item.overflow.amount > 1) report.failures.push(`case ${slug}: horizontal overflow ${item.overflow.amount}px`);
  }
  report.failures.push(...report.measuredEvidence.caseRoutes.mobile.errors.map((error) => `case mobile: ${error}`));
  if (!report.measuredEvidence.caseRoutes.mobile.panelVisible || report.measuredEvidence.caseRoutes.mobile.overflow.amount > 1) report.failures.push('case mobile: Known / Unknown panel is not visible without overflow');

  report.serviceFamilies = await verifyServiceFamilies();
  const serviceImages = [];
  const heroGeometries = [];
  for (const [slug, item] of Object.entries(report.serviceFamilies.items)) {
    report.failures.push(...item.errors.map((error) => `service ${slug}: ${error}`), ...item.brokenImages.map((src) => `service ${slug}: broken image ${src}`));
    serviceImages.push(item.imageSrc);
    heroGeometries.push(JSON.stringify(item.heroGeometry));
    if (item.family !== item.expected.family || item.h1Count !== 1 || !item.h1 || !item.imageReady) report.failures.push(`service ${slug}: family, H1, or dominant image failed`);
    if (!item.canonical || !item.ogImage || !item.ogUrl || item.ogType !== 'website' || item.jsonLdCount < 1) report.failures.push(`service ${slug}: canonical, Open Graph metadata, or structured data missing`);
    if (item.ogUrl !== item.canonical || item.structuredUrl !== item.canonical || item.ogUrl.includes('?') || item.structuredUrl.includes('?')) report.failures.push(`service ${slug}: canonical, og:url, and structured-data URL are not stable`);
    if (!item.commercialHeadingUsesShumo || !item.visibleCopyUsesZvuko) report.failures.push(`service ${slug}: required шумоизоляция heading or natural visible звукоизоляция copy missing`);
    if (item.overflow > 1 || item.runningAnimations || item.infiniteAnimations) report.failures.push(`service ${slug}: ${item.overflow}px overflow, ${item.runningAnimations} running, ${item.infiniteAnimations} infinite animations after hold`);
    if (item.family === 'surface') {
      if (item.surface !== item.expected.surface || item.diagram !== item.expected.surface || item.directRouteCount !== 2 || item.stageConstraintCount < 3 || item.relatedCaseCount !== 1 || item.faqCount < 2 || item.diagnosisTargets < 1) report.failures.push(`surface ${slug}: dedicated diagram, routes, constraints, case, FAQ, or diagnosis CTA incomplete`);
      if (item.interaction.state !== 'flanking' || item.interaction.pressed?.length !== 1 || !item.interaction.readout) report.failures.push(`surface ${slug}: direct/flanking signature interaction failed`);
    } else if (item.family === 'situation') {
      if (item.situationPhaseCount !== 3 || item.decisionRiskCount !== 1 || item.likelyPathCount < 3 || item.interventionConstraintCount < 3 || item.relatedSurfaceCount < 2 || item.diagnosisTargets < 1) report.failures.push(`situation ${slug}: state/risk/path/constraint/related-surface/diagnosis flow incomplete`);
      if (item.interaction.state !== 'ограничение' || item.interaction.pressed?.length !== 1 || !item.interaction.readout) report.failures.push(`situation ${slug}: three-phase signature interaction failed`);
    } else {
      if (item.diagnosisStageCount !== 4 || item.diagnosisLimitationCount !== 1 || item.fullFormCount !== 1 || item.fullFormProgressCount !== 4 || item.visibleFieldsetCount !== 1) report.failures.push('diagnosis family: opening, limitations, or full progressive form incomplete');
      if (item.interaction.state !== '4' || item.interaction.pressed?.length !== 1 || !item.interaction.readout) report.failures.push('diagnosis family: four-stage signature interaction failed');
    }
  }
  if (new Set(serviceImages).size !== serviceImages.length) report.failures.push('service families: dominant raster asset is repeated between routes');
  if (new Set(heroGeometries).size !== heroGeometries.length) report.failures.push('service families: identical hero geometry repeated between routes');
  for (const [slug, item] of Object.entries(report.serviceFamilies.mobile)) {
    report.failures.push(...item.errors.map((error) => `service mobile ${slug}: ${error}`), ...item.brokenImages.map((src) => `service mobile ${slug}: broken image ${src}`));
    if (!item.h1Visible || !item.imageReady || item.overflow > 1 || item.clientWidth !== item.innerWidth || item.clientWidth !== item.scrollWidth) report.failures.push(`service mobile ${slug}: H1, image, or fixed CSS viewport width failed`);
    if (item.targetSizes.some((rect) => rect.width < 44 || rect.height < 44)) report.failures.push(`service mobile ${slug}: interactive target below 44px`);
  }

  report.mandatoryViewports.tablet768 = await captureMandatoryViewport(768, 1024, 'tablet-768');
  report.mandatoryViewports.mobile320 = await captureMandatoryViewport(320, 568, 'mobile-320');
  for (const [name, result] of Object.entries(report.mandatoryViewports)) {
    report.failures.push(...result.errors);
    if (result.geometry.collisions.length) {
      report.failures.push(`${name}: H1 collision with ${result.geometry.collisions.join(', ')}`);
    }
  }

  const reducedContext = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: 'reduce'
  });
  const reduced = await reducedContext.newPage();
  const reducedErrors = collectErrors(reduced);
  await reduced.goto(origin, { waitUntil: 'networkidle' });
  await hydrateDeferredStory(reduced);
  await reduced.waitForFunction(() => document.querySelector('.construction-decision')?.getAttribute('data-step') === '7', null, { timeout: 10_000 });
  const h1Visible = await reduced.locator('h1').isVisible();
  const diagnosisVisible = await reduced.getByRole('link', { name: /разобрать мой шум|диагност/i }).first().isVisible();
  const reducedGraphs = reduced.locator('#measured-evidence .evidence-graph');
  const reducedGraphStates = await reducedGraphs.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-graph-state')));
  const reducedGraphAnimations = await reducedGraphs.evaluateAll((nodes) => nodes.reduce((total, node) => total + node.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length, 0));
  await reduced.waitForTimeout(300);
  const reducedMotionState = await reduced.evaluate(() => {
    const infiniteNodes = [...document.querySelectorAll('body *')]
      .filter((node) => getComputedStyle(node).animationIterationCount.split(',').some((value) => value.trim() === 'infinite'))
      .map((node) => `${node.tagName.toLowerCase()}.${node.className || ''}`)
      .slice(0, 20);
    const runningAnimations = document.getAnimations()
      .filter((animation) => animation.playState === 'running')
      .map((animation) => {
        const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
        return target instanceof Element ? `${target.tagName.toLowerCase()}.${target.className || ''}` : 'unknown';
      });
    const hero = document.querySelector('.hero');
    const stages = document.querySelector('.renovation-morph .mobile-sequence, .stages .stage-frame');
    const construction = document.querySelector('.construction-decision');
    return {
      infiniteNodes,
      runningAnimations,
      heroHeight: hero ? getComputedStyle(hero).height : null,
      renovationPosition: stages ? getComputedStyle(stages).position : null,
      constructionStep: construction?.getAttribute('data-step') || null
    };
  });
  await reduced.screenshot({ path: path.join(output, 'reduced-motion.png') });
  report.reducedMotion = { errors: reducedErrors, h1Visible, diagnosisVisible, graphStates: reducedGraphStates, graphAnimations: reducedGraphAnimations, ...reducedMotionState };
  report.failures.push(...reducedErrors);
  if (!h1Visible) report.failures.push('reduced motion: H1 is not visible');
  if (!diagnosisVisible) report.failures.push('reduced motion: diagnosis CTA is not visible');
  if (reducedMotionState.infiniteNodes.length) report.failures.push(`reduced motion: infinite animations remain on ${reducedMotionState.infiniteNodes.join(', ')}`);
  if (reducedMotionState.runningAnimations.length) report.failures.push(`reduced motion: animations still running on ${reducedMotionState.runningAnimations.join(', ')}`);
  if (reducedGraphStates.some((state) => state !== 'complete') || reducedGraphAnimations) report.failures.push('reduced motion: measured-evidence graphs are not fully static');
  if (reducedMotionState.renovationPosition === 'sticky') report.failures.push('reduced motion: renovation scene remains sticky');
  if (reducedMotionState.constructionStep && reducedMotionState.constructionStep !== '7') report.failures.push(`reduced motion: construction resolved to step ${reducedMotionState.constructionStep}, expected 7`);
  await reducedContext.close();

  const reducedMobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    screen: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce'
  });
  const reducedMobile = await reducedMobileContext.newPage();
  const reducedMobileErrors = collectErrors(reducedMobile);
  await reducedMobile.goto(origin, { waitUntil: 'networkidle' });
  const summary = reducedMobile.locator('.reduced-summary');
  await summary.scrollIntoViewIfNeeded();
  const mobileSummaryVisible = await summary.isVisible();
  const mobileConclusionVisible = await reducedMobile.getByText('Конструкция появляется только после диагноза.', { exact: true }).last().isVisible();
  const mobileReducedAnimations = await reducedMobile.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length);
  const reducedMobileOverview = await captureFullPageOrViewport(reducedMobile, 'reduced-motion-mobile.png');
  report.reducedMotion.mobile = {
    errors: reducedMobileErrors,
    summaryVisible: mobileSummaryVisible,
    conclusionVisible: mobileConclusionVisible,
    runningAnimations: mobileReducedAnimations,
    overview: reducedMobileOverview
  };
  report.failures.push(...reducedMobileErrors);
  if (!mobileSummaryVisible || !mobileConclusionVisible) report.failures.push('reduced motion mobile: static diagnostic summary is not visible');
  if (mobileReducedAnimations) report.failures.push(`reduced motion mobile: ${mobileReducedAnimations} animations still running`);
  await reducedMobileContext.close();
} finally {
  await browser.close();
}

await fs.writeFile(path.join(output, 'browser-evidence.json'), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(output, 'interaction-notes.md'), [
  `# Slice ${slice} browser evidence`,
  '',
  `Captured from ${origin} at ${report.capturedAt}.`,
  '',
  `- Desktop console/runtime errors: ${report.desktop.errors?.length || 0}`,
  `- Desktop broken images: ${report.desktop.brokenImages?.length || 0}`,
  `- Desktop horizontal overflow: ${report.desktop.overflow?.amount || 0}px`,
  `- Mobile console/runtime errors: ${report.mobile.errors?.length || 0}`,
  `- Mobile broken images: ${report.mobile.brokenImages?.length || 0}`,
  `- Mobile horizontal overflow: ${report.mobile.overflow?.amount || 0}px`,
  `- Mandatory viewport H1 collisions: ${Object.values(report.mandatoryViewports).flatMap((item) => item.geometry?.collisions || []).length}`,
  `- Touch-emulated interactions: ${report.mobile.touch ? report.mobile.touchInteractions.join('; ') : 'not completed'}`,
  `- Path lab desktop states/keyboard/persistence: ${report.pathLab.desktop?.stateCount === 6 && report.pathLab.desktop?.homeKey === 'impact' && report.pathLab.desktop?.persistedKey === 'bass' ? 'verified' : 'not verified'}`,
  `- Path lab scenario/diagnosis hydration: ${report.pathLab.desktop?.downstream?.scenarioNoise === 'bass' && report.pathLab.desktop?.downstream?.diagnosisContextVisible ? 'verified' : 'not verified'}`,
  `- Path lab mobile direct/next selection: ${report.pathLab.mobile?.selectedByDirectControl === 'road' && report.pathLab.mobile?.selectedByNext === 'ventilation' ? 'verified' : 'not verified'}`,
  `- Construction wall/ceiling/floor final hold: ${report.construction.desktop?.finalSteps?.every((step) => step === '7') ? 'verified' : 'not verified'}`,
  `- Construction mobile expanded/bridge/controlled states: ${report.construction.mobile?.expandedStep === '1' && report.construction.mobile?.controlledStep === '7' ? 'verified' : 'not verified'}`,
  `- Renovation desktop layered newbuild/renovation/finished sequence: ${report.renovation.desktop?.states?.join(',') === 'newbuild,renovation,finished' ? 'verified' : 'not verified'}`,
  `- Renovation desktop local masks/text transition: ${report.renovation.desktop?.localMaskCount || 0} masks, ${report.renovation.desktop?.uniqueLocalMaskClipPaths || 0} distinct clip paths, ${report.renovation.desktop?.textTransitionAnimations || 0} running transition(s) observed`,
  `- Renovation mobile three-frame sequence: ${report.renovation.mobile?.frameCount === 3 && report.renovation.mobile?.selected?.join(',') === '0,1,2' ? 'verified' : 'not verified'}`,
  `- Measured evidence dominant/supporting structure: ${report.measuredEvidence.desktop?.dominantCount === 1 && report.measuredEvidence.desktop?.supportingCount === 2 ? 'verified' : 'not verified'}`,
  `- Measured evidence finite graph types: ${report.measuredEvidence.desktop?.graphTypes?.join(',') || 'not captured'}`,
  `- Measured evidence graph completion: ${report.measuredEvidence.desktop?.graphRuns?.every((run) => run.finalState === 'complete' && run.animationsAfterCompletion === 0) ? 'verified' : 'not verified'}`,
  `- Case routes Known / Unknown panels: ${Object.values(report.measuredEvidence.caseRoutes?.items || {}).every((item) => item.knownCount > 0 && item.unknownCount > 0) ? 'verified' : 'not verified'}`,
  `- Service family routing: ${Object.values(report.serviceFamilies.items || {}).map((item) => `${item.expected.slug}:${item.family}`).join(', ') || 'not captured'}`,
  `- Surface wall/ceiling/floor diagrams and flanking toggle: ${Object.values(report.serviceFamilies.items || {}).filter((item) => item.family === 'surface').every((item) => item.diagram === item.surface && item.interaction.state === 'flanking') ? 'verified' : 'not verified'}`,
  `- Situation state/risk/path/constraint sequence: ${Object.values(report.serviceFamilies.items || {}).filter((item) => item.family === 'situation').every((item) => item.situationPhaseCount === 3 && item.interaction.state === 'ограничение') ? 'verified' : 'not verified'}`,
  `- Diagnosis four-stage opening / full progressive form: ${report.serviceFamilies.items?.['diagnostika-shuma']?.diagnosisStageCount === 4 && report.serviceFamilies.items?.['diagnostika-shuma']?.fullFormProgressCount === 4 ? 'verified' : 'not verified'}`,
  `- Service dominant raster uniqueness: ${new Set(Object.values(report.serviceFamilies.items || {}).map((item) => item.imageSrc)).size === Object.keys(report.serviceFamilies.items || {}).length ? 'verified' : 'not verified'}`,
  `- Service mobile representative families: ${Object.keys(report.serviceFamilies.mobile || {}).join(', ') || 'not captured'}`,
  `- Scenario one-question/back/complete/persistence: ${report.scenarioConversion.desktop?.initialQuestionCount === 1 && report.scenarioConversion.desktop?.backStep === '1' && report.scenarioConversion.desktop?.complete === 'true' && report.scenarioConversion.desktop?.persisted?.complete ? 'verified' : 'not verified'}`,
  `- Scenario to full-form context carry: ${report.scenarioConversion.desktop?.carried?.path === 'ceiling' && report.scenarioConversion.desktop?.fullVisibleFieldsets === 1 ? 'verified' : 'not verified'}`,
  `- Quality four-check finite sequence: ${report.scenarioConversion.desktop?.qualityReveals === '4' && report.scenarioConversion.desktop?.qualityRunningAnimations === 0 ? 'verified' : 'not verified'}`,
  `- FAQ exact count / short form primary fields: ${report.scenarioConversion.desktop?.faqCount || 0} / ${report.scenarioConversion.desktop?.shortFieldNames?.join(',') || 'not captured'}`,
  `- Mobile sticky after hero / hidden on scenario and form: ${report.scenarioConversion.mobile?.stickyAfterHero?.hidden === 'false' && report.scenarioConversion.mobile?.stickyOnScenario === 'true' && report.scenarioConversion.mobile?.stickyOnForm === 'true' ? 'verified' : 'not verified'}`,
  `- Mobile sticky removed on client navigation / hidden from AX with menu: ${report.scenarioConversion.mobile?.stickyAfterNavigation?.count === 0 && report.scenarioConversion.mobile?.stickyWithMenu?.hidden === 'true' && report.scenarioConversion.mobile?.stickyWithMenu?.tabindex === '-1' ? 'verified' : 'not verified'}`,
  `- Short/full radio visible focus: ${report.scenarioConversion.mobile?.shortStageFocus?.outlineWidth || 'not captured'} / ${report.scenarioConversion.desktop?.fullStageFocus?.outlineWidth || 'not captured'}`,
  `- Reduced-motion H1/CTA visible: ${report.reducedMotion.h1Visible && report.reducedMotion.diagnosisVisible ? 'yes' : 'no'}`,
  `- Reduced-motion infinite/running animations: ${(report.reducedMotion.infiniteNodes?.length || 0) + (report.reducedMotion.runningAnimations?.length || 0)}`,
  `- Reduced-motion mobile summary/conclusion visible: ${report.reducedMotion.mobile?.summaryVisible && report.reducedMotion.mobile?.conclusionVisible ? 'yes' : 'no'}`,
  `- Reduced-motion renovation sticky: ${report.reducedMotion.renovationPosition === 'sticky' ? 'yes' : 'no'}`,
  `- Route failures: ${Object.values(report.routes).filter((status) => status >= 400).length}`,
  `- Capture failures: ${report.failures.length ? report.failures.join(' | ') : 'none observed'}`,
  '',
  'This script captures current evidence only. It never writes PASS/FAIL or reviewer conclusions.'
].join('\n'));

console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
