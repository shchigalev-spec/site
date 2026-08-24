# Slice 01 interaction notes

## Scope exercised

- Desktop hero at 1440 × 900: clean room, measurement, competing routes, selected route, and conclusion were captured at distinct scroll positions.
- Mobile hero at 390 × 844: start, observed route, competing routes, and selected route were captured from the dedicated portrait plates.
- Narrow mobile was checked at 320 × 844. The chapter label is intentionally hidden below 371 px while the live progress rule remains visible, preventing brand/header overlap.
- Reduced motion was checked at 390 × 844 with `prefers-reduced-motion: reduce`. The cutaway, selected route, legend, conclusion, H1, support copy, and actions are all present without a pinned scroll sequence.

## Live browser observations

- Desktop final state: `scrollY = 760`; chapter label `01 · Диагностика`; no horizontal overflow; no Vite overlay; no console, page, or failed-request errors.
- Mobile final state: `scrollY = 388`; chapter label `01 · Диагностика`; no horizontal overflow; no Vite overlay; no console, page, or failed-request errors.
- Reduced-motion state: media query matched; hero height 1107 px; cutaway and selected route fully visible; conclusion in normal flow; no horizontal overflow or browser errors.
- The mobile menu places focus on its first link when opened, closes on Escape, and returns focus to the menu trigger.
- Both mobile hero image sources completed loading at their intrinsic 1122 × 1402 resolution.

## Motion and state model

The sticky desktop scene uses one continuous normalized progress value. Image reveal, SVG path drawing, checkpoints, annotation crossfades, header progress, and chapter state derive from that value; there are no looping primary animations. The desktop hero releases directly into the next section. Mobile keeps the same explanatory states in a shorter scroll sequence and keeps the conversion copy in normal flow. Reduced motion renders the complete explanatory state immediately.

## Revisions made before review

- Moved mobile progress state away from the conclusion to remove a collision at the final state.
- Stacked transitional notes instead of letting them crossfade in the same text box.
- Hid the long header chapter label at 320 px after a live overlap check while preserving progress feedback.
- Moved the reduced-motion surface annotation below the illustration after inspecting the real capture.

## Review-driven revisions

The first visual review failed the observed-surface state for insufficient annotation contrast. The active timing was widened, the surface label received an opaque light backing, and desktop/mobile notes received stronger backings before a full recapture.

The subsequent accessibility review failed caption size, contrast, and SVG exposure. Every hero caption is now at least 12 px, the header/eyebrow use the darker teal text token, timeline numerals use a high-contrast dark backing, and the semantic SVG is no longer inside an `aria-hidden` ancestor. A fresh hero-scoped axe run reports zero violations; the diagram title is exposed, the page has no horizontal overflow, and the final mobile arrangement has no annotation/copy collision.
