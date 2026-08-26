CONDITIONAL PASS

# Milestone B — Visual + Motion Review R2

## Consolidated verdict

- P0: 0
- P1: 0
- P2: 1
- P3: 0

The prior Visual + Motion blocker is corrected. Generated case disclosures now remain attached to the actual project-finder image in side-by-side and stacked layouts, including both exact case assets and the no-match fallback. The responsive price header, BIM cadence, and factory disclosure defects raised in R1 are also corrected without introducing a visual or motion regression. Milestone B may proceed under the override's `CONDITIONAL PASS` policy because no P0 or P1 remains.

## Scope independently inspected

- Re-read the complete master specification, the fast-execution override, Milestone B acceptance/evidence documents, the current polish backlog, and the complete R1 Visual + Motion report.
- Loaded the current live route at `http://127.0.0.1:5175/modulnye-zdaniya/` in Chromium at 1440×1000, 768×1024, 390×844, and 320×568. Checked full-width containment, first-screen hierarchy, current responsive state, relevant generated assets, and runtime errors.
- Reviewed the current desktop, tablet, 390px, 320px, configurator, risk, logistics, finder, BIM start/middle/end, BIM diff, factory, price, dominant-case, reduced-motion, and generated-visual evidence.
- Inspected the current Kamchatka, dormitory, and factory desktop/mobile derivatives at source resolution. The mobile crops retain their relevant subjects and contain no visible generated text, logos, or documentary-photo implication.
- Exercised the project finder with an exact Kamchatka selection, an exact 300-person dormitory selection, and an industry no-match fallback. At 320px the active files changed to `a-modul-case-kamchatka-mobile.avif` and `a-modul-case-dormitories-300-mobile.avif` as appropriate; the no-match state retained the dormitory analogue and explicitly named `отрасль` as the difference.
- Selected all seven BIM states directly, replayed the complete finite timeline, stopped it after the first transition, and verified the stopped state held. The observed autoplay changes occurred at approximately 0.01, 1.67, 3.27, 4.84, 6.44, 8.06, and 9.65 seconds and ended at stage 6 without looping.
- Loaded 390px with `prefers-reduced-motion: reduce`: the hero opened at stage 3, BIM opened at stage 6, the control read `Итог показан`, and hero/BIM transitions collapsed to `0.00001s`.
- Independently observed no console/page errors, broken inspected assets, or horizontal overflow in the exercised visual/motion paths. The current deterministic package additionally records zero errors and complete lazy-image hydration at all four required widths.

## R1 blocking-area recheck

### Resolved P1 — finder disclosure is now attached to the image

`ProjectFinder.svelte` now places the disclosure inside `.finder__visual`, which is the positioned and clipped image wrapper. The live text is unambiguous: `Визуализация по открытым данным кейса — не фотография объекта`.

At 768px, 390px, and 320px the label is fully contained inside the image and finishes 16px above both the image boundary and the beginning of the case-copy panel. This remains true for the exact Kamchatka case, the exact dormitory case, and the no-match fallback. At 1440px it stays inside the image while the case copy occupies the parallel column. The current mobile crops leave sufficient low-detail foreground for the label, so it remains legible without covering the defining building groups.

### Resolved P2 — the mobile price matrix starts with row 01

The responsive rule now keeps `.matrix__head` at `display: none` below 820px. Live 768px, 390px, and 320px layouts start with `01 — Исходные данные и проект`; the duplicated `Только модуль` / `Запуск объекта` header card no longer renders. The per-row labels remain readable and the 320px cards do not overflow.

### Resolved P2 — BIM autoplay is readable, complete, and interruptible

The sequence now uses 1.6-second stage intervals with a 350ms crossfade. The current captions and changed plates/overlays receive a materially readable stable interval, while the overall run remains concise and finite. Direct stage selection exposes all seven distinct conclusions. Clicking stop after stage 1 left the sequence on stage 1 after a further 1.9 seconds, confirming that interruption cancels the remaining timeline instead of resuming invisibly.

### Resolved P3 — factory disclosure no longer competes with a KPI

The factory disclosure now sits at the top-right of the generated image field. It does not intersect the `25 000 м²`, `до 750`, or `до 25` KPI rail at 1440px, 768px, 390px, or 320px. The mobile factory crop keeps the module frames and engineering work visible, while the disclosure remains directly associated with the image.

## Complete remaining issue list

### P2 — the generated hero anchor remains below the initial tablet/mobile viewport

**Location:** retained Milestone A hero stack below 820px.

**Evidence:** Current live geometry places `.hero__visual` at approximately y=1025 in the 768×1024 viewport, y=914 in the 390×844 viewport, and y=696 in the 320×568 viewport. The H1, primary CTA, and exact one-working-day qualification remain visible and correctly prioritized, but no recognizable part of the generated site appears in those opening views.

**Impact:** This does not block conversion clarity or interaction, and it is the same accepted Milestone A polish item. It continues to delay the strongest distinctive visual proof on tablet and mobile.

**Recommended polish:** Expose a controlled strip or crop of the site anchor in the initial tablet/mobile view while preserving the current H1, CTA, exact qualification, normal flow, and 320px containment.

**Retest:** Capture initial 768×1024, 390×844, and 320×568 views. A recognizable part of the industrial site should appear without displacing any required offer or qualification content.

## Strengths retained

- The page keeps a coherent premium industrial language across configurator, risk chain, logistics, finder, BIM, factory, price, dominant case, and seismic proof without reverting to a uniform card template.
- Generated assets remain visually related, architecturally credible, and properly qualified wherever real case facts are attached. The corrected finder now matches the stronger disclosure treatment already present in the dominant case.
- The configurator, no-match warning, logistics map, BIM overlays, production controls, price matrix, and case compositions each advance a different buying question; density is high but purposeful.
- BIM motion now explains a complete project sequence, ends in a stable operational state, supports direct interruption, and has a truthful reduced-motion conclusion. No looping, video, scroll hijacking, or meaningless decorative animation was observed.
- Mobile layouts preserve readable labels, large controls, distinct active states, useful generated-image crops, and 320px containment. The corrected factory and price treatments remove the prior local hierarchy conflicts.

## Gate decision

`CONDITIONAL PASS` — P0 0 / P1 0. The sole remaining P2 is already recorded in `reviews/a-modul-v2/POLISH-BACKLOG.md` and does not prevent Milestone C under the fast-execution override.
