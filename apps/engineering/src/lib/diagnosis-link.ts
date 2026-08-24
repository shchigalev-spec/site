const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

type ContextValue = string | number | null | undefined;

function appendLandingContext(params: URLSearchParams, url: URL, source: string) {
  params.set('source', source);
  params.set('source_page', url.pathname === '/' ? 'homepage' : url.pathname);
  for (const key of campaignKeys) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }
}

export function buildDiagnosisHref(url: URL, source: string, context: Record<string, ContextValue> = {}): string {
  const params = new URLSearchParams();
  const segments = url.pathname.split('/').filter(Boolean);
  const first = segments[0] || '';

  if (first.startsWith('shumoizolyatsiya-')) params.set('service', first);
  if (first === 'cases' && segments[1]) params.set('case', segments[1]);

  for (const [key, value] of Object.entries(context)) {
    if (value !== undefined && value !== null && String(value).length) params.set(key, String(value));
  }
  appendLandingContext(params, url, source);

  return `/diagnostika-shuma/?${params.toString()}`;
}

export function buildSourceContext(url: URL, source: string): string {
  const params = new URLSearchParams();
  appendLandingContext(params, url, source);
  return [...params.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');
}
