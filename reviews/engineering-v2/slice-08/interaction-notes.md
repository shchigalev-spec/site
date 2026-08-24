# Slice 08 — implementation and browser evidence

## Current production build

- `npm --prefix apps/engineering run check`: 0 errors, 0 warnings.
- `npm --prefix apps/engineering run test`: 4 files, 19 tests passed.
- `npm --prefix apps/engineering run build`: completed.
- Browser target: Vite production preview at `http://127.0.0.1:5174/`.

## Mandatory responsive evidence

Fresh browser captures exist for 320×568, 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×1366, 1440×1000, and 1920×1080. At each tested width the document had no horizontal overflow, no overflow-causing element, one H1, no broken initial image, and no Vite error overlay. The 768 header uses the mobile menu so navigation and CTA do not collide.

`desktop-1440.png`, `mobile-390.png`, `start.png`, `mid.png`, `end.png`, and `reduced-motion.png` were recaptured from the current rebuilt code after the attribution correction. Full-page captures temporarily force `content-visibility: visible` and eager image decoding in the browser only so Chromium's full-page screenshot mechanism paints every off-screen chapter; this does not change geometry, source, or runtime code. Viewport and interaction captures use the unmodified production page.

## Interaction and keyboard

- Hero start/mid/end were captured at scroll positions 0, 194, and 388 with normal motion. The frames are distinct and show progressive route isolation rather than state swapping.
- Mobile menu: the first menu link receives focus on open; Tab and Shift+Tab wrap; Escape closes and restores focus to the menu button.
- Touch input was verified with CDP `Input.dispatchTouchEvent`; the menu opened and reported `aria-expanded=true`.
- Symptom tablist: ArrowDown moved focus and selection to the next symptom, updated `aria-labelledby`, and returned `aria-busy=false` after the finite transition.
- Construction tablist: ArrowRight moved selection and focus from wall to ceiling and exposed the matching panel.
- The short form's empty submit focused `#short-form-error`; noise, stage, name, phone, and consent referenced that alert with `aria-invalid=true`.
- The full form's first empty step focused `#diagnosis-step-error`; its final empty contact step focused `#diagnosis-contact-error` and marked name, phone, and consent.
- At 390×500 a focused contact input remained above the simulated keyboard viewport.

## Reduced motion

At 390×844 the browser reported `matchMedia('(prefers-reduced-motion: reduce)').matches === true`. Hero core copy and actions were static with no pairwise overlap, the cutaway/final route/conclusion were visible, sticky dead space was removed, and the page had no horizontal overflow or browser errors. `reduced-motion.png` records the complete static explanatory page.

## Accessibility and runtime

- Axe 4.12.1 homepage: 0 violations (one incomplete group where image/SVG overlap prevents automated colour-background calculation).
- Axe 4.12.1 diagnosis route: 0 violations and 0 incomplete checks.
- Console, page-error, request-error, broken-image, and framework-overlay checks were clean during the viewport/reduced-motion passes.
- The visible page uses one H1, semantic regions, labelled tablists/panels, explicit button state, focus-visible outlines, and textual equivalents for SVG conclusions.

## Performance revision history

The first final 4G run failed the hard LCP target at 2.8 s; a warm repeat remained a FAIL at 3.0 s. The critical path was revised by removing competing Latin-font/full-stylesheet preloads and adding intrinsic placeholders for deferred chapters so native lazy loading does not fetch renovation imagery on the initial viewport.

Current report: `lighthouse-mobile-4g-after-attribution.json`.

- Performance: 85.
- Accessibility: 100.
- FCP: 1.5 s.
- LCP: 1.5 s (hard target: under 2.5 s).
- CLS: 0 (hard target: under 0.1).
- TBT under simulated 4× CPU slowdown: 540 ms.
- 32 requests, 441 KiB; only the two required mobile hero plates were fetched as initial images.

The Lighthouse CLI writes the complete valid JSON and then exits 1 on this Windows host because Chrome Launcher cannot remove its temporary directory (`EPERM`). The report itself is complete and parseable. A separate production browser long-task buffer observed one 57 ms task during the hero pass and no sustained scroll stall.

## Conversion FAIL and correction

The first independent conversion review found that several homepage diagnosis links and the short form did not retain the landing campaign. All diagnosis actions now use `buildDiagnosisHref`, including hero, symptom, renovation, reduced renovation, construction, FAQ, sticky mobile CTA, scenario, full-brief alternative, header, and footer.

On a live landing carrying all five standard UTM fields, every inspected diagnosis link retained `source`, `source_page=homepage`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`. An intercepted valid short-form submission contained:

`source=homepage_short · source_page=homepage · utm_source=conversion · utm_medium=review · utm_campaign=slice08 · utm_term=diagnosis · utm_content=desktop`

The re-review determines whether that correction closes the Slice 08 conversion FAIL.
