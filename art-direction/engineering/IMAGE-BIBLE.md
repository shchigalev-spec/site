# QUIET / ENGINEERING — Image Bible

## 0. Image mandate

The Engineering image set is an independent, clean-room visual world. It must not reuse, imitate, recolour or crop any asset from another concept or existing site. All primary visuals are generated specifically for QUIET / ENGINEERING and stored locally. No stock images, competitor references or external image hotlinks.

Images communicate two things:

1. the residential outcome is calm, believable and worth protecting;
2. the engineering work exists inside real surfaces, junctions and renovation constraints.

The image itself carries architecture, material and light. All brand text, dimensions, dB values, UI, graph lines and technical labels are rendered separately in HTML/SVG/Canvas.

## 1. Visual DNA

### 1.1 Style anchor

The anchor is a high-end editorial architectural photograph of a believable contemporary Moscow apartment in warm daylight. Its signature traits:

- limestone and warm lime-plaster palette;
- natural oak, honed stone, wool and linen;
- soft overcast daylight plus restrained practical warmth;
- calm negative space occupying 35–50% of the composition;
- one strong real architectural boundary suitable for a cutaway overlay;
- lived-in but not styled as a luxury showroom;
- no person in the hero;
- moderate camera height (approximately eye level), rectilinear lens, plausible verticals;
- gentle filmic roll-off, low saturation, natural microtexture;
- quiet confidence, no cinematic darkness and no glossy spectacle.

The anchor is approved only when the room remains believable at full resolution, the negative space accepts large Russian typography, and the selected wall/ceiling/floor boundary can support SVG measurements without covering furniture.

### 1.2 Reference adjectives

Use: editorial, architectural, restrained, tactile, daylight, inhabited, precise, quiet, warm, credible, premium.

Reject: palatial, futuristic, glossy, dramatic, opulent, surreal, cyber, staged, showroom, hotel-lobby, ultra-luxury.

### 1.3 Material continuity

Across the set, repeat a restrained material family rather than the same room:

- lime plaster: warm mineral off-white, subtle trowel variation;
- oak: matte, medium-light, natural grain, never orange;
- stone: honed limestone/travertine character, low contrast;
- fabric: oatmeal, grey-green or charcoal wool/linen;
- metal: darkened bronze or graphite in small amounts;
- construction layers: realistic mineral/fibrous/board-like textures without branded products.

Do not repeat the same sofa, pendant, vase or exact furniture arrangement across unrelated assets. Continuity should come from light and material, not duplicate objects.

### 1.4 Lighting continuity

- Key: large window daylight, soft and directional.
- Colour: neutral-warm, no strong orange cast.
- Contrast: low to medium; retain detail in plaster and shadow.
- Practical lights: optional, subtle, never the dominant glow.
- Avoid sunset beams, deep blue shadows, volumetric haze and nightclub contrast.

## 2. Camera and composition rules

- Use rectilinear architectural perspective with straight verticals.
- Preferred full-frame equivalent: 28–40mm for rooms; 50–85mm for details.
- Camera height: 1.3–1.6m for rooms, orthographic/axonometric for technical CGI.
- Do not create impossible wide-angle rooms, duplicated doors or disconnected openings.
- One image = one compositional conclusion. Avoid collage inside generated pixels.
- Provide clean edges around any region that will receive a line drawing.
- Keep important content inside a 6% crop-safe area; hero headline safety zone is defined per asset below.
- People, when necessary, appear in side/rear view and are secondary to the space. Hands and instruments must be plausible.
- No shallow depth of field for wide architecture. Detail assets may use moderate depth only when the junction remains readable.

## 3. Generation workflow and approval gate

1. Generate 4 anchor candidates from the anchor prompt.
2. Inspect each at full resolution for geometry, furniture, openings, light and usable negative space.
3. Select or regenerate until one candidate passes every item in Section 11.
4. Lock an anchor reference and a short continuity note: plaster temperature, oak value, daylight direction, contrast and grain.
5. Generate at least 3 candidates for hero room, hero cutaway, each case visual and final consultation visual.
6. Generate 2 candidates for each supporting stage/detail image.
7. Inspect at 100% and at intended mobile crop.
8. Reject defects; do not repair major architectural errors with cropping.
9. Export master plus responsive variants; keep source generation outside public delivery where appropriate.
10. Record final prompt, source, crop, path, dimensions, usage, alt text and “illustrative” status in central asset documentation.

Generated case visuals are always illustrative visualisations, never documentary customer photography.

## 4. Prompt construction

All production prompts are written in English. Use this grammar:

> `[asset purpose and scene], [credible apartment/technical subject], [materials], [lighting], [camera and composition], [negative-space or overlay requirement], high-end editorial architectural photography or clean architectural CGI, plausible construction and perspective, restrained warm neutral grade, no text, no logos`

Shared negative clause:

> `No embedded text, no letters, no numbers, no logos, no watermark, no visible brand, no fake UI, no people facing camera, no luxury cliches, no glossy marble palace, no blue-purple light, no neon, no extreme wide angle, no fisheye, no bent verticals, no impossible openings, no duplicated furniture, no surreal objects, no malformed tools, no branded materials.`

Technical images add:

> `No baked-in dimensions or labels; leave clear surfaces and margin space for SVG annotations added later.`

The full final prompt must be stored exactly as used in the central prompt log. This bible defines intent and seed prompts, not a substitute for that record.

## 5. Required asset set

Recommended naming prefix: `eng-`. Do not share filenames or sources with another concept.

### ENG-01 — Style anchor interior

- **Purpose:** approve material, light and editorial tone before batch production.
- **Aspect/master:** 3:2, minimum 2400×1600.
- **Composition:** calm living room, window light from left, broad plaster wall/ceiling negative space in upper-left 40%, grounded furniture in lower-right.
- **Seed prompt:**

  > `A believable contemporary premium Moscow apartment living room designed with quiet restraint, warm lime plaster walls, matte natural oak, honed limestone, oatmeal linen and subdued grey-green wool, soft overcast daylight entering from the left, rectilinear 32mm architectural camera at eye level, straight verticals, broad uncluttered negative space across the upper-left wall and ceiling, lived-in but minimal, tactile natural imperfections, high-end editorial architectural photography, restrained warm neutral color grade, plausible room geometry and furniture, no text, no logos.`

- **Approval:** must work as a visual reference even if never shipped.

### ENG-02 — Hero room

- **Purpose:** full-bleed asymmetrical hero and scroll cutaway base.
- **Aspect/master:** 16:10 or 8:5, minimum 2880×1800.
- **Crop variants:** desktop 16:10; tablet 4:5; mobile 4:5 or 3:4 derived from a separately generated candidate if crop destroys composition.
- **Safe zones:** upper-left/centre for H1; lower-right architectural surface for route; lower-middle furniture kept visually quiet.
- **Seed prompt:**

  > `A spacious calm contemporary apartment interior in Moscow, warm mineral plaster, natural oak, honed light stone and tactile linen, realistic high-end residential design without ostentation, soft northern daylight, asymmetrical architectural composition with a large quiet plaster plane extending across the upper-left and a clearly readable wall-to-ceiling junction on the right, furnishings grounded low in frame, rectilinear 30mm lens, eye-level camera, straight verticals, natural editorial detail, high-end architecture magazine photography, plausible construction, no text, no logos.`

- **Alt direction:** `Спокойный интерьер квартиры с открытым участком стены и потолка для схемы пути передачи шума.`

### ENG-03 — Hero local cutaway

- **Purpose:** pair with ENG-02 under a geometric mask; show underlying sectional logic.
- **Aspect/master:** identical view/framing to hero, minimum 2880×1800.
- **Method:** image edit/reference-guided generation from approved ENG-02 so perspective and room geometry remain locked.
- **Seed edit prompt:**

  > `Keep the exact camera, room geometry, furniture, lighting and color of the reference. Reveal only the designated wall-ceiling-floor boundary as a clean plausible architectural cutaway with restrained generic construction layers and visible junction logic. The rest remains the same finished interior. No labels, no dimensions, no text, no brands, no exploded floating pieces, no impossible structure. Clean high-end architectural CGI integrated into editorial photography.`

- **Approval:** pixel alignment at the mask boundary; unchanged furniture and openings.

### ENG-04 — Wall junction detail

- **Purpose:** explain mass, decoupling, sealing and a potential rigid bridge.
- **Aspect/master:** 4:5, minimum 2000×2500.
- **Seed prompt:**

  > `A precise close architectural CGI section through an apartment separating wall and its floor/ceiling junction, generic realistic layered construction with mineral and board-like textures, subtle separation interfaces and a readable perimeter condition, warm paper and limestone color family with graphite shadow, orthographic sectional view, generous clean margin on the right for SVG leaders, editorial engineering publication quality, plausible buildability, no labels, no dimensions, no text, no product branding.`

- **Do not imply:** a specified universal product system or exact thickness.

### ENG-05 — Ceiling junction detail

- **Purpose:** top impact-noise route and flanking junction.
- **Aspect/master:** 4:5, minimum 2000×2500.
- **Seed prompt:**

  > `A clean orthographic architectural CGI cutaway of an apartment ceiling and upper wall junction, plausible slab, suspended decoupled layer logic and sealed perimeter represented generically, clear structural route through the junction, restrained warm neutral materials, precise edges, soft diffuse studio light, spacious left margin for later SVG annotations, high-end technical editorial image, no baked-in arrows, labels, text, dimensions or brands.`

### ENG-06 — Floor junction detail

- **Purpose:** structural transmission, floor build-up and perimeter control.
- **Aspect/master:** 4:5, minimum 2000×2500.
- **Seed prompt:**

  > `A precise architectural CGI section of a residential floor-to-wall junction, realistic generic finish, load-distribution, resilient separation and structural slab relationships without branded products, a clear perimeter edge and potential rigid bridge location, orthographic view, tactile neutral material rendering, warm limestone paper palette, clean upper-right margin for SVG notes, technically plausible, no labels, no numbers, no text, no logos.`

### ENG-07 — Diagnosis scene

- **Purpose:** show professional observation without synthetic spokesperson theatre.
- **Aspect/master:** 3:2, minimum 2400×1600.
- **Composition:** engineer in side/rear view, one believable handheld/acoustic measurement device, examining a junction, face not central.
- **Seed prompt:**

  > `An acoustic engineer seen from the side and slightly behind inside a believable contemporary Moscow apartment, calmly inspecting a wall-ceiling junction with one plausible professional handheld measurement instrument, natural posture, understated work clothing without logos, warm daylight, lime plaster and oak interior, documentary-style high-end editorial architectural photography, the room and inspected junction more important than the person, realistic hands and equipment, no staged handshake, no eye contact, no text or branding.`

- **Approval:** reject any malformed display, extra controls or impossible grip. Any device screen should be unreadable/blank and never supply factual measurement UI.

### ENG-08 — New-build editorial spread

- **Purpose:** diagnosis before renovation.
- **Aspect/master:** 16:9 landscape, minimum 2560×1440.
- **Composition:** clean unfinished apartment shell, daylight, visible junctions, ample plan margin.
- **Seed prompt:**

  > `A clean believable unfinished apartment in a new Moscow residential building before renovation, exposed concrete slab and masonry/plaster surfaces, no debris chaos, clear wall-ceiling-floor junctions, soft overcast daylight, spacious asymmetrical composition with a broad empty foreground and left margin for editorial notes, rectilinear architectural camera, muted warm-grey palette, premium architecture publication photography, realistic construction, no workers, no signs, no text, no logos.`

### ENG-09 — Renovation-in-progress spread

- **Purpose:** show accessible hidden work and installation control.
- **Aspect/master:** 4:5 portrait, minimum 2000×2500.
- **Seed prompt:**

  > `A carefully managed apartment renovation in progress in Moscow, one wall or ceiling assembly open before closure, believable generic acoustic construction layers and clean junction work, tidy site, realistic tools in the background but no visible brands, soft daylight, vertical editorial composition with the critical junction in the middle third and quiet negative space above, high-end architectural documentary style, no posed workers, no text or logos.`

### ENG-10 — Finished-apartment spread

- **Purpose:** address fear of dust, demolition and repeat renovation honestly.
- **Aspect/master:** 21:9 or 2:1, minimum 2800×1400.
- **Seed prompt:**

  > `A finished lived-in contemporary Moscow apartment with warm plaster, natural oak cabinetry, linen and honed stone, calm daylight, believable personal traces without people, long low horizontal editorial crop, a clearly readable boundary between finished wall, ceiling and built-in joinery, refined but not ostentatious, high-end residential architecture photography, muted warm neutral grade, no text, no logos, no luxury cliches.`

### ENG-11 — Case visual A / 58 → 39 dB

- **Purpose:** support the measured result as an illustrative report spread.
- **Aspect/master:** 3:2, minimum 2400×1600.
- **Composition:** abstracted but believable quiet receiving room with two clean vertical datum zones.
- **Seed prompt:**

  > `An illustrative architectural visualization of a calm contemporary apartment room used as a neutral backdrop for an acoustic measurement report, warm lime plaster and oak, restrained daylight, two clean vertical architectural planes with generous uncluttered areas for HTML measurement data, precise editorial crop, believable residential geometry, high-end architecture publication image, explicitly not a documentary customer photograph, no people, no text, no numbers, no graphs, no logos.`

### ENG-12 — Case visual B / 71 dB, −16 dB peak

- **Purpose:** support the peak-level story.
- **Aspect/master:** 5:4, minimum 2400×1920.
- **Composition:** sectional boundary and quiet negative field for one peak trace.
- **Seed prompt:**

  > `An illustrative architectural sectional visualization of a residential room boundary and structural junction, warm neutral plaster and stone tones, subdued graphite construction depth, broad clean negative field across the upper half for a later SVG peak trace, editorial engineering report aesthetic, plausible apartment construction, restrained and precise, explicitly not documentary photography, no people, no text, no numbers, no waveform, no labels, no logos.`

### ENG-13 — Case visual C / 64 → 43 dB

- **Purpose:** before/after bands over one quiet sectional image.
- **Aspect/master:** 16:9, minimum 2560×1440.
- **Seed prompt:**

  > `An illustrative high-end architectural visualization combining a believable finished apartment room with a subtle clean sectional edge at one wall, composed as one coherent image rather than a collage, two wide uncluttered horizontal zones for later HTML before-and-after measurement bands, warm daylight, lime plaster, oak and muted stone, technically plausible, architecture publication quality, explicitly not a documentary customer photograph, no text, no numbers, no logos.`

### ENG-14 — Hidden-work control detail

- **Purpose:** four inspection checkpoints before closure.
- **Aspect/master:** 3:2, minimum 2400×1600.
- **Seed prompt:**

  > `A very detailed but clean editorial photograph/CGI hybrid of an acoustic construction junction during installation before closure, realistic generic layered materials, decoupled perimeter and penetration/sealing areas visible, tidy professional workmanship, warm neutral work light, four spatially separated readable regions for later SVG checkpoint leaders, plausible buildability, no people required, no branded products, no text, no tape labels, no dimensions.`

### ENG-15 — Final consultation visual

- **Purpose:** calm diagnosis/application transition and final CTA.
- **Aspect/master:** 16:10, minimum 2560×1600.
- **Composition:** large quiet table/plan area, room still primary, optional engineer/client presence only as cropped hands or rear silhouettes.
- **Seed prompt:**

  > `A calm architectural consultation setting inside a refined believable Moscow apartment, a large natural oak table with a blank apartment plan sheet and simple measuring tools, warm mineral plaster and soft daylight, no readable documents, people optional only as subtle rear or cropped side presence, broad negative space for the diagnosis call to action, premium residential editorial photography, quiet precise mood, no text, no logos, no staged handshake, no visible UI.`

### ENG-16 — Open Graph image

- **Purpose:** share preview with brand/message added later in layout, not pixels.
- **Aspect/master:** 1200×630.
- **Composition:** simplified crop derived from or visually continuous with ENG-02, right-side cutaway edge, left safe zone.
- **Rule:** generate/crop without embedded words; compose typography programmatically in the final OG asset workflow.

## 6. Optional route-specific image families

Service pages may reuse an Engineering asset across Engineering routes when the reuse is editorially justified, but each page must not look like a thin template. Prefer route-specific crops/details:

- apartment: wide room section and symptom overview;
- walls: wall junction macro;
- ceiling: upper junction/impact route;
- floor: floor perimeter and structural route;
- neighbours: separating/flanking boundary;
- new build: open shell and early planning;
- finished apartment: controlled intervention boundaries;
- diagnosis: engineer and marked drawing;
- cases: the three exclusive case visuals.

Do not use the same hero crop on multiple routes. A crop variant must reveal a different relevant architectural subject, not just resize the homepage hero.

## 7. Diagram integration rules

- Generated pixels never contain route lines, arrows, labels or dB graphs.
- Keep the diagram in SVG, aligned through stable `viewBox` anchors rather than viewport pixel coordinates.
- Pair light images with graphite/teal lines; if an image is too busy, use a local paper wash behind labels rather than a glass card.
- Labels live outside the subject where possible and connect through leader lines.
- Use true visible junctions as endpoints. Do not draw a line through furniture merely because it looks dynamic.
- The active brick route must remain distinguishable in greyscale through stroke weight and endpoint shape.

## 8. Responsive crops and export

For each shipped raster, produce only necessary variants based on actual rendered sizes. Baseline:

- desktop: 2400–2880px wide for full-bleed, 1600–2000px for half-width;
- tablet: 1280–1600px;
- mobile: 800–1080px, preferably a purpose-composed portrait asset for hero/critical scenes;
- formats: AVIF primary where supported, WebP fallback; high-quality JPEG only if required by the framework/toolchain;
- colour profile: sRGB;
- preserve natural fine grain without sharpening halos;
- set intrinsic width/height or `aspect-ratio` to prevent layout shift.

Do not crop engineer hands, instruments, critical junctions or route anchor surfaces. Use `object-position` per breakpoint rather than one global `center` crop.

## 9. Alt-text and disclosure policy

Alt text describes the visual's purpose, not its style prompts. Examples:

- hero: `Спокойный интерьер квартиры; поверх участка стены и потолка показан предполагаемый путь передачи шума.`
- diagnosis: `Инженер осматривает примыкание стены и потолка с измерительным прибором.`
- wall detail: `Разрез многослойной конструкции стены и узла примыкания к перекрытию.`
- case: `Иллюстративный интерьер к результату измерений 58 дБ до работ и 39 дБ после.`

Decorative texture crops use empty alt. Captions for all case visuals state:

> Иллюстративная визуализация, не фотография объекта заказчика.

Do not imply an image is an actual address, client, system or worksite unless separately verified.

## 10. Absolute exclusions

Reject any image containing:

- embedded text, pseudo-Cyrillic, logos, watermarks or fake UI;
- blue–purple gradients, neon glow or cyber imagery;
- impossible structure, bent verticals, duplicated furniture or disconnected doors/windows;
- glossy marble palace, gold excess, hotel-lobby scale or generic luxury cliché;
- random smiling family, front-facing synthetic spokesperson, handshake or staged team;
- distorted faces, hands, measuring tools or instrument displays;
- branded acoustic material, unverifiable product layers or exact baked-in dimensions;
- dramatic darkness that hides construction detail;
- over-styled clutter that competes with linework;
- the same furniture or exact room reused across unrelated story claims;
- a visual source, motif or asset borrowed from another concept/site.

## 11. Full-resolution approval checklist

An asset passes only if all relevant answers are “yes”:

1. Are verticals and perspective plausible?
2. Do walls, slabs, openings and furniture connect physically?
3. Are material junctions believable at 100% zoom?
4. Is the lighting direction consistent?
5. Is there enough quiet space for live typography/diagram overlays?
6. Does the intended mobile crop preserve the subject?
7. Are human anatomy and instruments credible where present?
8. Is all generated text absent?
9. Does the image feel editorial and residential rather than stock-like or palatial?
10. Is the image visibly part of this Engineering family without duplicating another asset?
11. Does the file meet its target aspect and resolution?
12. For cases, is the illustrative status documented and visible in nearby copy?

If a major geometry, anatomy or perspective defect exists, regenerate. Do not hide the cause under a line overlay.

