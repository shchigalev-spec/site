import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const [slice = 'slice-00', target = 'http://127.0.0.1:5175/modulnye-zdaniya/'] = process.argv.slice(2);
const output = resolve('reviews', 'a-modul-v2', slice);

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const defects = {
  consoleErrors: [],
  pageErrors: [],
  failedRequests: []
};

const desktopContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark',
  reducedMotion: 'no-preference'
});
await desktopContext.tracing.start({ screenshots: true, snapshots: true, sources: true });

const desktop = await desktopContext.newPage();
desktop.on('console', (message) => {
  if (message.type() === 'error') defects.consoleErrors.push(message.text());
});
desktop.on('pageerror', (error) => defects.pageErrors.push(error.message));
desktop.on('requestfailed', (request) => {
  defects.failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown'}`);
});

const response = await desktop.goto(target, { waitUntil: 'networkidle' });
if (!response?.ok()) throw new Error(`Target returned ${response?.status() ?? 'no response'}: ${target}`);

await desktop.screenshot({ path: resolve(output, 'desktop-1440.png'), fullPage: true });
await desktop.screenshot({ path: resolve(output, 'start.png') });

const desktopMetrics = await desktop.evaluate(() => ({
  title: document.title,
  h1Count: document.querySelectorAll('h1').length,
  landmarks: {
    header: document.querySelectorAll('header').length,
    main: document.querySelectorAll('main').length,
    footer: document.querySelectorAll('footer').length
  },
  viewportWidth: window.innerWidth,
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  documentHeight: document.documentElement.scrollHeight
}));

await desktop.keyboard.press('Tab');
const skipFocus = await desktop.evaluate(() => ({
  activeElement: document.activeElement?.className ?? document.activeElement?.tagName ?? null,
  hash: window.location.hash
}));
await desktop.screenshot({ path: resolve(output, 'skip-link-focus.png') });
await desktop.keyboard.press('Enter');
await desktop.waitForTimeout(100);
const skipTarget = await desktop.evaluate(() => ({
  activeElement: document.activeElement?.id ?? document.activeElement?.tagName ?? null,
  hash: window.location.hash,
  scrollY: window.scrollY
}));
await desktop.screenshot({ path: resolve(output, 'skip-link-target.png') });

await desktop.goto(target, { waitUntil: 'networkidle' });
await desktop.keyboard.press('Tab');
await desktop.keyboard.press('Tab');
const wordmarkFocus = await desktop.evaluate(() => {
  const element = document.activeElement;
  const style = element ? getComputedStyle(element) : null;
  return {
    activeElement: element?.className ?? element?.tagName ?? null,
    outlineStyle: style?.outlineStyle ?? null,
    outlineWidth: style?.outlineWidth ?? null,
    outlineColor: style?.outlineColor ?? null,
    outlineOffset: style?.outlineOffset ?? null
  };
});
await desktop.screenshot({ path: resolve(output, 'wordmark-focus.png') });

const contrastMetrics = await desktop.evaluate(() => {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  const luminance = (color) => {
    const values = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
    return 0.2126 * channel(values[0]) + 0.7152 * channel(values[1]) + 0.0722 * channel(values[2]);
  };
  const ratio = (foreground, background) => {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  };
  const opaqueBackground = (element) => {
    let current = element;
    while (current) {
      const color = getComputedStyle(current).backgroundColor;
      if (color && color !== 'rgba(0, 0, 0, 0)') return color;
      current = current.parentElement;
    }
    return 'rgb(24, 23, 27)';
  };
  return [
    '.audit-copy .eyebrow',
    '.route-map li span',
    '.source-strip span',
    '.principle .eyebrow',
    'footer'
  ].map((selector) => {
    const element = document.querySelector(selector);
    if (!element) return { selector, missing: true, ratio: 0 };
    const foreground = getComputedStyle(element).color;
    const background = opaqueBackground(element);
    return { selector, foreground, background, ratio: ratio(foreground, background) };
  });
});

const maxScrollY = await desktop.evaluate(() =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
);
await desktop.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), maxScrollY / 2);
await desktop.waitForTimeout(150);
await desktop.screenshot({ path: resolve(output, 'mid.png') });
const midScrollY = await desktop.evaluate(() => window.scrollY);

await desktop.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await desktop.waitForTimeout(150);
await desktop.screenshot({ path: resolve(output, 'end.png') });
const endScrollY = await desktop.evaluate(() => window.scrollY);

await desktopContext.tracing.stop({ path: resolve(output, 'playwright-trace.zip') });
await desktopContext.close();

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: 'dark',
  reducedMotion: 'reduce',
  hasTouch: true
});
const mobile = await mobileContext.newPage();
mobile.on('console', (message) => {
  if (message.type() === 'error') defects.consoleErrors.push(`mobile: ${message.text()}`);
});
mobile.on('pageerror', (error) => defects.pageErrors.push(`mobile: ${error.message}`));
mobile.on('requestfailed', (request) => {
  defects.failedRequests.push(`mobile: ${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown'}`);
});

const mobileResponse = await mobile.goto(target, { waitUntil: 'networkidle' });
if (!mobileResponse?.ok()) throw new Error(`Mobile target returned ${mobileResponse?.status() ?? 'no response'}: ${target}`);
await mobile.screenshot({ path: resolve(output, 'mobile-390.png'), fullPage: true });

const mobileMetrics = await mobile.evaluate(() => ({
  viewportWidth: window.innerWidth,
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  documentHeight: document.documentElement.scrollHeight,
  h1: (() => {
    const heading = document.querySelector('h1');
    return heading ? { clientWidth: heading.clientWidth, scrollWidth: heading.scrollWidth } : null;
  })(),
  sourceCells: Array.from(document.querySelectorAll('.source-strip > div')).map((element, index) => ({
    index,
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  })),
  minInteractiveTarget: Array.from(document.querySelectorAll('a, button, input, select, textarea'))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, width: rect.width, height: rect.height };
    })
    .sort((a, b) => Math.min(a.width, a.height) - Math.min(b.width, b.height))[0] ?? null
}));

await mobileContext.close();

const narrowContext = await browser.newContext({
  viewport: { width: 320, height: 568 },
  colorScheme: 'dark',
  reducedMotion: 'reduce',
  hasTouch: true
});
const narrow = await narrowContext.newPage();
narrow.on('console', (message) => {
  if (message.type() === 'error') defects.consoleErrors.push(`mobile-320: ${message.text()}`);
});
narrow.on('pageerror', (error) => defects.pageErrors.push(`mobile-320: ${error.message}`));
narrow.on('requestfailed', (request) => {
  defects.failedRequests.push(`mobile-320: ${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown'}`);
});
const narrowResponse = await narrow.goto(target, { waitUntil: 'networkidle' });
if (!narrowResponse?.ok()) throw new Error(`320 target returned ${narrowResponse?.status() ?? 'no response'}: ${target}`);
await narrow.screenshot({ path: resolve(output, 'mobile-320.png'), fullPage: true });
const narrowMetrics = await narrow.evaluate(() => {
  const heading = document.querySelector('h1');
  return {
    viewportWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    h1: heading ? { clientWidth: heading.clientWidth, scrollWidth: heading.scrollWidth } : null,
    sourceCells: Array.from(document.querySelectorAll('.source-strip > div')).map((element, index) => ({
      index,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth
    }))
  };
});
await narrowContext.close();

// A 320px classic-scrollbar browser leaves a 305px layout client area.
// Capture that available-width condition explicitly because headless Chromium uses overlay scrollbars.
const classicClientContext = await browser.newContext({
  viewport: { width: 305, height: 568 },
  colorScheme: 'dark',
  reducedMotion: 'reduce',
  hasTouch: true
});
const classicClient = await classicClientContext.newPage();
classicClient.on('console', (message) => {
  if (message.type() === 'error') defects.consoleErrors.push(`classic-client-305: ${message.text()}`);
});
classicClient.on('pageerror', (error) => defects.pageErrors.push(`classic-client-305: ${error.message}`));
classicClient.on('requestfailed', (request) => {
  defects.failedRequests.push(`classic-client-305: ${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown'}`);
});
const classicResponse = await classicClient.goto(target, { waitUntil: 'networkidle' });
if (!classicResponse?.ok()) throw new Error(`305 target returned ${classicResponse?.status() ?? 'no response'}: ${target}`);
await classicClient.screenshot({ path: resolve(output, 'mobile-320-classic-client.png'), fullPage: true });
const classicClientMetrics = await classicClient.evaluate(() => {
  const heading = document.querySelector('h1');
  return {
    viewportWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    h1: heading ? { clientWidth: heading.clientWidth, scrollWidth: heading.scrollWidth } : null,
    sourceCells: Array.from(document.querySelectorAll('.source-strip > div')).map((element, index) => ({
      index,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth
    }))
  };
});
await classicClientContext.close();
await browser.close();

await sharp(resolve(output, 'start.png'))
  .composite([{ input: resolve(output, 'end.png'), blend: 'difference' }])
  .png()
  .toFile(resolve(output, 'diff-start-end.png'));

const results = {
  slice,
  target,
  capturedAt: new Date().toISOString(),
  desktop: {
    ...desktopMetrics,
    midScrollY,
    endScrollY,
    keyboard: { skipFocus, skipTarget, wordmarkFocus },
    contrast: contrastMetrics
  },
  mobile: mobileMetrics,
  mobile320: narrowMetrics,
  classicScrollbarClient305: classicClientMetrics,
  defects
};

await writeFile(resolve(output, 'capture-results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);

if (
  desktopMetrics.h1Count !== 1 ||
  desktopMetrics.scrollWidth > desktopMetrics.clientWidth ||
  mobileMetrics.scrollWidth > mobileMetrics.clientWidth ||
  (mobileMetrics.h1 ? mobileMetrics.h1.scrollWidth > mobileMetrics.h1.clientWidth : true) ||
  mobileMetrics.sourceCells.some((cell) => cell.scrollWidth > cell.clientWidth) ||
  narrowMetrics.scrollWidth > narrowMetrics.clientWidth ||
  (narrowMetrics.h1 ? narrowMetrics.h1.scrollWidth > narrowMetrics.h1.clientWidth : true) ||
  narrowMetrics.sourceCells.some((cell) => cell.scrollWidth > cell.clientWidth) ||
  classicClientMetrics.scrollWidth > classicClientMetrics.clientWidth ||
  (classicClientMetrics.h1 ? classicClientMetrics.h1.scrollWidth > classicClientMetrics.h1.clientWidth : true) ||
  classicClientMetrics.sourceCells.some((cell) => cell.scrollWidth > cell.clientWidth) ||
  midScrollY <= 0 ||
  midScrollY >= endScrollY ||
  skipFocus.activeElement !== 'skip-link' ||
  skipTarget.activeElement !== 'main' ||
  skipTarget.hash !== '#main' ||
  wordmarkFocus.activeElement !== 'wordmark' ||
  Number.parseFloat(wordmarkFocus.outlineWidth ?? '0') < 2 ||
  contrastMetrics.some((entry) => entry.missing || entry.ratio < 4.5) ||
  defects.consoleErrors.length > 0 ||
  defects.pageErrors.length > 0 ||
  defects.failedRequests.length > 0
) {
  process.exitCode = 1;
}
