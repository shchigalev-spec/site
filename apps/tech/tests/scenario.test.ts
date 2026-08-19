import { describe, expect, it } from 'vitest';
import { buildScenario, emptyScenario } from '../src/lib/scenario';

describe('preliminary scenario', () => {
  it('changes the inspection map from selected noise, path and stage', () => {
    const result = buildScenario({
      ...emptyScenario,
      noise: 'impact',
      path: 'ceiling',
      stage: 'finished',
      room: 'спальня',
      direction: 'above',
      problemArea: 'потолок',
      spaceLoss: 'minimum'
    });

    expect(result.probableType).toContain('Топот');
    expect(result.inspect).toEqual(expect.arrayContaining(['перекрытие', 'связанные стены', 'доступные зоны локального осмотра']));
    expect(result.scale).toContain('интерьера');
  });

  it('keeps unknowns explicit and never outputs a price', () => {
    const result = buildScenario(emptyScenario);
    expect(result.unknowns).toContain('доминирующий конструктивный путь');
    expect(JSON.stringify(result).toLowerCase()).not.toMatch(/₽|руб\.|точная цена|стоимост/);
  });
});
