import { chromium, devices } from '@playwright/test';

const origin = process.env.TECH_ORIGIN || 'http://127.0.0.1:5173';
const routes = process.argv.slice(2).length ? process.argv.slice(2) : [
  '/shumoizolyatsiya-kvartiry/',
  '/shumoizolyatsiya-ot-sosedey/',
  '/shumoizolyatsiya-v-novostroyke/',
  '/shumoizolyatsiya-v-gotovoy-kvartire/'
];
const browser = await chromium.launch();
const results = [];

for (const width of [390, 320]) {
  const context = await browser.newContext({
    ...devices['Pixel 5'],
    viewport: { width, height: width === 390 ? 844 : 568 },
    screen: { width, height: width === 390 ? 844 : 568 },
    isMobile: true,
    hasTouch: true
  });
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    results.push(await page.evaluate(({ route, requestedWidth }) => {
      const clientWidth = document.documentElement.clientWidth;
      return {
        route,
        requestedWidth,
        clientWidth,
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: Math.max(0, document.documentElement.scrollWidth - clientWidth),
        nodes: [...document.querySelectorAll('body *')]
          .map((node) => ({ node, rect: node.getBoundingClientRect(), style: getComputedStyle(node) }))
          .filter(({ rect, style }) => style.position !== 'fixed' && (rect.right > clientWidth + 1 || rect.left < -1))
          .slice(0, 30)
          .map(({ node, rect }) => ({
            node: `${node.tagName.toLowerCase()}.${typeof node.className === 'string' ? node.className : ''}`,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            text: node.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) || ''
          }))
      };
    }, { route, requestedWidth: width }));
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.overflow > 1)) process.exitCode = 1;
