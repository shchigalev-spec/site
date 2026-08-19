import { browser } from '$app/environment';

export type AnalyticsEvent =
  | 'page_view'
  | 'hero_cta_click'
  | 'diagnostic_start'
  | 'noise_selected'
  | 'path_selected'
  | 'renovation_stage_selected'
  | 'scenario_started'
  | 'scenario_completed'
  | 'form_started'
  | 'file_attached'
  | 'form_validation_error'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'phone_click'
  | 'email_click'
  | 'faq_open'
  | 'scroll_50'
  | 'scroll_90'
  | 'case_open'
  | 'service_page_view';

let metricaId = '';

const servicePaths = new Set([
  '/shumoizolyatsiya-kvartiry',
  '/shumoizolyatsiya-sten',
  '/shumoizolyatsiya-potolka',
  '/shumoizolyatsiya-pola',
  '/shumoizolyatsiya-ot-sosedey',
  '/shumoizolyatsiya-v-novostroyke',
  '/shumoizolyatsiya-v-gotovoy-kvartire'
]);

export function pageTypeFor(pathname: string) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  if (path === '/') return 'home';
  if (path === '/diagnostika-shuma') return 'diagnostic';
  if (path === '/cases') return 'cases';
  if (path.startsWith('/cases/')) return 'case';
  if (path === '/privacy-policy' || path === '/privacy') return 'legal';
  if (servicePaths.has(path)) return 'service';
  return 'not_found';
}

export function initAnalytics(id: string) {
  if (!browser || !id || metricaId) return;
  metricaId = id;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return;

  window.ym = window.ym || function (...args: unknown[]) {
    (window.ym as unknown as { a?: unknown[] }).a = (window.ym as unknown as { a?: unknown[] }).a || [];
    (window.ym as unknown as { a: unknown[] }).a.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.appendChild(script);
  window.ym(numericId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
}

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (!browser || !metricaId || !window.ym) return;
  const path = window.location.pathname;
  const pageType = pageTypeFor(path);
  window.ym(Number(metricaId), 'reachGoal', event, { concept: 'tech', path, page_type: pageType, ...payload });
}
