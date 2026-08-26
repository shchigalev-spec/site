import { mount } from 'svelte';
import '@fontsource/geologica/500.css';
import '@fontsource/onest/400.css';
import '@fontsource/onest/600.css';
import '@fontsource/ibm-plex-mono/500.css';
import App from './App.svelte';
import '../../src/app.css';
import { goto } from './shims/page-runtime';

type StorageRecord = Record<string, string>;

function installSessionStorageFallback() {
  try {
    const key = '__a_modul_storage_probe__';
    window.sessionStorage.setItem(key, '1');
    window.sessionStorage.removeItem(key);
  } catch {
    const values: StorageRecord = {};
    const storage: Storage = {
      get length() { return Object.keys(values).length; },
      clear() { for (const key of Object.keys(values)) delete values[key]; },
      getItem(key) { return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null; },
      key(index) { return Object.keys(values)[index] ?? null; },
      removeItem(key) { delete values[key]; },
      setItem(key, value) { values[key] = String(value); }
    };
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: storage });
  }
}

function installOfflineFetch() {
  window.fetch = async () => new Response(JSON.stringify({
    ok: false,
    message: 'Автономная версия работает без сервера. Данные не отправлены.'
  }), {
    status: 503,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function installOfflineNavigation() {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!target) return;
    const href = target.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
    if (!href.startsWith('/') && !href.startsWith('?')) return;
    event.preventDefault();
    void goto(href, { replaceState: true });
  });
}

installSessionStorageFallback();
installOfflineFetch();
installOfflineNavigation();

mount(App, { target: document.getElementById('app')! });
document.documentElement.dataset.aModulStandalone = 'ready';
