import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const concepts = [
  { name: 'tech', origin: process.env.TECH_ORIGIN ?? 'http://127.0.0.1:5173' },
  { name: 'engineering', origin: process.env.ENGINEERING_ORIGIN ?? 'http://127.0.0.1:5174' }
];
const viewports = [
  { name: 'desktop-1440', width: 1440, height: 1000 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'tablet-1024', width: 1024, height: 1366 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-375', width: 375, height: 812 }
];
const browser = await chromium.launch();
try {
  for (const concept of concepts) {
    const output = path.resolve('reviews', concept.name, 'final');
    await fs.mkdir(output, { recursive: true });
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(concept.origin, { waitUntil: 'networkidle' });
      const images = await page.locator('img').all();
      for (const image of images) {
        await image.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(50);
      }
      await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 15_000 });
      const broken = await page.locator('img').evaluateAll((nodes) => nodes.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src));
      if (broken.length) throw new Error(`${concept.name}/${viewport.name} broken images: ${broken.join(', ')}`);
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        scrollTo(0, 0);
      });
      await page.waitForFunction(() => scrollY === 0);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.waitForTimeout(420);
      await page.screenshot({ path: path.join(output, `${viewport.name}.png`), fullPage: true });
      if (errors.length) throw new Error(`${concept.name}/${viewport.name}: ${errors.join(' | ')}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
