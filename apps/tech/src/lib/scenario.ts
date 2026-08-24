import type { DiagnosticContext, NoiseKey, PathKey, StageKey } from '$lib/types';
import { noiseProfiles } from '$lib/data/site';

export interface ScenarioInput extends DiagnosticContext {
  direction: string;
  problemArea: string;
  comment: string;
}

export interface ScenarioResult {
  probableType: string;
  candidateRoutes: string[];
  hypothesis: string;
  inspect: string[];
  scale: string;
  unknowns: string[];
  uncertainty: string;
  next: string;
}

const pathZones: Record<PathKey, string[]> = {
  ceiling: ['перекрытие', 'верхние примыкания', 'связанные стены'],
  wall: ['перегородка', 'розетки и проходки', 'боковые примыкания'],
  floor: ['основание пола', 'периметр', 'инженерные проходки'],
  socket: ['коробки розеток', 'полость перегородки', 'периметр'],
  ventilation: ['решётка', 'канал', 'смежные помещения'],
  junction: ['стык конструкций', 'жёсткие связи', 'фланговые поверхности']
};

export const emptyScenario: ScenarioInput = {
  noise: '',
  path: '',
  stage: '',
  room: '',
  spaceLoss: '',
  direction: '',
  problemArea: '',
  comment: ''
};

export function buildScenario(input: ScenarioInput): ScenarioResult {
  const profile = noiseProfiles.find((item) => item.key === input.noise);
  const inspect = new Set<string>(profile?.likelyPaths ?? ['слышимая поверхность', 'примыкания']);

  if (input.path) pathZones[input.path].forEach((zone) => inspect.add(zone));
  if (input.direction === 'unknown') inspect.add('альтернативные пути по периметру комнаты');
  if (input.stage === 'finished') inspect.add('доступные зоны локального осмотра');
  if (input.stage === 'new-build') inspect.add('открытые основания до отделки');

  const stageScale: Record<StageKey, string> = {
    'new-build': 'Можно координировать решение с будущими перегородками, полом, потолком и инженерией.',
    renovation: 'Масштаб нужно связать с уже выполненными и ещё открытыми этапами ремонта.',
    finished: 'Сначала оцениваются локальность вмешательства, защита интерьера и допустимый демонтаж.'
  };

  const unknowns = [
    !input.path && 'доминирующий конструктивный путь',
    !input.problemArea && 'размер зоны, которую потребуется обследовать',
    !input.spaceLoss && 'допустимая потеря пространства',
    'фактический состав конструкций и примыканий',
    'показатели профессионального замера'
  ].filter(Boolean) as string[];

  return {
    probableType: profile ? `${profile.label}: ${profile.character.toLowerCase()}` : 'Тип шума уточняется по симптому и повторяемости.',
    candidateRoutes: profile?.likelyPaths.slice(0, 3) ?? ['слышимая поверхность', 'примыкания', 'связанные конструкции'],
    hypothesis: input.path
      ? `Выбранная зона «${pathZones[input.path][0]}» становится рабочей гипотезой, но остаётся непроверенной.`
      : 'Рабочая гипотеза строится по симптому и направлению; доминирующий путь ещё не выбран.',
    inspect: [...inspect].slice(0, 6),
    scale: input.stage ? stageScale[input.stage] : 'Масштаб вмешательства определяется после уточнения стадии объекта.',
    unknowns,
    uncertainty: unknowns.length > 3 ? 'Высокая: ключевые данные ещё нужно проверить.' : unknowns.length > 1 ? 'Средняя: гипотеза собрана, но требует осмотра.' : 'Остаётся измерительная неопределённость.',
    next: 'Передать сценарий инженеру: менеджер свяжется и согласует следующий коммерческий шаг — выездную диагностику.'
  };
}
