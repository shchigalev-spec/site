import { build } from 'vite';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = join(repositoryRoot, 'apps', 'a-modul');
const buildDirectory = join(appRoot, '.standalone-build');
const outputFile = join(appRoot, 'standalone', 'a-modul-direct.html');
const configFile = join(appRoot, 'vite.standalone.config.ts');

const mimeTypes = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(absolute));
    else files.push(absolute);
  }
  return files;
}

async function createAssetMap() {
  const roots = [
    { directory: join(appRoot, 'static', 'generated'), prefix: '/generated' },
    { directory: join(appRoot, 'static', 'brand'), prefix: '/brand' }
  ];
  const map = {};
  for (const root of roots) {
    for (const file of await collectFiles(root.directory)) {
      const extension = extname(file).toLowerCase();
      const mime = mimeTypes[extension];
      if (!mime) continue;
      const key = `${root.prefix}/${relative(root.directory, file).replaceAll('\\', '/')}`;
      map[key] = `data:${mime};base64,${(await readFile(file)).toString('base64')}`;
    }
  }
  return map;
}

function findTag(html, pattern, label) {
  const match = html.match(pattern);
  if (!match) throw new Error(`Standalone build: ${label} not found in Vite output.`);
  return match;
}

function builtFile(webPath) {
  return join(buildDirectory, webPath.replace(/^\.\//, '').replace(/^\//, ''));
}

function assetRuntime(assetMap) {
  const serialized = JSON.stringify(assetMap).replaceAll('</script', '<\\/script');
  return `
const __A_MODUL_OFFLINE_ASSETS__ = Object.freeze(${serialized});
const __aModulResolveAsset = (value) => typeof value === 'string' && __A_MODUL_OFFLINE_ASSETS__[value] ? __A_MODUL_OFFLINE_ASSETS__[value] : value;
const __aModulSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value) {
  return __aModulSetAttribute.call(this, name, name === 'src' || name === 'srcset' ? __aModulResolveAsset(String(value)) : value);
};
for (const [prototype, property] of [[HTMLImageElement.prototype, 'src'], [HTMLImageElement.prototype, 'srcset'], [HTMLSourceElement.prototype, 'srcset']]) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
  if (!descriptor?.set || !descriptor.get) continue;
  Object.defineProperty(prototype, property, {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) { descriptor.set.call(this, __aModulResolveAsset(String(value))); }
  });
}
const __aModulHydrateAssets = (root) => {
  if (!(root instanceof Element || root instanceof Document)) return;
  for (const element of root.querySelectorAll('[src], [srcset]')) {
    for (const attribute of ['src', 'srcset']) {
      const value = element.getAttribute(attribute);
      const resolved = __aModulResolveAsset(value);
      if (resolved !== value) __aModulSetAttribute.call(element, attribute, resolved);
    }
  }
};
new MutationObserver((records) => {
  for (const record of records) for (const node of record.addedNodes) if (node instanceof Element) {
    __aModulHydrateAssets(node);
    for (const attribute of ['src', 'srcset']) {
      const value = node.getAttribute(attribute);
      const resolved = __aModulResolveAsset(value);
      if (resolved !== value) __aModulSetAttribute.call(node, attribute, resolved);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });
`;
}

await build({ configFile });

let html = await readFile(join(buildDirectory, 'index.html'), 'utf8');
const scriptMatch = findTag(html, /<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/i, 'module script');
const styleMatch = findTag(html, /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/i, 'stylesheet');
const javascript = await readFile(builtFile(scriptMatch[1]), 'utf8');
let css = await readFile(builtFile(styleMatch[1]), 'utf8');
const assetMap = await createAssetMap();
const javascriptLoader = `(0,eval)(${JSON.stringify(javascript.trim()).replaceAll('</script', '<\\/script')});`;

css = css.replace(/\/(?:generated|brand)\/[A-Za-z0-9_./-]+/g, (path) => assetMap[path] ?? path);
html = html.replace(styleMatch[0], `<style>${css.trim().replaceAll('</style', '<\\/style')}</style>`);
html = html.replace(scriptMatch[0], `<script>${assetRuntime(assetMap).trim()}</script><script>${javascriptLoader}</script>`);
html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/gi, '');

if (/\b(?:src|href)="\.?\/assets\//.test(html)) throw new Error('Standalone build still references emitted Vite assets.');
if (!html.includes('data:image/avif;base64,') || !html.includes('data:font/woff2;base64,')) throw new Error('Standalone build did not inline visual assets or fonts.');
if (!html.includes('aModulStandalone')) throw new Error('Standalone application marker is missing from bundle.');

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, html);
await rm(buildDirectory, { recursive: true, force: true });

const megabytes = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(`Standalone A-Modul built: ${outputFile} (${megabytes} MiB, ${Object.keys(assetMap).length} embedded assets).`);
