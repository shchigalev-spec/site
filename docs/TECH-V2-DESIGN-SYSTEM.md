# Tech V2 design system

Tech V2 uses the internal direction “Acoustic Observatory” while the only public brand remains “Лаборатория тишины”.

## Type

- Geologica: display conclusions and measured values.
- Onest: body copy, labels, forms, and navigation.
- IBM Plex Mono: short route, checkpoint, state, and measurement identifiers.
- Inter is not loaded or permitted.

## Colour roles

- Graphite (`--tech-v2-ink*`) is the diagnostic field.
- Warm paper (`--tech-v2-paper*`) is used for pauses and engineering explanation.
- Coral (`--tech-v2-coral`) marks symptoms, energy, and primary diagnosis actions.
- Acoustic teal (`--tech-v2-teal`) marks measured or selected paths.
- Amber is reserved for uncertainty and limitations.
- Blue-purple light, decorative neon, and generic glow gradients are excluded.

## Spatial rules

- Desktop uses an editorial 16-column field and one dominant object per chapter.
- Tablet resolves to eight columns; mobile is a separate four-column composition.
- Major chapters use `--tech-v2-section-y`; supporting transitions use the compact token.
- A card is not the default container. Controls may be bounded; scenes and diagrams remain spatial objects.
- Core mobile copy stays in normal flow and controls are at least 44×44 px.

## Texture and imagery

Raster plates are clean architecture only. Text, routes, waveforms, arrows, measurements, and interface chrome are rendered in code. Residential material cues are oak, textured plaster, matte stone, linen, and restrained graphite metal under warm practical light.

## Implementation

The production tokens live in `apps/tech/src/lib/styles/v2-tokens.css` and are imported only by the Tech application. Motion durations share the same file so visual and interaction timing use one source of truth.

## Page families and loading

- Homepage chapters after the proof strip are real dynamic component boundaries hosted by `DeferredChapter.svelte`.
- Placeholder heights preserve the chapter rhythm until the component enters the configured observer margin.
- Surface service pages use a construction-led light-paper family; situation pages use a dark decision-led family; diagnosis has a separate four-stage opening and progressive form.
- Homepage SSR removes only the deferred chapter stylesheets. Each dynamic component loads its own CSS before becoming visible.
- The hero and above-fold shell are never deferred. The cutaway plate is requested only after the scroll story has begun.
