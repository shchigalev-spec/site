import { describe, expect, it } from 'vitest';
import { casePages, routePaths, servicePages } from '../src/lib/data/site';

describe('Tech route content', () => {
  it('contains every required commercial route', () => {
    expect(routePaths).toEqual(expect.arrayContaining([
      '/',
      '/shumoizolyatsiya-kvartiry/',
      '/shumoizolyatsiya-sten/',
      '/shumoizolyatsiya-potolka/',
      '/shumoizolyatsiya-pola/',
      '/shumoizolyatsiya-ot-sosedey/',
      '/shumoizolyatsiya-v-novostroyke/',
      '/shumoizolyatsiya-v-gotovoy-kvartire/',
      '/diagnostika-shuma/',
      '/cases/',
      '/cases/58-39-db/',
      '/cases/impact-noise-minus-16-db/',
      '/cases/64-43-db/'
    ]));
  });

  it('keeps service metadata unique and conclusion-led', () => {
    expect(new Set(servicePages.map((page) => page.title)).size).toBe(servicePages.length);
    expect(new Set(servicePages.map((page) => page.description)).size).toBe(servicePages.length);
    for (const page of servicePages) {
      expect(page.h1.length).toBeGreaterThan(20);
      expect(page.diagnosticFocus.length).toBeGreaterThanOrEqual(4);
      expect(page.title.toLowerCase()).toContain('шумоизоляц');
    }
  });

  it('uses only supplied measured case headlines', () => {
    expect(casePages.map((item) => item.result)).toEqual([
      '58 dB → 39 dB',
      'Пик 71 dB → −16 dB',
      '64 dB → 43 dB'
    ]);
    expect(casePages[1].narrative).toContain('не пересчитываем');
    expect(casePages[2].narrative).toContain('достигнутый результат');
  });
});
