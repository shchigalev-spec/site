import { describe, expect, it } from 'vitest';
import { resolveLandingData } from './routes';

describe('resolveLandingData', () => {
  it('keeps query variants out of the index and on the base canonical', () => {
    const data = resolveLandingData('general', new URL('https://a-modul.ru/modulnye-zdaniya/?type=office&region=sibir'));
    expect(data.robots).toBe('noindex,follow');
    expect(data.canonical).toBe('https://a-modul.ru/modulnye-zdaniya/');
    expect(data.initialObjectType).toBe('abk');
    expect(data.initialRegion).toBe('siberia');
  });

  it('keeps query-free primary routes indexable', () => {
    const data = resolveLandingData('dorm', new URL('https://a-modul.ru/modulnye-obshchezhitiya/'));
    expect(data.robots).toBe('index,follow');
    expect(data.initialObjectType).toBe('dorm');
    expect(data.initialMode).toBe('standard');
  });

  it('uses the sourced Office/ABK case with an explicit generated-visual disclosure', () => {
    const data = resolveLandingData('office', new URL('https://a-modul.ru/modulnye-ofisy-abk/'));
    expect(data.route.caseTitle).toContain('Эр Ликид Кузбасс');
    expect(data.route.caseFacts).toEqual(expect.arrayContaining(['427 м²', '28 модулей', '2 этажа']));
    expect(data.route.visualLabel).toBe('Визуализация по открытым данным кейса — не фотография объекта');
    expect(data.route.image).not.toBe(data.route.caseImage);
    expect(data.route.visualStory.map((item) => item.image)).toEqual(['a-modul-office-plan', 'a-modul-office-interior', 'a-modul-office-final']);
    expect(data.route.ogImage).toBe('a-modul-office-og.jpg');
  });

  it('keeps every specialist route hero, case and story visuals distinct', () => {
    for (const key of ['shift', 'office', 'dorm'] as const) {
      const { route } = resolveLandingData(key, new URL(`https://a-modul.ru/${key}/`));
      expect(route.image).not.toBe(route.caseImage);
      expect(new Set(route.visualStory.map((item) => item.image)).size).toBe(route.visualStory.length);
      expect(route.visualStory.at(-1)?.image).toBe(`a-modul-${key === 'dorm' ? 'dormitory' : key}-final`);
      expect(route.ogImage).toMatch(/-og\.jpg$/);
    }
  });

  it('ends the general live visual story in a distinct final-state asset', () => {
    const { route } = resolveLandingData('general', new URL('https://a-modul.ru/modulnye-zdaniya/'));
    expect(route.visualStory.at(-1)?.image).toBe('a-modul-general-final');
    expect(route.visualStory.at(-1)?.image).not.toBe(route.image);
  });
});
