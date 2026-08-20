# Engineering V2 design system

The implemented token source is `apps/engineering/src/v2-tokens.css`.

## Direction

Engineering V2 balances architectural calm, engineering evidence, and one diagnostic interaction. Layouts use long editorial rules, asymmetric fields, measured white space, live vector annotation, and restrained photography. Repeated equal-card grids are not a primary page grammar.

## Type

- Display: Geologica.
- Body and controls: Onest.
- Data, labels, and annotations: IBM Plex Mono.
- Inter is prohibited.

## Colour

- Warm paper and plaster backgrounds carry the residential layer.
- Near-black ink carries the primary hierarchy.
- Muted teal-grey identifies candidate routes and measurement structure.
- Brick/coral identifies a selected route, active control, warning, and primary action.
- State is never communicated by colour alone.

## Motion tokens

- Micro response: 160 ms.
- Control state: 260 ms.
- Route drawing: 820 ms.
- Mask/cutaway: 780 ms.
- Page transition: 380 ms.
- Calm easing: `cubic-bezier(0.22, 1, 0.36, 1)`.

All explanatory motion is finite. Reduced-motion layouts render their complete conclusion without sticky dead space.
