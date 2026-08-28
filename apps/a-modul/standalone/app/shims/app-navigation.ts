import { goto } from './page-runtime';

export { goto };

export function afterNavigate(callback: () => void) {
  queueMicrotask(callback);
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}
