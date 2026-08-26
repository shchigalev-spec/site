import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import {
  capacityMetrics,
  isPlausiblePhone,
  isValidEmail,
  landingRoutePaths,
  objectTypeIds,
  projectStageOptions,
  regionIds,
  regionVariantSlugs,
  scopeOptions,
  typeVariantSlugs
} from '$lib/content/lead-options';
import { objectTypeDefinitions } from '$lib/state/projectContext';

const SUPPORTED_EXTENSIONS = new Set(['pdf', 'docx', 'xlsx', 'dwg', 'jpg', 'jpeg', 'png', 'zip']);
const FILE_FIELDS = new Set(['files', 'files[]', 'attachments', 'attachments[]', 'file']);
const MAX_FILE_COUNT = 10;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 40 * 1024 * 1024;
const WEBHOOK_TIMEOUT_MS = 12_000;
const OBJECT_TYPES = new Set<string>(objectTypeIds);
const CAPACITY_METRICS = new Set<string>(capacityMetrics);
const REGIONS = new Set<string>(regionIds);
const PROJECT_STAGES = new Set<string>(projectStageOptions);
const SCOPES = new Set<string>(scopeOptions);
const TYPE_VARIANTS = new Set<string>(typeVariantSlugs);
const REGION_VARIANTS = new Set<string>(regionVariantSlugs);
const LANDING_ROUTES = new Set<string>(landingRoutePaths);
const CAMPAIGN_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'] as const;

const MIME_BY_EXTENSION: Record<string, Set<string>> = {
  pdf: new Set(['application/pdf']),
  docx: new Set(['application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  xlsx: new Set(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  dwg: new Set([
    'application/acad',
    'application/autocad',
    'application/dwg',
    'application/octet-stream',
    'application/x-acad',
    'image/vnd.dwg'
  ]),
  jpg: new Set(['image/jpeg']),
  jpeg: new Set(['image/jpeg']),
  png: new Set(['image/png']),
  zip: new Set(['application/zip', 'application/x-zip-compressed', 'application/octet-stream'])
};

const STRING_LIMITS: Record<string, number> = {
  mode: 24,
  objectType: 120,
  personnelCount: 12,
  area: 16,
  capacityMetric: 24,
  region: 120,
  desiredCommissioningDate: 80,
  projectStage: 120,
  leasingInterest: 16,
  tenderInvitation: 16,
  comment: 4_000,
  company: 240,
  name: 160,
  phone: 80,
  email: 254,
  contact: 320,
  tenderName: 320,
  deadline: 80,
  consent: 16,
  landingRoute: 300,
  pageUrl: 2_000,
  referrer: 2_000,
  landing_variant: 200,
  regionSlug: 100,
  typeVariant: 100,
  utm_source: 300,
  utm_medium: 300,
  utm_campaign: 300,
  utm_content: 300,
  utm_term: 300,
  yclid: 300
};

const ALIASES: Record<string, string[]> = {
  mode: ['mode', 'submissionMode'],
  objectType: ['objectType', 'object_type', 'type'],
  personnelCount: ['personnelCount', 'personnel_count', 'capacity'],
  area: ['area', 'approximateArea', 'approximate_area'],
  capacityMetric: ['capacityMetric', 'capacity_metric'],
  region: ['region', 'objectRegion', 'object_region'],
  desiredCommissioningDate: [
    'desiredCommissioningDate',
    'desired_commissioning_date',
    'commissioningDate'
  ],
  projectStage: ['projectStage', 'project_stage'],
  leasingInterest: ['leasingInterest', 'leasing_interest'],
  tenderInvitation: ['tenderInvitation', 'tender_invitation'],
  comment: ['comment', 'message'],
  company: ['company'],
  name: ['name'],
  phone: ['phone'],
  email: ['email'],
  contact: ['contact'],
  tenderName: ['tenderName', 'tender_name'],
  deadline: ['deadline', 'tenderDeadline', 'tender_deadline'],
  consent: ['consent', 'privacyConsent', 'privacy_consent'],
  landingRoute: ['landingRoute', 'landing_route', 'route'],
  pageUrl: ['pageUrl', 'page_url'],
  referrer: ['referrer'],
  landing_variant: ['landing_variant', 'landingVariant'],
  regionSlug: ['regionSlug', 'region_slug'],
  typeVariant: ['typeVariant', 'type_variant'],
  utm_source: ['utm_source'],
  utm_medium: ['utm_medium'],
  utm_campaign: ['utm_campaign'],
  utm_content: ['utm_content'],
  utm_term: ['utm_term'],
  yclid: ['yclid']
};

const FORWARDED_FIELDS = Object.keys(STRING_LIMITS);

export type LeadFailureCode =
  | 'REQUEST_FORMAT_INVALID'
  | 'VALIDATION_ERROR'
  | 'CRM_CONFIGURATION_ERROR'
  | 'CRM_UNAVAILABLE';

export type LeadApiResponse =
  | {
      ok: true;
      code: 'ACCEPTED';
      reference: string;
      message: string;
    }
  | {
      ok: false;
      code: LeadFailureCode;
      reference: string;
      message: string;
      retryable: boolean;
      errors?: Record<string, string>;
      preserveState: true;
    };

export interface ParsedLead {
  mode: 'standard' | 'tender' | 'leasing';
  fields: Record<string, string>;
  scope: string[];
  functionalZones: string[];
  files: File[];
}

export interface ParseLeadResult {
  lead?: ParsedLead;
  errors: Record<string, string>;
}

export interface SubmitLeadResult {
  accepted: boolean;
  configurationError?: boolean;
}

function firstString(formData: FormData, aliases: string[]): string {
  for (const alias of aliases) {
    const value = formData.get(alias);
    if (typeof value === 'string') return value.trim();
  }

  return '';
}

function collectScope(formData: FormData): string[] {
  const values = ['scope', 'scope[]', 'requiredScope', 'requiredScope[]'].flatMap((key) =>
    formData.getAll(key)
  );

  return values
    .filter((value): value is string => typeof value === 'string')
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 16);
}

function collectFunctionalZones(formData: FormData): string[] {
  return ['functionalZones', 'functionalZones[]', 'functional_zones', 'functional_zones[]']
    .flatMap((key) => formData.getAll(key))
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 32);
}

function collectFiles(formData: FormData): File[] {
  const files: File[] = [];

  for (const [key, value] of formData.entries()) {
    if (!FILE_FIELDS.has(key) || typeof value === 'string' || value.size === 0) continue;
    files.push(value);
  }

  return files;
}

function fileExtension(file: File): string {
  const lastDot = file.name.lastIndexOf('.');
  return lastDot === -1 ? '' : file.name.slice(lastDot + 1).toLowerCase();
}

function isTruthy(value: string): boolean {
  return ['1', 'true', 'yes', 'on', 'accepted', 'да'].includes(value.toLowerCase());
}

function isPositiveNumber(value: string): boolean {
  if (!value) return false;
  const normalized = value.replace(/\s/g, '').replace(',', '.');
  return /^\d+(?:\.\d{1,2})?$/.test(normalized) && Number(normalized) > 0;
}

function isValidMonth(value: string): boolean {
  if (['Срочно', '1–3 месяца', '3–6 месяцев', '6–12 месяцев'].includes(value)) return true;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  return year >= 2000 && year <= 2200;
}

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return year >= 2000 && year <= 2200
    && date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function sanitizeReferrer(value: string): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? `${url.origin}${url.pathname}`.slice(0, STRING_LIMITS.referrer) : '';
  } catch {
    return '';
  }
}

function sanitizeLandingVariant(value: string): string {
  if (LANDING_ROUTES.has(value)) return value;
  const [kind, slug, extra] = value.split(':');
  if (extra) return '';
  if (kind === 'type' && TYPE_VARIANTS.has(slug)) return value;
  if (kind === 'region' && REGION_VARIANTS.has(slug)) return value;
  return '';
}

function sanitizePageUrl(value: string): string {
  if (!value) return '';
  try {
    const source = new URL(value);
    if (!['http:', 'https:'].includes(source.protocol) || !LANDING_ROUTES.has(source.pathname)) return '';
    const clean = new URL(source.pathname, source.origin);
    for (const field of CAMPAIGN_FIELDS) {
      const campaignValue = source.searchParams.get(field)?.slice(0, 300);
      if (campaignValue) clean.searchParams.set(field, campaignValue);
    }
    const type = source.searchParams.get('type') ?? '';
    const region = source.searchParams.get('region') ?? '';
    const mode = source.searchParams.get('mode') ?? '';
    if (TYPE_VARIANTS.has(type)) clean.searchParams.set('type', type);
    if (REGION_VARIANTS.has(region)) clean.searchParams.set('region', region);
    if (['standard', 'tender', 'leasing'].includes(mode)) clean.searchParams.set('mode', mode);
    return clean.toString().slice(0, STRING_LIMITS.pageUrl);
  } catch {
    return '';
  }
}

function sanitizeLandingFields(fields: Record<string, string>): void {
  fields.landingRoute = LANDING_ROUTES.has(fields.landingRoute) ? fields.landingRoute : '';
  fields.typeVariant = TYPE_VARIANTS.has(fields.typeVariant) ? fields.typeVariant : '';
  fields.regionSlug = REGION_VARIANTS.has(fields.regionSlug) ? fields.regionSlug : '';
  fields.landing_variant = sanitizeLandingVariant(fields.landing_variant);
  fields.pageUrl = sanitizePageUrl(fields.pageUrl);
  fields.referrer = sanitizeReferrer(fields.referrer);
}

function normalizeMode(fields: Record<string, string>): ParsedLead['mode'] | null {
  if (isTruthy(fields.tenderInvitation)) return 'tender';

  switch (fields.mode.toLowerCase()) {
    case '':
    case 'standard':
    case 'full':
    case 'brief':
      return 'standard';
    case 'tender':
      return 'tender';
    case 'leasing':
      return 'leasing';
    default:
      return null;
  }
}

function validateFiles(files: File[], errors: Record<string, string>): void {
  if (files.length > MAX_FILE_COUNT) {
    errors.files = `Можно приложить не более ${MAX_FILE_COUNT} файлов.`;
    return;
  }

  let totalBytes = 0;

  for (const file of files) {
    totalBytes += file.size;
    const extension = fileExtension(file);

    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      errors.files = 'Допустимы PDF, DOCX, XLSX, DWG, JPG, PNG и ZIP.';
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      errors.files = 'Размер одного файла не должен превышать 20 МБ.';
      return;
    }

    const normalizedMime = file.type.toLowerCase();
    if (normalizedMime && !MIME_BY_EXTENSION[extension].has(normalizedMime)) {
      errors.files = 'Тип одного из файлов не соответствует его расширению.';
      return;
    }
  }

  if (totalBytes > MAX_TOTAL_FILE_BYTES) {
    errors.files = 'Общий размер файлов не должен превышать 40 МБ.';
  }
}

export function parseLead(formData: FormData): ParseLeadResult {
  const fields = Object.fromEntries(
    Object.entries(ALIASES).map(([canonicalName, aliases]) => [canonicalName, firstString(formData, aliases)])
  );
  const scope = collectScope(formData);
  const functionalZones = collectFunctionalZones(formData);
  const files = collectFiles(formData);
  const errors: Record<string, string> = {};
  const mode = normalizeMode(fields);

  for (const [field, limit] of Object.entries(STRING_LIMITS)) {
    if (fields[field].length > limit) errors[field] = 'Значение слишком длинное.';
  }

  sanitizeLandingFields(fields);

  if (!mode) errors.mode = 'Неизвестный режим формы.';
  if (!isTruthy(fields.consent)) errors.consent = 'Подтвердите согласие на обработку данных.';

  const validPhone = fields.phone ? isPlausiblePhone(fields.phone) : false;
  const validEmail = fields.email ? isValidEmail(fields.email) : false;
  const validCombinedContact = fields.contact
    ? isPlausiblePhone(fields.contact) || isValidEmail(fields.contact)
    : false;
  if (fields.phone && !validPhone) errors.phone = 'Укажите корректный телефон: от 10 до 15 цифр.';
  if (fields.email && !validEmail) errors.email = 'Проверьте электронную почту.';
  if (fields.contact && !validCombinedContact) errors.contact = 'Укажите корректный телефон или электронную почту.';
  if (!validPhone && !validEmail && !validCombinedContact) errors.contact = 'Укажите телефон или электронную почту.';

  if (fields.objectType && !OBJECT_TYPES.has(fields.objectType)) errors.objectType = 'Выберите допустимый тип объекта.';
  if (fields.capacityMetric && !CAPACITY_METRICS.has(fields.capacityMetric)) errors.capacityMetric = 'Выберите допустимую единицу вместимости.';
  if (fields.region && !REGIONS.has(fields.region)) errors.region = 'Выберите регион из списка.';
  if (fields.projectStage && !PROJECT_STAGES.has(fields.projectStage)) errors.projectStage = 'Выберите стадию проекта из списка.';
  if (fields.desiredCommissioningDate && !isValidMonth(fields.desiredCommissioningDate)) {
    errors.desiredCommissioningDate = 'Укажите корректный срок ввода.';
  }

  const definition = objectTypeDefinitions.find((item) => item.id === fields.objectType);
  if (definition && fields.capacityMetric) {
    const allowedMetrics = definition.id === 'service' ? ['area', 'people'] : [definition.metric];
    if (!allowedMetrics.includes(fields.capacityMetric)) errors.capacityMetric = 'Единица вместимости не соответствует типу объекта.';
  }
  if (scope.some((value) => !SCOPES.has(value))) errors.scope = 'Выберите состав работ из списка.';
  if (functionalZones.length && !definition) errors.functionalZones = 'Сначала выберите тип объекта.';
  if (definition && functionalZones.some((value) => !definition.zones.includes(value))) {
    errors.functionalZones = 'Выберите функциональные зоны для указанного типа объекта.';
  }

  if (fields.personnelCount && (!/^\d+$/.test(fields.personnelCount) || Number(fields.personnelCount) <= 0)) {
    errors.personnelCount = 'Укажите целое положительное число.';
  }
  if (functionalZones.some((value) => value.length > 120)) {
    errors.functionalZones = 'Название функциональной зоны слишком длинное.';
  }
  if (fields.area && !isPositiveNumber(fields.area)) {
    errors.area = 'Укажите положительную площадь.';
  }

  if (mode === 'tender') {
    if (!fields.company) errors.company = 'Укажите компанию.';
    if (!fields.tenderName) errors.tenderName = 'Укажите название тендера.';
    if (!fields.deadline) errors.deadline = 'Укажите срок подачи.';
    else if (!isValidDate(fields.deadline)) errors.deadline = 'Укажите корректную дату подачи.';
    if (!fields.region) errors.region = 'Укажите регион объекта.';
  } else {
    if (!fields.objectType) errors.objectType = 'Выберите тип объекта.';
    if (!fields.region) errors.region = 'Выберите регион.';
    if (!fields.capacityMetric) errors.capacityMetric = 'Выберите единицу вместимости.';
    if (fields.capacityMetric === 'area' && !fields.area) {
      errors.capacity = 'Укажите ориентировочную площадь.';
    } else if ((fields.capacityMetric === 'people' || fields.capacityMetric === 'workplaces') && !fields.personnelCount) {
      errors.capacity = fields.capacityMetric === 'workplaces' ? 'Укажите число рабочих мест.' : 'Укажите численность персонала.';
    } else if (!fields.personnelCount && !fields.area) {
      errors.capacity = 'Укажите численность персонала или ориентировочную площадь.';
    }
  }

  validateFiles(files, errors);

  if (!mode || Object.keys(errors).length > 0) return { errors };

  fields.mode = mode;
  return { lead: { mode, fields, scope, functionalZones, files }, errors };
}

function safeForwardedFilename(file: File, index: number): string {
  const extension = fileExtension(file);
  const basename = file.name
    .split(/[\\/]/)
    .at(-1)
    ?.replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .replace(/^\.+/, '')
    .slice(0, 120);

  return basename || `attachment-${index + 1}.${extension}`;
}

function buildWebhookBody(lead: ParsedLead, reference: string): FormData {
  const body = new FormData();
  body.set('reference', reference);
  body.set('receivedAt', new Date().toISOString());
  body.set('source', 'a-modul-direct');

  for (const field of FORWARDED_FIELDS) {
    const value = lead.fields[field];
    if (value) body.set(field, value);
  }

  for (const value of lead.scope) body.append('scope[]', value);
  for (const value of lead.functionalZones) body.append('functionalZones[]', value);
  lead.files.forEach((file, index) => body.append('files[]', file, safeForwardedFilename(file, index)));

  return body;
}

function validWebhookUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || (dev && url.protocol === 'http:') ? url : null;
  } catch {
    return null;
  }
}

export async function submitLead(
  lead: ParsedLead,
  reference: string,
  mockFailureRequested: boolean
): Promise<SubmitLeadResult> {
  const mode = (env.A_MODUL_CRM_MODE || 'webhook').trim().toLowerCase();

  if (mode === 'mock') {
    if (!dev) return { accepted: false, configurationError: true };
    return { accepted: !mockFailureRequested };
  }

  if (mode !== 'webhook') return { accepted: false, configurationError: true };

  const webhookUrl = validWebhookUrl((env.A_MODUL_LEAD_WEBHOOK_URL || '').trim());
  if (!webhookUrl) return { accepted: false, configurationError: true };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const headers = new Headers({
      Accept: 'application/json',
      'User-Agent': 'a-modul-direct/lead-adapter'
    });
    const token = (env.A_MODUL_LEAD_WEBHOOK_TOKEN || '').trim();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: buildWebhookBody(lead, reference),
      signal: controller.signal
    });

    return { accepted: response.ok };
  } catch {
    return { accepted: false };
  } finally {
    clearTimeout(timeout);
  }
}
