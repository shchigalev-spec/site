# QUIET / ENGINEERING — Final Interaction Notes

## Evidence boundary

The final folder now contains five full-page responsive screenshots plus `hero-start.png`, `hero-mid.png`, `hero-end.png` and `reduced-motion.png`. These frames confirm semantic state change, intermediate composition and scroll termination; the latest live browser review is PASS. Dedicated mobile mid-state motion evidence is not included, so it remains a useful future regression capture rather than a release blocker.

## 1. Architectural hero reveal

**Status: PASS.**

- Scroll progress is derived from the local hero range and drives one finite `0…1` state.
- The same room receives a local cutaway, measurement rule, witness ticks, selected route and final diagnosis conclusion.
- It is not a full-image crossfade, dashboard or looping scan.
- Desktop and mobile keep a single architectural composition and diagnosis CTA.
- Full-page screenshot whitespace after the first viewport is the sticky scene's document footprint, not an empty normal-scroll state.
- At `prefers-reduced-motion: reduce`, sticky interpolation is removed and the complete cutaway, measure, route and conclusion are shown statically.
- `hero-start.png` preserves the quiet inhabited room and immediate diagnosis promise.
- `hero-mid.png` reveals the local section, measurement field and selected brick route while headline and CTA remain legible.
- `hero-end.png` keeps the diagnosis action visible and naturally reveals the evidence band and next chapter; the scene does not trap scroll.

## 2. Editorial symptom index

**Status: PASS.**

- Six factual symptom states are present.
- Selection updates the route drawing, source/mechanism, inspection list and CTA context.
- The control is a real tablist with `role="tab"`, `aria-selected`, roving `tabindex` and four-direction arrow-key support.
- Active state uses brick colour plus underline/number treatment, so selection is not colour-only.
- Mobile retains the drawing, plain-language summary and all six options without a carousel.

## 3. Transmission-path drawing

**Status: visual PASS; accessibility revision recommended.**

- Each selection draws a different route through a stable architectural section.
- Candidate paths remain dashed and subordinate; the selected path is brick and terminates at a real inspection zone.
- SVG has a title and description containing the active mechanism and zones to inspect.
- The adjacent conclusion makes the diagram understandable without animation.

Issue: the outer container declares `role="tablist"`, but its six buttons lack `role="tab"`, `aria-selected`, roving `tabindex` and arrow-key handling. The controls remain ordinary keyboard-focusable buttons, so this is not a content blocker, but the announced widget semantics are incomplete.

## 4. Construction-layer detail

**Status: PASS with minor keyboard-pattern gap.**

- Wall, ceiling and floor contexts are selectable.
- Layers separate along a controlled axis; functional roles stay labelled.
- The rigid bridge and bypass path create a meaningful problem state instead of decorative floating layers.
- Hidden-work rail continues the logic into inspection and recording before closure.
- The assembled/expanded conclusion remains available with reduced motion.

Issue: the three tabs expose `role="tab"` and `aria-selected`, but lack roving tabindex and arrow-key navigation. All remain available through ordinary Tab/click/touch.

## 5. Cases

**Status: PASS.**

- `58 dB → 39 dB`, `71 dB → снижение на 16 dB`, and `64 dB → 43 dB` are represented accurately.
- Numbers remain visible rather than counting from zero.
- Report grammars differ: datum marks, peak trace and before/after bands.
- Illustrative disclosure is present and no customer/address/system/budget/duration is invented.

## 6. Preliminary engineering brief

**Status: PASS.**

- Inputs meaningfully update the persistent source-data summary.
- Output distinguishes probable type, inspection zones, qualitative scale, unknowns and next step.
- It explicitly states that the result is not a project or estimate and emits no fictional exact price/reduction/thickness.
- Selected context is carried into the diagnostic route.

## 7. FAQ and diagnostic form

**Status: PASS.**

- FAQ buttons expose `aria-expanded`; answers remain plain DOM text.
- Form labels, autocomplete hints, native validity, explicit errors and server-confirmed success logic are present.
- Optional PDF/image/video/audio files have type, count, empty-file and 10 MB validation, removable rows and accessible error messages.
- Phone recording is correctly described as contextual, not a professional measurement.
- The submit area explains manager contact and the next commercial step.

The form is intentionally long. Consider testing a shorter “describe first” entry for cold traffic, but do not remove the complete diagnostic path.

## 8. Navigation and focus

**Status: PASS.**

- Skip link and visible `:focus-visible` treatment exist.
- Mobile menu moves focus into the sheet, traps Tab, closes on Escape and returns focus to the trigger.
- The current Header locks document scrolling while the sheet is open, restores it on close and clears the lock on component teardown.

## 9. Reduced-motion conclusion

**Status: PASS by implementation and evidence.**

- Global transitions/animations collapse to effectively zero duration.
- Smooth scroll is disabled.
- Hero sticky height is removed and the final explanatory state is visible.
- Sticky method/brief captions become static.
- Route/case information is already present in SVG/HTML, so content does not depend on drawn animation.
- `reduced-motion.png` confirms the cutaway, dimension line, route, conclusion and diagnosis CTA are simultaneously available in a stable non-scrubbed composition.
