import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

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
  | 'service_page_view'
  | 'mobile_sticky_cta_click'
  | 'hero_motion_complete'
  | 'path_animation_complete'
  | 'short_form_submit'
  | 'full_form_start';

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

export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}): void {
  if (!browser) return;
  const path = window.location.pathname;
  const pageType = pageTypeFor(path);
  const payload = { concept: 'engineering', path, page_type: pageType, ...properties };
  window.dispatchEvent(new CustomEvent('silentlab:analytics', { detail: { event, ...payload } }));
  const counterId = Number(env.PUBLIC_YANDEX_METRICA_ID);
  if (Number.isFinite(counterId) && counterId > 0 && typeof window.ym === 'function') {
    window.ym(counterId, 'reachGoal', event, payload);
  }
}
