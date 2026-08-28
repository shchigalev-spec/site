import { writable } from 'svelte/store';

const logicalOrigin = 'https://offline.local';
export const statePage = { url: new URL('/modulnye-zdaniya/', logicalOrigin) };
export const pageStore = writable({ url: statePage.url });

function logicalUrl(target: string | URL) {
  const raw = String(target);
  if (raw.startsWith('?') || raw.startsWith('#')) return new URL(raw, statePage.url);
  try {
    const parsed = new URL(raw, logicalOrigin);
    if (parsed.protocol === 'file:') return new URL(`${parsed.search}${parsed.hash}`, statePage.url);
    return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, logicalOrigin);
  } catch {
    return new URL('/modulnye-zdaniya/', logicalOrigin);
  }
}

function syncBrowserUrl(url: URL, replaceState = false) {
  const physical = new URL(window.location.href);
  physical.search = url.search;
  physical.hash = url.hash;
  try {
    history[replaceState ? 'replaceState' : 'pushState']({}, '', physical);
  } catch {
    window.location.hash = url.hash;
  }
}

export async function goto(target: string | URL, options: { replaceState?: boolean; keepFocus?: boolean; noScroll?: boolean } = {}) {
  const next = logicalUrl(target);
  statePage.url = next;
  pageStore.set({ url: next });
  syncBrowserUrl(next, options.replaceState);

  if (!options.noScroll) {
    const id = decodeURIComponent(next.hash.slice(1));
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      }));
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
}
