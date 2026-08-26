export function diagnosisHref(url: URL, mode: 'standard' | 'tender' | 'leasing', hash = mode === 'tender' ? '#full-brief' : '#project-brief') {
  const params = new URLSearchParams(url.searchParams);
  params.set('mode', mode);
  return `${url.pathname}?${params.toString()}${hash}`;
}
