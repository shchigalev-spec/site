import { describe, expect, it } from 'vitest';
import { allPublicPaths, cases, noises, services } from './content';

describe('engineering content model', () => {
  it('contains six distinct noise states with supplied proportions', () => {
    expect(noises).toHaveLength(6);
    expect(new Set(noises.map((item) => item.id)).size).toBe(6);
    expect(noises.map((item) => item.share)).toEqual(['≈ 40%', '≈ 25%', '≈ 15%', '≈ 7%', '≈ 7%', '≈ 6%']);
  });

  it('keeps measured result headlines exact', () => {
    expect(cases.map((item) => item.title)).toEqual(['58 dB → 39 dB', 'Пик 71 dB → снижение на 16 dB', '64 dB → 43 dB']);
  });

  it('provides every required public route once', () => {
    expect(services).toHaveLength(7);
    expect(new Set(allPublicPaths).size).toBe(allPublicPaths.length);
    for (const path of ['/shumoizolyatsiya-kvartiry/', '/diagnostika-shuma/', '/cases/58-39-db/', '/cases/impact-noise-minus-16-db/', '/cases/64-43-db/']) {
      expect(allPublicPaths).toContain(path);
    }
  });

  it('keeps the service architecture split into complete surface and situation families', () => {
    const surfaces = services.filter((service) => service.family === 'surface');
    const situations = services.filter((service) => service.family === 'situation');
    expect(surfaces.map((service) => service.diagram)).toEqual(['wall', 'ceiling', 'floor']);
    expect(situations).toHaveLength(4);
    expect(situations.every((service) => service.routePath && service.relatedSurfaces?.length === 3)).toBe(true);
    expect(services.every((service) => service.symptoms.length >= 3 && service.constraints.length >= 3 && service.faq.length >= 2)).toBe(true);
  });

  it('uses unique service SEO copy and hero imagery', () => {
    expect(new Set(services.map((service) => service.title)).size).toBe(services.length);
    expect(new Set(services.map((service) => service.description)).size).toBe(services.length);
    expect(new Set(services.map((service) => service.image)).size).toBe(services.length);
  });
});
