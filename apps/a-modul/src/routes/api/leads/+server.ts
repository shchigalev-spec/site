import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  parseLead,
  submitLead,
  type LeadApiResponse
} from '$lib/server/lead-adapter';

const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

const MAX_REQUEST_BYTES = 41 * 1024 * 1024;

function reference(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `AMD-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function failure(
  status: number,
  code: Exclude<LeadApiResponse, { ok: true }>['code'],
  requestReference: string,
  message: string,
  retryable: boolean,
  errors?: Record<string, string>
) {
  const response: LeadApiResponse = {
    ok: false,
    code,
    reference: requestReference,
    message,
    retryable,
    preserveState: true,
    ...(errors ? { errors } : {})
  };

  return json(response, { status, headers: RESPONSE_HEADERS });
}

export const POST: RequestHandler = async ({ request }) => {
  const requestReference = reference();
  const contentType = request.headers.get('content-type') || '';

  if (!contentType.toLowerCase().startsWith('multipart/form-data;')) {
    return failure(
      415,
      'REQUEST_FORMAT_INVALID',
      requestReference,
      'Формат запроса не поддерживается. Введённые данные сохранены — отправьте форму повторно.',
      false
    );
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return failure(
      413,
      'REQUEST_FORMAT_INVALID',
      requestReference,
      'Размер отправляемых данных превышает допустимый. Суммарный размер файлов — не более 40 МБ.',
      false,
      { files: 'Уменьшите суммарный размер файлов до 40 МБ.' }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    const errorStatus = typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status?: unknown }).status)
      : 0;
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorStatus === 413 || errorMessage.includes('BODY_SIZE_LIMIT') || errorMessage.includes('exceeds limit')) {
      return failure(
        413,
        'REQUEST_FORMAT_INVALID',
        requestReference,
        'Размер отправляемых данных превышает допустимый. Суммарный размер файлов — не более 40 МБ.',
        false,
        { files: 'Уменьшите суммарный размер файлов до 40 МБ.' }
      );
    }
    return failure(
      400,
      'REQUEST_FORMAT_INVALID',
      requestReference,
      'Не удалось прочитать форму. Введённые данные сохранены — отправьте её повторно.',
      true
    );
  }

  const parsed = parseLead(formData);
  if (!parsed.lead) {
    return failure(
      422,
      'VALIDATION_ERROR',
      requestReference,
      'Проверьте выделенные поля. Введённые данные сохранены.',
      false,
      parsed.errors
    );
  }

  const mockFailureRequested = request.headers.get('x-a-modul-mock-result') === 'failure';
  const result = await submitLead(parsed.lead, requestReference, mockFailureRequested);

  if (!result.accepted) {
    if (result.configurationError) {
      return failure(
        503,
        'CRM_CONFIGURATION_ERROR',
        requestReference,
        'Приём заявок временно не настроен. Введённые данные сохранены — свяжитесь с нами по телефону или электронной почте.',
        false
      );
    }

    return failure(
      503,
      'CRM_UNAVAILABLE',
      requestReference,
      'Не удалось передать заявку. Введённые данные сохранены — попробуйте ещё раз или свяжитесь с нами по телефону.',
      true
    );
  }

  const response: LeadApiResponse = {
    ok: true,
    code: 'ACCEPTED',
    reference: requestReference,
    message:
      'Заявка принята. Менеджер уточнит исходные данные. Предварительное КП подготовим в течение одного рабочего дня после получения необходимых вводных.'
  };

  return json(response, { status: 201, headers: RESPONSE_HEADERS });
};
