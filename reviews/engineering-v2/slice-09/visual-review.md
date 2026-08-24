# Slice 09 — Visual Director re-review

PASS

Fresh read-only re-review of the latest production preview at `http://127.0.0.1:5174/`, the recaptured Slice 09 evidence, Slice 00 baseline evidence, the authoritative specification, and `docs/ENGINEERING-V2-REVIEW-PROTOCOL.md`.

## Prior FAIL and correction — explicitly preserved

The first independent final visual review was `FAIL`. At that point the full-page homepage was only about 25% shorter on desktop and 17.5% shorter on mobile, materially below the required approximate 35–45% reduction. The first final mobile sweep had also failed on horizontal overflow in the impact-noise case and privacy routes; an intermediate case fix split the Russian word `снижение` incorrectly.

Those failures remain recorded in `interaction-notes.md` and are not overwritten by this PASS. The subsequent revision bounded the affected route typography/header, restored word-boundary wrapping, and condensed Method/Construction, Cases, and FAQ/Conversion without removing a chapter, required fact, graph, diagram, form field, or route.

After that visual PASS, the first independent accessibility/performance re-review found a separate hard failure: the primary `Разобрать мой шум` action in the open mobile menu measured only 26.34px high. That failure is also preserved in `interaction-notes.md`; this confirmation does not erase or reinterpret it.

## Reduction and rhythm evidence

- Slice 00 full-page evidence: 23,427px at 1440×1000 and 24,330px at 390×844.
- Current recaptured full-page evidence: 15,078px desktop and 15,656px mobile.
- Evidence reduction: 35.64% desktop and 35.65% mobile, inside the requested approximate 35–45% range.
- Independent complete live scroll-paint measured 14,866px at 1440×1000 and 15,817px at 390×844; both independently confirm approximately 35% or greater reduction. The small capture/live difference is consistent with the documented browser-only full-page painting of deferred chapters.
- The former mobile concentration was materially reduced: Method/Construction now measures 2,790px, Cases 3,456px, and FAQ/Conversion 2,460px in the live 390px pass, versus 4,323px, 5,084px, and 3,742px at the prior FAIL.
- The tightened second half remains readable and hierarchical: the method retains one datum and six steps; construction retains three contexts and five states; the dominant case remains dominant while supporting cases become compact; all seven FAQ questions and the complete short contact form remain available.

## Final visual gates

- The live homepage contains exactly seven chapters in the required order: `01 · Диагностика`, `02 · Маршрут шума`, `03 · Этап ремонта`, `04 · Метод + конструкция`, `05 · Кейсы`, `06 · Сценарий`, and `07 · FAQ + диагностика`.
- `start.png`, `mid.png`, and `end.png` are fresh, distinct 1440×1000 frames of the same hero camera: calm room, local cutaway/candidate paths, and isolated selected route with checkpoints and conclusion. The stable H1, support copy, and CTA do not overlap.
- Desktop and mobile hero composition remains premium and legible. At 320, 390, 768, 1440, and 1920 CSS px, the H1 and CTA remained within the intended composition with zero document overflow and no broken visible hero image.
- A complete 320×568 scroll-paint after the rhythm revision reported `scrollWidth === clientWidth`, no element outside the viewport, one H1, no broken image, and no framework overlay. The tighter two-column case evidence and construction controls do not create hidden horizontal overflow.
- Symptom/path remains one coherent vector interaction with a clear desktop hierarchy and mobile `1 / 6` stepper. The renovation chapter retains one same-camera three-state sequence and a full mobile three-step presentation.
- Wall, ceiling, and floor remain genuinely distinct SVG models with different geometry and live titles: `Узел шумоизоляции стены`, `Узел шумоизоляции потолка`, and `Узел плавающего пола`.
- Cases still present one dominant measured result and two supporting results, readable graphs, bounded Known/Unknown language, and visible illustrative-image disclosures. Compression did not restore equal-card dominance.
- Surface routes still use three unique hero images and their dedicated wall/ceiling/floor diagrams. All four situation routes retain distinct residential/editorial heroes. The diagnosis route remains a separate complete family. A fresh live 390px pass across all eight routes found one H1, zero overflow, no broken visible hero image, and no framework overlay on every route.
- Reduced-motion evidence is a complete 390px normal-flow page. Live reduced-motion verification showed decision state `1`, visible legend/conclusion, non-sticky hero, all three renovation articles, zero running animations, and zero horizontal overflow.
- Browser page-error and console logs were empty after the final homepage and service-family passes.
- `apps/tech` has no diff, and no Engineering runtime reference to Tech was found.
- All six current Slice 09 PNGs have distinct hashes, and none duplicates a PNG from Slices 00–08.

## Mobile-menu CTA correction — current confirmation

- The rebuilt production preview returns HTTP 200 and its currently served CSS bundle contains the corrected `.menu-primary` rule: `display:flex`, centered alignment, `min-height:52px`, padded dark `var(--ink)` surface, and light `var(--paper)` text. The same rule is present in both critical and full source CSS, so the action no longer falls back to the former 26.34px plain-link rendering.
- The current markup applies that class directly to the primary `Разобрать мой шум` diagnosis link. The verified current-build measurements recorded after the correction are 52px high at 320, 390, and 430px widths, with zero document overflow and the intended mobile-menu attribution.
- The menu remains a full-viewport paper sheet with five clearly separated 66px navigation rows and the contrasting primary action anchored at the bottom. The corrected CTA therefore reads as the deliberate conversion endpoint rather than another unstyled navigation line.
- Escape/close behavior remains wired to remove the sheet, restore document overflow, and return focus to the 44px menu trigger. The freshly recaptured `mobile-390.png` is a clean closed-page state: the header, hero, and first CTA retain their prior alignment; no backdrop, open-menu residue, horizontal clipping, or reflow regression is visible.
- Browser-control discovery was unavailable during this short visual confirmation, so no substitute UI automation was used. The decision is based on the freshly served production bundle, current source, the post-fix 320/390/430 browser measurements preserved in the evidence notes, and direct inspection of the newly recaptured canonical closed-page image.

No Visual Director hard fail or remaining major visual requirement miss was found in the latest build.
