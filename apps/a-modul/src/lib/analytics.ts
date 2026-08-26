import { browser } from '$app/environment';
import { landingRoutePaths, regionVariantSlugs, typeVariantSlugs } from '$lib/content/lead-options';

export const analyticsEvents = [
  'page_view', 'hero_brief_start', 'hero_brief_complete', 'object_type_select', 'capacity_select',
  'region_select', 'commissioning_date_select', 'configurator_start', 'configurator_complete',
  'case_filter_change', 'case_open', 'logistics_map_start', 'logistics_route_complete',
  'bim_interaction_start', 'bim_interaction_complete', 'production_sequence_start',
  'production_sequence_complete', 'price_scope_open', 'leasing_click', 'tender_start',
  'tender_submit_success', 'form_start', 'file_attach', 'form_validation_error',
  'form_submit_success', 'form_submit_error', 'phone_click', 'email_click', 'scroll_50', 'scroll_90'
] as const;

export type AnalyticsEvent = typeof analyticsEvents[number];
type SafeValue = string | number | boolean;

const attributionKey = 'a-modul-attribution-v1';
const forbiddenKeys = /name|phone|email|company|filename|comment|contact/i;
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'] as const;
const attributionKeys = [...campaignKeys, 'route', 'region', 'type', 'referrer', 'landing_variant'] as const;
const ATTRIBUTION_KEYS = new Set<string>(attributionKeys);
const LANDING_ROUTES = new Set<string>(landingRoutePaths);
const TYPE_VARIANTS = new Set<string>(typeVariantSlugs);
const REGION_VARIANTS = new Set<string>(regionVariantSlugs);

function safeReferrer(value: string) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}

function safeLandingVariant(value: string) {
  if (LANDING_ROUTES.has(value)) return value;
  const [kind, slug, extra] = value.split(':');
  if (extra) return '';
  if (kind === 'type' && TYPE_VARIANTS.has(slug)) return value;
  if (kind === 'region' && REGION_VARIANTS.has(slug)) return value;
  return '';
}

export function sanitizeAttributionRecord(input: unknown): Record<string, string> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const clean: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(input)) {
    if (!ATTRIBUTION_KEYS.has(key) || typeof rawValue !== 'string') continue;
    const value = rawValue.trim().slice(0, key === 'referrer' ? 2_000 : 180);
    if (!value) continue;
    if (key === 'route' && !LANDING_ROUTES.has(value)) continue;
    if (key === 'type' && !TYPE_VARIANTS.has(value)) continue;
    if (key === 'region' && !REGION_VARIANTS.has(value)) continue;
    if (key === 'referrer') {
      const referrer = safeReferrer(value);
      if (referrer) clean.referrer = referrer;
      continue;
    }
    if (key === 'landing_variant') {
      const variant = safeLandingVariant(value);
      if (variant) clean.landing_variant = variant;
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

export function sanitizeEventDetail(input: Record<string, unknown>): Record<string, SafeValue> {
  const clean: Record<string, SafeValue> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!key || key.length > 64 || forbiddenKeys.test(key)) continue;
    if (typeof value === 'string') clean[key] = value.slice(0, 180);
    else if (typeof value === 'boolean') clean[key] = value;
    else if (typeof value === 'number' && Number.isFinite(value)) clean[key] = value;
  }
  return clean;
}

export function captureAttribution(url = browser ? new URL(window.location.href) : undefined) {
  if (!browser || !url) return {};
  let parsed: unknown = {};
  try { parsed = JSON.parse(sessionStorage.getItem(attributionKey) ?? '{}'); } catch { parsed = {}; }
  const saved = sanitizeAttributionRecord(parsed);
  for (const key of campaignKeys) {
    const value = url.searchParams.get(key);
    if (value) saved[key] = value.slice(0, 180);
  }
  if (LANDING_ROUTES.has(url.pathname)) saved.route = url.pathname;
  const region = url.searchParams.get('region') ?? '';
  const type = url.searchParams.get('type') ?? '';
  if (REGION_VARIANTS.has(region)) saved.region = region;
  if (TYPE_VARIANTS.has(type)) saved.type = type;
  saved.referrer = saved.referrer || safeReferrer(document.referrer);
  saved.landing_variant = saved.landing_variant
    || (TYPE_VARIANTS.has(type) ? `type:${type}` : REGION_VARIANTS.has(region) ? `region:${region}` : LANDING_ROUTES.has(url.pathname) ? url.pathname : '');
  const clean = sanitizeAttributionRecord(saved);
  sessionStorage.setItem(attributionKey, JSON.stringify(clean));
  return clean;
}

export function getAttribution() {
  if (!browser) return {};
  try {
    const clean = sanitizeAttributionRecord(JSON.parse(sessionStorage.getItem(attributionKey) ?? '{}'));
    sessionStorage.setItem(attributionKey, JSON.stringify(clean));
    return clean;
  } catch {
    sessionStorage.removeItem(attributionKey);
    return {};
  }
}

export function trackEvent(event: AnalyticsEvent, payload: Record<string, SafeValue> = {}) {
  if (!browser || !analyticsEvents.includes(event)) return;
  const detail = sanitizeEventDetail({ ...getAttribution(), ...payload });
  window.dispatchEvent(new CustomEvent('a-modul:analytics', { detail: { event, ...detail } }));
  const id = window.__A_MODUL_METRICA_ID__;
  if (id && typeof window.ym === 'function') window.ym(id, 'reachGoal', event, detail);
}
