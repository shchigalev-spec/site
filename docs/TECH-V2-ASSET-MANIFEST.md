# Tech V2 asset manifest

All files below are exclusive to `apps/tech`. Engineering assets are not imported or modified. PNG files are retained as generation/edit masters and fallbacks; production `<picture>` elements select AVIF or WebP where supported.

| Family | Master files | Rendered role | Production variants |
|---|---|---|---|
| Hero | `tech-v2-hero-clean.png`, `tech-v2-hero-cutaway.png` | locked H1 diagnostic scroll story | AVIF, WebP, mobile WebP/AVIF, depth and surface masks |
| Path lab | `tech-v2-apartment-xray-base.png` | clean apartment plate under live candidate/selected routes | AVIF, WebP, `-960.webp` |
| Renovation | `tech-v2-stage-newbuild.png`, `tech-v2-stage-renovation.png`, `tech-v2-stage-finished.png` | one-room construction continuity | AVIF, WebP, `-960.webp`, mobile frame family |
| Surface services | `tech-v2-service-wall.png`, `tech-v2-service-ceiling.png`, `tech-v2-service-floor.png` | distinct wall/ceiling/floor page plates | AVIF, WebP, `-960.webp` |
| Quality | `tech-v2-quality-control.png` | finite hidden-work/control sequence | AVIF, WebP, `-960.webp` |
| Cases | `tech-case-58-39.png`, `tech-case-impact-16.png`, `tech-case-64-43.png` | illustrative measured-case backgrounds | WebP and `-960.webp` |
| Conversion | `tech-final-quiet.png` | calm final diagnostic invitation | WebP and `-960.webp` |
| Diagnosis/OG | `tech-diagnosis.png`, `tech-og.png` | diagnosis route and social preview | existing responsive derivatives where present |

## Runtime rules

- Desktop hero starts with one AVIF clean plate; the cutaway is inserted only after progress exceeds 0.12.
- Lower images use lazy loading and deferred component boundaries.
- A single traversal never downloads two formats for the same stem (`duplicateFormats: []` in Slice 08).
- Case imagery is visibly labelled as illustrative, not customer photography.
- Raster plates contain no embedded text, paths, waveforms, charts, arrows, measurements or fake UI.

The generated mobile masters are actual `1024×941` derivatives of the locked source plates; they are not described as separately photographed portrait scenes. Responsive cropping is controlled in CSS.
