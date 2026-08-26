# A-Modul lead integration

## Runtime contract

The landing sends `multipart/form-data` to `POST /api/leads`. The server validates the request, then forwards a new multipart request to the configured CRM webhook. A browser-visible success is valid only after the configured webhook returns a 2xx response. The upstream response body, identifiers, and headers are never exposed to the browser.

The endpoint response is deliberately small and never echoes submitted personal data or attachment names:

```json
{
  "ok": true,
  "code": "ACCEPTED",
  "reference": "AMD-20260825-12AB34CD",
  "message": "Заявка принята. Менеджер уточнит исходные данные. Предварительное КП подготовим в течение одного рабочего дня после получения необходимых вводных."
}
```

All failure responses include `ok: false`, a generated `reference`, a stable `code`, a buyer-facing `message`, `retryable`, and `preserveState: true`. Validation failures also include field-keyed `errors`. The client must retain its current form and attachments on every failure and clear them only after `ok: true`.

Possible failure codes:

- `REQUEST_FORMAT_INVALID` — the request is not readable multipart data;
- `VALIDATION_ERROR` — required or typed fields are invalid;
- `CRM_CONFIGURATION_ERROR` — webhook mode or URL is missing/invalid, or mock mode is attempted outside development;
- `CRM_UNAVAILABLE` — the configured webhook timed out, rejected the submission, or could not be reached.

Responses use `Cache-Control: no-store`. The endpoint never redirects after POST.

## Environment

Copy `apps/a-modul/.env.example` to a local, untracked environment file and configure:

```env
A_MODUL_LEAD_WEBHOOK_URL=https://crm.example.invalid/incoming/a-modul
A_MODUL_LEAD_WEBHOOK_TOKEN=
A_MODUL_CRM_MODE=webhook
ORIGIN=https://a-modul.ru
BODY_SIZE_LIMIT=45M
PUBLIC_YANDEX_METRICA_ID=
PUBLIC_SITE_URL=https://a-modul.ru
PUBLIC_SITE_PHONE=88003336131
PUBLIC_SITE_EMAIL=zakaz@a-modul.ru
PUBLIC_CALLTRACKING_SCRIPT_URL=
```

`A_MODUL_LEAD_WEBHOOK_URL` and `A_MODUL_LEAD_WEBHOOK_TOKEN` are server-only. In `webhook` mode, an absent or invalid URL produces a controlled `503 CRM_CONFIGURATION_ERROR`; it never produces a false success. When a token is present, the adapter sends it as `Authorization: Bearer <token>`.

`ORIGIN` is required for a direct adapter-node production launch so SvelteKit can validate same-origin form POSTs. Set it to the exact public HTTPS origin. If a trusted reverse proxy terminates HTTPS, configure adapter-node with `PROTOCOL_HEADER`, `HOST_HEADER`, and, when needed, `ADDRESS_HEADER` using only headers that the proxy overwrites. Do not trust client-supplied forwarded headers. A production smoke test must submit standard, tender, and leasing forms through the final public proxy path; a 403 before `/api/leads` is a deployment failure.

`BODY_SIZE_LIMIT=45M` makes adapter-node reject an oversized body while reading the request, before `request.formData()` materializes it. The value intentionally leaves multipart overhead above the form's documented 40 MiB total attachment allowance. A trusted proxy or platform must enforce an equal or tighter compatible boundary and return a controlled request-too-large response; verify this on the actual production path.

The adapter waits 12 seconds for the webhook. Any non-2xx response, connection error, or timeout is a controlled `503 CRM_UNAVAILABLE`. Configure the receiver to return 2xx only after it has durably accepted responsibility for the lead and its attachments.

## Multipart fields

Canonical fields forwarded to the webhook are:

- `reference`, `receivedAt`, `source` (`a-modul-direct`);
- `mode`: `standard`, `tender`, or `leasing`;
- `objectType`, `personnelCount`, `area`, `capacityMetric`, `region`, `desiredCommissioningDate`, `projectStage`;
- repeated `functionalZones[]` values carrying the selected diagnostic composition;
- repeated `scope[]` values;
- `leasingInterest`, `tenderInvitation`, `comment`;
- `company`, `name`, `phone`, `email`, `contact`;
- `tenderName`, `deadline`;
- `landingRoute`, `pageUrl`, `referrer`, `landing_variant`, `regionSlug`, `typeVariant`;
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `yclid`;
- repeated `files[]` attachments.

`full` and `brief` input modes normalize to `standard`. `tenderInvitation=true` normalizes to `tender`, so the tender route cannot accidentally be submitted as a generic lead.

Standard/leasing submissions require object type, region, consent, one contact method, and either personnel count or area. Tender submissions require company, tender name, deadline, region, consent, and one contact method. Phone or email may be supplied separately; `contact` is accepted for the tender contact field.

Attachments are optional. Accepted extensions are PDF, DOCX, XLSX, DWG, JPG/JPEG, PNG, and ZIP. A request may contain up to 10 files, at most 20 MiB each and 40 MiB total. The server checks extension and, when supplied, the browser MIME type. It forwards sanitized attachment names but never returns or logs them.

## Development-only mock

For deterministic local browser tests only:

```env
A_MODUL_CRM_MODE=mock
```

On the SvelteKit development server a valid request returns the same confirmed success contract without contacting a CRM. Send the request header below to force the error path:

```http
X-A-Modul-Mock-Result: failure
```

The forced response is `503 CRM_UNAVAILABLE`. Mock mode is rejected with `CRM_CONFIGURATION_ERROR` in production builds; it cannot create a production success.

## Privacy and logging

Application code does not log request bodies, names, companies, contacts, comments, UTM identifiers, file contents, or filenames. Operational infrastructure must apply the same rule: disable body/header capture for `/api/leads`, redact `Authorization`, and retain only status, latency, and the generated `AMD-…` reference where a request correlation field is configured.

Analytics must record only the event and non-personal route context. Never send name, phone, email, company, comment, tender name, filenames, or file contents to Yandex Metrica.

## Production handoff

Before launch:

1. configure the exact adapter-node `ORIGIN` (or trusted proxy headers), `BODY_SIZE_LIMIT`, a real HTTPS webhook, and optional bearer token;
2. verify that the CRM stores standard, tender, and leasing modes separately;
3. verify all attachment types and the CRM-side size limit;
4. test webhook 2xx, non-2xx, timeout, and malformed multipart paths;
5. confirm the UI preserves state for every non-success response;
6. confirm no request body, filename, token, or personal data appears in application or proxy logs;
7. configure the final privacy policy, phone, email, Metrica ID, call tracking, and production site URL.

Until the real webhook and owner-approved legal/contact configuration are present and tested, the landing must not be described as fully production-ready.
