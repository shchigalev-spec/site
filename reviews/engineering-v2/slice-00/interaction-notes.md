# Slice 00 interaction notes

## Captured state

- `desktop-1440.png` and `mobile-390.png` are full-page baseline captures from the running Engineering app.
- `start.png`, `mid.png`, and `end.png` are distinct viewport captures at the hero, mid-page construction/case region, and final conversion region.
- Browser verification reported meaningful content, no Vite error overlay, and no page error.
- `reduced-motion.png` was recaptured in a fresh 390×844 browser session at `scrollY = 0` with `prefers-reduced-motion: reduce` active after moving all core mobile hero copy into normal flow. The static hero measured 1229 CSS pixels, and the H1, support copy, diagnosis CTA, secondary action, cutaway (`opacity: 0.92`), selected route (`opacity: 1`), and conclusion were present without overlap. Horizontal overflow and the Vite overlay were absent; the browser error log was empty.

## Foundation changes under review

- Actual base SHA and branch are recorded.
- Tech is declared frozen and remains unmodified.
- V2 tokens are imported by Engineering only.
- The legacy retrospective review command is renamed and refuses to run when the V2 review root exists.
- New generated masters and responsive derivatives are exclusive to Engineering.

This slice judges foundation integrity and evidence trustworthiness. Visual redesign defects visible in the baseline remain explicit input to Slice 01 onward rather than being presented as finished V2 quality.
