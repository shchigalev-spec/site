import { describe, expect, it } from 'vitest';
import { resolvePublicSiteOrigin } from './facts';

describe('resolvePublicSiteOrigin', () => {
  it('accepts HTTPS and strips paths', () => {
    expect(resolvePublicSiteOrigin('https://example.ru/path')).toBe('https://example.ru');
  });

  it('allows local HTTP for smoke tests', () => {
    expect(resolvePublicSiteOrigin('http://127.0.0.1:4175/path')).toBe('http://127.0.0.1:4175');
  });

  it('rejects non-local HTTP and invalid protocols', () => {
    expect(resolvePublicSiteOrigin('http://example.ru')).toBe('https://a-modul.ru');
    expect(resolvePublicSiteOrigin('javascript:alert(1)')).toBe('https://a-modul.ru');
  });
});
