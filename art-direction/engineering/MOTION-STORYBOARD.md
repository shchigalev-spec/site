# QUIET / ENGINEERING — Motion Storyboard

## 0. Motion thesis

Motion is a drafting instrument. It marks a boundary, traces a transmission path, separates a construction or records a measured result. It is finite, calm and exact. The visitor should notice that the explanation became clearer, not that “the page animated”.

Primary tools may include SVG, CSS masks/clip paths and GSAP ScrollTrigger loaded only where a sequence needs scroll coordination. The Engineering concept must not require WebGL.

## 1. Motion constants

### Timing

| Use | Duration | Easing |
|---|---:|---|
| control response | 140–180ms | `cubic-bezier(.2,.7,.2,1)` |
| crop/mask change | 550–850ms | `cubic-bezier(.65,0,.2,1)` |
| diagram route | 700–1100ms | linear-to-soft-stop |
| layer separation | 650–900ms | `cubic-bezier(.4,0,.15,1)` |
| sheet transition | 300–500ms | `cubic-bezier(.55,0,.25,1)` |
| editorial parallax | scroll-linked, max 6% travel | no spring |

No elastic, bounce or overshoot easing. Nothing decorative loops indefinitely. Cursor-reactive effects are unnecessary.

### Distances

- Text and controls move no more than 12–20px.
- Image masks may traverse the relevant architectural surface, not the full viewport arbitrarily.
- Perspective shift stays under 2°.
- Parallax differential stays under 6% of the element height.
- Construction layers separate only far enough to read their relationship.

### State discipline

Every scroll scene has named states and an accessible static conclusion. Each scene must have an obvious start, middle and end. Do not scrub body copy letter-by-letter or pin a scene after its explanatory state is complete.

## 2. Global page motion

### 2.1 Initial entry

The page loads directly into a stable hero photograph. Navigation and H1 are present in the first rendered frame; no preloader, logo film or blank intro. Once fonts and the hero image are ready, the single measurement rule may draw 12–18% of its length as a quiet affordance, then stop.

### 2.2 Navigation

At 48–64px of downward scroll, the top rail compacts onto a solid paper background and gains a bottom rule. Duration 180ms. The active section may be indicated by a short baseline, never a moving progress dashboard.

Mobile navigation opens as a drawing sheet moving vertically by 16px while opacity resolves. Menu items remain still; only the sheet and one dividing rule animate. Respect focus trap and body-scroll locking.

### 2.3 Page transitions

Where route transitions are implemented, the outgoing page behaves like a lifted paper sheet: a paper-coloured mask travels 30–40% across the viewport while the next page becomes available. Total duration under 500ms; browser history remains native. Skip when the page is not hydrated or reduced motion is active.

## 3. Scene A — Architectural hero reveal

### Purpose

Show that a calm-looking room still has hidden transmission paths and that diagnosis precedes construction selection.

### Scroll range

Desktop: hero composition starts at 0svh and continues through approximately 165–185svh. The visual field is sticky for 90–105svh. Tablet: 145–165svh. Mobile: 125–145svh, with the image sticky for no more than 72svh.

### Story states

#### A0 — Quiet room / 0–12%

- Full-bleed warm interior, stable crop.
- H1, support copy and CTA are already readable.
- No technical overlay except one short datum mark.
- Copy establishes: “Сначала найдём причину шума. Потом спроектируем тишину.”

#### A1 — Surface observed / 12–34%

- A 1px measurement line extends along a real wall/ceiling or wall/floor boundary.
- Two witness marks anchor the line to geometry.
- The image moves at most 1.5% relative to the viewport to clarify the boundary.
- A mono label appears: “наблюдаемая поверхность”.

#### A2 — Local cutaway / 34–63%

- A polygonal mask follows the selected surface and slowly reveals the paired clean cutaway asset.
- The rest of the room remains photographic; this is not a full-image crossfade.
- Three broad physical zones become legible without fabricated millimetres.
- Caption conclusion: “Источник и видимая поверхность могут не совпасть.”

#### A3 — Route and dimensions / 63–86%

- One subdued teal route tests two junctions.
- The non-dominant branch ends as a dashed line.
- The selected branch switches to brick and reaches a real junction.
- Dimension brackets name constraints rather than inventing values: “узел примыкания”, “потеря пространства уточняется”, “проверить на месте”.

#### A4 — Diagnosis decision / 86–100%

- Cutaway stops moving and all labels reach their final readable positions.
- A marginal note appears: “Не назначаем конструкцию до обследования пути.”
- The CTA becomes solid brick and its contextual sublabel resolves: “менеджер уточнит задачу → следующий шаг — выездная диагностика”.
- The scene unpins naturally into the evidence band.

### Interaction details

- Scrub smoothing: 0.6–0.9s maximum; never create laggy scroll hijacking.
- Labels must not chase the cursor.
- If the cutaway asset fails, show the room plus a complete SVG outline and the conclusion; never leave a blank mask.
- Recalculate geometry on resize without shifting the reading position.

### Reduced motion

Render A4 as a static split-state composition: photograph with a local cutaway inset, complete route, all labels and conclusion visible. Remove sticky positioning and transform interpolation. CTA remains identical.

## 4. Scene B — Editorial symptom index

### Purpose

Let the visitor recognise what they hear and see that each symptom suggests different routes to inspect. This is not a generic tab group.

### Layout

Desktop uses a tall left index (about 35% width), a large changing architectural crop (about 52%) and a narrow marginal note. Mobile stacks the active crop above the six-option radio list; only one expanded explanation appears.

### Six states

1. Шаги и удары сверху — approx. 40%; inspect ceiling, upper junctions and structural route.
2. Голоса через соседнюю стену — approx. 25%; inspect separating wall and flanking junctions.
3. Бас и музыка — approx. 15%; inspect low-frequency and structural paths.
4. Лифт и вибрация — approx. 7%; inspect structural transmission and attachment points.
5. Дорога и улица — approx. 7%; inspect façade/openings and connected weak points.
6. Вентиляция — approx. 6%; inspect duct path, openings and connected structures.

### State transition

On selection:

1. selected number gains a brick pencil mark (140ms);
2. previous route retracts or desaturates (220ms);
3. the image crop moves no more than 4% to the relevant zone (550ms);
4. the new route draws from perceived source to likely inspection points (700–900ms);
5. the conclusion and CTA context update together.

Never auto-cycle the states. Selection works by pointer, touch, Tab plus Enter/Space, and arrow keys inside the radio/tabs pattern. Do not fire analytics until a user actively changes selection.

### Reduced motion

The selected crop and complete route swap immediately. A 100ms colour response is allowed. The DOM conclusion changes without transition. All six options remain available.

## 5. Scene C — Transmission-path drawing

### Purpose

Explain the central engineering insight: the obvious surface can be the wrong target because energy travels through junctions and flanking structures.

### Composition

A full-width architectural section or axonometric drawing occupies 70–85svh. The active caption is sticky in the outer margin, not overlaid as a dashboard. The same six symptom controls from Scene B may carry state into this scene; the current choice is preserved in URL/session state when appropriate.

### Path phases

#### C0 — Symptom

Highlight the receiving room and perceived surface. Label: “где слышно”.

#### C1 — Competing hypotheses

Draw two or three thin teal-grey candidate routes to real junctions. Label each qualitatively: “прямой путь”, “через примыкание”, “по конструкции”.

#### C2 — Diagnostic isolation

Non-selected routes become dashed and reduce to 30–40% opacity. The inspected route gains terminal markers at each construction change.

#### C3 — Conclusion

Selected route becomes brick. The corresponding inspection list appears as plain text. Conclusion: “Проектируем не поверхность, а путь передачи и его примыкания.”

### User control

- Six labelled symptom buttons are always visible or reached with one deliberate open action.
- An optional “Показать путь” control replays the finite draw once; no automatic replay loop.
- On mobile, the drawing is fitted to width; if panning is necessary, provide visible zoom/pan controls and “Вписать чертёж”. Prefer a simplified mobile drawing to pan.

### Reduced motion

Show C3 immediately for the selected symptom. Provide a static legend distinguishing perceived surface, candidate paths, selected path and inspection points by both shape and colour.

## 6. Scene D — Construction layer detail

### Purpose

Make mass, decoupling, sealing and junction control understandable without claiming a universal system or unverified dimensions.

### Trigger and controls

This is a user-controlled detail with three example contexts: wall, ceiling, floor. Only one is active. Each context uses a dedicated diagram; do not rotate one generic stack ninety degrees.

### Timeline

#### D0 — As assembled

Layers appear as a coherent section with two junction callouts. No motion until the scene is in view or the user selects a context.

#### D1 — Separation

Layers move apart along the true section axis over 650–900ms. Labels appear after their leader line reaches the layer. Use generic functional labels where exact material composition is not verified: “масса”, “развязка”, “поглощение”, “герметичный контур”.

#### D2 — Critical bridge

One rigid bridge or unsealed edge is marked in brick. A small route crosses it, showing how the shortcut compromises the assembly. Caption: “Один жёсткий мост может обойти рабочие слои.”

#### D3 — Controlled junction

The bridge retracts or receives the intended isolation/sealing condition. The route stops at the boundary. Hidden-work checkpoint appears: photograph/record before closure; acceptance criterion agreed before work.

### Constraints

- Do not state exact thicknesses unless supplied elsewhere as verified project data.
- Do not imply one universal construction.
- Do not animate layers floating independently in 3D space.
- Keep labels outside material shapes when possible.

### Reduced motion

Show assembled and expanded sections side-by-side or sequentially, with the critical bridge and controlled junction both labelled. Toggle changes are immediate.

## 7. Scene E — Six-step diagnosis process

### Purpose

Turn the service method into a measured sequence without a row of icon cards.

Use one long vertical datum line with six offset steps:

1. симптом;
2. источник и путь;
3. конструкция;
4. объём и бюджет;
5. монтаж своей бригадой;
6. проверка результата.

As each step enters the reading zone, its short horizontal witness mark extends and the adjacent conclusion gains ink colour. Previously read steps remain visible. A small sectional image changes only at steps 2, 3 and 5; do not animate every paragraph.

Reduced motion: complete timeline present from first paint, no sticky behaviour.

## 8. Scene F — Renovation-stage editorial stories

### Purpose

Explain that intervention, risks and planning differ before renovation, during it and in a finished apartment.

The three stories must not be equal cards:

- **Новостройка до ремонта** — a wide image with a plan-margin; reveal routes before finishes.
- **Ремонт идёт** — a narrow vertical site photograph next to a large checklist; one image mask exposes hidden-work control.
- **Готовая квартира** — a calm finished interior with a low horizontal crop; annotations emphasise dust, demolition boundaries and unknowns rather than promising a no-demolition outcome.

Motion is limited to editorial crop reveals and one sticky caption per story. Each motion ends with a diagnosis CTA carrying the stage context.

Reduced motion: use final crops and all captions; no information concealed by masks.

## 9. Scene G — Measurement cases

### Purpose

Present achieved results without fabricating case context.

Each case uses a different graph grammar:

### G1 — `58 dB → 39 dB`

Two vertical datum marks draw from a shared baseline. Numbers are visible from the start; do not count from zero. A short connector establishes the achieved difference without claiming a system.

### G2 — `71 dB / снижение пикового уровня на 16 dB`

A single peak trace draws once. The peak marker and `−16 dB` annotation appear at the factual comparison point. Avoid waveform spectacle.

### G3 — `64 dB → 43 dB`

Two horizontal measured bands align with a sectional image. The “before” band reduces in ink density as the achieved reading is disclosed; both values remain visible.

Every case includes “Иллюстративная визуализация; не фотография объекта заказчика.” No addresses, names, exact system, price or duration.

Reduced motion: complete graphs and values appear immediately. Never hide the before value.

## 10. Scene H — Preliminary solution brief

### Purpose

Collect useful context without performing a fake calculation.

As the visitor answers noise, likely direction, property stage, room, problem area and acceptable space loss, an “Исходные данные” margin rail is progressively filled. Each answered row receives a 1px completion rule; no progress ring or celebratory animation.

The output changes meaningfully and is explicitly provisional:

- probable noise type;
- zones to inspect;
- likely intervention scale in qualitative terms;
- unknowns that require diagnosis;
- next diagnostic step.

Transition between questions is 200–300ms and limited to a small sheet shift. Context carries to the application. No exact price, reduction or thickness is generated.

Reduced motion: all questions render in one continuous accessible form; the summary updates immediately.

## 11. Scene I — Hidden-work control

Use a large material junction image with a vertical inspection rail. Four checkpoints appear as the user scrolls: substrate/route, decoupling, sealing/penetrations, record before closure. Each checkpoint points to an actual visible region; no generic check icons floating over the image.

The final state resolves into the verified statements:

- “Контролируем технологию, монтаж и критические узлы.”
- “Фиксируем скрытые работы.”
- “Критерии приёмки согласуются до начала работ.”
- “Условия гарантии фиксируются в договоре.”

Reduced motion: all checkpoint leaders and statements are present.

## 12. Scene J — FAQ and application

FAQ uses calm line expansion: answer height and one rule change over 180–240ms. Respect native button semantics and `aria-expanded`. No accordion item auto-opens while scrolling.

The application form is a large engineering brief, not a centred modal. Steps reveal like stacked sheets; a persistent side summary shows what will be sent. Upload processing uses a finite progress indicator only when actual processing occurs. After submit:

- show pending while awaiting the server;
- show success only after confirmed acceptance;
- keep error and entered data visible on failure.

The final transition returns to a quiet interior and states what happens next: a manager contacts the visitor; the next commercial step is an on-site diagnosis.

## 13. Performance implementation notes

- Render hero copy and a correctly sized hero image server-side; LCP must not wait for animation code.
- Reserve image aspect ratios to avoid layout shift.
- Dynamically import GSAP/ScrollTrigger only for pages containing a scroll scene.
- Use SVG `pathLength`/stroke dash animation for routes; keep path complexity low.
- Prefer CSS clip paths or an SVG mask to a canvas for the cutaway.
- Use `IntersectionObserver` to initialise below-fold scenes and destroy/recreate timelines on relevant breakpoint changes.
- Do not attach a global unthrottled scroll handler.
- Pause observation for scenes well outside the viewport.
- A failed or disabled animation dependency must leave final content visible.

## 14. Motion QA capture matrix

For hero, transmission path and construction detail, capture at:

- start;
- 25%;
- 50%;
- 75%;
- end.

Test at 1440×1000, 1024×1366 and 390×844, plus one `prefers-reduced-motion: reduce` capture at desktop and mobile. PASS requires:

- visible semantic difference between start and end;
- no label collisions or clipped copy;
- no scroll trapping or horizontal overflow;
- keyboard and touch can select every state;
- the final engineering conclusion remains understandable with JavaScript animation disabled;
- no sustained frame-rate collapse on a normal laptop;
- no looping decorative movement after a scene concludes.
