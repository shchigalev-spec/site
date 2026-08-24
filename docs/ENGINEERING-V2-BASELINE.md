# Engineering V2 baseline

## Repository state

- Repository: `shchigalev-spec/site`.
- Actual and expected base SHA: `37004f6e6460203215ed6e57dd396b9421f83eba`.
- Working branch: `revamp/engineering-production-v2`.
- Baseline captured on 2026-08-19 from the running Engineering application at `http://127.0.0.1:5174/`.
- `apps/tech` is a frozen experimental concept. V2 must not import or edit its runtime components, CSS, design tokens, or primary imagery.

## Evidence

- `reviews/engineering-v2/slice-00/desktop-1440.png` is the actual 1440×1000 baseline render.
- `reviews/engineering-v2/slice-00/mobile-390.png` is the actual 390×844 baseline render.
- The baseline loaded meaningful content with no Vite error overlay or browser page error.

## Baseline findings

- The homepage is approximately 24,000 CSS pixels tall at both captured viewports and repeats diagnosis-first reasoning across separate symptom, path, method, construction, and conversion chapters.
- The hero contains a long visually empty scroll interval before the evidence strip. Its cutaway is a large rectangular reveal rather than a local mask following the room junction.
- The desktop H1 is large but uses the prior copy and is visually constrained by a hard split between copy wall and interior image.
- Mobile reuses the desktop hero scene and compresses the copy into a very small portion of the image rather than providing a dedicated composition.
- Symptom selection and transmission-path selection duplicate the same six choices.
- The path drawing is a generic apartment outline without semantic architecture identifiers or inspection checkpoints.
- Renovation stages are three distant spreads rather than one continuous same-camera sequence.
- One universal layer widget stands in for wall, ceiling, and floor.
- The three case reports have equal visual weight and limited Known/Unknown structure.
- The homepage uses the full engineering brief as the first form commitment.
- Service routes share one universal template.
- The existing server validation, file policy, Bitrix production guard, development-only mock, privacy routes, sitemap, robots, and basic analytics dispatch are functioning infrastructure to preserve.

## Acceptance baseline

V2 keeps all working routes and the server-confirmed lead contract while replacing the visible system with exactly seven homepage chapters. No previous `94/100` score or retrospective slice evidence is accepted as proof for V2.
