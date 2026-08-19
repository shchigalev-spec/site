# Журнал production-промптов

## Происхождение и воспроизводимость

- Генератор: встроенный **Codex imagegen** (`built-in imagegen`).
- Tech и Engineering произведены как два раздельных эксклюзивных набора. Изображение, reference или crop одной концепции нельзя переносить в другую.
- Ни один финальный prompt не просит встроить текст, логотип, значение дБ, график, waveform, размерную линию или UI. Эти элементы создаются кодом.
- Ниже хранится канонический production prompt для воспроизведения каждого финального имени. Seed, внутренний generation ID и параметры исходного запуска в доступных документах не зафиксированы и потому не выдумываются.
- Все case assets — иллюстративные визуализации, не документальные фотографии объектов заказчиков.

## SIGNAL / TECH — эксклюзивный набор

### `apps/tech/static/generated/tech-style-anchor.png`

```text
A cinematic architectural CGI of a believable contemporary premium Moscow apartment living room at early night, warm oak, matte stone, textured plaster, linen and restrained graphite metal, practical 2900K lighting with readable deep graphite shadows, physically plausible 28mm rectilinear lens at eye level, straight verticals, layered seven-to-ten-meter room depth, one clear wall-to-ceiling junction and broad quiet surface reserved for later interface overlays, calm inhabited details without showroom styling, no people, premium residential realism, restrained teal-neutral shadow bias without neon. No embedded text, letters, numbers, logos, watermark, fake UI, graphs, waveform, measurement display, blue-purple gradient, cyberpunk lighting, glowing blobs, smoke, fisheye distortion, bent structure, impossible openings, duplicated furniture, floating objects or luxury-hotel clichés.
```

### `apps/tech/static/generated/tech-hero-cutaway.png`

```text
Using the approved Tech style-anchor room as the visual reference, preserve the same camera position, room geometry, openings, furniture, warm practical lighting and graphite color grade. Reveal selected wall, ceiling and floor zones as a clean physically plausible architectural cutaway with generic separated layers and readable junction logic; keep most of the room finished and residential. Create real layered depth for a scroll-synchronized diagnostic transition and leave clear surfaces for live measurement planes and path lines added later. No exploded fantasy parts, no baked-in arrows, no embedded text, letters, numbers, labels, logos, watermark, fake UI, graphs, waveform, instrument reading, neon, blue-purple light, cyberpunk effects, impossible structure, distorted furniture or people.
```

### `apps/tech/static/generated/tech-apartment-xray.png`

```text
A clean cinematic axonometric architectural CGI of a believable contemporary apartment with three to five readable rooms, plausible shared walls, floor slab, ceiling zones, sockets, ventilation routes and junctions, simplified natural oak, matte stone and warm plaster materials consistent with the Tech anchor, controlled graphite background and warm practical light, enough separation between structural classes for later interactive masks, sound-path particles and live labels, premium engineering visualization with physically coherent circulation and openings. No dollhouse fantasy, impossible stairs, disconnected doors, duplicated furniture, embedded text, letters, numbers, logos, watermark, fake UI, arrows, waveform, glowing sound graphics, blue-purple neon, product branding or people.
```

### `apps/tech/static/generated/tech-diagnosis.png`

```text
A believable acoustic engineer seen from the side and slightly behind in a contemporary Moscow apartment at dusk, calmly inspecting a wall-to-ceiling junction with one plausible professional handheld measurement instrument, realistic posture, hands and grip, neutral workwear without logos, warm practical residential light, graphite shadows, oak and textured plaster consistent with the Tech image family, the inspected architectural junction more important than the person, cinematic editorial realism with clear negative space for live diagnostic copy. Keep the device screen blank or unreadable. No front-facing spokesperson, eye contact, staged handshake, embedded text, letters, numbers, logos, watermark, fake UI, malformed tools, extra fingers, dramatic smoke, neon, blue-purple light or impossible architecture.
```

### `apps/tech/static/generated/tech-stage-newbuild.png`

```text
The new-build state of one coherent Moscow apartment room before renovation, exposed but clean concrete slab, wall bases and service zones, visible wall-ceiling-floor junctions, no debris chaos, evening ambient light balanced with one restrained warm work light, fixed rectilinear camera and room geometry designed to match the renovation and finished states, cinematic architectural CGI in the Tech graphite-and-warm-material world, broad clear structural surfaces for later live annotations. No workers, signs, embedded text, numbers, logos, watermark, branded materials, fake UI, blue-purple neon, impossible openings, warped perspective or decorative sound effects.
```

### `apps/tech/static/generated/tech-stage-renovation.png`

```text
The renovation-in-progress state of the same room, same fixed camera, openings and structural geometry as the Tech new-build sequence, partially assembled wall and ceiling areas with generic believable acoustic layers visible before closure, protected finished surfaces and a tidy controlled site, warm task lighting against readable graphite depth, cinematic premium architectural CGI, critical perimeter and junction zones left unobstructed for live interface markers. No posed workers, branded products, embedded labels, letters, numbers, logos, watermark, fake UI, baked-in arrows, neon, blue-purple gradient, malformed tools, impossible layer assembly or construction debris spectacle.
```

### `apps/tech/static/generated/tech-stage-finished.png`

```text
The finished state of the same coherent Tech room, preserving the fixed camera, main openings and architectural geometry from the new-build and renovation states, believable warm oak, matte stone, textured plaster and linen, calm lived-in details without people, controlled evening practical light and slightly lighter quiet-state exposure, clearly readable wall-ceiling-floor boundaries for later live overlays, cinematic premium residential CGI without showroom excess. No embedded text, numbers, logos, watermark, fake UI, graphs, waveform, neon, blue-purple light, distorted furniture, duplicated decor, impossible geometry, sleeping-child cliché, headphones or finger-to-lips imagery.
```

### `apps/tech/static/generated/tech-case-58-39.png`

```text
An illustrative cinematic architectural visualization of a believable quiet apartment room serving as a neutral background for the measured-result story 58 dB to 39 dB, warm oak and textured plaster, controlled evening practical lighting, deep readable graphite shadows, two uncluttered architectural zones for live HTML measurement values and an SVG graph added later, coherent premium residential geometry, explicitly an illustrative visualization and not a documentary customer photograph. No people, address, documents, measuring device display, embedded text, letters, numbers, graphs, waveform, arrows, logos, watermark, fake UI, branded products, invented system details, blue-purple neon or impossible architecture.
```

### `apps/tech/static/generated/tech-case-impact-16.png`

```text
An illustrative cinematic architectural visualization of a residential room with a clearly readable upper slab and wall-ceiling junction, composed as a neutral background for a peak-level story whose live interface will show 71 dB and a reduction of 16 dB, restrained warm practical light, tactile plaster and oak, graphite structural depth and broad negative space for a later SVG peak trace, plausible apartment construction, explicitly not documentary photography of a customer object. No people, embedded text, letters, numbers, graphs, waveform, arrows, labels, logos, watermark, fake UI, exact product layers, address, blue-purple neon, cyberpunk glow or impossible structure.
```

### `apps/tech/static/generated/tech-case-64-43.png`

```text
An illustrative clean cinematic architectural background for the measured-result story 64 dB to 43 dB, one believable contemporary apartment room with a subtle physically plausible sectional edge at a wall junction, warm oak, matte stone and textured plaster, controlled evening practical light, graphite shadows with readable detail, two broad uncluttered zones reserved for live HTML before-and-after values and an SVG graph added later, one coherent image rather than a collage, explicitly not a documentary customer photograph. Absolutely no embedded graph, chart, waveform, line plot, arrows, text, letters, numbers, measurement marks, device display, logos, watermark or fake UI; no people, address, branded products, invented construction system, blue-purple neon, cyberpunk glow, impossible architecture or distorted furniture.
```

### `apps/tech/static/generated/tech-final-quiet.png`

```text
A calm warm lived-in contemporary Moscow apartment room at evening after an engineering decision has become clear, tactile oak, linen, matte stone and textured plaster, soft local practical light, readable graphite shadows, subtle signs of life such as a book and folded textile without people, strong quiet negative space for the final diagnosis call to action, cinematic premium residential CGI consistent with the Tech anchor, peaceful without becoming a white lifestyle catalogue. No embedded text, letters, numbers, logos, watermark, fake UI, graphs, waveform, blue-purple neon, glowing blobs, sleeping child, headphones, finger-to-lips gesture, clouds, hotel luxury, distorted furniture or impossible geometry.
```

### `apps/tech/static/generated/tech-og.png`

```text
A simplified cinematic social-preview composition in the exclusive Tech visual world, believable contemporary Moscow apartment at early night, warm practical light, graphite depth, oak, matte stone and textured plaster, one subtle clean architectural cutaway edge on the right and a broad low-detail safe zone on the left for programmatic brand typography, strong readable silhouette at 1200 by 630, premium residential engineering atmosphere without spectacle. No embedded words, letters, numbers, logos, watermark, fake UI, graph, waveform, arrows, device display, people, blue-purple gradient, cyberpunk neon, glowing blob, impossible architecture or distorted furniture.
```

## QUIET / ENGINEERING — эксклюзивный набор

### `apps/engineering/static/generated/engineering-style-anchor.png`

```text
A believable contemporary premium Moscow apartment living room designed with quiet restraint, warm lime plaster walls, matte natural oak, honed limestone, oatmeal linen and subdued grey-green wool, soft overcast daylight entering from the left, rectilinear 32mm architectural camera at eye level, straight verticals, broad uncluttered negative space across the upper-left wall and ceiling, lived-in but minimal, tactile natural imperfections, high-end editorial architectural photography, restrained warm neutral color grade, plausible room geometry and furniture. No embedded text, letters, numbers, logos, watermark, visible brand, fake UI, people facing camera, luxury clichés, glossy marble palace, blue-purple light, neon, extreme wide angle, fisheye, bent verticals, impossible openings, duplicated furniture or surreal objects.
```

### `apps/engineering/static/generated/engineering-hero-cutaway.png`

```text
Using the approved Engineering style-anchor interior as reference, keep the exact camera, room geometry, furniture, openings, daylight direction and restrained warm color. Reveal only the designated wall-ceiling-floor boundary as a clean plausible local architectural cutaway with generic construction layers and visible junction logic; the rest remains the same finished editorial interior. Leave clear margin space for SVG dimensions and route lines added later, clean high-end architectural CGI integrated into photography. No baked-in dimensions, labels, arrows, text, letters, numbers, brands, watermark, fake UI, graphs, exploded floating pieces, impossible structure, blue-purple light, neon or altered furniture.
```

### `apps/engineering/static/generated/engineering-wall-detail.png`

```text
A precise close architectural CGI section through an apartment separating wall and its floor-and-ceiling junction logic, generic realistic layered construction with mineral, fibrous and board-like textures, subtle separation interfaces and a readable perimeter condition, warm paper and limestone color family with graphite shadow, orthographic sectional view, generous clean margin on the right for SVG leaders added later, editorial engineering publication quality and plausible buildability. No specified universal product system, exact thickness, baked-in dimensions, labels, arrows, text, letters, numbers, logos, watermark, branded materials, fake UI, blue-purple light, neon or impossible structure.
```

### `apps/engineering/static/generated/engineering-ceiling-detail.png`

```text
A clean orthographic architectural CGI cutaway of an apartment ceiling and upper wall junction, plausible slab, generic suspended decoupled layer logic and sealed perimeter, clear structural relationship through the junction, restrained warm neutral materials, precise edges, soft diffuse studio light and spacious left margin for later SVG annotations, high-end technical editorial image with believable buildability. No baked-in arrows, dimensions, labels, text, letters, numbers, logos, watermark, product branding, fake UI, graph, blue-purple light, neon, malformed layers or impossible supports.
```

### `apps/engineering/static/generated/engineering-floor-detail.png`

```text
A precise architectural CGI section of a residential floor-to-wall junction, realistic generic finish, load-distribution, resilient separation and structural slab relationships without branded products, a clear perimeter edge and potential rigid-bridge location, orthographic view, tactile neutral material rendering, warm limestone paper palette and clean upper-right margin for SVG notes added later, technically plausible editorial engineering quality. No labels, arrows, dimensions, text, letters, numbers, logos, watermark, fake UI, graph, blue-purple light, neon, exact proprietary system or impossible construction.
```

### `apps/engineering/static/generated/engineering-diagnosis.png`

```text
An acoustic engineer seen from the side and slightly behind inside a believable contemporary Moscow apartment, calmly inspecting a wall-ceiling junction with one plausible professional handheld measurement instrument, natural posture, understated work clothing without logos, warm soft daylight, lime plaster and oak interior, documentary-style high-end editorial architectural photography, the room and inspected junction more important than the person, realistic hands and equipment, broad quiet margin for editorial copy. Keep the instrument display blank or unreadable. No staged handshake, eye contact, front-facing spokesperson, embedded text, letters, numbers, branding, watermark, fake UI, malformed tools, extra fingers, blue-purple light, neon or impossible architecture.
```

### `apps/engineering/static/generated/engineering-stage-newbuild.png`

```text
A clean believable unfinished apartment in a new Moscow residential building before renovation, exposed concrete slab and masonry or plaster surfaces, no debris chaos, clear wall-ceiling-floor junctions, soft overcast daylight, spacious asymmetrical composition with a broad empty foreground and left margin for editorial notes, rectilinear architectural camera, muted warm-grey palette, premium architecture publication photography and realistic construction. No workers, signs, embedded text, letters, numbers, logos, watermark, branded materials, fake UI, blue-purple light, neon, bent verticals or impossible openings.
```

### `apps/engineering/static/generated/engineering-stage-renovation.png`

```text
A carefully managed apartment renovation in progress in Moscow, one wall or ceiling assembly open before closure, believable generic acoustic construction layers and clean junction work, tidy site, realistic unbranded tools in the background, soft daylight, vertical editorial composition with the critical junction in the middle third and quiet negative space above, high-end architectural documentary style and plausible buildability. No posed workers, embedded text, letters, numbers, logos, watermark, visible brands, fake UI, baked-in dimensions, blue-purple light, neon, malformed tools or impossible layer connections.
```

### `apps/engineering/static/generated/engineering-stage-finished.png`

```text
A finished lived-in contemporary Moscow apartment with warm lime plaster, natural oak cabinetry, linen and honed stone, calm soft daylight, believable personal traces without people, long low horizontal editorial composition, a clearly readable boundary between finished wall, ceiling and built-in joinery, refined but not ostentatious, high-end residential architecture photography with a muted warm neutral grade and clean space for editorial notes. No embedded text, letters, numbers, logos, watermark, fake UI, luxury clichés, glossy marble palace, blue-purple light, neon, duplicated furniture, surreal objects or impossible openings.
```

### `apps/engineering/static/generated/engineering-case-58-39.png`

```text
An illustrative architectural visualization of a calm contemporary apartment room used as a neutral backdrop for the measured-result report 58 dB to 39 dB, warm lime plaster and oak, restrained daylight, two clean vertical architectural planes with generous uncluttered areas for live HTML measurement data, precise editorial crop, believable residential geometry and high-end architecture publication quality, explicitly not a documentary customer photograph. No people, address, documents, embedded text, letters, numbers, graphs, waveform, arrows, labels, logos, watermark, fake UI, branded systems, blue-purple light, neon or impossible architecture.
```

### `apps/engineering/static/generated/engineering-case-impact-16.png`

```text
An illustrative architectural sectional visualization of a residential room boundary and structural junction used as a neutral background for a live-interface peak-level story showing 71 dB and a reduction of 16 dB, warm neutral plaster and stone tones, subdued graphite construction depth, broad clean negative field across the upper half for a later SVG peak trace, editorial engineering report aesthetic, plausible apartment construction, restrained and precise, explicitly not documentary photography. No people, address, embedded text, letters, numbers, waveform, graph, arrows, labels, logos, watermark, fake UI, branded materials, blue-purple light, neon or impossible structure.
```

### `apps/engineering/static/generated/engineering-case-64-43.png`

```text
An illustrative high-end architectural visualization used as a neutral background for the measured-result report 64 dB to 43 dB, combining a believable finished apartment room with a subtle clean sectional edge at one wall, composed as one coherent image rather than a collage, two wide uncluttered horizontal zones for later live HTML before-and-after measurement bands, warm daylight, lime plaster, oak and muted stone, technically plausible architecture-publication quality, explicitly not a documentary customer photograph. No people, address, embedded text, letters, numbers, graphs, waveform, arrows, labels, logos, watermark, fake UI, branded systems, blue-purple light, neon or impossible architecture.
```

### `apps/engineering/static/generated/engineering-final-consultation.png`

```text
A calm architectural consultation setting inside a refined believable Moscow apartment, a large natural oak table with a blank apartment plan sheet and simple unbranded measuring tools, warm mineral plaster and soft daylight, no readable documents, no people required, broad negative space for the diagnosis call to action, premium residential editorial photography with a quiet precise mood and plausible room geometry. No embedded text, letters, numbers, logos, watermark, staged handshake, visible UI, branded materials, malformed tools, blue-purple light, neon, glossy marble palace, luxury cliché or impossible architecture.
```

### `apps/engineering/static/generated/engineering-og.png`

```text
A simplified 1200 by 630 social-preview composition visually continuous with the exclusive Engineering style anchor, spacious calm contemporary Moscow apartment, warm lime plaster, matte oak, honed light stone and soft northern daylight, restrained right-side local architectural cutaway edge and broad quiet left safe zone for programmatic brand typography, straight verticals, believable residential geometry and high-end editorial architectural quality. No embedded words, letters, numbers, logos, watermark, fake UI, dimensions, graph, waveform, arrows, people, blue-purple light, neon, glossy luxury cliché, duplicated furniture or impossible openings.
```

## Журнал отклонения и замены

### Tech case `64 дБ → 43 дБ`

- Отклонённый кандидат содержал встроенный в растр график. Он нарушал правило: измерительные значения, графики и интерфейс должны быть живыми HTML/SVG/Canvas-слоями, а не сгенерированными пикселями.
- Отклонённый вариант не входит в финальный инвентарь и не должен использоваться как доказательство измерений.
- Финальная замена: `apps/tech/static/generated/tech-case-64-43.png`.
- В replacement prompt добавлен жёсткий запрет: `Absolutely no embedded graph, chart, waveform, line plot, arrows, text, letters, numbers, measurement marks, device display, logos, watermark or fake UI.`
- Назначение замены — чистый архитектурный фон с двумя свободными зонами; подтверждённые значения `64 дБ → 43 дБ` и график накладываются кодом.

## Финальная asset-continuity ревизия Tech

После независимого visual gate семь Tech masters были отредактированы встроенным `imagegen`, а затем повторно конвертированы в full и `-960.webp`. Цель — сохранить одну камеру в morph-сценах и убрать запечённую инфографику из растров.

### `tech-style-anchor.png`

```text
EDIT the supplied image, do not redesign the architecture. Preserve the exact same room, camera position, lens, window geometry, furniture placement, crop, lighting direction, and 16:9 composition. Remove every coral or teal acoustic ribbon, wave, glow trail, measurement line, diagram, label, text, UI element, and graphic overlay. Reconstruct the hidden surfaces photorealistically so the result is a clean premium dark apartment interior at dusk. No text, no logo, no people, no infographic, no waveform, no arrows.
```

### `tech-hero-cutaway.png`

```text
EDIT the supplied clean apartment plate into an architectural acoustic cutaway of THE EXACT SAME ROOM. Lock the camera, lens, crop, perspective, window grid, furniture placement, lighting, and every architectural edge. Reveal a restrained sectional layer only along the principal wall, ceiling edge, and floor edge: realistic metal frame, mineral wool, resilient isolation strip, double board, sealed perimeter. Keep most of the finished room visible so this can crossfade over the original with pixel-consistent geometry. No coral or teal glow, no waveform, no arrows, no text, no labels, no numbers, no UI, no people.
```

### `tech-stage-renovation.png` и `tech-stage-finished.png`

```text
EDIT the supplied unfinished apartment into the requested mid-renovation / finished state of THE EXACT SAME ROOM. Preserve exact camera position, lens, crop, perspective, window openings, concrete columns, right doorway, pipe routes, lighting direction and every architectural edge. For renovation show an orderly acoustic installation in progress; for finished state complete the same geometry with restrained warm materials and minimal furniture. No glow, waveform, text, labels, numbers, arrows or UI.
```

### Три `tech-case-*.png`

```text
EDIT the supplied case background. Remove every coral/teal acoustic visualization, waveform, ring, arrow, particle, split-screen transition, label, number and UI-like mark. Reconstruct hidden walls, ceiling and floor naturally while preserving the exact room, camera, perspective, furniture, light and 16:9 crop. Return a clean photorealistic residential background plate; all measured values and graphs are added only by live HTML/CSS/SVG.
```
