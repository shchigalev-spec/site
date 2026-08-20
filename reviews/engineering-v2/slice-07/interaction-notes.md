# Slice 07 — service-page evidence

## Live routes inspected

- Surface family: `/shumoizolyatsiya-sten/`, `/shumoizolyatsiya-potolka/`, `/shumoizolyatsiya-pola/` at 1440 × 1000 and 390 × 844.
- Situation family: `/shumoizolyatsiya-kvartiry/`, `/shumoizolyatsiya-ot-sosedey/`, `/shumoizolyatsiya-v-novostroyke/`, `/shumoizolyatsiya-v-gotovoy-kvartire/` at 1440 × 1000 and 390 × 844.
- Diagnosis family: `/diagnostika-shuma/` at 1440 × 1000 and 390 × 844.

## Family A — surfaces

- Every route has one H1, unique title/description/hero image, symptom profile, direct and flanking paths, stage constraints, diagnosis CTAs, a related measured-result page, and two relevant FAQ answers.
- Wall, ceiling, and floor render distinct dedicated SVGs. Live titles were `Узел шумоизоляции стены`, `Узел шумоизоляции потолка`, and `Узел плавающего пола`.
- Related results explicitly preserve unknown surface/system details instead of implying that the published number proves the current construction.
- All primary CTAs carry service/source context to `/diagnostika-shuma/`.
- The first independent conversion review found that persistent header/footer links lost the originating service and every service CTA dropped incoming campaign parameters. A shared diagnosis-link builder now supplies the desktop header, mobile menu, footer, service hero, and service final CTA. Live inspection confirmed service, source, source page, and all five standard UTM parameters on every prominent diagnosis link.

## Family B — situations

- Situation pages use a full residential/editorial hero, a customer scenario, decision-risk callout, probable route logic, intervention constraints, and three context-specific links into surface pages.
- The four hero assets are unique. The route path and wording differ by apartment-wide, neighbor, new-build, and finished-interior contexts.
- The route diagrams are labelled as explanatory hypotheses, not as documentary plans or a diagnosis of a specific apartment.

## Family C — diagnosis

- The page explains the initial brief, optional plans/recordings/photos, what follows on site, what is checked, what the customer receives, the full progressive form, and explicit limitations.
- It links back to all three surface pages and measured results.
- Files remain optional and phone recordings are described as context rather than an acoustic measurement protocol.

## SEO, rendering, and accessibility

- Seven service titles, descriptions, and hero images are unique; tests enforce the family counts and uniqueness.
- Canonical, OG title/description/image/URL, one H1, internal links, and valid `Service` JSON-LD are present. The initial browser audit exposed that raw Svelte expressions inside a JSON-LD script were emitted literally; head markup now emits parseable JSON.
- Live image checks found no broken assets and all sampled desktop/mobile routes returned zero horizontal overflow and no Vite error overlay.
- The first independent visual review failed the unrepresented 320 px state: all three surface pages had 15 px overflow and the finished-apartment page had 5 px. The cause was long Russian H1/H2 words exceeding their mobile containers. A narrower fluid display scale and mobile heading wrap guards resolved the defect; fresh 320 checks returned zero overflow on all four affected routes with no heading scroll overflow.
- Initial axe passes exposed section-label contrast and nested `aside` landmarks. Explicit WCAG colors and non-landmark note containers resolved them. Final sampled results: diagnosis 0 violations / 29 passes, surface 0 / 27, situation 0 / 28.
- Svelte check: 0 errors and 0 warnings. Unit tests: 3 files / 15 tests passed.

## Evidence

- `surface-wall-desktop.png`, `surface-wall-diagram.png`
- `surface-ceiling-desktop.png`, `surface-ceiling-diagram.png`
- `surface-floor-mobile.png`, `surface-floor-diagram-mobile.png`
- `surface-wall-320.png`, `surface-ceiling-320.png`, `surface-floor-320.png`
- `situation-apartment-desktop.png`, `situation-apartment-route.png`
- `situation-neighbors-mobile.png`, `situation-newbuild-mobile.png`, `situation-finished-mobile.png`
- `situation-finished-320.png`
- `diagnosis-family-desktop.png`, `diagnosis-inputs.png`, `diagnosis-output.png`, `diagnosis-output-mobile.png`
- Required gate captures: `desktop-1440.png`, `mobile-390.png`, `start.png`, `mid.png`, `end.png`
