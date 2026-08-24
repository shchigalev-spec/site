# Slice 08 — Conversion re-review

PASS

## Fresh evidence inspected

- Rebuilt live homepage at `http://127.0.0.1:5174/` with `utm_source=conversion`, `utm_medium=review`, `utm_campaign=slice08`, `utm_term=diagnosis`, and `utm_content=rerun`.
- Current desktop and mobile Slice 08 screenshots after the correction.
- Actual diagnosis `href` values for the desktop header/navigation, hero, symptom path, desktop and reduced-motion renovation states, construction, FAQ, full-brief alternative, footer, and completed five-answer scenario.
- Mobile sticky CTA at 390 × 844 after leaving the hero.
- Intercepted homepage short-form `FormData`; no request was allowed to reach the diagnosis API.

## Verification

- Every inspected homepage diagnosis link carries `source`, `source_page=homepage`, and all five standard UTM parameters. Context-specific links additionally retain their symptom, stage, construction, or scenario fields.
- The completed scenario CTA retained symptom, direction, selected route, renovation stage, room, intervention priority, working hypothesis, source, source page, and all five UTM values.
- The FAQ diagnosis link and the “Перейти к полному брифу” link retain the same landing context.
- On mobile, the visible sticky CTA resolved to `/diagnostika-shuma/` with `source=mobile_sticky`, `source_page=homepage`, and all five UTM values. It remained absent near the final form and while the menu was open; no horizontal overflow was measured at 390 px.
- Intercepted short-form `FormData.sourceContext` was exactly `source=homepage_short · source_page=homepage · utm_source=conversion · utm_medium=review · utm_campaign=slice08 · utm_term=diagnosis · utm_content=rerun`.
- The short form still focuses its explicit validation alert and identifies the five missing required inputs.
- The full diagnosis form still focuses the step error for missing symptom context and the contact error for missing name, phone, and consent.
- Desktop/mobile comprehension and “what happens next” remain clear: initial symptom clarification, context/file review, then a separately agreed on-site diagnosis without an invented callback time.

No remaining conversion blocker or hard fail was found in the revised Slice 08 scope.
