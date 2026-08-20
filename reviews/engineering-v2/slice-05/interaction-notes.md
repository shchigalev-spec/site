# Slice 05 — case evidence notes

## Live routes inspected

- `/` at 1440 × 900, 390 × 844, and 320 × 800.
- `/cases/58-39-db/`, `/cases/impact-noise-minus-16-db/`, and `/cases/64-43-db/` at 1440 × 900.
- `/cases/58-39-db/` at 390 × 844.

All inspected routes rendered without a Vite overlay, broken images, or horizontal overflow.

## Hierarchy

- The homepage has one dominant report: `58 dB → 39 dB`.
- `71 dB peak → reduction by 16 dB` and `64 dB → 43 dB` are visibly smaller paired reports.
- The dominant report includes problem, initial hypothesis, inspected zones, diagnostic change, intervention principles, measured result, limitation, and a link to the full case.
- Every case visual carries the exact illustrative-image disclosure.

## Graph behavior

- Graphs use meaningful axes, before/after states, peak/reduction annotations, and a visible `измеренный результат · не прогноз` label.
- Each graph is armed by its own intersection observer, animates only on first intersection, disconnects after activation, and remains in its final state.
- Scoped animation inspection after the transition showed `0` running graph animations. Re-entry did not restart the graph.
- With `prefers-reduced-motion: reduce`, graph animation count was `0`; bar transforms resolved to the final scale and line paths resolved without a drawing transition.

## Detail-page completeness

Each detail route exposes eight explicit narrative steps plus a separate known/unknown evidence panel and a diagnosis CTA. The primary detail route reported 8 narrative cards, 3 known items, 4 unknown items, zero overflow, and zero broken images.

## Accessibility inspection

- Scoped axe 4.10.2 run on the homepage case chapter: `0` WCAG A/AA violations and 25 passes after the semantic region correction.
- Full detail-page run initially found one inherited footer contrast failure. The footer meta style was revised from the low-contrast measurement color to `--ink-soft` at 12 px; the repeated full-page run then returned `0` violations and 42 passes.
- Remaining axe color items are SVG/image-background incompletes and require manual contrast review; graph foreground colors are explicit on `#151915`.

## Canonical evidence

- `desktop-1440.png` — fresh current 1440×1000 capture of the cases chapter and dominant report after the final production build.
- `start.png`, `mid.png`, `end.png`
- `mobile-390.png`, `mobile-320.png`
- `reduced-motion.png`
- `case-primary.png`, `case-primary-mobile.png`
- `case-secondary-a.png`, `case-secondary-b.png`
- `mobile-390-graphs.png`, `mobile-320-graphs.png`

The first visual review correctly failed the supporting charts: legacy `.graph-peak` and `.graph-bands` selectors were still shrinking/absolutely positioning the new SVGs. The new graph classes no longer collide with the legacy CSS. Both desktop supporting charts now receive 598.7 px of usable width; mobile adds a 12 px label / 13.6 px value legend and keeps document overflow at zero. Fresh evidence was captured after the revision.

The first accessibility review then correctly failed the meaningful axis/grid strokes at approximately 2:1 non-text contrast. The axis is now explicit `#9ba7a1`; contrast measured against the composited graph backgrounds is 7.04:1 in the dominant dark report and 4.86:1 in the supporting paper cards.
