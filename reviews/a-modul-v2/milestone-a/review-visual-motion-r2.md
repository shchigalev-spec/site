CONDITIONAL PASS

# Milestone A — Visual + Motion Review R2

## Consolidated verdict

- P0: 0
- P1: 0
- P2: 1
- P3: 0

The prior blocking mobile assembly defect is resolved. The complete Milestone A now clears the Visual + Motion gate because no P0 or P1 findings remain. One non-blocking responsive-composition item remains for the polish backlog.

## Inspection scope

- Independently loaded the live route `http://127.0.0.1:5175/modulnye-zdaniya/` at 1440×1000, 768×1024, 390×844, and 320×568.
- Inspected all four direct assembly states at every viewport, including the actual responsive source selected by the browser, rendered viewport differences, captions, active/pressed controls, focusable native buttons, and target geometry.
- Replayed the normal finite sequence through stages 0→1→2→3, verified that stage 3 holds without looping, and verified that a direct stage selection interrupts the timeline.
- Loaded the route with `prefers-reduced-motion: reduce`, checked its initial/final state and control copy, activated the static conclusion control, and inspected computed transition duration.
- Inspected the current desktop, tablet, mobile, start, planning, middle, end, reduced-motion, dedicated mobile stage 03/04, pixel-diff, full-page, trace, and generated-anchor evidence in `reviews/a-modul-v2/milestone-a/`.
- Reviewed the current implementation in `HeroAssembly.svelte` and `app.css`, including the localized timing, mobile asset, stage-grid, and reduced-motion corrections.
- Continued through the whole milestone after the former blocker recheck: official-logo header, hero hierarchy and CTAs, site-assembly viewport, scope line, mini-brief, evidence rail, milestone handoff, footer, responsive typography, color, spacing, and visual continuity.

## Blocking-area retest

### Prior P1 — mobile stages 03 and 04: RESOLVED

At 390px and 320px, stage 03 now loads `a-modul-general-hero-partial-settlement-mobile.avif` and visibly centers an active crane, arriving modules, exposed installation area, and an incomplete right-hand group. Stage 04 loads `a-modul-general-hero-operational-object-mobile.avif` and visibly replaces that construction activity with a completed linked two-building complex and sheltered transition. The change is obvious without reading the HUD or caption.

Independent live screenshot-buffer comparison produced:

- 390px: mean absolute channel difference 31.83; 50.61% of rendered channels changed by more than 16 levels;
- 320px: mean absolute channel difference 31.99; 50.42% of rendered channels changed by more than 16 levels.

The paired scenes retain the same wet diagonal road, forest horizon, overcast light, material language, and white/purple modular system. The current `mobile-stage-03.png`, `mobile-stage-04.png`, and `diff-mobile-stage-03-04.png` match the live result. The reduced-motion conclusion uses the same now-legible completed composition.

### Prior P2 — intermediate hold/readability: RESOLVED

The live timeline now advances at approximately 1.6-second intervals with a 350ms plate crossfade. On desktop, sampled states were 0 at start, 1 at 1.7s, 2 at 3.3s, and 3 at 4.9s; stage 3 remained held at 5.6s and the play control was enabled again. The planning grid and active installation states have a readable settled interval rather than spending most of their slot in transition.

### Prior P2 — 320px four-row selector: RESOLVED

The 320px selector remains a compact 2×2 grid. Live button boxes were 160×72px at x=0/160 and two y rows. All four controls fit without clipping or horizontal overflow and preserve the active/pressed state.

### Prior P3 — reduced-motion wording: RESOLVED

With reduced motion enabled, the route starts and holds at `3 / 04 Запуск`, the completed image and operational caption are visible, and the control truthfully reads `Итог показан →`. Activating it keeps the same completed state. Computed plate transition duration collapses to `0.00001s`, so the conclusion does not depend on animation.

## Complete current issue list

### P2 — The generated visual anchor still begins below the initial viewport at 768px and mobile widths

**Location:** `app.css`, the responsive hero stack under `@media (max-width: 820px)` and the hero copy height/spacing.

**Evidence:** In the current 768×1024, 390×844, and 320×568 initial views, the exact H1, support, primary CTA, required CTA qualification, secondary CTA, and regional context occupy the opening composition. The assembly image starts only after that copy block. The current mobile fixes improve the visual sequence once reached but do not expose the generated architectural anchor in the initial viewport.

**Impact:** Offer comprehension and CTA visibility are strong, so this does not block Milestone B. However, the project’s most distinctive industrial visual proof does not contribute to first-screen credibility at tablet/mobile sizes; those openings remain typography-only.

**Recommended polish:** During a later responsive polish pass, expose a recognizable band or controlled crop of the site image in the initial 768/390/320 composition while retaining the H1, primary CTA, its qualification, and normal document flow. Do not trade this for overlap, tiny type, or overflow.

**Retest:** Capture the unchanged initial viewport at 768×1024, 390×844, and 320×568 and confirm that a recognizable modular/site visual appears alongside the required offer and CTA content.

## Regression and quality observations

- Live browser inspection found no console errors and no horizontal overflow at 1440, 768, 390, or 320 in the visual/motion paths exercised.
- Each direct control selected the expected state and caption, used the correct desktop/mobile image source, and exposed the correct `aria-pressed` value.
- Normal motion remains user-triggered, finite, interruptible, and non-looping. At 320px, selecting stage 02 during playback cancelled the remaining timers and held that directly selected state.
- The official logo and restrained graphite/warm-white/purple/magenta/technical-mint system remain coherent. Typography is distinctive and legible; the implementation avoids generic SaaS gradients, particle effects, and animation clutter.
- Desktop preserves the strong editorial split and a genuine project viewport. The planning overlay remains a live SVG rather than baked UI, and the generated image family contains no visible text, brands, or documentary-case implication.
- The mini-brief and asymmetric evidence rail remain visually integrated with the hero system rather than reading as imported component-library cards.
- The localized factual qualifier adds a small line beneath the primary action without damaging the desktop or mobile hierarchy.

## Final gate decision

`CONDITIONAL PASS` — zero P0/P1 findings. Record the single P2 responsive first-screen anchor item in `reviews/a-modul-v2/POLISH-BACKLOG.md`; it does not prevent Milestone B from starting.
