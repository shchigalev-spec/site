# Slice 09 — Motion and Interaction Director review

PASS

Fresh read-only review of the latest rebuilt Engineering preview at `http://127.0.0.1:5174/`, `docs/ENGINEERING-V2-MOTION-SPEC.md`, the current motion source and served build, `interaction-notes.md`, and the recaptured Slice 09 `start.png`, `mid.png`, `end.png`, and `reduced-motion.png`.

## Hero continuity and finite scroll

- The three 1440×1000 canonical frames are distinct and preserve one room and one camera. `start.png` is the clean observed room; `mid.png` reveals the local wall cutaway, witness line, candidate routes, legend, and hypothesis note; `end.png` keeps the same geometry while isolating one coral route, three checkpoints, and the final decision note. The H1, support copy, primary action, and room framing remain fixed rather than swapping between unrelated compositions.
- Current source maps one clamped `0…1` progress value into four finite phases: observed boundary, hypotheses, isolated route, and decision. The scroll listener only schedules a `requestAnimationFrame`; layout is read and state is written inside that frame.
- Desktop uses a 176svh section with a 100svh sticky stage; mobile uses a shorter 146svh range. The preserved live measurement for this implementation recorded a 760px desktop motion range and natural stage unpinning after the range, so there is no empty terminal scroll or trapped sticky state.
- All hero paths terminate at explicit dash-offset/opacity values. A scan of the current source and built client found no infinite animation and no `setInterval`; the only hero frame request is event-driven by scroll/resize and is cancelled on teardown.

## Symptom and transmission path

- The six-state architectural SVG uses a finite `retracting → entering → hold` sequence. A selection fades the previous route for 210ms, commits the new symptom, redraws candidates/selected route/checkpoints, and settles at `hold` after 950ms. Timers are cleared before every new choice and on teardown, preventing stacked or perpetual transitions.
- Pointer tabs, Arrow keys, Home/End, and the mobile previous/next stepper all call the same state transition. Current interaction evidence records all six mobile symptoms producing unique labelled panels and finishing with `aria-busy=false`.
- The normal mobile evidence retains the signature `1 / 6` stepper beside the shared architectural scene and its conclusion. It is not replaced by generic cards or an auto-cycling carousel.
- With reduced motion, selection commits immediately and the route, markers, and checkpoints resolve directly to their visible final state without the retract/enter timers.

## Renovation sequence

- Desktop progress is clamped across a finite 208svh chapter. Three aligned plates use local opacity and opposing clip masks; the architectural camera and geometry stay constant while the active stage, risk, overlay marks, and conclusion change.
- Mobile removes sticky scroll choreography and exposes finite 50px previous/next controls over the same three aligned plates. Current interaction evidence records successful selection of all three stages and updated active state/context.
- Reduced motion hides the sticky scene and renders all three renovation stages as complete ordinary articles with their images, constraints, and diagnosis actions. The recaptured 390px reduced-motion page visibly contains all three in sequence.

## Method, construction, cases, and feedback

- Method progress is driven by an `IntersectionObserver` selecting one of six datum steps. It has no timer or perpetual decorative loop.
- Wall, ceiling, and floor use finite tab/state changes. Their geometry separates for 520ms and risk/control/checkpoint marks fade for 240ms, then hold. Context tabs support Arrow Left/Right and Home/End; state controls expose a persistent pressed state.
- Case graphs animate only on first intersection, then disconnect their observer. Labels and result text are static. Reduced-motion CSS places bars, bands, line, peak, and reduction marks directly in their final state and disables their animations.
- FAQ/form/menu feedback consists only of short finite control transitions. Focus restoration and form-error focus are explicit in current source/evidence; the corrected mobile-menu primary action remains a finite sheet interaction and introduces no new loop.

## Reduced motion and runtime evidence

- `reduced-motion.png` is a complete 390×16,106 normal-flow capture, not a duplicated normal-motion endpoint. The hero exposes the cutaway, selected route, checkpoints, legend, and decision; its sticky positioning is removed. The symptom interaction remains available and the renovation chapter contains all three static explanatory articles.
- Component-level reduced-motion rules remove route, method, construction, case, and stage transitions or resolve them to final values. The global safeguard also collapses any remaining animation/transition duration and limits iteration count to one.
- The current post-fix browser evidence records `prefers-reduced-motion: reduce`, a non-sticky hero, the reduced renovation grid, zero running animations, zero horizontal overflow, and no framework/console/page errors. Normal motion likewise returned to zero running animations after the completion window.
- The latest preview returned HTTP 200 during this review. Its served stylesheet bundle includes the current reduced-motion and finite interaction rules, and the built client contains no infinite-animation or interval loop. Browser-control discovery itself was unavailable for this short pass, so no substitute UI automation was used; live behavior is corroborated by the current served bundle, current source, preserved post-fix browser measurements, and direct inspection of the fresh canonical captures.

No Motion/Interaction hard fail or major motion-spec miss remains in the latest build.
