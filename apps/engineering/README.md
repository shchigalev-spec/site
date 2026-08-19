# Лаборатория тишины — QUIET / ENGINEERING

Independent SvelteKit application for the restrained architectural Engineering concept. It shares no runtime UI, CSS, components, design tokens or images with the Tech application.

## Run

```bash
npm install
npm run dev
```

Local development URL: `http://localhost:5174/`.

Validation:

```bash
npm run check
npm run test
npm run build
```

## Environment

Copy `.env.example` to `.env` and provide the applicable values. The diagnostic endpoint creates a Bitrix lead through `BITRIX_WEBHOOK_URL`. When the webhook is absent in development, the server validates the request and writes a clearly marked mock-handling message to the server log; the public interface does not expose development copy. A production build without a configured webhook returns a server error rather than a false success.

Phone and email are intentionally absent until `PUBLIC_SITE_PHONE` and `PUBLIC_SITE_EMAIL` are configured.

## Generated assets

The current style anchor is `static/generated/engineering-style-anchor.png`. The app expects these exclusive Engineering assets and renders an architectural fallback when one is not yet present:

- `engineering-hero-cutaway.png`
- `engineering-stage-newbuild.png`
- `engineering-stage-renovation.png`
- `engineering-stage-finished.png`
- `engineering-wall-detail.png`
- `engineering-ceiling-detail.png`
- `engineering-floor-detail.png`
- `engineering-diagnosis.png`
- `engineering-case-58-39.png`
- `engineering-case-impact-16.png`
- `engineering-case-64-43.png`
- `engineering-final-consultation.png`

All diagrams, labels, dimensions and measured values are live HTML/SVG/CSS, never embedded into generated images. Case images are labelled as illustrative rather than documentary customer photography.

## Routes

- `/`
- `/shumoizolyatsiya-kvartiry/`
- `/shumoizolyatsiya-sten/`
- `/shumoizolyatsiya-potolka/`
- `/shumoizolyatsiya-pola/`
- `/shumoizolyatsiya-ot-sosedey/`
- `/shumoizolyatsiya-v-novostroyke/`
- `/shumoizolyatsiya-v-gotovoy-kvartire/`
- `/diagnostika-shuma/`
- `/cases/`
- `/cases/58-39-db/`
- `/cases/impact-noise-minus-16-db/`
- `/cases/64-43-db/`
- `/privacy/`
- `/sitemap.xml`
- `/robots.txt`

The privacy page is deliberately marked as a working legal placeholder; operator details must be supplied before public launch.
