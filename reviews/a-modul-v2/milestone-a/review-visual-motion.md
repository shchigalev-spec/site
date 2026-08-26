BLOCKED

# Milestone A — Visual + Motion Review

## Consolidated verdict

- P0: 0
- P1: 1
- P2: 3
- P3: 1

Milestone A is visually credible on desktop and the overall system fits the Controlled Launch direction, but the signature assembly sequence does not yet communicate a distinct operational conclusion on the required mobile compositions. That P1 blocks the milestone. The report below is the complete issue list; review continued across the full milestone after the blocker was found.

## Scope actually inspected

- Live route `http://127.0.0.1:5175/modulnye-zdaniya/` at 1440×1000, 768×1024, 390×844, and 320×568.
- Normal-motion start, planning-grid, module-placement, and operational-object states, including the complete finite play sequence and direct stage selection.
- Mobile stage controls at 390px and 320px; native button semantics, pressed states, focus treatment, and 44px target evidence.
- Reduced-motion evidence and implementation: the route starts and holds on stage 04, all transitions collapse through the media query, and the operational plate remains present without autoplay dependence.
- Header and unchanged official logo, hero hierarchy, CTA treatment, mini-brief, tender-context presentation, responsibility line, proof rail, milestone handoff, and footer.
- `desktop-1440.png`, `tablet-768.png`, `mobile-390.png`, `mobile-320.png`, `start.png`, `planning-grid.png`, `mid.png`, `end.png`, `reduced-motion.png`, `brief-validated.png`, `diff-start-end.png`, `playwright-trace.zip`, and `style-anchor-candidates.webp`.
- The generated desktop/mobile AVIF/WebP derivatives at their production resolutions, plus the image bible, prompt record, and generated-asset manifest.

## Complete issue list

### P1 — Mobile stages 03 and 04 do not form a legible assembly conclusion

**Location:** `HeroAssembly.svelte`, the `max-width: 760px` sources for `a-modul-general-hero-partial-settlement-mobile` and `a-modul-general-hero-operational-object-mobile`; live 390px and 320px assembly viewport.

**Evidence:** On desktop, stage 03 clearly shows a crane, transport, a partial central connection, and incomplete building groups; stage 04 removes construction activity and adds the completed linked group. In the dedicated 720×900 mobile derivatives, both stages center almost the same finished two-storey right-hand building and foreground utility cabinet. Directly selecting `03 Монтаж` and then `04 Запуск` on the live 390px viewport changes the caption and active cell, but the visible focal architecture is effectively unchanged; the additional completed group and transition that make the desktop conclusion readable sit outside or at the weak edge of the mobile composition. The reduced-motion mobile state therefore also presents one isolated building rather than a convincing operational complex.

**Why this blocks:** The milestone explicitly requires a meaningful finite `empty site → planning grid → module placement → operational object` interaction, a distinct mobile composition, responsive crops, and a complete reduced-motion conclusion. The signature motion cannot rely on text alone while its two decisive mobile raster states communicate the same visual result.

**Required correction:** Regenerate or re-art-direct the mobile partial and operational derivatives as a deliberately paired sequence. Stage 03 must keep visible unfinished foundations/module placement or crane/transport context; stage 04 must visibly add at least the second functional building group and sheltered transition/operational infrastructure within the actual 390px and 320px rendered crop. Preserve the locked road, camera, forest, light, and module proportions.

**Retest:** At 390×844 and 320×568, compare direct stage 03→04 selection, the full autoplay sequence, and `prefers-reduced-motion: reduce`. The architectural change must be obvious without reading the caption, and the final state must hold indefinitely.

### P2 — The generated visual anchor is entirely below the initial viewport at every width at or below 820px

**Location:** `app.css`, the `@media (max-width: 820px)` hero stack and `.hero__copy` sizing.

**Evidence:** At 768×1024 the first viewport is a full black editorial text panel; the image begins below it. At 390×844 and 320×568, the H1 and primary CTA are correctly visible, but the generated industrial scene starts only after the remaining CTA/context content. The first screen therefore establishes offer clarity but not the distinctive modular-construction visual system.

**Why it matters:** Milestone A is meant to establish the generated visual anchor and a separate mobile hero, not only a typography-first holding screen. The current responsive design loses immediate industrial credibility and makes the strongest non-generic asset discoverable only after scrolling.

**Required correction:** In the next visual pass, expose a meaningful portion of the generated anchor in the initial 768/390/320 composition while preserving normal-flow H1 and CTA visibility. A compact scene band, controlled overlap outside the text flow, or tighter vertical rhythm is acceptable; do not sacrifice readability or reintroduce overflow.

**Retest:** Capture the initial viewport at 768×1024, 390×844, and 320×568 and confirm that H1, primary CTA, and a recognizable modular/site visual all appear without overlap.

### P2 — Autoplay cadence leaves too little stable time to read the planning and installation states

**Location:** `HeroAssembly.svelte` (`1050ms` per stage) and `app.css` (`650ms` plate crossfade).

**Evidence:** The complete run ends correctly after about 3.15 seconds and does not loop, but each intermediate stage spends most of its 1.05-second slot entering or leaving through a 650ms crossfade. The planning grid and module-placement state are fully settled for only a brief fraction of a second. Manual stage controls rescue inspectability, but the primary play sequence reads as a quick slideshow rather than a controlled engineering explanation.

**Required correction:** Lengthen the intermediate holds or shorten the crossfade so each explanatory state is visibly stable long enough to parse its geometry and caption. Preserve the finite end state and immediate user interruption.

**Retest:** Play once at desktop and mobile sizes; a first-time viewer should be able to identify the grid, active installation, and completed object without pausing or manually selecting stages.

### P2 — The 320px stage selector becomes an unnecessarily tall four-row block

**Location:** `app.css`, `@media (max-width: 340px)` where `.assembly__stages` changes from 2×2 to one column.

**Evidence:** At 390px the four stages form a compact, legible 2×2 control. At 320px each stage occupies a full row, so the stage selector alone fills much of a 568px viewport and separates the visual conclusion from the following content. All labels fit comfortably within half-width cells at this copy length.

**Required correction:** Retain the 2×2 arrangement at 320px or use another compact two-column treatment, keeping 44px targets, pressed state, and focus outline intact.

**Retest:** Inspect the full assembly and its handoff at 320×568 with each stage active; there must be no clipping or horizontal overflow.

### P3 — Reduced-motion control wording is redundant after the final state is already shown

**Location:** `HeroAssembly.svelte`, reduced-motion branch of the play-button label.

**Evidence:** Reduced motion correctly starts at `04 Запуск` with the completed image visible, while the control still says `Показать итог`. Activating it produces no perceptible change because the result is already displayed.

**Required correction:** Replace the label/state with a truthful static conclusion such as `Итог показан`, or remove/disable the replay control only in reduced-motion mode while leaving the stage buttons usable.

**Retest:** Load directly with reduced motion enabled and confirm that the final state, caption, and control wording agree.

## Strengths retained

- The official logo, Geologica/Onest/IBM Plex Mono typography, graphite/warm-white base, purple, magenta, and restrained technical mint form a specific and credible Avista system; there is no Inter, yellow-black cliché, or blue-purple SaaS glow.
- The desktop 14-column composition is authoritative, the exact offer and primary CTA dominate immediately, and the generated sequence occupies a true project viewport rather than a generic card.
- The selected Candidate C family has convincing fixed road, horizon, weather, material, and building continuity on desktop. The planning grid is live SVG with no baked text or fake UI, and the generated assets contain no visible logos or signs.
- The mini-brief is clean, editorial, and usable at all inspected widths. Area/personnel switching, labeled controls, tender mode, and the honest no-submission message are presented without fake success.
- The proof treatment reads as one asymmetric evidence rail rather than six detached marketing cards; type scale and contrast remain strong on desktop and mobile.
- Motion is user-triggered, finite, interruptible, and ends in a stable state. There is no autoplay video, endless loop, particle decoration, scroll hijacking, or generic fade-up system.
