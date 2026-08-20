# Tech V2 motion specification

Every meaningful scene follows one finite grammar:

`symptom → uncertainty → measurement → candidate routes → selected route → construction response → controlled result`

## Timing tokens

- micro response: 150 ms;
- control transition: 280 ms;
- signal decay: 360 ms;
- route drawing: 880 ms;
- cutaway: 900 ms;
- construction separation: 820 ms;
- scene transition: 1000 ms;
- page transition: 380 ms.

The live values are defined in `apps/tech/src/lib/styles/v2-tokens.css`. Motion uses calm non-elastic easings and must reach a stable end state.

## Scene rules

- Hero and renovation are the only major pinned scenes.
- Hero scroll progress is continuous and never changes the locked H1.
- A scan crosses the room once per forward timeline.
- Candidate routes draw once, settle, and remain legible.
- Construction layers separate only far enough to explain their relationship.
- Case graphs animate once on first intersection and then stop.
- Controls never auto-cycle.
- Off-screen motion is paused or absent.

## Reduced motion

Reduced motion removes sticky footprints and renders each scene's complete explanatory conclusion immediately. H1, path legend, selected route, construction principles, measured values, and CTAs remain present. No meaning depends on an animation event.

## Analytics boundaries

Finite sequences emit completion events once: `hero_motion_start`, `hero_motion_complete`, `route_animation_complete`, `construction_sequence_complete`, and `renovation_sequence_complete`. Reversing or resizing a timeline must not duplicate a completion event in the same page session.

## Runtime discipline

- Below-fold story chapters are dynamically imported through IntersectionObserver rather than animated while absent.
- Renovation mobile uses three explicit static frames; the desktop continuity scene uses one pinned, finite three-state reveal.
- Evidence graphs start only on first intersection and store a complete terminal state.
- The mobile sticky CTA is suppressed while the menu, scenario, or diagnostic form is active and is removed after route navigation.
- Slice 08 traversal evidence finishes with no off-screen running animations and a maximum normal-interaction task of 74 ms.
