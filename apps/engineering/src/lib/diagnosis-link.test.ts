import { describe, expect, it } from 'vitest';
import { buildDiagnosisHref, buildSourceContext } from './diagnosis-link';

describe('diagnosis link context', () => {
  it('carries service, source page, and all standard UTM parameters', () => {
    const href = buildDiagnosisHref(new URL('https://example.test/shumoizolyatsiya-sten/?utm_source=search&utm_medium=cpc&utm_campaign=walls&utm_term=quiet&utm_content=a'), 'header');
    const params = new URL(href, 'https://example.test').searchParams;
    expect(Object.fromEntries(params)).toEqual({
      service: 'shumoizolyatsiya-sten',
      source: 'header',
      source_page: '/shumoizolyatsiya-sten/',
      utm_source: 'search',
      utm_medium: 'cpc',
      utm_campaign: 'walls',
      utm_term: 'quiet',
      utm_content: 'a'
    });
  });

  it('carries a case slug without inventing a service', () => {
    expect(buildDiagnosisHref(new URL('https://example.test/cases/64-43-db/'), 'footer')).toContain('case=64-43-db');
  });

  it('merges component context without dropping campaign attribution', () => {
    const href = buildDiagnosisHref(new URL('https://example.test/?utm_source=search&utm_campaign=hero'), 'symptom_path', {
      noiseId: 'voices',
      noise: 'Голоса'
    });
    expect(Object.fromEntries(new URL(href, 'https://example.test').searchParams)).toMatchObject({
      noiseId: 'voices',
      noise: 'Голоса',
      source: 'symptom_path',
      source_page: 'homepage',
      utm_source: 'search',
      utm_campaign: 'hero'
    });
  });

  it('serializes short-form source context with all five standard UTM values', () => {
    const source = buildSourceContext(new URL('https://example.test/?utm_source=s&utm_medium=m&utm_campaign=c&utm_term=t&utm_content=x'), 'homepage_short');
    expect(source).toBe('source=homepage_short · source_page=homepage · utm_source=s · utm_medium=m · utm_campaign=c · utm_term=t · utm_content=x');
  });
});
