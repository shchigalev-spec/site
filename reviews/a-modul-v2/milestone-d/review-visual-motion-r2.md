Milestone D R2 — Visual + Motion Director

Severity counts:

- P0: 0
- P1: 2
- P2: 1
- P3: 0

## P1 — Required generated route-visual system is materially incomplete

The shipped manifest contains the aligned general hero family plus only one Kamchatka, factory, dormitory and Office/ABK scene. Consequently:

- Shift, Office/ABK and dormitory routes reuse the same raster for hero and case.
- Required office/dormitory plan, interior and final scenes are absent.
- Required shift composition, logistics, seismic and final scenes are absent.
- Dedicated route social-card and generated logistics-mode groups are absent.
- The long Office/ABK and dormitory routes contain only one route-specific scene repeated twice.

This violates the master specification’s required generated asset groups and route-family narrative. The fast override did not supersede those product requirements.

Required correction:

Generate and integrate distinct Codex-authored route visuals for the missing story beats, preserving the established lens, geometry, palette and disclosure rules. Update prompts and manifest, then recreate complete desktop/mobile route evidence.

Retest:

Inspect every new master and derivative at full resolution; verify that hero, plan/composition/interior, case and final beats are meaningfully distinct and that no generated case scene is presented as documentary photography.

## P1 — Production “sequence” changes only text; the visual is static

`FactorySequence.svelte` renders one permanent factory `<picture>` for all seven stages. Independent live screenshots of `.factory__visual` at:

- `Металл` — stage 0;
- `Инженерия` — stage 3;
- `Отгрузка` — stage 6

were byte-identical, each producing SHA-256:

`90c17bad4f29dc4c95cb7f5a752880568728c340e47732dbc18cebd6bc400609`

Only the active tab and caption change. This does not meet the required generated-still production progression:

`metal → frame → envelope → engineering → finishing → quality control → shipment`

Required correction:

Integrate distinct, coherent generated plates or equivalent meaningful visual states for the factory stages, with controlled finite transitions and a stable conclusion. Preserve keyboard selection, reduced motion and offscreen behavior.

Retest:

Capture fresh factory start/middle/end frames, a non-empty visual diff and trace showing user-controlled progression. The factory viewport itself must visibly change.

## P2 — Reduced-motion screenshot does not prove the fallback

`reduced-motion.png` is byte-identical to `hero-modulnye-zdaniya-mobile390.png`. Both show only the initial copy-backed hero, while the animated Hero Assembly and BIM scenes are below the captured viewport.

The runtime behavior itself passed independently: reduced motion initializes Hero at stage 3 and BIM at stage 6 with `Итог показан`. The defect is the final visual evidence.

Required correction:

Capture reduced-motion evidence containing the completed Hero Assembly and BIM states, including their final captions and controls.

## Confirmed passing areas

- All R1 visual/motion findings were corrected.
- Generated architecture, H1, primary CTA and qualification coexist in the first 320, 390 and 768 viewport on all four routes.
- Hero runs `0→1→2→3`; BIM runs `0→1→2→3→4→5→6`; both stop and hold without looping.
- Both sequences cancel timers offscreen and remain stable.
- Final normal-motion frames, diffs and trace are fresh; no cross-milestone screenshot hashes were duplicated.
- Localized file control and corrected 1.2-second logistics documentation are present.
- Existing generated assets are high-quality architectural CGI without baked text, customer logos or documentary-photo claims.
- Case disclosures are attached and factually framed.
- No video, remote stock imagery, overflow, broken visual asset or runtime console defect was observed.
- The typography, asymmetric editorial layouts and restrained industrial palette remain strong and non-template-like.

Milestone D cannot receive explicit Visual + Motion PASS until both P1 requirements are implemented and re-reviewed.

BLOCKED
