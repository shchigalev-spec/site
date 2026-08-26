# Milestone C deterministic test results

Final R3-correction browser evidence: `2026-08-25T19:43:15.044Z`, captured from the live application after the complete blocking-fix batch.

| Check | Result |
|---|---|
| Svelte typecheck | PASS — 0 errors, 0 warnings |
| Lint | PASS — 0 errors, 0 warnings |
| Vitest | PASS — no test files, `--passWithNoTests` |
| Production build | PASS — adapter-node output created |
| Primary routes | PASS — four routes return 200 |
| Query and region variants | PASS — 18 variants return 200, retain CTA context, canonicalize to base and use `noindex,follow`; all seven specified regions map exactly in both applicable forms |
| Neutral and field-level context | PASS — the general route starts without an invented object/region; object, region, and capacity provenance survive cross-route navigation independently; exact query intent keeps precedence |
| Responsive route matrix | PASS — all four routes at 1440, 768, 390, and 320 px |
| Horizontal overflow | PASS — 0 px at every tested route/viewport pair |
| H1 and primary CTA | PASS — one visible H1 and an initially visible primary CTA at every tested route/viewport pair |
| Images | PASS — no broken images and no missing intrinsic dimensions |
| Browser runtime | PASS — 0 unexpected console errors, 0 page errors, 0 failed requests |
| Diagnostic transfer | PASS — route planner and general configurator scale/zones update an already-touched full form transactionally while preserving contact/comment state; repeated `functionalZones[]`, `capacityMetric`, and the intercepted multipart body match |
| Type-safe composition | PASS — zone-only cross-route navigation replaces incompatible zones; changing the full-form object from ABK to dormitory replaces visible/hidden composition and produces a consistent multipart payload |
| Standard form | PASS — client validation, attachment, server confirmation and exact success copy; every dynamic field survives client validation |
| Tender form | PASS — hero CTA lands directly on `?mode=tender#full-brief`; dedicated fields and confirmed submit |
| Leasing form | PASS — dedicated intent state and controlled-error evidence |
| Mode isolation | PASS — tender/leasing state does not leak into a later query-free standard route |
| CRM failure | PASS — controlled 503 tested; object, capacity, area, date, stage, scope, leasing intent, comment, contact fields and attachment remain present |
| Server validation | PASS — company, phone and comment 422 errors are visible, programmatically associated, focusable and set `aria-invalid` |
| Analytics privacy | PASS — all 30 required events observed; test phone and filename absent from event payloads |
| Attribution | PASS — UTM source/campaign and yclid persist through the root redirect and into the adapter; route/variant/referrer fields are present |
| SEO | PASS — unique title/H1, complete metadata and valid five-type JSON-LD graph on each primary route |
| Sitemap / robots / privacy / 404 | PASS — four query-free sitemap URLs, sitemap directive, 200 privacy and 404 missing route |
| Reduced motion | PASS — smooth scrolling and nonessential transitions disabled; the complete static state is visible and captured |
| Verified case wording | PASS — every public 105-module occurrence uses `105 одиночных модулей с крыльцами`; the unsupported residential/vestibule classification is absent |
| Production adapter smoke | PASS — adapter-node root redirect preserved attribution; a same-origin browser multipart POST reached application handling (controlled 503) with state preserved when `ORIGIN` was set; missing-Origin curl correctly received CSRF 403 |

Machine-readable assertions and per-route measurements are in `qa-results.json`. `playwright-trace.zip` covers the route matrix; `conversion-trace.zip`, `tender.png`, `leasing-error.png`, and `server-validation.png` cover critical conversion states. Runtime defect arrays contain zero console errors, zero console warnings, zero page errors, and zero failed requests.
