# QUIET / ENGINEERING — Art Direction

## 0. Mandate

This document is the visual contract for the Engineering concept of **Лаборатория тишины**. The public experience is not a toned-down version of a technology site and not an architecture portfolio. It is an architectural engineering publication in which a calm residential scene is progressively marked, measured, cut open and explained.

The desired emotional mix is:

- 45% architectural calm;
- 35% engineering authority;
- 20% premium service.

The one-sentence art direction is:

> Тишина выглядит как спокойный интерьер; доверие появляется, когда на нём видны путь передачи, размер и узел.

Every visual device must do one of three jobs: create calm, locate a transmission path, or prove control of the construction. If it does none of these, remove it.

## 1. Concept principles

### 1.1 Quiet is composed, not empty

Whitespace must establish hierarchy, isolate evidence and slow the reading rhythm. A large blank area is valid only when it gives an adjacent image, conclusion, dimension or action more authority. Do not distribute content evenly to “fill the grid”.

### 1.2 The page behaves like an annotated architectural spread

Photography presents the inhabited promise. Linework reveals what the photograph cannot: junctions, likely paths, layers, dimensions and acceptance criteria. HTML text carries facts; generated images must never contain labels or diagrams baked into pixels.

### 1.3 Asymmetry is the default

Avoid two equal columns. Use a 7/5, 8/4 or 9/3 relationship, offset baselines, deliberately cropped images and captions positioned away from the obvious centre. A section may be image-led, type-led or drawing-led, but should not repeat the geometry of the preceding section.

### 1.4 Precision replaces spectacle

Movement is slow, finite and connected to a measurement or spatial state. A line ends at a real junction. A dimension belongs to a layer. A crop reveals a relevant surface. No floating decorations, glowing noise, generic counters or continuous scan loops.

### 1.5 Diagnosis is the service entrance

The dominant action is always a diagnosis, never materials, packages or a price per square metre. The architecture must support this reasoning:

1. describe the symptom;
2. locate the route;
3. inspect constraints;
4. design the construction;
5. control installation;
6. verify the result.

## 2. Visual identity system

### 2.1 Palette

Use flat colour and material contrast. Do not introduce blue–purple gradients, neon or glass effects.

| Token | Value | Use |
|---|---:|---|
| `paper` | `#F2EEE6` | primary canvas, long editorial sections |
| `plaster` | `#E7E0D4` | secondary canvas, diagram fields |
| `limestone` | `#D1C7B7` | rules, inactive diagram surfaces, quiet panels |
| `ink` | `#20231F` | main text and dark sections |
| `ink-soft` | `#55584F` | secondary copy |
| `brick` | `#A95742` | CTA, selected route, red-pencil notes |
| `brick-dark` | `#7F3F32` | active/focus contrast on light fields |
| `measure` | `#607777` | dimensions, graphs, technical status |
| `measure-pale` | `#A8B5B0` | inactive route line, diagram grid |
| `white` | `#FBFAF6` | text on dark fields, image captions |

Colour proportions on the homepage: approximately 64% paper/plaster, 22% imagery, 9% ink, 5% accent/measurement. Brick marks a decision or a critical junction; teal-grey marks observation. Never use both as arbitrary decoration in the same small component.

Dark sections are limited to one evidence/case chapter and the final application transition. A page made of alternating dark slabs is a failure.

### 2.2 Typography

Load locally or through an approved font delivery path:

- **Geologica** — display headings, calm weights 420–560;
- **Onest** — body, navigation, controls, weights 400–600;
- **IBM Plex Mono** — dimensions, dB readings, drawing indices and short captions only.

Inter is prohibited.

Desktop scale:

| Role | Size / line | Notes |
|---|---|---|
| Hero display | `clamp(4.25rem, 7.4vw, 8.5rem)` / `.91` | 420–500 weight, `-0.045em` tracking |
| Section display | `clamp(3.2rem, 5.2vw, 6.5rem)` / `.96` | controlled 2–4 line wrap |
| Editorial H3 | `clamp(1.8rem, 2.4vw, 3rem)` / `1.05` | conclusion-led |
| Lead | `clamp(1.25rem, 1.6vw, 1.7rem)` / `1.35` | max 34 characters per line in Russian |
| Body | `1.05rem`–`1.2rem` / `1.55` | minimum 17px at all viewports |
| Caption | `.72rem`–`.82rem` / `1.35` | uppercase optional, not full paragraphs |
| Dimension | `.68rem`–`.78rem` / `1.2` | IBM Plex Mono, tabular figures |

Headlines should look set, not shouted: sentence case, no all-caps display text, no outline type, no multicolour phrases. A large heading may enter an image edge by 4–8% of its width, but must preserve legibility without a text shadow.

### 2.3 Grid and spacing

Desktop (>1280px): 12 columns, max content width 1680px, outer margin `clamp(32px, 4.2vw, 80px)`, gutter 24px.

Tablet (768–1279px): 8 columns, 32px margin, 20px gutter.

Mobile (<768px): 4 columns, 18–20px margin, 12px gutter.

Spacing is deliberately non-periodic. Approved section intervals: 96, 136, 184 and 240px on desktop; 72, 96 and 128px on tablet; 56, 72 and 96px on mobile. Do not apply one uniform vertical padding to every section.

Rules:

- at least one content edge in every major section must align to the master grid;
- the other edge may crop, overshoot or step inward;
- maximum readable body width: 62ch;
- minimum touch target: 44×44px;
- avoid more than two rounded containers in a viewport;
- default corner radius is 0; optional image mask radius is 2–4px, never pill-shaped.

### 2.4 Line and dimension language

Linework is functional, lightweight and optically precise:

- structural rule: 1px `rgba(32,35,31,.24)`;
- primary measurement: 1px `measure`;
- selected transmission path: 1.5–2px `brick`;
- hidden continuation: 1px dashed, 6px dash / 6px gap;
- witness mark: 10–16px;
- terminal dot: 4px only where a route changes construction;
- arrowheads: architectural 30° open chevrons, not filled UI arrows.

Dimensions must contain a meaningful value or a qualitative constraint supplied by the interface. Never invent wall thicknesses, reductions, systems or specifications. When exact numbers are unknown, label the relationship rather than fabricate precision: “зазор уточняется после обследования”, “узел примыкания”, “возможный жёсткий мост”.

Use a red-pencil annotation sparingly: one handwritten-looking underline, circle or marginal note per scene at most. It must highlight a critical decision. Do not use fake blueprint graph paper as a page background.

### 2.5 Photography and diagrams

Photography should feel like a quiet architecture magazine commissioned for a Moscow residential engineering practice: warm daylight, lime plaster, oak, stone, wool and linen, natural imperfection, strong negative space, no synthetic residents posing at camera.

Images are editorially cropped, not placed in decorative cards. Captions sit outside the image when space permits. Generated case imagery must always be marked as illustrative in nearby metadata/copy, never as a documentary customer photograph.

Diagrams are built in SVG/HTML over a clean CGI or vector base. They use sectional logic, visible junctions and a single active route. Avoid house icons, cartoon sound waves, pseudo-CAD clutter and diagrams that cannot explain a sentence in the adjacent copy.

## 3. Signature composition: architectural hero

### 3.1 Desktop geometry

The hero is 108–120svh with a scroll continuation; it is not a split layout.

- One full-bleed interior occupies the viewport.
- The image's calm negative-space zone sits toward the upper-left or upper-centre.
- The headline begins around column 1 and spans columns 1–9; its last line may cross the image's architectural edge.
- Supporting copy sits lower, around columns 2–5, not directly below the full headline block.
- The CTA begins around columns 7–10, creating a diagonal reading path.
- A measurement line crosses from a real wall/ceiling boundary toward the CTA, visually linking observation and action.
- Brand/navigation remains quiet along the perimeter; it must not sit in a translucent floating capsule.

Required copy:

> Сначала найдём причину шума. Потом спроектируем тишину.

Supporting copy:

> Диагностика, проект, собственная бригада, монтаж и проверка результата в Москве.

Primary CTA:

> Записаться на бесплатную диагностику

### 3.2 Hero transformation

From 0% to 100% of its local scroll range, the same interior changes state:

1. **Room** — unmarked, habitable calm; the copy establishes the promise.
2. **Observation** — a slim section line locks to an actual wall/ceiling/floor boundary.
3. **Cutaway** — a clean architectural layer is revealed inside a shaped mask; it does not simply replace the whole photograph.
4. **Dimension** — two or three relevant witness marks and labels appear.
5. **Decision** — one likely route is selected in brick; CTA gains hierarchy.

The end state must remain recognisably the same room. No x-ray spectacle, particles, darkness or dashboard panels.

### 3.3 Mobile geometry

Mobile retains the signature transformation as a 125–145svh narrative, but avoids pinning for more than 75svh at a time.

- image first, occupying roughly 58svh;
- headline overlaps the lower image edge and paper field;
- support copy and CTA follow on paper;
- cutaway uses a vertical clip or swipe-like reveal tied to page scroll;
- dimension labels relocate into a readable caption rail below the image;
- no label is smaller than 12px and no interaction depends on hover.

## 4. Component grammar

### 4.1 Navigation

Use a slender, architectural top rail: wordmark at left, two to four priority links around the centre-right, diagnosis action at far right. On scroll it may collapse to a 52–60px paper strip with a bottom rule. No glass, floating island or oversized hamburger animation.

Mobile navigation opens like a folded drawing sheet: full-height paper, large text, route numbers in mono, clear close button, focus trap and no background scroll.

### 4.2 Buttons and links

Primary CTA: solid brick, rectangular, minimum 48px height, 12–16px horizontal internal breathing room beyond its label. Hover/active changes should feel like pencil pressure: 1–2px rule shift, deeper brick, short 140–180ms response. Do not scale the button.

Secondary CTA: text with a baseline that extends toward a small architectural arrow. Focus style: 2px ink/brick outline with 3px offset, never removed.

### 4.3 Evidence

Evidence is presented as a continuous marginal band, not four cards. Use large facts separated by vertical rules and one-line qualifiers:

- “15 лет” / “работаем с шумом и вибрацией”;
- diagnosis before construction;
- own installation crew;
- acceptance criteria agreed before work.

Never turn unverified claims into certification seals. Contract and guarantee wording must remain within the verified safe wording.

### 4.4 Cases

Cases look like measurement report spreads. Each gets its own composition and measured result:

- `58 dB → 39 dB` as two vertical datum lines over a room crop;
- `71 dB / −16 dB` as a peak trace and annotated intervention boundary;
- `64 dB → 43 dB` as before/after bands across a sectional image.

Do not repeat three identical cards. Do not invent address, name, building, system, budget or duration. State that visuals are illustrative.

### 4.5 Forms

The preliminary scenario and application read as an engineering brief: numbered questions, one decision per row, generous writing space, and an accumulating margin summary. It is not a SaaS wizard card.

Selected context stays visible as a concise “Исходные данные” rail. File attachment is optional and styled as a document tray with actual filenames, removable items, validation and processing state. Never show a production success state before server confirmation.

## 5. Distinctive interaction inventory

The experience requires these four semantic interactions; the first three are release blockers:

1. **Architectural hero reveal** — one room moves from photograph to local cutaway and dimensions through scroll.
2. **Transmission-path drawing** — six selectable symptoms redraw a route through actual junctions and update annotations and CTA context.
3. **Construction layer detail** — layers separate along one measured axis; the rigid bridge/sealing condition becomes clear.
4. **Editorial symptom index** — a vertical index changes crop, route preview, explanatory conclusion and diagnosis context; it is not a text-only tab set.

Subtle supporting motion may include sticky captions, graph drawing, sheet-like page transitions and restrained image-mask changes. Fade-up alone does not count as interaction.

## 6. Responsive behaviour

### Desktop

Preserve overscale typography, marginal notes and asymmetry. Sticky scenes may occupy 140–190vh of document length but should never block natural scroll. Pointer hover adds detail, while click and keyboard remain fully functional.

### Tablet

Reduce competing annotations, not body size. Replace wide marginal bands with two-row continuous strips. Keep sectional diagrams at full viewport width and move long labels to a keyed legend.

### Mobile

Translate spreads into a staggered vertical essay:

- image → conclusion → annotation rail → action;
- one active route at a time;
- horizontally scrollable equal cards are prohibited;
- diagrams may use a controlled pan only if controls and a “fit drawing” action are present;
- sticky sequences must have a clear end and never trap the page;
- tap targets and labels meet accessibility requirements.

## 7. Accessibility and reduced motion

- Maintain WCAG AA contrast for text and controls.
- Every drawing has a plain-language summary in the DOM.
- Route selection is a real radio group or tabs pattern with appropriate semantics and arrow-key support.
- Selected state is not colour-only: use line weight, label and marker shape.
- Images have useful alt text; decorative lines are hidden from assistive technology.
- Motion never starts audio and never depends on sound.
- `prefers-reduced-motion: reduce` replaces progressive drawing with complete static drawings and explicit state changes; no content disappears.
- Focus order follows the reading order even when visual elements are offset.

## 8. Hard-fail checklist

Reject the implementation if any item is true:

- hero becomes centred copy over a stock-like image or equal text/image columns;
- content is dominated by rows of three identical cards;
- whitespace carries no hierarchy or evidence;
- diagrams are decorative, pseudo-CAD or physically incoherent;
- typography falls below 17px for body copy;
- the site becomes a static brochure or uses fade-ups as its motion system;
- generated imagery includes fake text, surreal furniture or impossible architecture;
- Inter, neon, blue–purple gradients, glassmorphism or dashboard UI appears;
- fake prices, guarantees, customer identities, reviews or exact systems are introduced;
- the mobile experience loses the cutaway, route or layer explanation;
- reduced-motion users lose meaning;
- visual or component structures are imported from another concept/site.

## 9. Art-direction acceptance test

At 1440×1000, 1024×1366 and 390×844, a reviewer should answer “yes” to all:

1. Can the core diagnosis promise be understood in three seconds?
2. Does the hero look like one asymmetrical architectural composition rather than a template?
3. Does every large blank area intensify a nearby image, fact, label or action?
4. Can the visitor see one physically plausible sound path?
5. Does at least one construction detail explain a failure-prone junction?
6. Is diagnosis the most prominent commercial action?
7. Does movement end in a more informed state?
8. Does mobile preserve the same reasoning without imitating desktop geometry?
9. Does the concept feel calmer, not cheaper, than a high-motion alternative?

