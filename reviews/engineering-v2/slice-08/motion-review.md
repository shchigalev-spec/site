# Slice 08 — Motion and Interaction review

PASS

Reviewed read-only against the current production preview at `http://127.0.0.1:5174/`, the refreshed Slice 08 evidence, the Engineering V2 motion/mobile requirements, and `docs/ENGINEERING-V2-REVIEW-PROTOCOL.md`.

## Evidence inspected

- Refreshed `start.png`, `mid.png`, and `end.png` at 390×844.
- `reduced-motion.png` and `interaction-notes.md`.
- Current full-page desktop/mobile captures and mandatory viewport captures.
- Independent live browser interaction at 1440×1000 and 390×844.

## Findings

- Hero motion is finite and continuous. At 1440×1000 the live scroll range was 760px over a 1760px section (176svh). Start values were all `0`; at 50% the observed boundary was `1` and competing hypotheses `0.6`; at the end observed/hypotheses/isolated/decision were all `1`. Scrolling 120px beyond the range moved the sticky stage to `-120px`, proving natural unpinning rather than dead scroll.
- The refreshed 390px start/mid/end frames are genuinely distinct: calm room, competing path explanation, and selected route with checkpoints and final conclusion. Core copy and CTA remain in normal flow and do not swap between frames.
- The symptom transition is user-triggered and finite. A live mobile step moved from `1 / 6` to `2 / 6`, entered `aria-busy=true`, settled at `aria-busy=false`, updated the conclusion and URL context, and held. Keyboard `End` moved selection and focus to `6 / 6` with the selected tab at `tabindex=0`.
- No symptom auto-cycle or infinite path pulse was observed; the final route state persisted after the transition.
- Renovation desktop state progressed from approximately `0` to `0.5` to `1`, with the correct new-building, renovation, and finished-apartment conclusions. The three decoded plates were the aligned new-build, renovation, and finished images; local opacity/clip transitions reached stable end values.
- At 390px, the renovation controls were 50px high and advanced visibly from `1 / 3` to `2 / 3` to `3 / 3`, updating the image layer, risk statement, conclusion, URL/session context, and CTA context without horizontal overflow. The recorded CDP touch test in `interaction-notes.md` also confirms touch activation.
- Construction controls are finite and responsive. Arrow Right moved focus and selection from wall to ceiling. Selecting `Жёсткий мост` exposed the ceiling-specific risk and SVG; eight transition animations were active immediately and zero remained after 1.05s. Mobile state controls measured 52px high.
- Under `prefers-reduced-motion: reduce` at 390×844, the hero immediately exposed decision state `1`, legend, selected route, checkpoints, and conclusion; the hero stage was non-sticky. The renovation sticky scene was removed and replaced with all three complete normal-flow articles and CTAs. Symptom and construction controls remained available.
- Reduced-motion live checks reported zero running animations, zero horizontal overflow, no framework overlay, and no missing explanatory state.
- Browser page-error and console logs were empty during the final pass.

No Motion and Interaction hard fail remains.
