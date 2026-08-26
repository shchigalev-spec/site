import { writable } from 'svelte/store';

export type ObjectTypeId = 'shift' | 'dorm' | 'abk' | 'service';
export type ObjectTypeSelection = ObjectTypeId | '';
export type CapacityMetric = 'people' | 'workplaces' | 'area';
export type RegionId = '' | 'moskva' | 'krasnoyarsk' | 'ural' | 'far-east' | 'siberia' | 'kurgan' | 'russia';
export type DiagnosisMode = 'standard' | 'tender' | 'leasing';

export const commissioningOptions = [
  { value: 'Срочно', label: 'Срочно' },
  { value: '1–3 месяца', label: '1–3 месяца' },
  { value: '3–6 месяцев', label: '3–6 месяцев' },
  { value: '6–12 месяцев', label: '6–12 месяцев' }
] as const;

export function isExactCommissioningMonth(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function isValidCommissioning(value: string) {
  return commissioningOptions.some((option) => option.value === value) || isExactCommissioningMonth(value);
}

export function commissioningLabel(value: string) {
  if (!value) return 'не указан';
  if (!isExactCommissioningMonth(value)) return value;
  return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}-01T00:00:00Z`));
}

export type ProjectEditedFields = {
  objectType: boolean;
  capacity: boolean;
  region: boolean;
  zones: boolean;
  commissioning: boolean;
};

export type ProjectContext = {
  objectType: ObjectTypeSelection;
  metric: CapacityMetric;
  capacity: string;
  customCapacity: string;
  region: RegionId;
  selectedZones: string[];
  zonesObjectType: ObjectTypeSelection;
  commissioning: string;
  mode: DiagnosisMode;
  typeIntent: string;
  transferRevision: number;
  edited: ProjectEditedFields;
};

type ObjectTypeDefinition = {
  id: ObjectTypeId;
  label: string;
  metric: CapacityMetric;
  capacityOptions: string[];
  zones: string[];
  next: string;
};

export const objectTypeDefinitions: ObjectTypeDefinition[] = [
  {
    id: 'shift',
    label: 'Вахтовый посёлок',
    metric: 'people',
    capacityOptions: ['100', '300', '500', '1000', 'custom'],
    zones: ['Общежития', 'Столовая', 'АБК', 'БПК', 'Медпункт', 'КПП', 'Инженерные модули', 'Переходы', 'Спорт / досуг', 'Другое'],
    next: 'Сверить численность, сменность, климат и схему доставки.'
  },
  {
    id: 'dorm',
    label: 'Общежитие',
    metric: 'people',
    capacityOptions: ['100', '300', '500', '1000', 'custom'],
    zones: ['Жилые блоки', 'Санитарные блоки', 'Душевые', 'Бытовые помещения', 'Мебель', 'Инженерные помещения', 'Инженерные модули', 'Спорт / досуг', 'Другое'],
    next: 'Уточнить расселение, бытовые сценарии и инженерную нагрузку.'
  },
  {
    id: 'abk',
    label: 'Офис / АБК',
    metric: 'workplaces',
    capacityOptions: ['50', '100', '300', 'custom'],
    zones: ['Рабочие места', 'Переговорные', 'Санитарные зоны', 'Серверная / электрощитовая', 'Бытовые помещения', 'Входная группа', 'Инженерные модули', 'Другое'],
    next: 'Зафиксировать число рабочих мест и состав помещений.'
  },
  {
    id: 'service',
    label: 'Отдельное здание',
    metric: 'area',
    capacityOptions: ['500', '1000', '3000', 'custom'],
    zones: ['Основная функция', 'Санитарные зоны', 'Инженерные модули', 'Входная группа', 'Другое'],
    next: 'Описать функцию, режим эксплуатации и площадку.'
  }
];

export const regionOptions: { value: RegionId; label: string }[] = [
  { value: '', label: 'Выберите регион' },
  { value: 'moskva', label: 'Москва и Московская область' },
  { value: 'krasnoyarsk', label: 'Красноярский край' },
  { value: 'ural', label: 'Урал' },
  { value: 'far-east', label: 'Дальний Восток' },
  { value: 'siberia', label: 'Сибирь' },
  { value: 'kurgan', label: 'Курганская область' },
  { value: 'russia', label: 'Россия' }
];

const storageKey = 'a-modul-configurator';
const untouched: ProjectEditedFields = {
  objectType: false,
  capacity: false,
  region: false,
  zones: false,
  commissioning: false
};
const defaults: ProjectContext = {
  objectType: '',
  metric: 'people',
  capacity: '',
  customCapacity: '',
  region: '',
  selectedZones: [],
  zonesObjectType: '',
  commissioning: '',
  mode: 'standard',
  typeIntent: '',
  transferRevision: 0,
  edited: { ...untouched }
};

export const projectContext = writable<ProjectContext>(defaults);
let initialized = false;

function definitionFor(id: ObjectTypeId) {
  return objectTypeDefinitions.find((item) => item.id === id) ?? objectTypeDefinitions[0];
}

function sanitizedEdited(raw: Partial<ProjectEditedFields> | undefined): ProjectEditedFields {
  return {
    objectType: raw?.objectType === true,
    capacity: raw?.capacity === true,
    region: raw?.region === true,
    zones: raw?.zones === true,
    commissioning: raw?.commissioning === true
  };
}

function sanitize(raw: Partial<ProjectContext> & { userEdited?: boolean }): ProjectContext {
  const objectType = objectTypeDefinitions.some((item) => item.id === raw.objectType) ? raw.objectType as ObjectTypeId : '';
  const definition = objectType ? definitionFor(objectType) : undefined;
  const fallbackMetric = definition?.metric ?? 'people';
  const allowedMetrics: CapacityMetric[] = objectType === 'service' ? ['area', 'people'] : definition ? [definition.metric] : ['people', 'workplaces', 'area'];
  const metric = allowedMetrics.includes(raw.metric as CapacityMetric) ? raw.metric as CapacityMetric : fallbackMetric;
  const capacityOptions = definition
    ? metric === 'people' && objectType === 'service' ? ['50', '100', '300', 'custom'] : definition.capacityOptions
    : [];
  const requestedCapacity = typeof raw.capacity === 'string' ? raw.capacity : '';
  const capacity = definition
    ? capacityOptions.includes(requestedCapacity) ? requestedCapacity : requestedCapacity ? 'custom' : ''
    : requestedCapacity;
  const customCapacity = typeof raw.customCapacity === 'string'
    ? raw.customCapacity.slice(0, 12)
    : definition && requestedCapacity && !capacityOptions.includes(requestedCapacity) ? requestedCapacity.slice(0, 12) : '';
  const region = regionOptions.some((item) => item.value === raw.region) ? raw.region as RegionId : '';
  const requestedZonesObjectType = objectTypeDefinitions.some((item) => item.id === raw.zonesObjectType)
    ? raw.zonesObjectType as ObjectTypeId
    : objectType;
  const zonesObjectType = requestedZonesObjectType === objectType ? requestedZonesObjectType : objectType;
  const allowedZones = definition?.zones ?? [];
  const selectedZones = objectType && Array.isArray(raw.selectedZones)
    ? raw.selectedZones.filter((zone): zone is string => typeof zone === 'string' && allowedZones.includes(zone)).slice(0, 32)
    : [];

  return {
    objectType,
    metric,
    capacity,
    customCapacity,
    region,
    selectedZones,
    zonesObjectType,
    commissioning: typeof raw.commissioning === 'string' && isValidCommissioning(raw.commissioning) ? raw.commissioning : '',
    mode: raw.mode === 'tender' || raw.mode === 'leasing' ? raw.mode : 'standard',
    typeIntent: typeof raw.typeIntent === 'string' ? raw.typeIntent.slice(0, 80) : '',
    transferRevision: Number.isSafeInteger(raw.transferRevision) && Number(raw.transferRevision) >= 0 ? Number(raw.transferRevision) : 0,
    edited: sanitizedEdited(raw.edited)
  };
}

function persist(value: ProjectContext) {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, JSON.stringify(value));
}

function update(mutator: (value: ProjectContext) => ProjectContext) {
  projectContext.update((current) => {
    const next = sanitize(mutator(current));
    persist(next);
    return next;
  });
}

export function initProjectContext() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  window.sessionStorage.removeItem('a-modul-mini-brief');
  const stored = window.sessionStorage.getItem(storageKey);
  if (!stored) {
    persist(defaults);
    return;
  }
  try {
    const next = sanitize(JSON.parse(stored));
    projectContext.set(next);
    persist(next);
  } catch {
    projectContext.set(defaults);
    persist(defaults);
  }
}

export function setObjectType(objectType: ObjectTypeId) {
  const definition = definitionFor(objectType);
  update((current) => ({
    ...current,
    objectType,
    metric: definition.metric,
    capacity: definition.capacityOptions[0],
    customCapacity: '',
    selectedZones: [...definition.zones],
    zonesObjectType: objectType,
    typeIntent: '',
    edited: { ...current.edited, objectType: true, capacity: false, zones: false }
  }));
}

export function clearObjectType() {
  update((current) => ({
    ...current,
    objectType: '',
    metric: 'people',
    capacity: '',
    customCapacity: '',
    selectedZones: [],
    zonesObjectType: '',
    typeIntent: '',
    edited: { ...current.edited, objectType: true, capacity: false, zones: false }
  }));
}

export function setMetric(metric: CapacityMetric) {
  update((current) => {
    if (current.objectType !== 'service' || !['area', 'people'].includes(metric)) return current;
    return {
      ...current,
      metric,
      capacity: metric === 'area' ? '500' : '50',
      customCapacity: '',
      edited: { ...current.edited, capacity: true }
    };
  });
}

export function setCapacity(capacity: string) {
  update((current) => ({ ...current, capacity, customCapacity: capacity === 'custom' ? current.customCapacity : '', edited: { ...current.edited, capacity: true } }));
}

export function setCustomCapacity(customCapacity: string) {
  update((current) => ({ ...current, capacity: 'custom', customCapacity, edited: { ...current.edited, capacity: true } }));
}

export function setRegion(region: RegionId) {
  update((current) => ({ ...current, region, edited: { ...current.edited, region: true } }));
}

export function applyPublishedCaseContext(input: { objectType: ObjectTypeId; region: RegionId; capacity?: string }) {
  const definition = definitionFor(input.objectType);
  const capacity = input.capacity && definition.capacityOptions.includes(input.capacity) ? input.capacity : '';
  update((current) => ({
    ...current,
    objectType: input.objectType,
    metric: definition.metric,
    capacity,
    customCapacity: '',
    region: input.region,
    selectedZones: [],
    zonesObjectType: input.objectType,
    typeIntent: '',
    edited: {
      ...current.edited,
      objectType: true,
      capacity: Boolean(capacity),
      region: true,
      zones: true
    }
  }));
}

export function toggleProjectZone(zone: string) {
  update((current) => {
    if (!current.objectType || !definitionFor(current.objectType).zones.includes(zone)) return current;
    return {
      ...current,
      selectedZones: current.selectedZones.includes(zone)
        ? current.selectedZones.filter((item) => item !== zone)
        : [...current.selectedZones, zone],
      zonesObjectType: current.objectType,
      edited: { ...current.edited, zones: true }
    };
  });
}

export function setProjectZones(selectedZones: string[]) {
  update((current) => ({
    ...current,
    selectedZones,
    zonesObjectType: current.objectType,
    edited: { ...current.edited, zones: true }
  }));
}

export function commitProjectTransfer() {
  update((current) => ({ ...current, transferRevision: current.transferRevision + 1 }));
}

export function setCommissioning(commissioning: string) {
  update((current) => ({ ...current, commissioning, edited: { ...current.edited, commissioning: true } }));
}

export function setDiagnosisMode(mode: DiagnosisMode) {
  update((current) => ({ ...current, mode }));
}

export function applyLandingDefaults(input: { objectType: ObjectTypeSelection; region?: RegionId; typeIntent?: string }) {
  update((current) => {
    const forceObject = Boolean(input.typeIntent);
    const applyObject = forceObject || !current.edited.objectType;
    const nextObject = applyObject ? input.objectType : current.objectType;
    const definition = nextObject ? definitionFor(nextObject) : undefined;
    const objectChanged = applyObject && nextObject !== current.objectType;
    const resetCapacity = applyObject && (forceObject || !current.edited.capacity);
    const resetZones = applyObject && (objectChanged || forceObject || !current.edited.zones || current.zonesObjectType !== nextObject);

    return {
      ...current,
      ...(applyObject ? {
        objectType: nextObject,
        metric: definition?.metric ?? current.metric,
        ...(resetCapacity ? {
          capacity: definition?.capacityOptions[0] ?? '',
          customCapacity: ''
        } : {}),
        ...(resetZones ? {
          selectedZones: definition ? [...definition.zones] : [],
          zonesObjectType: nextObject,
          edited: { ...current.edited, zones: false, ...(forceObject ? { objectType: false } : {}) }
        } : forceObject ? { edited: { ...current.edited, objectType: false } } : {})
      } : {}),
      ...(input.region !== undefined ? { region: input.region } : {}),
      typeIntent: input.typeIntent ?? ''
    };
  });
}

export function metricLabel(metric: CapacityMetric) {
  if (metric === 'area') return 'Площадь';
  if (metric === 'workplaces') return 'Рабочие места';
  return 'Численность';
}

export function metricUnit(metric: CapacityMetric) {
  if (metric === 'area') return 'м²';
  if (metric === 'workplaces') return 'рабочих мест';
  return 'человек';
}
