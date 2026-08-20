# Engineering V2 image briefs

The V2 raster set is exclusive to `apps/engineering`. It must not be moved into or shared with `apps/tech`. These are reproducible briefs for the implemented images, not claims about real customer properties.

## Shared visual constraints

- Quiet contemporary Moscow apartment; warm mineral plaster, restrained timber and stone, soft overcast daylight.
- Architectural editorial photography, realistic materials, calm neutral grade, no people, no text, no logos, no measurement graphics.
- Leave usable negative space for HTML copy and SVG annotations.
- Case images are illustrative. They must never be described as documentary customer photography.

## Hero family

- `engineering-v2-hero-clean.png`: wide living room, fixed camera, large pale wall on the left and residential interior on the right; clean construction.
- `engineering-v2-hero-cutaway.png`: exact same camera and geometry; a local wall/ceiling/floor junction is opened to reveal layers without turning the whole room into a technical render.
- `engineering-v2-hero-mobile-clean.png`: portrait art direction of the same visual language, large calm upper field and legible room junction.
- `engineering-v2-hero-mobile-cutaway.png`: portrait counterpart with the same camera as its clean plate and a local cutaway aligned to the interface mask.
- `engineering-v2-hero-depth.png` and `engineering-v2-og.png` are deterministic derivatives made by `scripts/process-engineering-v2-assets.mjs`.

## Renovation family

- `engineering-v2-stage-newbuild.png`: empty new-build room, exposed mineral surfaces and readable wall/ceiling/floor junctions.
- `engineering-v2-stage-renovation.png`: the same room, camera, windows, perspective, and aperture while work is in progress and hidden junctions remain accessible.
- `engineering-v2-stage-finished.png`: the same fixed scene as a completed calm interior; no geometry or camera drift.

## Case and conversion family

- `engineering-v2-case-primary.png`: quiet bedroom-like interior with enough dark/neutral field for the dominant 58 dB → 39 dB report layout.
- `engineering-v2-case-secondary-a.png`: distinct warm interior for the measured peak reduction case; no embedded numbers or graph.
- `engineering-v2-case-secondary-b.png`: distinct finished interior for the 64 dB → 43 dB case; no embedded numbers or graph.
- `engineering-v2-final-diagnosis.png`: calm residential detail suitable for a diagnosis invitation, without a staged engineer or invented equipment.

The interface adds all labels, routes, checkpoints, decibel values, and disclaimers as live HTML/SVG.
