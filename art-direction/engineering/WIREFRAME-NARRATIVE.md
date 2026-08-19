# QUIET / ENGINEERING — Wireframe Narrative

## 0. Narrative premise

The homepage is a calm architectural essay that gradually acquires engineering evidence. It starts with an inhabited room, moves from symptom to constraints and renovation stage, then opens one large transmission drawing. Only after the visitor understands the path does it present method, construction control, measured results and an engineering brief.

This sequence is intentionally not a “hero → cards → process → cases → form” stack. Section lengths, image ratios, typography and interaction modes change. The continuous connective tissue is a fine datum line that sometimes becomes a measurement, margin, timeline or form rule.

The visitor's mental progression is:

> «Это про мой шум» → «этап ремонта меняет границы решения» → «очевидная поверхность может быть не причиной» → «диагностика определяет конструкцию» → «монтаж можно контролировать» → «результат измеряют» → «я понимаю следующий шаг».

## 1. Global frame

### Header

A 64–76px transparent perimeter rail over the hero becomes a 56px paper rail after scroll. Desktop content:

- public wordmark `Лаборатория тишины` at left;
- links: `Проблемы`, `Как работаем`, `Результаты`, `Диагностика`;
- compact text action `Записаться` at right.

Do not display internal concept names publicly. No floating pill, glass bar or dashboard navigation.

Mobile uses wordmark, diagnosis text action and menu button. The menu opens as a paper drawing sheet with large route labels and retains a direct diagnosis action.

### Persistent reading aids

- Desktop: an unobtrusive section number in the outer margin, updated without animation theatre.
- Mobile: no fixed section number; use inline mono captions.
- Current symptom/stage context may persist in state and later prefill the engineering brief, but must never obscure content.

## 2. Homepage at a glance

| Chapter | Spatial type | Core question | Main action |
|---|---|---|---|
| 01 Hero | full-bleed asymmetrical room/cutaway | Why diagnose before building? | Free diagnosis |
| 02 Evidence margin | continuous editorial band | Is this a real engineering service? | Read method anchor |
| 03 Symptom index | vertical index + changing crop | What exactly do I hear? | Select symptom |
| 04 Renovation boundaries | three unequal spreads | What can be done at my stage? | Select stage |
| 05 Transmission section | one large drawing | Why can the obvious surface be wrong? | Switch route |
| 06 Diagnostic datum | long measured sequence | What happens during diagnosis? | Continue to brief |
| 07 Construction/hidden work | cutaway + inspection rail | How is a solution chosen and controlled? | Explore junction |
| 08 Measurement reports | three non-identical report spreads | What results were achieved? | Open case |
| 09 Engineering brief | full-width working document | What is the probable scenario? | Carry context to form |
| 10 Honest limits/FAQ | marginal questions | What remains unknown? | Open answer |
| 11 Application | large diagnosis sheet | What happens after submission? | Submit application |
| 12 Quiet close | small interior + contacts | How do I contact the team? | Phone/email/diagnosis |

## 3. Chapter 01 — Architectural hero

### Job

Communicate in three seconds that the company finds the cause before prescribing construction.

### Desktop composition

One full-bleed generated interior, 108–120svh. This is not a left text/right image split:

- H1 spans columns 1–9 and crosses a quiet architectural edge;
- support copy sits independently around columns 2–5 near the lower third;
- CTA sits around columns 7–10, creating a diagonal reading path;
- a fine line begins at a real wall/ceiling junction and terminates near the CTA;
- the room owns the whole field behind and around the copy.

Required H1:

> Сначала найдём причину шума. Потом спроектируем тишину.

Supporting copy:

> Диагностика, проект, собственная бригада, монтаж и проверка результата в Москве.

Primary CTA:

> Записаться на бесплатную диагностику

Secondary text action:

> Сначала описать проблему

### Scroll meaning

Across the hero continuation the photograph reveals a local architectural cutaway, relevant witness marks and one selected route. The final conclusion is:

> Не назначаем конструкцию, пока не понимаем путь передачи.

The hero never becomes a full dark x-ray or technical dashboard. Details are specified in `MOTION-STORYBOARD.md`.

### Mobile

Use a portrait/4:5 view of the same visual family. The H1 overlaps the image's lower edge and a paper field. The cutaway is a vertical scroll reveal with labels in a separate rail below. CTA occupies full available width but remains rectangular and calm.

## 4. Chapter 02 — Evidence in one margin

### Job

Establish authority quickly without badges, logos or cards.

### Composition

A 88–120px-high continuous paper band touches the hero end. Four facts sit on one baseline and are separated by vertical rules:

- `15 лет` — `работаем с шумом и вибрацией`;
- `сначала диагноз` — `потом конструкция и расчёт`;
- `своя бригада` — `ответственность за монтаж`;
- `до и после` — `проверка результата в пути клиента`.

On tablet, the band wraps to two rows without becoming four boxes. On mobile, facts become a vertical marginal list with one unbroken left rule.

No animation beyond witness marks extending as the band enters. Link “Как устроена диагностика” jumps to Chapter 06.

## 5. Chapter 03 — “Что именно вы слышите?” editorial index

### Job

Build recognition, select a working context and introduce different likely routes without implying diagnosis from a click.

### Composition

This is a tall editorial spread, approximately 120–150svh on desktop:

- left 4 columns: oversize question and vertical numbered index;
- middle 6 columns: a changing crop/section of one architectural field;
- right 2 columns: a concise “проверить” margin and diagnosis link.

Six options with supplied proportions:

1. Шаги и удары сверху — ~40%.
2. Голоса через соседнюю стену — ~25%.
3. Бас и музыка — ~15%.
4. Лифт и вибрация — ~7%.
5. Дорога и улица — ~7%.
6. Вентиляция — ~6%.

Selection changes all of the following:

- architectural crop or diagram emphasis;
- complete route preview;
- one-line mechanism description;
- zones to inspect;
- CTA context carried forward.

It must not merely swap paragraph text in tabs. Provide real radio/tabs semantics, keyboard arrows and touch controls. Default can be top impact noise, but label percentages as approximate supplied scenario proportions, not scientific market statistics.

### Mobile

The active crop appears first; below it, a vertical radio index with large row targets. Selecting a row updates the image and a visible “Что проверить” paragraph. No horizontal carousel.

## 6. Chapter 04 — “Ремонт задаёт границы решения”

### Job

Answer early whether the service applies before renovation, during it or in a finished apartment. This chapter deliberately precedes the large path diagram so visitors with demolition anxiety receive relevance before technical depth.

### Story A — New building before renovation

- 16:9 unfinished-space image spans columns 1–9.
- Oversize conclusion enters the lower-right paper field: `Лучший момент — когда узлы ещё открыты.`
- Margin lists opportunities: inspect routes, coordinate construction with project, plan space loss.
- Avoid promising an optimal result without diagnosis.

### Story B — Renovation in progress

- Portrait work-in-progress image on columns 8–12; text occupies columns 2–7.
- A vertical hidden-work rule visually joins image checkpoints and the statement `Важно проверить то, что скоро закроют отделкой.`
- Explain coordination and recording of hidden works.

### Story C — Finished apartment

- Very wide low image bleeds from the left; a graphite text block occupies a narrow right margin, not half the screen.
- Conclusion: `Сначала определим, где вмешательство действительно нужно.`
- Acknowledge dust, demolition and repeat-renovation fears; do not promise a dust-free or no-demolition solution before inspection.

Each story has a diagnosis action with stage context. The three layouts and crop ratios are deliberately unequal.

### Mobile

Image → conclusion → risks/opportunities → contextual CTA. Keep distinct aspect ratios (4:3, 3:4, 16:9) so the chapter still has rhythm.

## 7. Chapter 05 — “Шум выбирает путь, а не очевидную поверхность”

### Job

Deliver the central engineering explanation in the largest technical scene of the site.

### Composition

A warm-plaster field holds one large architectural section/axonometric drawing spanning almost the viewport. A narrow sticky caption sits in the outer margin. Six symptom selectors remain available as numbered labels along the drawing edge. There are no cards over the drawing.

The selected story moves through:

1. where sound is perceived;
2. two or three plausible route hypotheses;
3. diagnostic isolation;
4. selected path through actual junctions;
5. zones that require inspection.

Use honest labels:

- `где слышно`;
- `прямой путь`;
- `через примыкание`;
- `по конструкции`;
- `проверить на месте`.

Conclusion:

> Проектируем не поверхность, а путь передачи и его примыкания.

Do not state that the illustrated path is the visitor's diagnosis. CTA copy: `Проверить путь в моей квартире` leading to the diagnosis brief.

### Interaction

Switching the six symptoms redraws a different physically coherent route and updates both legend and inspection list. A “Показать путь” control may replay the finite draw once. No auto-cycle or loop.

### Mobile

Use simplified vertically legible sectional variants, one route at a time. Prefer fit-to-width over pan. If pan is unavoidable, provide controls and `Вписать чертёж`. The plain-language conclusion remains adjacent.

## 8. Chapter 06 — “Сначала диагноз, потом смета”

### Job

Explain what happens and why this prevents premature spending on materials/installation.

### Composition

A long vertical datum occupies columns 3–4. Six steps alternate across it with intentionally different depths, not equal cards:

1. `Фиксируем симптом` — what, where, when.
2. `Ищем источник и путь` — inspect competing hypotheses.
3. `Проектируем конструкцию` — task, building, renovation stage, constraints.
4. `Считаем объём и бюджет` — after essential unknowns are reduced.
5. `Монтируем своей бригадой` — control critical nodes and hidden work.
6. `Проверяем результат` — criteria agreed before work; measurements before/after belong to the intended journey.

An image changes only at major logical shifts: symptom, construction, installation. White space between steps makes consequence visible. A small brick marginal note after step 2 states: `Прайс за м² до диагноза создаёт ложную точность.` Do not publish fictional prices.

### Mobile

One continuous left rule with all six steps on the right. No accordion; the process must remain scannable without interaction.

## 9. Chapter 07 — Construction choice and hidden-work control

### Job

Show why construction is selected for the task and how a small junction defect can compromise an otherwise plausible assembly.

### Part 1: layer detail

The heading occupies columns 1–6; an expanded wall/ceiling/floor detail occupies columns 5–12, deliberately overlapping the heading zone. Three text controls choose context. The active section separates along its true construction axis and names functional roles:

- mass;
- decoupling;
- absorption;
- sealed contour;
- junction control.

Exact material composition and dimensions remain unclaimed unless verified for an actual design. One brick path crosses a rigid bridge in the problem state. The corrected condition stops the shortcut.

Conclusion:

> Один жёсткий мост может обойти рабочие слои.

### Part 2: hidden-work inspection rail

Without resetting into a new card section, the same detail grows into a wide installation image. A vertical rail points to:

1. base and route;
2. decoupling;
3. sealing and penetrations;
4. record before closure.

Verified wording:

- `Контролируем технологию, монтаж и критические узлы.`
- `Фиксируем скрытые работы.`
- `Критерии приёмки согласуются до начала работ.`
- `Условия гарантии фиксируются в договоре.`

This chapter is one continuous “detail → defect → control” narrative, not a services grid.

## 10. Chapter 08 — Measured results as three reports

### Job

Provide evidence while clearly limiting claims to supplied numbers.

The three cases use different geometry and graph language.

### Report 01 — `58 dB → 39 dB`

- full-width room crop;
- two vertical datum marks in the left third;
- result headline overlaps the lower paper margin;
- short link: `Открыть историю измерения`.

### Report 02 — `Пиковый уровень 71 dB → снижение на 16 dB`

- restrained graphite field on the left, sectional image on the right at a 7/5 ratio;
- one peak trace, drawn once;
- fact phrasing preserves “reduction by 16 dB”, not a fabricated final value.

### Report 03 — `64 dB → 43 dB`

- low horizontal image between two paper bands;
- before/after values align to the image's architectural section;
- achieved result, never a target.

For every report:

- state `Иллюстративная визуализация, не фотография объекта заказчика`;
- do not invent address, customer, residential complex, system, duration, budget or protocol details;
- provide one sentence about what the case can and cannot establish;
- `case_open` and contextual diagnosis CTA are tracked.

### Mobile

Keep different structures: vertical datum, peak trace, horizontal bands. Values remain visible from first paint; do not use count-up from zero.

## 11. Chapter 09 — Preliminary solution as an engineering brief

### Job

Help the visitor organise the task and produce a meaningful provisional inspection brief, not a fake quote.

### Desktop composition

Use a full paper “working document” with questions on columns 1–8 and a sticky `Исходные данные` margin on columns 10–12. No centred rounded wizard container.

Inputs:

1. primary noise;
2. likely direction;
3. property stage;
4. room;
5. problem area;
6. acceptable loss of space;
7. optional comment.

Provisional output:

- probable noise type;
- zones to inspect;
- qualitative intervention scale;
- unknowns;
- next diagnostic step.

Every output begins with a visible qualification: `Предварительный сценарий, не проект и не смета.` Exact price, guaranteed reduction, construction thickness and named system are prohibited.

Primary action after completion:

> Передать вводные на диагностику

Selected context carries into the application form and analytics events `scenario_started`, `scenario_completed`, `noise_selected`, `path_selected`, `renovation_stage_selected`.

### Mobile

Render all questions in one scrollable document. The summary appears after the current group and can be expanded from a sticky text button, never a floating bubble. No content depends on drag.

## 12. Chapter 10 — Honest limits and FAQ

### Job

Increase trust by stating unknowns before the form.

### Composition

A narrow question column around columns 2–5 and a wide answer field around columns 6–11. Use open rules, not cards. One question can be expanded at a time on desktop; all remain accessible in the DOM.

Required topics:

- Why photographs/phone recordings cannot replace professional measurement.
- Why the obvious wall/ceiling may not be the only route.
- What can and cannot be known before an on-site diagnosis.
- How finished-apartment constraints are discussed.
- Why there is no universal price per square metre here.
- How criteria and guarantee terms are agreed.
- What happens after the application.

Required meaning for attachments:

> Запись с телефона помогает понять контекст, но не заменяет профессиональный замер.

Open actions track `faq_open`. Answers do not use marketing absolutes.

## 13. Chapter 11 — Diagnosis application as a large sheet

### Job

Collect the complete underlying form data while making the next step explicit.

### Composition

A restrained graphite threshold introduces the form, then a large paper application sheet enters asymmetrically. Desktop sheet spans columns 2–11; form fields occupy 2–7 inside it, with a contextual summary and “what happens next” on 8–10. No modal and no small centred card.

Fields:

1. what is heard;
2. direction/suspected source;
3. when heard;
4. rooms;
5. new building / renovation / finished apartment;
6. building type, optional;
7. approximate problem area, optional;
8. comment;
9. optional files: plan, photos, video, audio;
10. name;
11. phone;
12. email, optional;
13. consent.

Attachment tray supports drag/drop desktop and native mobile selection, removable items, processing state, preview where practical and accessible errors for PDF/JPG/PNG/HEIC/MP4/MOV/M4A/MP3/WAV validation.

Copy beside submit:

> После заявки менеджер свяжется с вами, уточнит задачу и согласует следующий коммерческий шаг — выездную диагностику.

The interface shows success only after server confirmation. On error, preserve entries and show a direct recovery path. Phone and email remain visible alternatives.

### Mobile

The form becomes one continuous document with clear group headings. Summary appears before submit. Touch targets are at least 44px. Native file selection is primary; drag/drop language is secondary/hidden.

## 14. Chapter 12 — Quiet close and footer

### Job

End in residential calm and offer contacts without creating another campaign panel.

A small final consultation/interior visual occupies about 40% width, offset from a large paper field. One restrained conclusion:

> Тишина начинается не с материала, а с правильно поставленной задачи.

Actions:

- `Записаться на бесплатную диагностику`;
- configured phone;
- configured email.

Footer is a minimal ruled index: service routes, cases, diagnosis, privacy placeholder, public contacts. No logo cloud, social proof inventions or newsletter.

## 15. Service and case route narrative

All required routes inherit the visual grammar but must not be identical templates.

### Service-detail routes

Each service route uses this adaptable four-beat logic:

1. route-specific conclusion-led H1 with a distinct editorial crop;
2. symptom/path section relevant to that surface/context;
3. constraints, junction detail and renovation-stage implications;
4. diagnosis brief/action.

Vary composition by intent:

- apartment overview uses a wide whole-room section;
- wall uses a tall junction detail and flanking path;
- ceiling uses a top-heavy crop and impact route;
- floor uses a low datum and perimeter condition;
- neighbours uses two adjacent spatial fields with a shared boundary;
- new building uses plan-like open margins;
- finished apartment uses a low horizontal image and intervention-boundary notes;
- diagnosis uses the engineering brief as its main page, not a decorative hero.

Use “шумоизоляция” in primary URLs/H1s and “звукоизоляция” naturally in body/FAQ/metadata. Do not create a door service page.

### Cases index

The cases index is a numbered measurement folio. Each result receives a unique graph thumbnail and composition; no 3-card row.

### Case detail routes

Each case page opens with the verified measurement headline, then shows:

- what the supplied figure establishes;
- an illustrative visual clearly disclosed;
- a diagram/graph appropriate to the number;
- unknown case details explicitly omitted rather than invented;
- diagnostic relevance and CTA.

Do not infer addresses, systems, budgets, durations, client identity or legal conclusions.

## 16. Responsive narrative rules

### At 1024×1366

- preserve asymmetry with an 8-column grid;
- reduce marginal notes to one active rail;
- do not reduce body copy below 17px;
- drawings fit the viewport and move long legends beneath;
- evidence band becomes two continuous rows;
- sticky scenes end before their next section starts.

### At 390×844 / 375×812

- convert spread logic into a staggered essay, not equal stacked cards;
- maintain distinctive image ratios and type scale;
- separate live labels from image pixels to avoid collisions;
- keep only one active diagram route;
- no horizontal body overflow;
- no hover-only information;
- preserve hero cutaway, route drawing and layer/junction meaning;
- diagnosis action appears after every major decision chapter but never as an obstructive floating bar.

## 17. Content and conversion safeguards

- Public brand is only `Лаборатория тишины`; do not append “Дом”.
- Primary geography is Moscow.
- Use only `15 лет работаем с шумом и вибрацией`; do not expand it to unverified residential-construction tenure.
- Free initial diagnosis, own crew, responsibility, manufacturer independence and measurement journey may be stated.
- Do not invent exact price, calculator precision, guarantee terms, certificates, reviews, scarcity or ratings.
- Major CTAs relate to diagnosis; no buying panels/materials/packages.
- Contact values come from central configuration; do not hardcode fictional phone/email.
- Generated images are never described as real client photography.
- The visitor must always understand what happens after submission.

## 18. Narrative acceptance test

The homepage fails if any answer is “no”:

1. Is the promise understood before the first scroll?
2. Does the first technical explanation arise from the hero image rather than a separate dashboard?
3. Does the visitor recognise a symptom before being asked for contact details?
4. Are renovation stages treated as unequal editorial stories, not three cards?
5. Can a visitor explain why the obvious surface may be wrong after Chapter 05?
6. Does the process clearly place diagnosis before estimate and construction?
7. Does the layer scene show a failure-prone junction and hidden-work control?
8. Are all three achieved measurement headlines exact and free of invented context?
9. Does the preliminary scenario avoid fake price/precision?
10. Does the application explain the manager contact and on-site diagnosis step?
11. Does the rhythm alternate image, drawing, process, report and document rather than repeating one component system?
12. Does mobile preserve the same reasoning and at least three semantic interactions?

