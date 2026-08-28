BLOCKED

# Milestone B — Accessibility + Performance Review R1

Independent read-only review of the complete Milestone B. I did not rely on the Builder's PASS claim and did not edit application code or evidence.

## Gate decision

- P0: 0
- P1: 5
- P2: 3
- P3: 0
- Decision: **BLOCKED** because P1 findings remain.

## Scope and measurements

- Live application reviewed at `http://127.0.0.1:5175/modulnye-zdaniya/`; `/modulnye-zdaniya/` returned HTTP 200, `/` returned HTTP 307 to `/modulnye-zdaniya/`, and the canonical is exact.
- Repeated Chromium runs at 1440×1000, 768×1024, 390×844, and 320×568 found document/client widths of 1440/1440, 768/768, 390/390, and 320/320. No chapter or descendant protruded beyond the viewport.
- No console errors, page errors, failed requests, or broken images occurred after explicitly hydrating the finder, BIM, factory, and dominant-case visuals.
- One H1 and coherent H2/H3 order are present. Header, labelled navigation, main, and footer landmarks are present. The first Tab reaches the visible skip link, and activating it targets the focusable `main` element.
- All visible form controls have accessible labels. Native labels make the 1px radio inputs and 16px checkboxes part of effective 48px and 52px label targets. All effective visible link/button/input/select targets measured at least 44×44; hidden desktop navigation at smaller breakpoints was excluded.
- The logistics SVG exposes a Russian title and description through `role="img"`/`aria-labelledby`. Hero and BIM plates are hidden as decorative and duplicated by textual stage conclusions. The factory and case visuals have descriptive alt text; the finder image is decorative beside an equivalent textual case record. Generated-visual disclosures remain live text.
- Reduced-motion at 390px opens the hero at stage 3 and BIM at stage 6, labels both controls `Итог показан`, collapses route/plate animation and transitions to 0.00001s, and leaves the logistics route at its completed dash offset.
- Mobile interactions remained usable at both 390px and 320px: zone toggling, all selects, logistics destinations, risk/BIM/factory stages, and the finder mismatch state worked without overflow.
- The page contains 628 DOM elements. A cold production-preview load at 390px transferred about 52.7 KB of compressed JavaScript, 14.2 KB of compressed CSS, 101.2 KB of fonts, and 207.1 KB for the logo plus three responsive hero AVIF states. Explicit hydration produced only six unique image requests (about 316.5 KB on mobile and 657.1 KB on desktop); repeated BIM/case nodes reused cached URLs rather than making duplicate downloads.
- Three cold production-preview measurements with 150 ms latency, 1.6 Mbps download, and 4× CPU throttling produced LCP 1.088 s, 1.092 s, and 1.468 s (H1 in every run), CLS 0.00105, and 55–69 ms aggregate long-task overage. These are controlled local measurements, not field data, but they clear the specification's 2.5 s/0.1 targets with substantial margin.

## Complete consolidated issue list

### P1-01 — Primary CTA text does not meet AA contrast

Every `.button--primary` renders 16px/600 warm text `#f3f0e8` on magenta `#e40a46`, measured at **4.16:1**. Because this is not large text, the required ratio is 4.5:1. The defect affects the initial hero CTA and the brief, configurator, logistics, price, and case conversion actions. Darken the magenta or otherwise provide a compliant foreground/background pair in all states.

### P1-02 — The visible keyboard focus indicator fails non-text contrast on light surfaces

The global focus ring is `#ff4d7e`. It measures **2.79:1** against the warm `#f3f0e8` surfaces used by the mini-brief/configurator/price/finder controls and **2.17:1** against the technical `#a8e1d4` surface used around the final light CTA. Both are below the 3:1 focus-indicator requirement. The same ring is compliant on graphite, so this requires a surface-aware ring or a two-colour focus treatment rather than removing the existing outline.

### P1-03 — Both ARIA tab widgets are structurally and behaviorally incomplete

The risk chain exposes nine `role="tab"` elements and the factory exposes six, but every tab remains in the normal Tab order; none has roving `tabindex`, an `id`, or `aria-controls`; neither widget exposes a related `role="tabpanel"`/`aria-labelledby` panel. `ArrowRight` from the selected first tab changed neither focus nor selection in either widget. Accessibility snapshots therefore expose an orphan tablist followed by an unrelated article. Implement the ARIA tabs keyboard pattern and explicit tab/panel relationships, or remove the tab roles and retain honest pressed-button/group semantics.

### P1-04 — Autoplay activation drops keyboard focus and does not expose progress or an operable stop

Pressing Enter on either `Запустить сборку` or `Показать весь путь` immediately disables the focused button; Chromium moves focus to `<body>` and focus remains there after the sequence finishes. The hero and BIM captions are not live regions, so the successive stage and final conclusions are not announced. BIM runs for about 6.3 seconds; although a stage button can cancel it, the user has been thrown to the document root and there is no focused stop/pause control. Preserve focus with an enabled play/stop control (or an equivalent focus-managed control), expose concise stage/final status, and keep the final state intelligible without forcing users to traverse the page again.

### P1-05 — Required mini-brief errors lack the mandated programmatic associations

Submitting the empty mini-brief correctly invokes native constraint validation and focuses `objectType`, but `objectType`, `area`, `region`, and `commissioning` remain without `aria-invalid`; no field has an error `aria-describedby`; and no persistent inline error/status nodes exist. The form-level description only references the general note and submit status. This does not meet the master requirement for field error associations, `aria-invalid`, and `aria-describedby`. Render Russian field-level errors, associate each with its control, and clear/update those states as values become valid.

### P2-01 — Several intended group labels are placed on unnamed generic divs

`assembly__stages`, `bim__stages`, `finder__filters`, and `factory__facts` use `aria-label` on generic `div` elements without a role. Their labels do not appear in the Chromium accessibility snapshots, so the controls/facts are exposed without the intended group context. Use an appropriate `role="group"`, semantic fieldset/legend, list, or another named structure.

### P2-02 — Numeric/region placeholder text is slightly below AA contrast

The light-form placeholder colour `#746e77` against `#f3f0e8` measures **4.35:1**, below the 4.5:1 requirement for normal text. Persistent visible labels limit the impact, but the examples remain user-facing instructional text and should use the compliant label/body palette.

### P2-03 — Visual selected state relies only on colour changes

The hero/BIM stages, configurator choices, logistics destinations, and risk/factory stages expose state programmatically through `aria-pressed` or `aria-selected`, but their visible active state is only a foreground/background colour swap. The master accessibility standard explicitly requires colour not to be the only state. Add a non-colour marker such as a persistent check, underline, border geometry, or labelled status while retaining the current ARIA state.

## Recheck boundary

Reinvoke this reviewer role after the five P1 areas are fixed and deterministic QA is rerun. The P2 items may enter the milestone polish backlog under the Fast Execution Override, but none should be lost before the final accessibility gate.
