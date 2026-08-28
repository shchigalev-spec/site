CONDITIONAL PASS

# Milestone D — Visual + Motion Director

Independent read-only review completed.

Severity counts:

- P0: 0
- P1: 0
- P2: 2
- P3: 2

This report is not eligible for the Milestone D aggregate PASS because one unresolved P2 materially reduces mobile release quality.

## P2 — Generated hero visuals remain entirely below the initial mobile/tablet viewport

Location:

- General hero responsive stack in `apps/a-modul/src/app.css`
- Route hero responsive stack in `apps/a-modul/src/app.css`
- All four primary routes

Production evidence from `http://127.0.0.1:4175`:

- At 390×844, the visual starts at:
  - general: y=913.7
  - shift camp: y=869.5
  - Office/ABK: y=859.7
  - dormitory: y=869.5
- At 320×568, the visual starts at:
  - general: y=715.1
  - shift camp: y=775.5
  - Office/ABK: y=750.6
  - dormitory: y=770.6
- At 768×1024, every visual starts at y=1025.

The H1, support, CTA, qualification and region context are clear and contained, but the complete first screen is effectively a dark typographic panel. The generated architectural system—the release candidate’s main differentiator and required mobile hero—contributes nothing before scrolling. This is the same retained Milestone A/B P2 and now materially limits final mobile polish.

Required correction:

Expose a recognizable, art-directed portion of the appropriate generated hero within the initial 320, 390 and 768 viewport while preserving normal-flow copy, CTA visibility, the one-day qualifier and zero overflow. A restrained image band or image-backed composition is acceptable; do not reduce the architecture to an indistinct texture.

Retest:

Fresh production screenshots at 320×568, 390×844 and 768×1024 for all four routes. The relevant object must be recognizable without scrolling, and the required CTA content must remain visible.

## P2 — Final D evidence does not independently prove normal-motion start/middle/end states

Location:

- `reviews/a-modul-v2/milestone-d/start.png`
- `mid.png`
- `end.png`
- `diff-start-end.png`
- `playwright-trace.zip`
- `conversion-trace.zip`

The named start/mid/end and diff images prove full-form untouched, validation and success states—not motion. The release trace covers route/responsive checks; the conversion trace selects the final BIM stage directly but does not capture the timed hero or BIM playback through start, middle and stable conclusion. `reduced-motion.png` correctly proves the static fallback, but it cannot substitute for normal-motion evidence.

I independently exercised the live sequences, so this is not an observed runtime failure. It is an incomplete final motion-evidence package.

Required correction:

Capture fresh Milestone D-only frames for hero and BIM start, meaningful middle and stable end states, plus a fresh diff and a trace containing user-triggered playback. Retain the existing form-state evidence under descriptive filenames. Do not use video or copy earlier milestone screenshots.

## P3 — File attachment control breaks the otherwise polished Russian interface

In the final form evidence, the browser-native control displays `Choose Files / No file chosen`. It visually reads as an unstyled English system control inside an otherwise tightly art-directed Russian interface.

Recommended correction:

Use a localized visible trigger and live Russian filename/count text while retaining an accessible native file input.

## P3 — Logistics timing documentation does not match the rendered motion

`docs/A-MODUL-MOTION-SPEC.md` describes a 450 ms route draw. The actual `.map__route` animation in `app.css` lasts 1.2 seconds; 450 ms is only the analytics completion delay. Align the document with the implementation or intentionally align both timings.

## Confirmed strengths

I inspected the production build and mock-integrated app, all four complete desktop routes, full general-route mobile evidence, generated masters and derivatives, image bible/prompts/manifest, design and motion specifications, prior reports/backlog, D traces, QA metadata and live interactions.

Confirmed:

- Strong industrial editorial hierarchy, asymmetric composition and disciplined graphite/warm-white/purple/magenta system.
- Geologica, Onest and IBM Plex Mono are correctly used; no Inter or video is shipped.
- Generated general, Kamchatka, dormitory, office/ABK and factory assets are coherent, credible architectural CGI with appropriate disclosures.
- Route-specific desktop heroes are distinct and commercially legible.
- Hero playback progresses 0→1→2→3 at readable intervals, stops at stage 3 and does not loop.
- BIM progresses through all seven stages, stops at the final object and remains interruptible.
- Direct stage selection cancels playback and holds the chosen state.
- Reduced motion opens at hero stage 3 and BIM stage 6, collapses transition/animation duration to 0.01 ms and retains textual conclusions.
- The logistics route is absent while its section is offscreen, renders only near the viewport, and resolves immediately under reduced motion.
- No decorative loop, scroll hijacking, generic fade-up system, broken generated asset, visual overflow or runtime console defect was observed.
- Desktop and long-page chapter sequencing avoid a generic equal-card landing-page appearance.

Final decision: `CONDITIONAL PASS`. Re-review the Visual + Motion role after the mobile hero and final motion-evidence P2 findings are corrected.
