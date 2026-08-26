# A-Modul Direct V2 — design system

## Direction

The interface is an engineering dossier rather than a catalogue template: asymmetric 14-column compositions, large editorial type, hard section boundaries, technical rails, and one controlled magenta conversion signal. Generated architecture remains dominant; UI decoration never impersonates project documentation.

## Typography

- Geologica 500: H1–H3 and high-level conclusions.
- Onest 400/600: body copy, forms, buttons, and explanatory text.
- IBM Plex Mono 500: eyebrows, stages, status labels, measurements, and navigation metadata.
- Inter is not used.

Fonts are bundled locally through Fontsource. Browser synthesis is disabled.

## Colour tokens

| Token | Value | Use |
|---|---:|---|
| graphite | `#17161a` | primary dark field |
| warm | `#f3f0e8` | light field and primary light text |
| warm-muted | `#d9d3db` | secondary dark-field copy |
| purple | `#492d7d` | evidence and selected technical states |
| magenta | `#c60a3c` | primary diagnosis CTA |
| pink-accessible | `#ff4d7e` | small dark-field signals |
| technical | `#a8e1d4` | engineering conclusion and focus support |

Light-field error text uses `#a30732`; global focus uses a three-pixel white outline with a graphite separation ring. Selected states always include a non-colour marker (`aria-pressed`, checkbox/radio state, text, border, or inset ring).

## Layout and responsive rules

- Desktop: 14-column hero and asymmetric chapter grids.
- Tablet/mobile: core copy returns to normal document flow; no H1 or CTA magic positioning.
- Required widths: 320, 360, 375, 390, 430, 768, 1024, 1440, and 1920.
- No minimum body width, negative-margin overflow concealment, horizontal scroll dependency, or sticky control over form fields.
- Primary targets are at least 44×44 CSS pixels.
- Images use explicit intrinsic dimensions; mobile and desktop AVIF/WebP sources are selected in `<picture>`.

## Components

- Primary CTA always advances to diagnosis or the full project application.
- Cards are used only where the information model requires discrete evidence, stages, or choices; long chapters use rails, matrices, plans, or split editorial compositions.
- Case visuals include an image-local disclosure and are never described as customer photography.
- Forms retain entered data and attachments after every non-success response.

The implementation source of truth is `apps/a-modul/src/app.css` and the Svelte components; this document describes the shipped system rather than introducing a second token package.
