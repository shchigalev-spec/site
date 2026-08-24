# Engineering V2 motion specification

This document describes the motion that is implemented in `apps/engineering`.

## Hero

- Desktop uses one scroll-driven scene. A normalized progress value is derived from the hero section in `requestAnimationFrame`; no scroll handler writes layout synchronously.
- The sequence is finite: observed boundary → candidate paths → isolated path and checkpoints → decision. The clean and cutaway plates keep the same room and camera.
- The H1, support, and primary action remain readable throughout. Motion is explanatory; there is no unbounded decorative loop.
- Mobile keeps the same diagnostic sequence in a dedicated portrait composition and shorter sticky range.
- With `prefers-reduced-motion: reduce`, progress resolves to the complete conclusion, sticky positioning is removed, and all core copy returns to normal flow.

## Symptom and route

- Six symptoms use an ARIA tab pattern and one shared architectural SVG.
- A change retracts the prior finite route, commits the selected state, then draws the new candidates, selected route, and checkpoints. The transition ends in `hold`.
- Arrow keys, Home, End, the mobile previous/next controls, and pointer selection expose the same states.
- Reduced motion commits immediately without the retract/enter timers.

## Renovation stage

- Desktop maps scroll progress across three aligned photographs of the same room and camera. Opacity and directional masks reveal the renovation and finished states.
- Mobile exposes the same three states through finite previous/next controls; it is not replaced by unrelated generic cards.
- Reduced motion renders all three stages as ordinary explanatory articles.

## Method, construction, cases, and forms

- Method progress is selected through intersection state, not a perpetual animation.
- Wall, ceiling, and floor diagrams use finite tab/state changes. Their tablists support keyboard navigation.
- Case graphs animate once when rendered and have static labels and textual results.
- Form and FAQ feedback use short control transitions only. Focus movement is explicit after validation.

## Timing tokens

The implemented values live in `apps/engineering/src/v2-tokens.css`: 160 ms micro, 260 ms control, 820 ms route, 780 ms mask, 380 ms page transition, with `cubic-bezier(0.22, 1, 0.36, 1)` as the calm easing.
