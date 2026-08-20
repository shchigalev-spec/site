# Slice 04 interaction evidence

- Live route: `http://127.0.0.1:5174/`, HTTP 200.
- Desktop viewport: 1440×900. Mobile viewports: 390×844 and 320×844.
- The six-step method uses one vertical datum. Browser scrolling advanced the live map from `01 / 06` to `06 / 06`; at the final step the DOM reported five previously read steps and `Монтируем и проверяем` as current.
- Wall, ceiling, and floor each render a separate SVG model and accessible title. A fresh page contained exactly one model at a time.
- Every construction context exposes five finite states: assembled, separated, rigid bridge, controlled junction, and hidden-work checkpoint. State changes are manual; there is no timer or loop.
- Wall screenshots `start.png`, `mid.png`, and `end.png` are distinct real browser states. `ceiling.png` and `floor.png` show the two separate geometries.
- Desktop and mobile tab selection updates the diagram, panel label, explanation, and diagnosis URL. Keyboard `ArrowRight` moved selection from `Стена` to `Потолок`.
- The diagnosis CTA preserves construction context, for example `/diagnostika-shuma/?construction=wall`.
- Mobile provides one diagram at a time, a large two-column functional legend, stacked state controls, and no horizontal pan. Measured controls are 60 px for context tabs and 52 px for state controls at both 390 and 320 px.
- A fresh component-scoped mobile check found `.method-construction-v2`, measured the minimum technical-caption size at exactly 12 px, found no duplicate IDs, and confirmed one titled SVG model mounted per context.
- After contrast revision, a fresh axe-core 4.13.0 audit scoped to `.method-construction-v2` returned zero violations and 27 passing rules. Direct contrast probes measured 5.63:1 for the construction technical labels and comfortably higher ratios for dark-method copy. The state selector now exposes `role="group"` with its accessible label.
- Browser overflow checks returned `false` at 1440, 390, and 320 px. No Vite overlay or browser error entry was present.
- Reduced-motion emulation returned `matchMedia(...reduce) = true`, zero running animations, and no overflow. The method remains fully readable and construction states change without transition.
