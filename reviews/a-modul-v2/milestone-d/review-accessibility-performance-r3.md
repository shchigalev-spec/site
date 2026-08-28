CONDITIONAL PASS

Severity counts:

- P0: 0
- P1: 0
- P2: 2
- P3: 0

## P2 — Mobile responsive sources publish the desktop intrinsic ratio

Location:

- `apps/a-modul/src/lib/components/RouteHero.svelte:13-16`
- `apps/a-modul/src/lib/components/HeroAssembly.svelte:75-92`
- The same pattern exists in `BimSequence.svelte:103-106`, `FactorySequence.svelte:46-49`, `LogisticsMap.svelte:95-98`, `RouteVisualSequence.svelte:34-37`, `ProjectFinder.svelte:101-104`, `ProofCase.svelte:8-11`, and `RouteLanding.svelte:87`.

Evidence:

- All 81 shipped `*-mobile.avif/webp` derivatives are 720×900.
- At 320/390 px, live images report `naturalWidth=720`, `naturalHeight=900`, while their `<img>` fallback declares `width="1600" height="900"`.
- Mobile `<source>` elements provide no corrective width/height, so selected 4:5 crops inherit a declared 16:9 intrinsic ratio.
- Current CSS containers prevent visible CLS; measured CLS remains approximately 0.001. The metadata is nevertheless incorrect.

Requirement violated:

- Master specification §34 requires responsive mobile/desktop crops with correct intrinsic dimensions.

Required correction:

- Publish 720×900 dimensions for mobile `<source>` candidates and 1600×900 for desktop candidates, or use an equivalent responsive-picture implementation that exposes the selected source’s correct ratio.

Retest:

- At 320, 390, 768, and 1440 px, compare the selected source ratio with its declared intrinsic ratio for every rendered generated image.
- Recheck CLS and image containment.

## P2 — General mobile eagerly downloads all inactive assembly plates

Location:

- `apps/a-modul/src/lib/components/HeroAssembly.svelte:75-92`
- `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte:55`
- `apps/a-modul/src/app.css:622`

Evidence from an independent 390×844 production run at `scrollY=0`:

- `.hero__visual` began at 913.7 px, below the 844 px viewport.
- The intended first-screen preload downloaded `a-modul-general-hero-operational-object-first-screen-mobile.avif` — 16,473 transferred bytes.
- The browser also immediately downloaded all three inactive/full assembly plates:
  - empty site — 70,057 bytes;
  - partial settlement — 69,465 bytes;
  - operational object — 64,281 bytes.
- The sequence is user-controlled and has not started at this point.
- Independent CPU×4/4G corroboration still passed the primary targets: LCP 1,724 ms and CLS 0.0010.

Requirement violated:

- Master specification §34 requires below-fold media to be lazy.
- `docs/A-MODUL-MOTION-SPEC.md` states that only the current above-the-fold hero plate is eager.

Required correction:

- Keep the lightweight mobile first-screen anchor eager.
- Defer inactive assembly plates until the assembly approaches the viewport or the buyer starts/selects a stage.
- On desktop, eagerly load only the currently visible stage; avoid blank transitions when a new stage is requested.

Retest:

- Capture the generated-image request list at mobile `scrollY=0`; only the first-screen anchor should load.
- Approach the assembly and activate stages 0→2→3, confirming deferred requests, no blank state, correct transitions, and unchanged LCP/CLS.

## Independently confirmed passing areas

- Completely reviewed both authoritative specifications, Milestone D evidence/results, R2 report, design/motion/integration documents, command log, current source, and generated-asset inventory.
- All four production routes passed live at 320, 390, 768, and 1440 px: HTTP 200, one visible H1, visible primary CTA, exact `scrollWidth === clientWidth`, complete images, no broken assets, no unlabeled controls, no undersized required targets, and no unexpected console/page/network defects.
- All four dev routes also returned 200 with their route-specific H1 and no runtime defects.
- File picker R2 correction passes:
  - AX role `button`;
  - exact accessible name `Исходные файлы — Выбрать файлы`;
  - pointer chooser activation;
  - Enter-key chooser activation;
  - visible 3 px focus outline;
  - polite live announcement of the selected filename;
  - status, note, and error remain associated through `aria-describedby`.
- Skip link becomes visible, targets `main`, and transfers focus correctly.
- Mobile menu traps forward/reverse Tab, closes on Escape, and returns focus to its toggle.
- Empty standard/leasing forms focus `objectType`; tender focuses `company`. Smooth focus scrolling finishes with the field visibly centred on mobile.
- Risk, factory, and route visual tabs support Arrow/Home/End navigation with synchronized selected tab, panel label, focus, and visual state.
- Logistics controls expose pressed state and update the textual route/mode result.
- Normal Hero and BIM sequences pause offscreen and hold their current stage.
- Reduced motion exposes stable Hero stage 3 and BIM stage 6, disables smooth scrolling, and limits computed animation/transition duration to 0.01 ms.
- Production submission returns controlled `503`, `Cache-Control: no-store`, preserves entered contact data, and shows no fake success.
- Independent API checks confirmed structured `422` standard/tender validation and a JSON `413` response for a 46 MiB multipart request. A valid dev multipart submission with a PDF returned confirmed `201`.
- Supplied three-run mobile-4G evidence passes: median LCP 1,196 ms, CLS 0.0010, FCP 1,044 ms, TTFB 9.7 ms, TBT 42 ms. Independent CPU×4 corroboration also kept LCP and CLS within target.
- `changed-files.txt` has no missing path. Its only two extra paths are the anticipated R3 director reports.
- No tracked or untracked change exists under `apps/tech` or `apps/engineering`.
- No video or animated GIF is shipped.

Methodology limitation: Chrome DevTools MCP and physical-device field data were unavailable. Performance was assessed using the production build in Chromium with CDP network/CPU controls, PerformanceObserver data, raw supplied trials, live DOM/AX inspection, and the trace/evidence package.
