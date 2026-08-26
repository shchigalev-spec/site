import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = resolve(repositoryRoot, 'apps/a-modul/standalone/src');
const outputPath = resolve(repositoryRoot, 'apps/a-modul/standalone/a-modul-direct.html');

const textSources = {
  INLINE_CSS: resolve(sourceDirectory, 'styles.css'),
  INLINE_JS: resolve(sourceDirectory, 'app.js')
};

const binarySources = {
  FONT_GEOLOGICA_CYRILLIC: ['font/woff2', 'node_modules/@fontsource/geologica/files/geologica-cyrillic-500-normal.woff2'],
  FONT_GEOLOGICA_LATIN: ['font/woff2', 'node_modules/@fontsource/geologica/files/geologica-latin-500-normal.woff2'],
  FONT_ONEST_CYRILLIC_400: ['font/woff2', 'node_modules/@fontsource/onest/files/onest-cyrillic-400-normal.woff2'],
  FONT_ONEST_LATIN_400: ['font/woff2', 'node_modules/@fontsource/onest/files/onest-latin-400-normal.woff2'],
  FONT_ONEST_CYRILLIC_600: ['font/woff2', 'node_modules/@fontsource/onest/files/onest-cyrillic-600-normal.woff2'],
  FONT_ONEST_LATIN_600: ['font/woff2', 'node_modules/@fontsource/onest/files/onest-latin-600-normal.woff2'],
  FONT_MONO_CYRILLIC: ['font/woff2', 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-cyrillic-500-normal.woff2'],
  FONT_MONO_LATIN: ['font/woff2', 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2'],
  GENERAL_HERO: ['image/avif', 'apps/a-modul/static/generated/a-modul-general-hero-operational-object-desktop.avif'],
  GENERAL_EMPTY: ['image/avif', 'apps/a-modul/static/generated/a-modul-general-hero-empty-site-desktop.avif'],
  GENERAL_PARTIAL: ['image/avif', 'apps/a-modul/static/generated/a-modul-general-hero-partial-settlement-desktop.avif'],
  GENERAL_FINAL: ['image/avif', 'apps/a-modul/static/generated/a-modul-general-final-desktop.avif'],
  SHIFT_HERO: ['image/avif', 'apps/a-modul/static/generated/a-modul-shift-hero-operational-camp-desktop.avif'],
  SHIFT_FINAL: ['image/avif', 'apps/a-modul/static/generated/a-modul-shift-final-desktop.avif'],
  OFFICE_HERO: ['image/avif', 'apps/a-modul/static/generated/a-modul-office-hero-desktop.avif'],
  OFFICE_FINAL: ['image/avif', 'apps/a-modul/static/generated/a-modul-office-final-desktop.avif'],
  DORM_HERO: ['image/avif', 'apps/a-modul/static/generated/a-modul-dormitory-hero-desktop.avif'],
  DORM_FINAL: ['image/avif', 'apps/a-modul/static/generated/a-modul-dormitory-final-desktop.avif'],
  GENERAL_CASE: ['image/avif', 'apps/a-modul/static/generated/a-modul-general-case-desktop.avif'],
  LOGISTICS_ROAD: ['image/avif', 'apps/a-modul/static/generated/a-modul-logistics-road-desktop.avif'],
  LOGISTICS_RAIL: ['image/avif', 'apps/a-modul/static/generated/a-modul-logistics-rail-desktop.avif'],
  LOGISTICS_SEA: ['image/avif', 'apps/a-modul/static/generated/a-modul-logistics-sea-desktop.avif'],
  LOGISTICS_WINTER: ['image/avif', 'apps/a-modul/static/generated/a-modul-logistics-winter-road-desktop.avif'],
  FACTORY_METAL: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-metal-desktop.avif'],
  FACTORY_FRAME: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-frame-desktop.avif'],
  FACTORY_ENVELOPE: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-envelope-desktop.avif'],
  FACTORY_ENGINEERING: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-engineering-desktop.avif'],
  FACTORY_FINISHING: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-finishing-desktop.avif'],
  FACTORY_CONTROL: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-control-desktop.avif'],
  FACTORY_SHIPMENT: ['image/avif', 'apps/a-modul/static/generated/a-modul-factory-shipment-desktop.avif']
};

let output = await readFile(resolve(sourceDirectory, 'index.html'), 'utf8');

for (const [token, path] of Object.entries(textSources)) {
  output = output.replaceAll(`{{${token}}}`, await readFile(path, 'utf8'));
}

for (const [token, [mimeType, relativePath]] of Object.entries(binarySources)) {
  const bytes = await readFile(resolve(repositoryRoot, relativePath));
  const dataUrl = `data:${mimeType};base64,${bytes.toString('base64')}`;
  output = output.replaceAll(`{{${token}}}`, dataUrl);
}

const unresolvedTokens = [...output.matchAll(/{{[A-Z0-9_]+}}/g)].map((match) => match[0]);
if (unresolvedTokens.length > 0) {
  throw new Error(`Unresolved standalone tokens: ${[...new Set(unresolvedTokens)].join(', ')}`);
}

if (/<script\s+[^>]*src=|<link\s+[^>]*rel=["']stylesheet|url\(["']?https?:/i.test(output)) {
  throw new Error('Standalone output contains a runtime stylesheet, script, or CSS URL dependency.');
}

if (/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b/.test(output) || /<form\s+[^>]*action=/i.test(output)) {
  throw new Error('Standalone output contains a network API or form action.');
}

const requiredInteractionMarkers = [
  'data-route="general"',
  'id="mini-brief"',
  'id="configurator-form"',
  'data-logistics="road"',
  'data-factory="6"',
  'id="offline-lead-form"',
  "document.documentElement.dataset.standalone = 'ready'"
];
for (const marker of requiredInteractionMarkers) {
  if (!output.includes(marker)) throw new Error(`Missing standalone interaction marker: ${marker}`);
}

await writeFile(outputPath, output, 'utf8');

const outputBytes = Buffer.byteLength(output);
const hash = createHash('sha256').update(output).digest('hex');
console.log(`Standalone HTML: ${outputPath}`);
console.log(`Bytes: ${outputBytes}`);
console.log(`SHA-256: ${hash}`);
console.log(`Embedded AVIF images: ${(output.match(/data:image\/avif;base64,/g) ?? []).length}`);
console.log(`Embedded WOFF2 fonts: ${(output.match(/data:font\/woff2;base64,/g) ?? []).length}`);
