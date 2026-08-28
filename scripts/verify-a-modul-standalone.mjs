import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const standaloneFile = resolve('apps', 'a-modul', 'standalone', 'a-modul-direct.html');
const outputDirectory = resolve('reviews', 'a-modul-v2', 'visual-simplification', 'standalone');
const fileUrl = pathToFileURL(standaloneFile).href;
const html = await readFile(standaloneFile, 'utf8');

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--allow-file-access-from-files']
});

const defects = {
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  brokenImages: []
};

async function inspectViewport(width, height, label) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('console', (message) => {
    if (message.type() === 'error') defects.consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => defects.pageErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? 'unknown';
    if (request.resourceType() === 'image' && failure.includes('ERR_ABORTED')) return;
    defects.failedRequests.push(`${label}: ${request.url()} — ${failure}`);
  });

  await page.goto(fileUrl, { waitUntil: 'load', timeout: 60_000 });
  await page.locator('h1').waitFor({ state: 'visible', timeout: 30_000 });
  await page.waitForTimeout(1_000);

  const metrics = await page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      h1Visible: visible(document.querySelector('h1')),
      primaryCtaVisible: visible(document.querySelector('.hero__actions .button--primary')),
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imageCount: document.images.length,
      mapImages: document.querySelectorAll('#logistics svg image, .logistics-map svg image').length,
      finderPresent: Boolean(document.querySelector('#finder')),
      factoryTabs: document.querySelectorAll('#factory [role="tab"]').length,
      heroControls: document.querySelectorAll('.assembly__hud, .assembly__stages, .assembly__caption, .hero__context').length,
      publishedProjects: document.querySelectorAll('.published-projects__card').length,
      clientProofPresent: Boolean(document.querySelector('#client-proof')),
      projectTeam: document.querySelectorAll('.project-team__grid article').length,
      finalCtaPresent: Boolean(document.querySelector('.final-cta')),
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src)
    };
  });
  defects.brokenImages.push(...metrics.brokenImages.map((source) => `${label}: ${source}`));

  if (label === 'desktop') {
    await page.screenshot({ path: resolve(outputDirectory, 'standalone-desktop.png') });

    const logos = page.locator('#client-proof');
    if (await logos.count()) {
      await logos.scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(outputDirectory, 'standalone-logo-wall.png') });
    }
  } else {
    await page.screenshot({ path: resolve(outputDirectory, 'standalone-mobile-390.png') });
  }

  await page.close();
  return metrics;
}

const results = {
  file: standaloneFile,
  fileUrl,
  embedded: {
    generatedAvif: html.includes('data:image/avif;base64,'),
    fonts: html.includes('data:font/woff2;base64,'),
    officialProof: html.includes('"/official/project-amikan.png":"data:image/png;base64,') && html.includes('"/official/team-pitunin.jpg":"data:image/jpeg;base64,')
  },
  desktop: await inspectViewport(1440, 1000, 'desktop'),
  mobile: await inspectViewport(390, 844, 'mobile'),
  defects
};

await browser.close();

results.pass = Object.values(results.embedded).every(Boolean)
  && results.desktop.h1Count === 1
  && results.desktop.h1Visible
  && results.desktop.primaryCtaVisible
  && results.desktop.scrollWidth <= results.desktop.clientWidth
  && !results.desktop.finderPresent
  && results.desktop.factoryTabs === 0
  && results.desktop.mapImages === 0
  && results.desktop.heroControls === 0
  && results.desktop.publishedProjects === 4
  && results.desktop.clientProofPresent
  && results.desktop.projectTeam === 4
  && results.desktop.finalCtaPresent
  && results.mobile.h1Count === 1
  && results.mobile.h1Visible
  && results.mobile.primaryCtaVisible
  && results.mobile.scrollWidth <= results.mobile.clientWidth
  && Object.values(defects).every((items) => items.length === 0);

await writeFile(
  resolve(outputDirectory, 'standalone-qa-results.json'),
  `${JSON.stringify(results, null, 2)}\n`
);

if (!results.pass) {
  console.error(JSON.stringify(results, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Standalone QA PASS: ${standaloneFile}`);
}
