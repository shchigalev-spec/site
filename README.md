# Lab of Silence website

Russian-language, multi-route service website for engineering apartment
soundproofing in Moscow. The current application uses the repository's Vinext
runtime and React Server Components while preserving the SSR, progressive
enhancement, accessibility, SEO, and Cloudflare-compatible deployment goals of
the original product brief.

## Local development

1. Install Node.js 22.13 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and configure only available values.
4. Run `npm run dev`.

`npm run build`, `npm run lint`, and `npm test` are the validation commands.

## Runtime configuration

- `NEXT_PUBLIC_SITE_URL`: canonical production origin.
- `NEXT_PUBLIC_YANDEX_METRICA_ID`: optional Metrica counter.
- `BITRIX_WEBHOOK_URL`: server-only Bitrix webhook base.
- `BITRIX_ENTITY_TYPE`: `lead`, `deal`, or `spa:<entityTypeId>`.
- `BITRIX_FIELD_MAP_JSON`: JSON object mapping internal payload keys to Bitrix
  field IDs.

Recommended mapped fields: `title`, `name`, `phone`, `email`, `noise`, `stage`,
`surface`, `direction`, `pattern`, `rooms`, `building`, `area`, `scenario`,
`route`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`, `timestamp`, and `file_metadata`.

The Bitrix webhook is never exposed to browser code. In development, missing
Bitrix variables activate an explicitly logged mock adapter so the form flow
can be tested. In production, missing configuration or delivery failure returns
an error and the interface preserves user input; it never shows false success.
Attachments are validated and represented as metadata until a real Bitrix file
field mapping is configured.

## Content controls

Business facts, service routes, case data, FAQs, and noise profiles live under
`lib/content`. Unverified launch inputs are listed in `docs/CONTENT-TODO.md`.
Do not replace those TODOs with invented claims.

