# Slice 06 — scenario and conversion evidence

## Live flows inspected

- Homepage preliminary scenario at 1440 × 900, 390 × 844, and 320 × 568.
- Homepage FAQ and short-contact form at 1440 × 900 and 390 × 844.
- Full `/diagnostika-shuma/` route at 1440 × 900, 390 × 844, and 320 × 568.
- Reduced-motion homepage scenario at 390 × 844.

## Scenario behavior

- The interface shows one of five questions at a time: symptom, direction, renovation stage, room, and intervention/space priority.
- Every answer advances visible progress and updates the simplified route map and hypothesis summary.
- Back/edit controls return to previous answers.
- State is persisted as `engineering:scenario-v2`. The first browser cycle exposed a real persistence defect because a reactive call did not depend directly on the state values; the store was revised to react to an explicit typed snapshot. A repeated live cycle preserved all five selected values and the completed state.
- Final output exposes probable noise type, candidate routes, inspection zones, qualitative intervention scale, important unknowns, and next step. It does not output price, thickness, promised reduction, material system, or guarantee.
- The first independent conversion and motion reviews failed the handoff because only symptom and direction changed the large route hypothesis, while stage, room, and intervention priority were merely listed. The route now changes geometry/class after stage and priority, changes its destination label after room, and updates the written engineering hypothesis after every one of the five answers.
- The handoff URL carries all five answers, probable route, noise identifier, working context, optional comment, source page, and available campaign context. The full form visibly renders those fields and preserves them in the submitted source context.
- A second conversion re-review failed because the displayed route/hypothesis were not yet present in the hidden submitted context and because `utm_medium`, `utm_term`, and `utm_content` were dropped. The submitted `sourceContext` now includes noise ID, route, hypothesis, stage context, source page, and all five standard UTM fields; a live handoff confirmed the exact values.
- The first independent mobile review failed the 320 × 568 question state because a 443 px diagram pushed the first answer below the viewport. The mobile state now uses a compact 108 px live route directly above the question and scrolls the changed state into view. Fresh measurements put the diagram at 86.7–194.8 px and the first answer at 405–475 px, with zero horizontal overflow.

## Form behavior

- Homepage first contact contains only main noise, renovation stage, name, phone, optional email, consent, and an optional attachment disclosure after the contact fields.
- Both homepage and full forms submit to the existing server-validated diagnosis endpoint and only show success after a 201 response. Two live development submissions reached the validated Bitrix mock adapter with zero files.
- The first independent conversion review also failed the response because the development adapter exposed its mock request identifier. The public endpoint now returns only `{ ok: true }`; adapter identifiers stay server-side.
- The full brief is a four-step progressive form: symptom, context, optional materials, contacts.
- Network failure was emulated with browser offline mode. The full form showed the explicit error state and retained the symptom and contact values on step 4. Offline mode was restored immediately afterward.
- Unit tests: 3 files / 13 tests passed, including server validation and file policy.

## Mobile sticky CTA

- Hidden in the hero.
- Visible after leaving the hero with a 62.3 px touch target and safe-area-aware bottom offset.
- Hidden while the mobile menu is open.
- Hidden while the scenario controls or final short form are in view, so it cannot cover interactive fields.
- Links to `/diagnostika-shuma/?source=mobile-sticky` and emits `mobile_sticky_cta_click` without personal data.
- The FAQ diagnosis action emits `diagnostic_start`. The alternative “full brief” action no longer emits `full_form_start` before that form is actually reached.

## Accessibility and mobile revisions

- A live 390 px check initially found 49 px horizontal overflow on the full route. The oversized mobile diagnosis H1 was revised to a smaller fluid scale with hyphenation; repeated 390 and 320 checks returned zero overflow.
- A motion re-review then found 56 px overflow on the long fifth scenario question at 320 px. Min-width constraints and a smaller wrapping mobile legend reduced the live fieldset to 294.4 px in a 320 px viewport; `mobile-step5-320.png` records the corrected state.
- Scoped axe first found nine FAQ/application contrast failures and two unsupported labels on plain divs. Explicit WCAG colors and progressbar/group roles resolved them.
- Full-page axe first found a nested complementary landmark on the carried-context panel. It is now a labeled note.
- A fresh post-review axe pass found one nested complementary landmark on the desktop scenario map. Replacing the nested `aside` with a live status container resolved it. Final focused axe results: zero violations / 18 passes for the scenario, zero for FAQ/short conversion, and zero violations / 27 passes on the full diagnosis route.
- The first keyboard review failed focus continuity after both scenario answers and full-form step changes. The changed question/result and the newly revealed form group now receive programmatic focus after the DOM update. A follow-up found the same defect on scenario Back/edit; those transitions now use the same focus path. Final live keyboard proof: Back returned focus to the restored legend and the next Tab entered its first answer.
- Reduced-motion scenario inspection reported `matchMedia=true`, zero scoped running animations, and zero overflow.

## Evidence

- `desktop-1440.png` — fresh current 1440×1000 capture of the one-question scenario after the final production build.
- `start.png`, `mid.png`, `end.png`
- `mobile-390.png`, `mobile-320.png`, `mobile-step5-320.png`, `mobile-end-320.png`, `reduced-motion.png`
- `mobile-sticky.png`, `mobile-form.png`
- `handoff.png`, `full-form-start.png`, `full-form-mobile.png`, `full-form-320.png`
- `short-form-success.png`, `full-form-success.png`, `full-form-error.png`
