# Slice 02 interaction notes

## Delivered interaction

The former symptom selector and separate transmission section are replaced by one chapter. Desktop uses a vertical six-state index, a true SVG architectural section, and a stable conclusion/diagnosis column. Mobile exposes all six controls as a two-column index, plus explicit previous/next buttons and a visible `n / 6` position.

Each state defines the perceived source, noise type, three candidate paths, a solid likely path, three inspection checkpoints, likely inspection zones, a plain-language conclusion, and diagnosis context. The scene contains semantic identifiers for wall, ceiling slab, floor slab, junction, socket, ventilation, façade opening, and structural core.

## Finite transition evidence

- `transition-retract.png`: the previous route retracts/fades during the first 210 ms.
- `transition-draw.png`: the next source is active; dashed candidates are drawing and the solid route has begun.
- State motion finishes before the 950 ms hold boundary; `aria-busy` remains true until that boundary. A live post-transition check found zero running animations.
- A fresh same-process timing probe measured `busy=true / running=0` at 900 ms and `busy=false / running=0` at 960 ms.
- There is no auto-cycle, infinite waveform, or route pulse.

## Browser checks

- Every final state was exercised and captured: impact, voices, bass, lift/vibration, street, and ventilation.
- `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, and `End` all move focus and selection with a roving `tabindex`; wrap-around was verified.
- The tab panel is labelled by the selected tab and clears `aria-busy` after the finite transition.
- Mobile previous/next moved `1 / 6 → 2 / 6 → 1 / 6`; all six 320 px controls are 58 px high and the page has no horizontal overflow.
- Selection persists in `sessionStorage`, the homepage URL, the preliminary scenario, and the diagnosis CTA query. The CTA always targets `/diagnostika-shuma/`.
- In reduced motion, selecting another state commits immediately, all candidate/selected routes and checkpoints are visible, `aria-busy=false`, and zero animations remain running.
- Fresh component-scoped axe checks report zero violations. The browser console contains only Vite connection diagnostics; page errors and overflow are absent.
