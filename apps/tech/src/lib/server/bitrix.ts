import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { DiagnosticPayload } from '$lib/diagnostic';

interface BitrixResult {
  id: string;
  mode: 'bitrix' | 'development-mock';
}

function buildEndpoint(webhook: string) {
  const url = new URL(webhook);
  if (!/\.json$/i.test(url.pathname)) {
    url.pathname = `${url.pathname.replace(/\/$/, '')}/crm.lead.add.json`;
  }
  return url.toString();
}

function description(payload: DiagnosticPayload, files: File[]) {
  return [
    `Что слышно: ${payload.heard}`,
    `Направление: ${payload.direction}`,
    `Когда: ${payload.timing}`,
    `Комнаты: ${payload.rooms}`,
    `Стадия: ${payload.stage}`,
    payload.building && `Тип дома: ${payload.building}`,
    payload.area && `Проблемная площадь: ${payload.area}`,
    payload.comment && `Комментарий: ${payload.comment}`,
    payload.path && `Предполагаемый путь: ${payload.path}`,
    payload.spaceLoss && `Допустимая потеря пространства: ${payload.spaceLoss}`,
    files.length && `Количество приложений: ${files.length}`,
    'Концепт сайта: tech'
  ].filter(Boolean).join('\n');
}

async function bitrixFileData(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return [file.name, btoa(binary)];
}

export async function sendToBitrix(payload: DiagnosticPayload, files: File[]): Promise<BitrixResult> {
  const webhook = env.BITRIX_WEBHOOK_URL?.trim();

  if (!webhook) {
    if (!dev) throw new Error('Bitrix webhook is not configured');
    console.info('[tech diagnostic mock]', { concept: 'tech', fileCount: files.length, validated: true });
    return { id: `dev-${Date.now()}`, mode: 'development-mock' };
  }

  const fields: Record<string, unknown> = {
    TITLE: `Диагностика шума — ${payload.heard}`,
    NAME: payload.name,
    PHONE: [{ VALUE: payload.phone, VALUE_TYPE: 'WORK' }],
    COMMENTS: description(payload, files),
    SOURCE_DESCRIPTION: 'Сайт Лаборатории тишины',
  };

  if (payload.email) fields.EMAIL = [{ VALUE: payload.email, VALUE_TYPE: 'WORK' }];
  if (env.BITRIX_ASSIGNED_BY_ID) fields.ASSIGNED_BY_ID = env.BITRIX_ASSIGNED_BY_ID;
  if (env.BITRIX_SOURCE_ID) fields.SOURCE_ID = env.BITRIX_SOURCE_ID;

  const fileField = env.BITRIX_FILE_FIELD?.trim();
  if (files.length && !fileField) {
    throw new Error('Bitrix file field is not configured');
  }
  if (files.length && fileField) {
    fields[fileField] = await Promise.all(files.map(bitrixFileData));
  }

  const response = await fetch(buildEndpoint(webhook), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: 'Y' } }),
    signal: AbortSignal.timeout(15_000)
  });

  if (!response.ok) throw new Error(`Bitrix request failed: ${response.status}`);
  const body = await response.json() as { result?: number | string; error?: string; error_description?: string };
  if (!body.result || body.error) throw new Error(body.error_description || body.error || 'Bitrix rejected the lead');

  return { id: String(body.result), mode: 'bitrix' };
}
