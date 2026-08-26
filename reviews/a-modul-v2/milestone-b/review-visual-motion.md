BLOCKED

# Milestone B — Visual + Motion Review R1

## Consolidated verdict

- P0: 0
- P1: 1
- P2: 3
- P3: 1

Milestone B is visually cohesive and its interactive sequences are functional, finite, and responsive, but it does not clear the Visual + Motion gate. In the stacked project-finder layouts, the disclosure for a photoreal generated case visual is separated from the image by the entire case-copy panel. That P1 leaves the case image presented without an adjacent illustrative-image qualification at 768px, 390px, and 320px. The review continued through every requested chapter, state, viewport, and reduced-motion path after this blocker was found; the list below is consolidated rather than first-defect-only.

## Scope independently inspected

- Loaded `http://127.0.0.1:5175/modulnye-zdaniya/` in a real Chromium browser at 1440×1000, 768×1024, 390×844, and 320×568; inspected the full page and every Milestone B chapter.
- Reviewed `desktop-1440.png`, `tablet-768.png`, `mobile-390.png`, `mobile-320.png`, `configurator-output.png`, `risk-active.png`, `logistics-route.png`, `finder-filtered.png`, `bim-start.png`, `bim-mid.png`, `bim-end.png`, `factory-stage.png`, `price-scope.png`, `dominant-case.png`, `reduced-motion.png`, `diff-bim-start-end.png`, `generated-visuals.webp`, and `playwright-trace.zip`.
- Inspected the three Codex-generated masters and their desktop/mobile AVIF/WebP derivatives, prompt records, public disclosure copy, subject placement, and live crops.
- Exercised the configurator output at all widths and checked its selected type, capacity, region, functional zones, missing-input framing, next step, and diagnosis handoff.
- Selected all nine risk controls, all six logistics destinations, all six factory states, and both exact and deliberately unmatched project-finder paths.
- Selected all seven BIM stages directly at every width. Independently replayed the complete timeline at every width and observed the state series `0,1,2,3,4,5,6,6`; the final state held and the play control re-enabled without looping.
- Loaded 390px with `prefers-reduced-motion: reduce`: the hero opened at stage 3, BIM opened at stage 6 with `Итог показан`, route animation and plate transition collapsed to `0.00001s`, and page width remained 390/390.
- Inspected the production-price matrix, dominant Kamchatka case, locked seismic proof composition, section-to-section density, card/grid repetition, hierarchy, and continuity with the accepted Milestone A visual language.
- Independent runtime exploration produced no console errors and no horizontal overflow at any target width.

## Complete issue list

### P1 — The project-finder’s generated-image disclosure is detached from the image in every stacked layout

**Location:** `ProjectFinder.svelte` and `app.css`, specifically `.finder__result { position: relative; }`, `.finder__result > .visualization-label`, and the single-column result layouts below 1120px.

**Evidence:** At 1440px the absolute disclosure happens to land over the bottom-left of the case image because the image and copy form parallel columns. Once the result stacks, the label remains anchored to the bottom of the entire result rather than to the `<picture>`. Independent live geometry measured the disclosure starting 454px after the image at 768px, 543px after it at 390px, and 599px after it at 320px. The current mobile capture therefore shows the photoreal Kamchatka case image, then the full factual case panel, difference warning, and CTA; only after all of that does `Визуализация по открытым данным кейса` appear. The image is introduced inside an “open project database” and “similar project” context, so the delayed label is material rather than decorative.

**Why this blocks:** Case imagery is required to remain clearly illustrative and must not be presented as documentary customer photography. A disclosure that appears hundreds of pixels later is not visually associated with the image when the viewer encounters it. The dominant-case chapter handles this correctly with `не фотография объекта` directly on its image; the finder does not at the three required stacked widths.

**Required correction:** Position the finder disclosure relative to the picture/image wrapper at every layout, not relative to the whole result. Keep it readable inside the actual 768/390/320 crop and use an unambiguous formulation such as `Визуализация по открытым данным кейса — не фотография объекта`. The disclosure must remain adjacent to the generated visual when exact and no-match filters swap either case asset.

**Retest:** At 768×1024, 390×844, and 320×568, exercise the default example, exact Kamchatka match, exact dormitory match, and no-match fallback. In every state, the disclosure must be visible on or immediately adjacent to the image before the case copy begins, with no clipping or conflict with the CTA.

### P2 — The responsive price matrix renders its column header as a redundant first data card

**Location:** `app.css`, `@media (max-width: 820px)` ordering of `.matrix__head { display: none; }` followed by `.matrix__row { display: grid; }` and the mobile `::before` labels.

**Evidence:** At 768px, 390px, and 320px the nominal header is still `display: grid`; the later equal-specificity rule overrides the attempted hide. It renders a 124px card containing `КОНТУР`, then `Только модуль: Только модуль`, then `Запуск объекта: Запуск объекта`. The actual eight rows below already supply those labels through pseudo-elements. The evidence and independent 320px capture both show this duplicate card before row 01.

**Impact:** The matrix remains usable, so this is not a blocker, but the first mobile “row” looks like malformed comparison data and weakens the otherwise transparent price-scope hierarchy.

**Required correction:** Ensure `.matrix__head` remains hidden below 820px (for example, by placing the rule after the generic row layout or increasing appropriate selector specificity), or replace it with a deliberate compact legend that does not receive the row pseudo-labels.

**Retest:** Inspect 768, 390, and 320. The first visible comparison item must be row 01, or a purpose-designed legend; duplicated `Только модуль` / `Запуск объекта` phrases must not render.

### P2 — The seven-stage BIM autoplay advances too quickly to read as an engineering sequence

**Location:** `BimSequence.svelte`, `play()` timers at `stage * 1050`, together with the 300ms plate opacity transition.

**Evidence:** The implementation correctly traverses all seven stages and holds the conclusion, but each intermediate caption and visual receives only about 1.05 seconds before the next transition. With a 300ms crossfade, the settled interval is roughly three quarters of a second. This is particularly compressed for `Состав`, `Модули`, `Производство`, `Доставка`, and `Монтаж`, whose captions describe different project responsibilities. Manual controls make every state inspectable, but the primary “Показать весь путь” run reads as a rapid image/state ticker. Milestone A’s comparable sequence was previously corrected to approximately 1.6-second intervals with a 350ms transition; Milestone B reintroduces the short cadence across more states.

**Impact:** The motion is technically complete and non-looping, so this is P2 rather than P1. Its explanatory value is nevertheless reduced for a first-time viewer, especially on mobile where the caption sits below the image and cannot be scanned simultaneously with every fast change.

**Required correction:** Increase the per-stage interval or otherwise guarantee a readable stable hold for each stage while retaining finite playback, manual interruption, and a stable final result. Do not add video, looping, or scroll-driven motion.

**Retest:** Replay once at all four widths without touching the manual controls. A viewer should be able to identify the changed plate/overlay and read the active caption before the sequence advances; direct selection must still cancel the timeline immediately.

### P2 — The generated site anchor remains below the initial viewport at tablet and mobile widths

**Location:** Milestone A hero composition retained in Milestone B; responsive stack below 820px.

**Evidence:** Independent current geometry places `.hero__visual` at y=1025 at 768×1024, y=914 at 390×844, and y=715 at 320×568. Thus no recognizable portion of the generated modular/site anchor is visible in the opening viewport at any of those widths, although the H1, primary CTA, and qualification are correctly visible. This is the same accepted Milestone A P2 and remains present in the complete Milestone B page.

**Impact:** The conversion hierarchy is intact, so this remains non-blocking. It does, however, leave the tablet/mobile first screen typography-only and delays the project’s strongest distinctive visual proof.

**Recommended polish:** Expose a controlled band or crop of the site visual in the first viewport while preserving the H1, primary CTA, exact qualification, normal document flow, and 320px containment.

**Retest:** Capture initial 768×1024, 390×844, and 320×568 views. A recognizable part of the industrial site must appear without sacrificing any required initial-view content.

### P3 — The factory visualization label competes with the third production KPI

**Location:** `FactorySequence.svelte` and the shared absolute `.visualization-label` positioning inside `.factory__visual`.

**Evidence:** The production-facts rail is absolutely overlaid across the bottom of the factory visual, and the visualization label is also anchored to the bottom-right of the same container. On desktop it sits inside the `до 25` KPI cell; on mobile it lands on the right side of that KPI’s final row. It does not currently obscure the number, but it reads as metadata attached to the KPI strip and competes with `модулей в смену` rather than clearly qualifying the generated factory scene.

**Recommended polish:** Move the label into the unobstructed image field, or reserve a distinct disclosure line between the image and facts rail. Keep it adjacent to the visual and clear of all three indicators at 1440, 768, 390, and 320.

## Strengths retained

- The graphite/warm-white/purple/magenta/technical-mint system and Geologica/Onest/IBM Plex Mono hierarchy remain specific, disciplined, and continuous with Milestone A. The page avoids generic SaaS glow, yellow-black industrial cliché, gratuitous particles, and scroll hijacking.
- Chapter composition is meaningfully varied: the configurator uses a working/output split, risk uses a nine-link control board, logistics uses a live schematic and dark route panel, the finder uses a case split, BIM uses a project viewport, factory uses a production line with fact rail, price uses a comparison matrix, and the case/seismic chapters close with large proof compositions. The page does not collapse into uniform marketing cards.
- All three generated visual families are coherent and free of visible generated text, brands, or customer marks. The Kamchatka and dormitory mobile crops retain the relevant building groups; the factory crop keeps the production chassis/modules legible.
- The configurator never fabricates a module count and maintains a strong, legible selected-state/output hierarchy at all widths.
- The logistics route redraw is finite, code-driven, visually restrained, and paired with explicit scheme/no-price/no-duration framing. All road/rail/sea/river/winter-road/mixed labels remain available through the appropriate regional state.
- Exact and no-match finder behavior is visually distinct: unmatched filters retain the closest published analogue and show the differences in a prominent magenta rule box rather than implying an exact precedent.
- The BIM state family is visually coherent: live overlays make the first three states genuinely distinct, production/delivery/mounting plates maintain continuity, the full autoplay ends and holds at the operational object, and reduced motion opens directly on the complete conclusion.
- The dominant Kamchatka case has sufficient scale and visual authority, its dedicated image disclosure is correctly adjacent, and the seismic proof reads as a scoped evidence conclusion rather than a generic guarantee.
- No broken crops, visible image-loading failures, page overflow, or runtime errors were observed in the visual/motion paths exercised.

## Gate decision

`BLOCKED` — one P1 remains. Correct the finder disclosure association, recreate the affected current evidence, rerun deterministic QA, and reinvoke only the Visual + Motion Reviewer because that is the materially changed blocking area. The P2/P3 items should be recorded in the polish backlog and do not independently prevent progression once the P1 is resolved.
