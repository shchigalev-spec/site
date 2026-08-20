# Slice 03 interaction notes

## Image continuity and desktop sequence

The chapter uses three generated 1672 × 941 source plates with the same camera, room shell, opening, window, wall proportions, floor line, and perspective. All three images are layered in the DOM, decoded before interaction, and were observed complete at their natural dimensions.

The desktop section measures exactly 208svh at a 1440 × 900 viewport, inside the required 190–220svh range. One continuous normalized progress value controls local left-to-right/right-to-left masks, plate opacity/exposure, engineering overlays, risk statement, stage rail, active conclusion, and chapter progress. `start.png`, `mid.png`, and `end.png` are direct captures of new-build, renovation, and finished states.

## Mobile stepper

- Dedicated 390 and 320 px layouts place the chapter introduction, changing image, risk statement, explicit previous/next controls, `n / 3`, conclusion, three constraints, and diagnosis CTA in document order.
- Controls are 50 px high at 320 px and the page has no horizontal overflow.
- The three active states use different aligned source plates; the mobile control is not a tab overlay on one static image.

## Context and reduced motion

- Stage selection persists in `sessionStorage`, `stageId` in the homepage URL, the preliminary scenario, analytics, and the diagnosis CTA query.
- A live mobile check confirmed `progress` selection in the preliminary scenario after selecting the renovation state and `finished` after selecting the final state.
- Reduced motion removes the sticky sequence and renders three complete normal-flow articles with their own image, conclusion, constraints, and diagnosis CTA. All three images are loaded, no animations run, and there is no overflow.
- Component-scoped normal-motion axe checks report zero violations. Browser page errors and the console are clean.
