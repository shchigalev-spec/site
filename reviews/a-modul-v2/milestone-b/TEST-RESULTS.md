# Milestone B — deterministic results

Date: 2026-08-25 (Europe/Moscow)
Live target: `http://127.0.0.1:5175/modulnye-zdaniya/`
Final evidence capture: `2026-08-25T16:16:44.210Z`

## Build/runtime

- Clean Vite dev-server restart on port 5175: PASS.
- `npm --prefix apps/a-modul run check`: PASS; 0 errors / 0 warnings.
- `npm --prefix apps/a-modul run lint`: PASS; 0 errors / 0 warnings.
- `npm --prefix apps/a-modul run test`: PASS; Vitest honestly reports no unit-test files.
- `npm --prefix apps/a-modul run build`: PASS; client, SSR, and adapter-node output completed.
- `/modulnye-zdaniya/`: HTTP 200.
- `/`: HTTP 307 to `/modulnye-zdaniya/`.
- Canonical: exact `https://a-modul.ru/modulnye-zdaniya/`.

## Browser QA

Command:

```text
node scripts/verify-a-modul-milestone-b.mjs http://127.0.0.1:5175/modulnye-zdaniya/
```

Result: PASS, zero assertions.

| Viewport | Document/client width | H1 | Primary CTA | Qualification | Broken images | Small targets |
|---|---:|---|---|---|---:|---:|
| 1440×1000 | 1440/1440 | 1 visible | y 815–867 | y 875–892 | 0 | 0 |
| 768×1024 | 768/768 | 1 visible | y 743–795 | y 803–820 | 0 | 0 |
| 390×844 | 390/390 | 1 visible | y 611–663 | y 670–688 | 0 | 0 |
| 320×568 | 320/320 | 1 visible | y 452–500 | y 507–524 | 0 | 0 |

Across all four widths after scrolling through every lazy visual:

- zero console errors, page errors, failed requests, broken images, page overflow, missing intrinsic image sizes, unlabeled controls, or visible targets below 44×44;
- all nine required Milestone B sections are visible;
- four live generated-visual disclosures are present;
- the finder disclosure is geometrically contained inside its image wrapper at every width;
- CTA contrast is 5.25:1 at every width;
- the price matrix contains one header plus eight scope rows, hides its desktop header on stacked layouts, and does not create internal/page horizontal overflow.

## Interaction coverage

- Configurator: exercised every object type and its valid metric, both generic-building bases, preset/custom scale, empty composition, `Офис / АБК` with 420 workplaces, Siberia, changed functional zones, and the single allowlisted session payload.
- Handoff: verified configurator → logistics → mini-brief and logistics → configurator → mini-brief update immediately; object type, metric/value, region, and zones remain coherent.
- Tender intent: clicked the actual mounted hero CTA, verified immediate visible tender mode and allowlisted `mode: tender` in the single payload, preserved it through base navigation/reload, then verified the explicit standard hero CTA resets mode without inheriting tender intent.
- Commissioning clear: stored a month, cleared it, changed logistics region, reloaded, and verified both the visible field and persisted contract remain empty until a new value is entered.
- Mini-brief errors: cleared all required inputs, submitted, and verified `aria-invalid` plus a non-empty associated `aria-describedby` message for each field.
- Risk: exercised all nine tabs, ArrowRight keyboard navigation, unique selection, and explicit tab/tabpanel relationships.
- Logistics: selected the Far East, observed the finite SVG route, and verified its explicit no-price/no-duration framing and reverse region handoff.
- Finder: verified unpublished delivery taxonomy creates an explicit `тип поставки` mismatch, then forced an industry mismatch and verified the complete difference list.
- BIM: observed all autoplay states 0→1→2→3→4→5→6 at the readable cadence, verified focus remains on the operable stop control, final state holds, and captured stable direct start/middle/end frames plus `diff-bim-start-end.png`.
- Factory: verified the exact seven stages `Металл → Каркас → Ограждение → Инженерия → Отделка → Контроль качества → Отгрузка`, End-key navigation, unique selection, and tab/tabpanel relationships.
- Hero autoplay: verified activation preserves focus on an enabled start/stop control.
- Selected focus: verified the active light-surface configurator choice retains the 6px graphite outer ring together with its inset selected marker.
- Reduced motion at 390px: hero starts at stage 3, BIM starts at stage 6 with `Итог показан`, and route/plate motion collapses to 0.00001s.

Evidence includes `playwright-trace.zip`; no WebM or other video exists.

Machine-readable result: `qa-results.json` (`pass: true`, `assertions: []`).
