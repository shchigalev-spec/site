import { validateFiles } from '$lib/file-policy';

export type DiagnosisInput = {
  heard: string;
  direction: string;
  timing: string;
  rooms: string;
  stage: string;
  buildingType: string;
  area: string;
  space: string;
  sourceContext: string;
  comment: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  files: File[];
};

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export function parseDiagnosis(form: FormData): { data?: DiagnosisInput; errors: string[] } {
  const files = form.getAll('files').filter((value): value is File => value instanceof File && value.name.length > 0);
  const data: DiagnosisInput = {
    heard: text(form, 'heard'),
    direction: text(form, 'direction'),
    timing: text(form, 'timing'),
    rooms: text(form, 'rooms'),
    stage: text(form, 'stage'),
    buildingType: text(form, 'buildingType'),
    area: text(form, 'area'),
    space: text(form, 'space'),
    sourceContext: text(form, 'sourceContext'),
    comment: text(form, 'comment'),
    name: text(form, 'name'),
    phone: text(form, 'phone'),
    email: text(form, 'email'),
    consent: text(form, 'consent') === 'yes',
    files
  };

  const errors = validateFiles(files);
  if (!data.heard) errors.push('Опишите, что слышно.');
  if (!data.direction) errors.push('Укажите предполагаемое направление.');
  if (!data.timing) errors.push('Укажите, когда слышен шум.');
  if (!data.rooms) errors.push('Укажите комнаты.');
  if (!data.stage) errors.push('Укажите этап квартиры.');
  if (!data.name) errors.push('Укажите имя.');
  if (!/^\+?[\d\s()\-]{7,20}$/.test(data.phone)) errors.push('Проверьте номер телефона.');
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Проверьте email.');
  if (!data.consent) errors.push('Нужно согласие на обработку данных.');

  return errors.length ? { errors } : { data, errors };
}
