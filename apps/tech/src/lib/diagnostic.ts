import { z } from 'zod';

export const acceptedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'mp4', 'mov', 'm4a', 'mp3', 'wav'];
export const acceptedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_TOTAL_SIZE = 40 * 1024 * 1024;
export const MAX_FILES = 6;

export interface FileLike {
  name: string;
  type: string;
  size: number;
}

export const diagnosticSchema = z.object({
  heard: z.string().trim().min(1, 'Опишите, что слышно'),
  direction: z.string().trim().min(1, 'Укажите направление или выберите «не уверен»'),
  timing: z.string().trim().min(1, 'Укажите, когда слышен шум'),
  rooms: z.string().trim().min(1, 'Укажите комнаты'),
  stage: z.enum(['new-build', 'renovation', 'finished'], { message: 'Выберите стадию объекта' }),
  path: z.string().trim().max(80).optional().default(''),
  spaceLoss: z.string().trim().max(80).optional().default(''),
  building: z.string().trim().max(120).optional().default(''),
  area: z.string().trim().max(80).optional().default(''),
  comment: z.string().trim().max(2000, 'Комментарий не должен превышать 2000 знаков').optional().default(''),
  name: z.string().trim().min(2, 'Укажите имя').max(120),
  phone: z.string().trim().regex(/^[+\d][\d\s()\-]{7,20}$/, 'Проверьте номер телефона'),
  email: z.union([z.literal(''), z.string().trim().email('Проверьте email')]).optional().default(''),
  consent: z.literal('on', { message: 'Нужно согласие на обработку данных' })
});

export type DiagnosticPayload = z.infer<typeof diagnosticSchema>;

export function validateFiles(files: FileLike[]): string[] {
  const errors: string[] = [];
  if (files.length > MAX_FILES) errors.push(`Можно приложить не больше ${MAX_FILES} файлов`);
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_SIZE) errors.push('Общий размер файлов не должен превышать 40 МБ');

  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!acceptedExtensions.includes(extension) || (file.type && !acceptedMimeTypes.includes(file.type))) {
      errors.push(`${file.name}: неподдерживаемый формат`);
    }
    if (file.size > MAX_FILE_SIZE) errors.push(`${file.name}: файл больше 10 МБ`);
    if (file.size === 0) errors.push(`${file.name}: файл пуст`);
  }

  return [...new Set(errors)];
}

export function formDataToDiagnostic(formData: FormData) {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, value]) => typeof value === 'string') as [string, string][]
  );
  return diagnosticSchema.safeParse(raw);
}
