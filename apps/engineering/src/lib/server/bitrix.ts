import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { DiagnosisInput } from './validation';

export type BitrixResult = { id: string; mock: boolean };

function comments(data: DiagnosisInput): string {
  return [
    `Что слышно: ${data.heard}`,
    `Направление: ${data.direction}`,
    `Когда: ${data.timing}`,
    `Комнаты: ${data.rooms}`,
    `Этап: ${data.stage}`,
    `Тип дома: ${data.buildingType || 'не указан'}`,
    `Проблемная площадь: ${data.area || 'не указана'}`,
    `Допустимая потеря пространства: ${data.space || 'нужно обсудить'}`,
    `Контекст перехода: ${data.sourceContext || 'прямой вход'}`,
    `Комментарий: ${data.comment || 'нет'}`,
    `Количество приложений: ${data.files.length}`,
    'Примечание: запись с телефона помогает понять контекст, но не заменяет профессиональный замер.'
  ].join('\n');
}

async function bitrixFileData(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return [file.name, btoa(binary)];
}

export async function createBitrixLead(data: DiagnosisInput): Promise<BitrixResult> {
  const webhook = env.BITRIX_WEBHOOK_URL?.replace(/\/$/, '');
  if (!webhook) {
    if (dev) {
      console.info('[engineering diagnosis mock]', { concept: 'engineering', fileCount: data.files.length, validated: true });
      return { id: `mock-${Date.now()}`, mock: true };
    }
    throw new Error('Bitrix integration is not configured');
  }

  const fields: Record<string, unknown> = {
    TITLE: `Диагностика шума — ${data.heard}`,
    NAME: data.name,
    PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
    COMMENTS: comments(data),
    SOURCE_ID: env.BITRIX_SOURCE_ID || undefined,
    ASSIGNED_BY_ID: env.BITRIX_ASSIGNED_BY_ID || undefined
  };
  if (data.email) fields.EMAIL = [{ VALUE: data.email, VALUE_TYPE: 'WORK' }];

  const fileField = env.BITRIX_FILE_FIELD?.trim();
  if (data.files.length && !fileField) throw new Error('Bitrix file field is not configured');
  if (data.files.length && fileField) fields[fileField] = await Promise.all(data.files.map(bitrixFileData));

  const response = await fetch(`${webhook}/crm.lead.add.json`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: 'Y' } })
  });
  if (!response.ok) throw new Error(`Bitrix responded with ${response.status}`);
  const payload = (await response.json()) as { result?: number | string; error_description?: string };
  if (!payload.result) throw new Error(payload.error_description || 'Bitrix did not confirm lead creation');
  return { id: String(payload.result), mock: false };
}
