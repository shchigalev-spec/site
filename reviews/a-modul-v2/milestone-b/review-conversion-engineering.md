BLOCKED

# Conversion + Engineering/Factual Review — Milestone B

## Gate summary

- P0: 0
- P1: 4
- P2: 2
- P3: 0

Milestone B is blocked. The verified company, production, case, leasing, and seismic copy is generally disciplined, but the core configurator-to-diagnosis handoff does not work in the live application, the configurator applies a personnel metric to object types for which that metric is not valid, the project finder treats unverified internal classifications as matched facts, and the interactive factory sequence omits mandatory production stages.

## Consolidated issue list

### P1 — The promised configurator handoff and regional personalization are disconnected

- Location: `ObjectConfigurator.svelte`, `LogisticsMap.svelte`, `MiniBrief.svelte`; live `#configurator`, `#logistics`, and `#project-brief` flow.
- Independent reproduction: selected `Офис / АБК`, `500`, `Сибирь`, and changed the functional zones. The application wrote an `a-modul-configurator` session payload, but `Передать контур в диагностику` only scrolled to an empty mini-brief. `MiniBrief.svelte` never reads that payload and writes a separate `a-modul-mini-brief` key.
- Independent reproduction: after changing the configurator region to `Сибирь`, the live logistics result still read `Новосибирск → Дальний Восток`. After changing the map to `Урал`, the configurator still displayed `Сибирь`, although the stored payload had silently changed to `ural`.
- Why this blocks: the Milestone B specification requires session carry-forward, regional personalization, local context handoff, and a truthful diagnostic CTA. At present the visible controls, route visualization, and saved context can disagree, and the CTA text `Передать контур в диагностику` promises a transfer that does not occur.
- Required correction: use one typed, allowlisted state contract (shared store or an equivalent same-page event contract), update the configurator and logistics result immediately in both directions, and prefill/preserve compatible object type, capacity/metric, region, and selected functional zones at the diagnostic handoff. Keep the current honest no-submission behavior until a server-confirmed form exists.
- Retest: configure a non-default object and region, verify both components update without reload, follow every relevant CTA, inspect the visible diagnosis fields and stored payload, reload within the same tab, and confirm there is one coherent context rather than two divergent session records.

### P1 — Capacity semantics and required composition choices are not truthful for all object types

- Location: `ObjectConfigurator.svelte`, live `#configurator`.
- Evidence: the fixed `100 / 300 / 500 / 1000 / Другая` personnel scale is used for every type. Selecting `Офис / АБК` produces `Масштаб — 500 человек`, while the same output says the next step is to determine workplace count. Selecting `Отдельное здание` also forces a people count even though the authoritative general-route model permits area or an appropriate type-specific capacity. The master specification assigns those fixed personnel presets specifically to shift camps.
- Evidence: the shift-camp composition omits the required `Спорт / досуг` and `Другое` choices. If every zone is deselected, the output still does not add functional composition to `Нужно уточнить`.
- Why this blocks: these are core engineering inputs. Treating people, workplaces, and area as the same unit creates a semantically invalid diagnostic payload and can misdirect the commercial/engineering follow-up.
- Required correction: define metric and label by object type (personnel for settlements/dormitories, workplaces for office/ABK, and an explicitly chosen area/personnel/custom basis for a generic building), include the missing required functional choices, and surface an empty composition as a missing input. Do not calculate an exact area or module count.
- Retest: exercise every object type, preset/custom capacity, empty/partial/full zone state, output wording, and stored unit; confirm no type displays a unit that is not valid for it.

### P1 — The finder reports undocumented taxonomy as a matched project fact

- Location: `ProjectFinder.svelte`, live `#finder`.
- Evidence: the dormitory record is internally classified as `climate: 'cold'`. Selecting `Общежитие` plus `Холодный регион` returns `Найден близкий аналог` with no climate difference. The approved source record intentionally withholds locality because the official case page conflicts between geographic descriptions, and neither the internal registry nor the approved locked facts establishes a climate classification for this analogue.
- Evidence: the Kamchatka record is internally classified as `delivery: 'mixed'`. The verified project source establishes that shipment followed vessel departures from Petropavlovsk-Kamchatsky, but it does not approve the landing's full `mixed` delivery taxonomy. Selecting that filter therefore also suppresses a difference on an inferred value.
- Why this blocks: the similar-project finder is explicitly required to use verified facts and to name every relevant difference when no exact analogue exists. Hidden filter metadata still becomes a public factual assertion when it decides whether the result is a match.
- Required correction: give unverified dimensions an explicit `not-published`/unknown state, do not let them satisfy an exact filter, and disclose the corresponding difference. Only map a project to `cold`, `mixed`, or another engineering/logistics taxonomy when the approved source registry records that exact classification.
- Retest: exhaust the six filter dimensions for both cases, including climate and delivery, and verify that every `Найден близкий аналог` result is supported by allowlisted source facts and every unknown/mismatch is named.

### P1 — The interactive production sequence is incomplete

- Location: `FactorySequence.svelte`, live `#factory`.
- Evidence: the six live stages are `Каркас → Ограждение → Инженерия → Комплектация → Контроль → Отгрузка`.
- Required sequence: `металл → каркас → ограждение → инженерия → отделка → контроль качества → отгрузка`. The current controls omit metal preparation and finishing as distinct stages; `Комплектация` does not explain either missing stage.
- Why this blocks: the finite factory sequence is a mandatory Milestone B interaction and a primary mechanism supporting the production-capacity claim. A generated factory plate that visually suggests more steps does not replace the required interactive process states.
- Required correction: implement all mandated stages in the approved order, retain the project-specific capacity caveat, and keep the final shipment state stable. Do not expand this into an unsupported equipment catalogue.
- Retest: exercise each stage by keyboard/pointer, confirm unique active state and distinct explanatory content, and verify the sequence covers metal, frame, envelope, engineering, finishing, quality, and shipment.

### P2 — Leasing interest has no dedicated conversion path

- Location: `PriceScope.svelte`, price-scope footer.
- Evidence: the caveat is good (`Ставка, график, одобрение и состав сделки зависят от проекта и лизинговой компании`), but the only footer CTA is the generic `Получить сопоставимое КП`. The authoritative leasing flow calls for `Возможна поставка в лизинг.` and a dedicated `Уточнить лизинговую схему` CTA.
- Impact: no false rate or payment schedule is shown, so this is not a factual blocker, but a user with explicit financing intent loses that context before diagnosis.
- Required correction: use the approved leasing formulation and add the dedicated CTA/mode so the later diagnostic form can receive an allowlisted leasing-interest flag without implying lender approval.

### P2 — The configurator's prominent count can be mistaken for a module count

- Location: `ObjectConfigurator.svelte`, purple output panel.
- Evidence: the output displays a large standalone `08` below `Предварительный контур`; its unit is not stated. The surrounding list reveals that it is the number of selected zones and the intro explicitly disclaims an invented module count, but the most visually prominent number remains ambiguous.
- Impact: this weakens the otherwise correct no-module-count safeguard in a high-stakes configurator.
- Required correction: label the value explicitly as `8 функциональных зон` (or remove the count). Continue to avoid any calculated module quantity until verified rules exist.

## What passed independent inspection

### Offer, CTA hierarchy, and truthfulness

- The H1 and support copy communicate a full project/production/logistics/launch contour rather than a commodity module price.
- The primary one-working-day CTA retains the exact adjacent qualification `После получения основных исходных данных.` in the initial viewport evidence and live page.
- Header, risk, finder, price, case, and boundary CTAs all lead to diagnosis; no CTA emits a fake lead success or manager-contact state.
- The mini-brief continues to state that parameters are only stored in the tab and the request has not been submitted.

### Risk and logistics logic

- All nine live risk controls were exercised. They cover source data, geology/foundation, climate, seismic conditions, engineering, logistics, site preparation, installation, and launch; each has a distinct risk/control explanation.
- The required conclusion is present: `Один проектный контур. Один график. Один ответственный за результат.`
- The logistics map identifies Novosibirsk as the calculation origin, covers road, rail, sea, river, winter road, and mixed delivery across its regional modes, and repeatedly states that it is not to scale and contains no distance, delivery duration, or price calculation.
- No random numeric route, fake logistics price, fake kilometre value, or promised delivery duration was found.

### BIM, price scope, and production indicators

- The BIM story has the required seven finite states from site plan/composition through modules, production, delivery, installation, and operational object. It expressly says model detail depends on stage and contract and does not promise a detailed working model before inputs/contract.
- The price section uses an eight-row scope matrix and no universal per-square-metre number. It distinguishes module-only scope from project, engineering, fit-out, delivery, site, installation, and commissioning responsibility.
- Current production indicators are correctly scoped as `25 000 м²`, `до 750 модулей в месяц`, and `до 25 модулей в смену`, followed by a clear statement that they are capabilities rather than a guaranteed project tempo.

### Case facts, seismic copy, and generated visual framing

- Live official-source rechecks support the published Kamchatka period (February 2022–February 2023), `2 476,36 м²`, 105 residential/single modules with porches, listed functional buildings, Avista scope, and vessel-departure constraint. The dominant case uses those facts without inventing a price or performance result.
- The dormitory analogue retains the locked facts `3 общежития / 300 человек / 3 200,4 м² / 180 модулей / транспаки` and correctly avoids publishing the disputed locality.
- The seismic headline is the exact locked phrase `Объекты «Ависты» на Камчатке выдержали землетрясение магнитудой 8,8 без разрушений.` The exact support sentence is present, with an additional case-scope caveat; no competing `8,6 баллов`, guarantee, certificate, or generalized design-intensity claim appears.
- Dominant-case imagery is explicitly labeled `Визуализация ... — не фотография объекта`; finder imagery is labeled as visualization. The production records identify the three Milestone B masters as Codex-generated, and the live route does not present them as customer photography.

### Routes, canonical, and forbidden claims

- Independent HTTP/browser checks: `/modulnye-zdaniya/` returns 200; `/` returns 307 to `/modulnye-zdaniya/`; canonical is exactly `https://a-modul.ru/modulnye-zdaniya/`.
- No invented price, per-m² rate, delivery distance, project duration, engineering guarantee, customer result, review, address, certificate, or fake success was found. The only public dates are the verified Kamchatka case period and the qualified one-working-day preliminary-proposal promise.
- Mixed units were not found in the verified case/production displays; the invalid capacity semantics are isolated and classified above.

## Evidence and independent checks

- Live target: `http://127.0.0.1:5175/modulnye-zdaniya/`.
- Read and inspected: Milestone B `SPEC.md`, `DIFF-SUMMARY.md`, `TEST-RESULTS.md`, `qa-results.json`, desktop evidence, interaction/motion/diff artifact inventory, complete Milestone B components, `facts.ts`, route markup, source-facts registry, generated-image prompts, and asset manifest.
- Browser interactions: live configurator payload and output, cross-component region state, diagnosis handoff, exact/no-match finder states, all risk controls, all factory controls, price/leasing copy, route status, canonical, and runtime console/page errors.
- Runtime observation: HTTP/browser route loaded without console or page errors during this review. The deterministic QA's zero-error/overflow/broken-image result is consistent with the inspected evidence; this review does not use that script's `pass: true` as a substantive approval.
- Current official pages were rechecked for company counters, production capability, leasing availability, both case records, and the seismic article. The approved precedence rules in `docs/A-MODUL-SOURCE-FACTS.md` remain necessary because older official pages still expose conflicting production-area/count formulations.

## Gate decision

`BLOCKED` until all four P1 findings are corrected as one batch, deterministic QA is rerun against the coherent live state, and a fresh Conversion + Engineering/Factual Reviewer inspects the changed blocking areas. The two P2 findings are complete non-blocking backlog items under the Fast Execution Override.
