# Revision Milestone R2 — deterministic QA

Captured: 2026-08-26. Live target: `http://127.0.0.1:5175/modulnye-zdaniya/`.

## Result

**PASS**

- typecheck: 0 errors, 0 warnings;
- unit/integration tests: 5 files, 22 tests passed;
- production build: passed;
- routes: 7/7 returned HTTP 200;
- browser console errors/warnings: 0/0;
- page errors: 0;
- failed requests after excluding browser-aborted non-matching `<picture>` candidates: 0;
- decoded broken images: 0;
- horizontal overflow: 0 at 320, 390, 768 and 1440 px;
- one visible H1 and visible primary/final CTA at every tested width;
- reduced motion: final hero stage, non-sticky assembly, route duration reduced to 0.01 ms, lower sequence entrance animation disabled.

## R2 interaction checks

- local map asset: `/data/russia-federal-subjects.svg`;
- map keeps a recognisable Russia silhouette and federal-subject boundaries;
- `Россия` creates no destination point and asks to clarify the region;
- `Россия` exposes only `Авто`, `Ж/д`, `Комбинированная`; conditional sea/winter-road modes require a concrete territory;
- `Дальний Восток` creates one destination point and exposes `Авто`, `Ж/д`, `Море / вода`, `Зимник`, `Комбинированная` with an official source link and the Kamchatka case;
- an externally changed region revalidates the active transport mode and its source panel;
- the full Russia SVG and selected Far East point stay inside the map viewport at 320 and 390 px;
- similar-project filters select the Kamchatka project for Far East + mining + shift camp + seismic + remote and show both comparison panels;
- unknown case data does not increase similarity; the comparison names requested and published values;
- the case CTA carries no unpublished capacity or inferred functional zones;
- finder source and carried `#project-brief` CTA are present;
- winter R2 hero assets are loaded on the shift-camp, office/ABK and dormitory routes;
- factory exposes six keyboard tabs and the published `25 000 м² / до 750 / до 25` evidence rail;
- lower object sequence exposes five keyboard tabs and reaches `Эксплуатация`;
- seven adjacent visualisation disclosures are present.

## Performance snapshots

Development-server snapshot at 1440 px:

- DOMContentLoaded: 603.5 ms;
- load event: 761.5 ms;
- transferred resources: 6,458,784 bytes after interaction-driven lazy loading;
- decoded resources: 6,414,984 bytes;
- image resource entries: 25.

This snapshot is evidence for regression comparison, not a production hosting SLA.

Cold local production preview, Chromium, unthrottled:

- LCP: 1,108 ms;
- CLS: 0.0015;
- total blocking time: 37 ms;
- interaction-to-next-paint proxy: 153.9 ms;
- first contentful paint: 852 ms;
- 31 resource requests / 1,073,374 transferred bytes;
- console errors / page errors: 0 / 0.

The standalone `file://` build also passed desktop and 390 px QA with embedded generated imagery, fonts and Russia map, no broken images or runtime errors, six production stages, five lower-object stages and the final CTA.

Machine-readable evidence: `r2-qa-results.json`, `performance.json`, `performance-production.json`, `standalone-qa-results.json`, `source-inventory.json`.
