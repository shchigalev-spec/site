# A-Modul Direct V2 — motion specification

## Principles

Motion explains state change and ends in a stable conclusion. It does not loop automatically, conceal information, or replace textual meaning.

## Shipped sequences

- Hero assembly: four buyer-controlled stages, 1.6 seconds per automated step, explicit start/stop, stable operational-object conclusion.
- BIM-to-object: seven buyer-controlled stages, 1.6 seconds per automated step, explicit start/stop, stable final object state.
- Logistics: one 1.2-second CSS route draw after a region choice; the corresponding completion analytics event is emitted after a 450 ms finite delay. Initial route animation is deferred until the chapter approaches the viewport.
- Risk and factory chapters: direct tab changes with keyboard arrow/Home/End support and persistent textual conclusions.
- Ordinary UI transitions: approximately 350 ms or shorter and limited to opacity/visual state.

Timers are cancelled on replay, unmount, and when a user-started hero or BIM sequence leaves its viewport. The current stage remains stable; returning to the chapter does not resume automatically, and pressing play restarts from stage one. Hero and BIM sequences do not autoplay. All BIM plates are lazy; only the current above-the-fold hero plate is eager.

## Reduced motion

At `prefers-reduced-motion: reduce`:

- smooth scrolling is disabled;
- CSS transition and animation duration collapses to 0.01 ms with one iteration;
- hero assembly and BIM render their complete final state;
- logistics resolves without the 450 ms delay;
- every conclusion remains available as ordinary text.

The browser suite verifies the reduced-motion initial state and computed timing values. No video, animated GIF, WebGL loop, or ambient background animation is shipped.
