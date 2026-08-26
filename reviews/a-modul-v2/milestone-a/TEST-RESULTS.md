# Milestone A — deterministic results

Date: 2026-08-25 (Europe/Moscow)
Live target: `http://127.0.0.1:5175/modulnye-zdaniya/`
Final evidence capture: `2026-08-25T13:55:13.111Z`

## App/runtime

- Clean Vite dev-server start on port 5175: PASS.
- `/modulnye-zdaniya/`: HTTP 200.
- `/`: HTTP 307 to `/modulnye-zdaniya/`.
- Canonical on every tested viewport: `https://a-modul.ru/modulnye-zdaniya/`.
- Tender variant `?mode=tender`: HTTP 200 with visible tender diagnostic context and persisted allowlisted `mode: "tender"`.

## Typecheck, lint, test, build

- `npm run check:a-modul`: PASS; `svelte-check found 0 errors and 0 warnings`.
- `npm run lint:a-modul`: PASS; `svelte-check found 0 errors and 0 warnings`.
- `npm run test:a-modul`: PASS; Vitest honestly reports no unit-test files for this milestone.
- `npm run build:a-modul`: PASS; Vite client/SSR bundles and adapter-node output completed successfully.

## Automated browser QA

Command:

```text
node scripts/verify-a-modul-milestone-a.mjs http://127.0.0.1:5175/modulnye-zdaniya/
```

Result: PASS, zero assertions.

| Viewport | Document/client width | H1 | Primary CTA initial viewport | Overflow | Broken images | Small targets |
|---|---:|---|---|---|---|---|
| 1440×1000 | 1440/1440 | 1 visible | y 815–867 | 0 | 0 | 0 |
| 768×1024 | 768/768 | 1 visible | y 743–795 | 0 | 0 | 0 |
| 390×844 | 390/390 | 1 visible | y 611–663 | 0 | 0 | 0 |
| 320×568 | 320/320 | 1 visible | y 452–500 | 0 | 0 | 0 |

Across all four viewports:

- zero console errors, page errors, failed requests, off-viewport elements, unlabeled controls, or images without intrinsic dimensions;
- one header, one main landmark, one footer, one H1;
- all visible links/buttons/inputs/selects meet 44×44 minimum targeting;
- the exact hero qualification `После получения основных исходных данных.` is fully visible in the initial viewport at all four widths (at 320px: y 507–524);
- generated responsive AVIF assets load successfully, with WebP fallback present.

## Interaction and reduced motion

- Normal motion starts at stage `0 / Площадка`, reaches `1 / Проект` after 1.6s, `2 / Монтаж` after 3.2s, and holds at `3 / Запуск` after 4.8s; the 350ms plate transition leaves a stable explanatory hold and never loops.
- Start, planning, middle, and end screenshots were captured from the real interaction; `diff-start-end.png` is a current pixel difference. Dedicated `mobile-stage-03.png`, `mobile-stage-04.png`, and `diff-mobile-stage-03-04.png` prove the crane/transport installation state and completed linked operational state are visually distinct in the rendered 390px viewport.
- All four stage controls are exercised at both 390px and 320px, where the selector stays a compact 2×2 grid.
- At `prefers-reduced-motion: reduce`, the live mobile route starts and holds at `3 / Запуск`, the operational object is visible, and the truthful static control reads `Итог показан`.
- Empty mini-brief fails native validation. A valid АБК / 3,200m² / Камчатский край / 2027-08 brief is stored only in session storage and displays `Заявка не отправлена`; no network submission or fake success occurs. Tender mode is included only when present.
- `playwright-trace.zip` contains current snapshots, screenshots, and sources. No WebM or other video is used.

Machine-readable evidence: `qa-results.json` (`pass: true`, `assertions: []`).
