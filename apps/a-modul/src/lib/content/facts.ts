import { env } from '$env/dynamic/public';

export type EvidenceFact = {
  value: string;
  label: string;
  sourceKey: string;
};

export const evidenceFacts: EvidenceFact[] = [
  { value: 'С 2007 года', label: 'проектируем и производим', sourceKey: 'official-company-history' },
  { value: '58', label: 'вахтовых поселков', sourceKey: 'official-shift-camps' },
  { value: '27 000+', label: 'произведённых модулей', sourceKey: 'official-company-history' },
  { value: '2 000+', label: 'построенных зданий', sourceKey: 'official-company-history' },
  { value: '305 120 м²', label: 'построенных объектов', sourceKey: 'official-company-history' },
  { value: 'до 750', label: 'модулей в месяц', sourceKey: 'official-production-current' }
];

const fallbackSiteOrigin = 'https://a-modul.ru';
const configuredSiteUrl = (env.PUBLIC_SITE_URL ?? '').trim();
export function resolvePublicSiteOrigin(value = '') {
  try {
    const url = new URL(value.trim() || fallbackSiteOrigin);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return fallbackSiteOrigin;
    return url.origin;
  } catch {
    return fallbackSiteOrigin;
  }
}

export const publicSiteOrigin = resolvePublicSiteOrigin(configuredSiteUrl);

const fallbackPhone = '88003336131';
const configuredPhone = (env.PUBLIC_SITE_PHONE ?? '').replace(/\D/g, '');
const phoneDigits = /^\d{10,15}$/.test(configuredPhone) ? configuredPhone : fallbackPhone;
const normalizedPhone = phoneDigits.startsWith('8') && phoneDigits.length === 11 ? `7${phoneDigits.slice(1)}` : phoneDigits;
const phoneDisplay = phoneDigits === fallbackPhone || normalizedPhone === '78003336131' ? '8 (800) 333-61-31' : `+${normalizedPhone}`;
const configuredEmail = (env.PUBLIC_SITE_EMAIL ?? '').trim();
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : 'zakaz@a-modul.ru';

export const publicContacts = {
  phoneDisplay,
  phoneHref: `tel:+${normalizedPhone}`,
  phoneE164: `+${normalizedPhone}`,
  email
} as const;
