# QUIET / ENGINEERING — Final Visual Supervisor Scorecard

**Result: PASS**  
**Score: 94 / 100**  
**Hard blockers: none**

Reviewed evidence:

- `desktop-1440.png`
- `desktop-1920.png`
- `tablet-1024.png`
- `mobile-390.png`
- `mobile-375.png`
- `hero-start.png`
- `hero-mid.png`
- `hero-end.png`
- `reduced-motion.png`
- current `apps/engineering` interaction, responsive and reduced-motion implementation
- latest browser review: PASS

The large paper field visible after the hero in full-page captures is the capture footprint of the `182svh` sticky scroll scene. During normal scrolling the hero remains pinned and changes state; it is not an empty visitor-facing section.

## Scoring

| Category | Score | Assessment |
|---|---:|---|
| Architectural composition and whitespace | 24 / 25 | The hero is a single asymmetric architectural field, not a two-column template. Section geometry changes deliberately: index, unequal renovation spreads, full drawing, dark datum, material detail, three report formats and engineering sheet. Whitespace isolates evidence and is generally purposeful. |
| Engineering credibility and information design | 18 / 20 | The transmission route, competing hypotheses, layer roles, rigid bridge, inspection rail and six-step method explain mechanisms rather than decorating the page. Labels remain honest and avoid fabricated dimensions. Some diagrams are intentionally simplified and should not be mistaken for project drawings. |
| Typography and editorial hierarchy | 14 / 15 | Geologica creates a strong conclusion-led hierarchy; Onest body copy and mono dimensions form a coherent publication system. Oversized headings, marginal labels and rules remain stable from 1920px to 375px. A few mobile technical captions and form qualifiers are optically small/dense. |
| Generated-image quality and consistency | 14 / 15 | The warm plaster/oak/limestone family is consistent, believable and exclusive to the concept. Hero, renovation stages, junction work, cases and consultation image have useful negative space and editorial crops. No obvious impossible architecture, synthetic spokesperson or embedded fake interface is visible. |
| Precise, restrained motion and reduced motion | 10 / 10 | `hero-start`, `hero-mid` and `hero-end` confirm a finite room → measured cutaway → selected path sequence and a clean unpin into the evidence band. The mid-state keeps headline, CTA, measurement plane and route legible without cyber effects. `reduced-motion.png` confirms the final explanatory state is available immediately without sticky interpolation or missing content. Latest live browser review is PASS. |
| Core message and conversion clarity | 9 / 10 | The diagnosis-first promise is understood immediately; brick CTAs consistently lead to diagnosis. The scenario explicitly refuses fake price precision, cases separate facts from unknowns, and the form explains the manager contact and on-site diagnosis. The long homepage form is clear but creates a high-commitment final step. |
| Responsive, accessibility and technical quality | 5 / 5 | Both mobile widths preserve hero, path, construction detail, cases, scenario and full form with no visible horizontal overflow. Focus styling, skip link, form labels, file validation, FAQ state, image alternatives and menu focus trap are implemented. Minor tab semantics issues are recorded below but do not make content inaccessible. |

## Viewport findings

### Desktop 1440 and 1920

- Hero hierarchy is immediate: brand, diagnosis statement, supporting copy and brick CTA form one controlled diagonal composition.
- The evidence band reads as one continuous editorial rule, not four cards.
- Renovation stages have three genuinely different geometries and produce the strongest irregular rhythm on the page.
- The large route drawing, dark process datum and light construction detail are visually distinct chapters with no dashboard language.
- Three cases use vertical datum, peak trace and horizontal bands rather than a repeated card component.
- Scenario and application read as working documents; the form remains subordinate to the diagnosis narrative.

### Tablet 1024

- Eight-column compression preserves asymmetry and adequate image scale.
- Route and material annotations remain associated with their subjects.
- The method timeline and application sheet remain legible without adopting desktop-only overlaps.
- Some captions and tertiary copy approach the lower practical size limit, but no information is visibly clipped.

### Mobile 390 and 375

- The layout becomes a staggered vertical essay rather than a stack of equal cards.
- Hero promise and CTA remain above the long-form journey; the signature image/cutaway surface is preserved.
- All six noise states remain visible, and the active route/inspection conclusion appears before the controls.
- Renovation imagery uses deliberately different proportions and maintains story order.
- Case values, scenario inputs, FAQ and diagnostic form survive without horizontal overflow.
- The hero's supporting copy, CTA and conclusion occupy a dense lower zone; verify the 50–85% scroll states for collision in live motion.

## Blockers

None. No hard-fail condition from the Engineering art direction is visible in the supplied evidence or current implementation.

## Non-blocking revisions

1. Give the transmission-path button group complete tab semantics: each button should expose `role="tab"`, `aria-selected`, roving `tabindex`, arrow-key movement and an associated tab panel.
2. Add arrow-key/roving-tabindex behaviour to the wall/ceiling/floor layer tabs; they currently remain reachable by ordinary Tab and click.
3. Keep a mobile mid-state motion frame in future regression captures; the current browser review passes, but the dedicated start/mid/end delta evidence is desktop-sized.

## Acceptance conclusion

QUIET / ENGINEERING reads as a premium acoustic engineering publication, not a generic architecture portfolio and not a recoloured high-tech site. It scores 94/100, exceeds the 92-point Engineering PASS threshold and has no hard blocker. New evidence closes the motion and reduced-motion verification gap; remaining work is limited to two tab-pattern semantics refinements.
