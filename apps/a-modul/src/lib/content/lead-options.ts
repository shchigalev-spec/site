export const projectStageOptions = [
  'Идея',
  'Собираем предложения',
  'Тендер',
  'Есть техническое задание',
  'Есть проект',
  'Строительство начато'
] as const;

export const scopeOptions = [
  'Проектирование',
  'Производство',
  'Доставка',
  'Монтаж',
  'Инженерия',
  'Мебель и комплектация',
  'Пусконаладка'
] as const;

export const objectTypeIds = ['shift', 'dorm', 'abk', 'service'] as const;
export const capacityMetrics = ['people', 'workplaces', 'area'] as const;
export const regionIds = ['moskva', 'krasnoyarsk', 'ural', 'far-east', 'siberia', 'kurgan', 'russia'] as const;
export const typeVariantSlugs = ['kpp', 'stolovaya', 'bpk', 'prorabskaya', 'office', 'abk', 'other'] as const;
export const regionVariantSlugs = ['moskva', 'krasnoyarsk', 'ural', 'dalniy-vostok', 'sibir', 'kurgan', 'rossiya'] as const;
export const landingRoutePaths = ['/modulnye-zdaniya/', '/vahtovye-poselki/', '/modulnye-ofisy-abk/', '/modulnye-obshchezhitiya/'] as const;

export function isPlausiblePhone(value: string): boolean {
  if (!value || !/^[+()\d\s.-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
