BLOCKED

# Milestone B — Accessibility + Performance Review R2

Independent read-only replacement review of the complete current Milestone B after the interrupted R2 wave. I inspected the live application, source, current evidence, the master specification, the fast-execution override, and the prior accessibility/performance report. I did not edit application source or evidence and did not rely on the Builder's aggregate verdict.

## Gate decision

- P0: 0
- P1: 1
- P2: 1
- P3: 0
- Decision: **BLOCKED** because the previous focus-indicator P1 is only partially corrected on selected controls over light surfaces.

## Independent recheck coverage

- Live Chromium checks at 1440×1000, 768×1024, 390×844, and 320×568 returned HTTP 200 with document/client widths exactly 1440/1440, 768/768, 390/390, and 320/320. There was one H1, a visible primary CTA, no page overflow, no console/page/request errors, and no broken image after every lazy image was explicitly brought into view.
- `/` still returns HTTP 307 to `/modulnye-zdaniya/`; the route canonical is exactly `https://a-modul.ru/modulnye-zdaniya/`.
- The full accessibility tree at desktop and mobile contained no unnamed button, link, combobox, spinbutton, checkbox, radio, or tab. No duplicate IDs or unnamed generic `div[aria-label]` groups remain.
- The first Tab exposes the 233×47px Russian skip link; activation moves focus to the focusable `main` landmark.
- At 320px, the visually hidden radio is backed by a 236×44px label target and configurator checkboxes by 280×52px label targets. Other visible controls measured at least 44×44.
- `npm --prefix apps/a-modul run check` completed with 0 errors and 0 warnings. Vitest exited successfully while honestly reporting that no unit-test files exist.

## R1 blocker disposition

### R1 P1-01 — CTA contrast: resolved

The primary CTA now renders warm `#f3f0e8` text on `#c60a3c`, measured at **5.25:1**. The initial and sectional CTA instances use the corrected pair.

### R1 P1-02 — Focus visibility: partially resolved, still blocking

Ordinary controls now receive a useful two-colour treatment: a 3px white outline plus a 6px graphite outer ring. The graphite ring is clearly visible on warm and technical surfaces, and the white outline is clearly visible on dark surfaces.

However, selected controls with component-level `box-shadow` rules overwrite the graphite focus ring. This affects at minimum:

- the selected object-type/capacity buttons in the light configurator;
- the selected production tab in the light factory section.

For those focused elements Chromium computes a white 3px outline and only a technical-colour **inset** selection shadow. The surrounding surface is warm `#f3f0e8`; white against that surface measures only **1.14:1**. The inset shadow is already present before focus, so it cannot identify the focus change. This leaves the actual focus indicator below the required 3:1 contrast on these light surfaces.

### R1 P1-03 — Risk/factory tabs: resolved

- Risk exposes 9 tabs; factory exposes the exact 7-stage production sequence.
- Each widget has exactly one `tabindex="0"` tab and one selected tab.
- Arrow navigation in risk moved focus and selection from `risk-tab-0` to `risk-tab-1`; End in factory moved both to `factory-tab-6`.
- Selected tabs reference the correct panel with `aria-controls`; each `role="tabpanel"` updates `aria-labelledby` to the selected tab.
- The panels expose the changed content, and no orphan tab roles remain.

### R1 P1-04 — Autoplay focus, stop, and progress: resolved

- Starting the hero kept focus on the enabled `.assembly__play` control, changed it to `Остановить сборку`, exposed stage progress through an atomic polite status, and retained focus through the stable final `Запуск` state.
- Starting BIM kept focus on the enabled `.bim__play` control, changed it to `Остановить последовательность`, announced the changed stage, and Space stopped the sequence without moving focus or losing the current readable state.
- The final BIM state was also exercised by deterministic evidence; the control stays enabled instead of being disabled under focus.

### R1 P1-05 — Mini-brief errors: resolved

Submitting all four required fields empty moved focus to `objectType`. Every required control exposed `aria-invalid="true"`, a non-empty `aria-describedby` target, and a persistent Russian message:

- `Выберите тип объекта.`
- `Укажите значение: численность.`
- `Выберите регион проекта.`
- `Укажите желаемый месяц ввода.`

Entering valid values cleared every message and returned every `aria-invalid` state to `false`.

## Prior P2 disposition

- **R1 P2-01 resolved:** assembly, BIM, logistics, and finder now expose named `role="group"` structures; factory facts use a named semantic list.
- **R1 P2-02 resolved:** placeholder `#625c65` on warm measures **5.69:1**.
- **R1 P2-03 resolved:** selected interactive states retain programmatic state and add a persistent 2px inset technical marker rather than relying only on the foreground/background swap; native checked controls retain their check mark.

## Complete consolidated issue list

### P1-01 — Selected controls on light surfaces lose the compliant outer focus ring

The active-state `box-shadow` declarations have higher specificity than the global focus rule and replace its 6px graphite outer ring. Preserve both layers for selected focused controls—for example, a surface-aware `:focus-visible` rule that combines the outer graphite ring with the existing inset selection marker. Recheck the active configurator choices and active factory tab, not only ordinary selects and inactive buttons.

### P2-01 — The initial logistics route animates completely while far offscreen

At 390px and `scrollY = 0`, the route was roughly 9,814px below the viewport but its CSS animation was already running at 267ms. After 1.3 seconds, still without scrolling, it had finished at a zero dash offset. Region changes correctly recreate the finite route animation, so the interaction remains usable, but the initial animation violates the performance rule that animation be paused offscreen and spends its explanatory transition before a user can see it. Gate the initial route animation with visibility/intersection or render its stable conclusion until the chapter enters view.

## Reduced motion and performance

- With `prefers-reduced-motion: reduce` at 390px, hero opened at stage 3 and BIM at stage 6; both statuses contained the complete textual conclusion and both controls read `Итог показан`.
- Hero plate, BIM plate, and logistics route durations collapsed to `0.00001s`. Pressing either final-state control retained focus and did not restart motion.
- Three cold production-preview runs at 390px with 150ms latency, 1.6Mbps download, and 4× CPU throttling produced LCP values of **1.092s, 1.104s, and 1.124s**; the H1 was the LCP element in every run. CLS was **0.00105**. Each run recorded one 52–92ms long task and no sustained main-thread stall.
- Initial transfer was about 380.6KB under that profile. The initial responsive images were the logo and three 720×900 AVIF hero states. After explicit full-page hydration, mobile made six unique image requests with no duplicate URL fetches; responsive mobile/desktop crops and intrinsic dimensions were correct.

## Recheck boundary

Reinvoke this reviewer role after the selected-light-surface focus ring is corrected and deterministic QA is rerun. The logistics offscreen-animation issue is P2 and may enter `POLISH-BACKLOG.md` under the Fast Execution Override, but it should remain visible for the final accessibility/performance gate.
