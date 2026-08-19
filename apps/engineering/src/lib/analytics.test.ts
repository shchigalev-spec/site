import { describe, expect, it } from 'vitest';
import { pageTypeFor } from './analytics';

describe('analytics page taxonomy', () => {
  it.each([
    ['/', 'home'],
    ['/shumoizolyatsiya-sten/', 'service'],
    ['/diagnostika-shuma/', 'diagnostic'],
    ['/cases/', 'cases'],
    ['/cases/58-39-db/', 'case'],
    ['/privacy-policy/', 'legal'],
    ['/missing/', 'not_found']
  ])('classifies %s as %s', (path, expected) => {
    expect(pageTypeFor(path)).toBe(expected);
  });
});
