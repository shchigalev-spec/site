BLOCKED

# Conversion + Engineering/Factual Review R2 — Milestone B

## Gate summary

- P0: 0
- P1: 2
- P2: 1
- P3: 0

The four P1 correction areas from R1 now work in their normal valid-input paths: object type drives a truthful metric and composition model, configurator/logistics/diagnosis share region bidirectionally, valid diagnosis context survives reload, unpublished finder taxonomies become named differences, and the factory exposes all seven required stages. Milestone B is nevertheless blocked because the previously accepted tender mode has regressed into an unchanged generic-form handoff and is absent from the saved diagnosis contract, while clearing the commissioning date can leave and later restore a stale saved value.

## Consolidated issue list

### P1 — The tender CTA can open an unchanged generic form, and tender intent is no longer part of the saved diagnosis context

- Location: hero `Пригласить в тендер` CTA in `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`; `MiniBrief.svelte`; `projectContext.ts`; live base route and `?mode=tender#project-brief` variant.
- Live evidence, base-route click: from a clean `http://127.0.0.1:5175/modulnye-zdaniya/` tab, clicking the visible hero tender CTA changed the URL to `?mode=tender#project-brief`, but `.brief__mode` remained absent (`count = 0`). The same mounted mini-brief therefore stayed visually generic. `tenderMode` is read only in `onMount`, so same-route client navigation does not apply the new query state.
- Live evidence, direct tender load: opening `?mode=tender#project-brief` directly did display `Режим / Приглашение в тендер`. After a valid `Офис / АБК`, `125 рабочих мест`, `Сибирь`, `2027-09` diagnostic save, the only payload was `a-modul-configurator = { objectType: "abk", metric: "workplaces", capacity: "custom", customCapacity: "125", region: "siberia", selectedZones: [...], commissioning: "2027-09" }`. It contained no `mode` or tender flag; `a-modul-mini-brief` was absent because the new initialization explicitly removes it. Navigating to the base route preserved the other project inputs but removed all visible tender context.
- Regression evidence: accepted Milestone A R2 explicitly verified a saved allowlisted `mode: "tender"` after reload, and `reviews/a-modul-v2/REVIEW-LOG.md` records tender payload context as resolved. The current `ProjectContext` type and sanitizer omit that accepted field.
- Why this blocks: the master tender rule says not to scroll to the generic form without switching mode. The current primary reproduction does exactly that, and the saved diagnostic context cannot distinguish a tender lead from a standard proposal lead. This is a conversion-routing regression in a previously accepted milestone, not a future Milestone C enhancement.
- Required correction: add an allowlisted diagnosis mode (for example `standard | tender`) to the single persisted context; derive/update it reactively from same-route query navigation; show the visible tender state immediately after the real CTA is clicked; preserve the mode with the other diagnosis inputs through reload/navigation; and do not fabricate a submission or success response.
- Retest: start on the clean base route, click the actual hero tender CTA (do not open the query URL directly), confirm the form visibly switches without a hard refresh, save valid inputs, inspect the single session payload for `mode: "tender"`, reload and navigate to the next/base diagnostic state, and confirm tender intent plus object, metric/value, region, zones, and commissioning remain coherent. Also verify that the standard primary CTA does not accidentally inherit tender mode when a user explicitly starts a new standard diagnosis.

### P1 — Clearing the desired commissioning month does not clear the shared context and a later region change resurrects the stale date

- Location: `MiniBrief.svelte`, `changeCommissioning`; shared `a-modul-configurator` context; live `#project-brief` plus `#logistics` interaction.
- Live evidence: entered `2027-09`; the single payload correctly stored `commissioning: "2027-09"`. Cleared the visible month input; the field became empty, but the payload still contained `commissioning: "2027-09"` because `setCommissioning` is called only for a truthy value. Then selected `Урал` in the logistics section. The region update notified the project-context subscriber, which restored `2027-09` into the previously cleared visible field.
- Why this blocks: R1 required one coherent typed context and immediate bidirectional handoff. Here the visible diagnosis input and saved engineering input disagree, and an unrelated region change silently restores a value the buyer removed. Desired commissioning is a core project input; a stale month must not be carried toward commercial or engineering follow-up.
- Required correction: treat an empty commissioning value as a valid cleared state in the shared contract, persist it immediately, and ensure subscriber updates cannot revive a removed value. Keep required-field validation at submission time.
- Retest: set a month, clear it, inspect both the input and session payload, change the region from both configurator and logistics, reload, and confirm the date remains empty until the user enters a new one; then submit and verify the existing associated required-field error.

### P2 — Leasing remains truthful but still has no dedicated diagnosis intent

- Location: `PriceScope.svelte`, price-scope footer.
- Evidence: the live copy accurately says that leasing is possible and qualifies rates, schedule, approval, and deal composition as project/lender dependent. The only action remains `Получить сопоставимое КП`; there is no `Уточнить лизинговую схему` path or persisted leasing-interest flag.
- Impact: there is no invented rate, approval, or payment schedule, so this does not block Milestone B. The conversion intent is deferred to Milestone C and is already recorded in `reviews/a-modul-v2/POLISH-BACKLOG.md`.
- Required correction: implement the approved dedicated leasing CTA and allowlisted carry-forward when building the complete conversion infrastructure; keep lender-specific terms unclaimed.

## R1 P1 correction recheck

### Single typed context, per-type metric, and valid handoff — corrected except for the two context defects above

- Exercised every object type live. `Вахтовый посёлок` and `Общежитие` use people; `Офис / АБК` uses workplaces; `Отдельное здание` exposes an explicit area/personnel basis. The saved metric/unit matched the visible output for every type.
- Shift-camp composition now includes `Спорт / досуг` and `Другое`. Deselecting every zone produced `0 функциональных зон`, the textual empty state, and `функциональный состав` under `Нужно уточнить`; no module count was shown.
- The prominent count is now explicitly labelled `функциональных зон`, resolving the prior ambiguity.
- Configured `Офис / АБК`, custom `420 рабочих мест`, and `Сибирь`. Logistics immediately changed to `Новосибирск → Сибирь`. Selecting `Урал` in logistics immediately changed both configurator and mini-brief region to `ural` and updated the single session payload.
- `Передать контур в диагностику` exposed the same object type, workplaces metric/value, region, and complete zones in both fields and visible `Контекст передан`. The valid state survived reload in the same tab with no divergent legacy record.

### Finder unknown taxonomy — corrected

- `Общежитие + Холодный регион` now returns `Ближайший опубликованный аналог` and names `климатические условия` as a mismatch because the case stores `not-published` for climate.
- The Kamchatka analogue with selected `Смешанная` delivery names `тип поставки` as a mismatch because its delivery taxonomy is `not-published` rather than inferred from the verified vessel-departure fact.
- The verified dormitory combination `Горнодобывающая + Общежитие + 300 человек + Транспаки` returns a close analogue; changing only industry to `Энергетика` names `отрасль` as the mismatch.
- No unpublished locality was added to the dormitory analogue.

### Exact seven-stage production sequence — corrected

- Exercised all live stages in order: `Металл → Каркас → Ограждение → Инженерия → Отделка → Контроль качества → Отгрузка`.
- Every control selected a unique matching detail; the final shipment state held. The capacity caveat remained explicit that published production capabilities are not a guaranteed project tempo.

## Whole-milestone checks that passed

### Offer, risk, logistics, BIM, and price logic

- The H1, full-cycle support, primary CTA, exact adjacent qualification `После получения основных исходных данных.`, and secondary tender CTA remain clear in the rendered hero. The tender defect is the handoff/state behavior described above.
- All nine risk controls were exercised and exposed distinct risk/control content from source data through launch. The required conclusion `Один проектный контур. Один график. Один ответственный за результат.` is present.
- Logistics changes the visible origin-to-region result and holds a stable selected route. It repeatedly disclaims map scale, distance, delivery duration, and price. No fake kilometre, duration, route price, or random precision was found.
- All seven BIM controls were exercised: `Генплан → Состав → Модули → Производство → Доставка → Монтаж → Объект`. Each produced a matching HUD and textual conclusion. The copy explicitly qualifies model detail by project stage and contract.
- The price section contains an eight-row scope-completeness matrix and no universal ₽/m² claim. It distinguishes the module-only number from project, engineering, fit-out, delivery, site, installation, and commissioning boundaries.
- No CTA or mini-brief action displays fake server success; a valid local diagnostic save still states that the request was not sent.

### Facts and case framing

- Current official-source rechecks support the live company counters and the approved current production values: `25 000 м²`, `до 750 модулей в месяц`, and `до 25 модулей в смену`. The landing keeps the required project-specific capacity caveat.
- The Kamchatka case retains the verified February 2022–February 2023 period, `2 476,36 м²`, 105 single modules with porches, functional composition, public Avista scope, and the vessel-departure constraint, without converting case-specific technical values into universal promises.
- The dormitory analogue retains `3 общежития / 300 человек / 3 200,4 м² / 180 модулей / транспаки` and omits the official page's conflicting locality.
- The seismic headline is the exact locked phrase `Объекты «Ависты» на Камчатке выдержали землетрясение магнитудой 8,8 без разрушений.` and the exact support sentence is present. No competing `8,6 баллов`, guarantee, certificate, or generalized design-intensity claim appears.
- Finder and dominant-case generated imagery are visibly labelled as visualization/not exact documentary photography.
- No invented price, delivery distance, project duration, review, address, certificate, final estimate, or customer performance result was found.

### Route and runtime

- Independent live checks: `/modulnye-zdaniya/` returned 200; `/` returned 307 to `/modulnye-zdaniya/`; canonical was exactly `https://a-modul.ru/modulnye-zdaniya/`.
- No console or page errors occurred during the independent valid-context, region, finder, risk, BIM, factory, price, case, and tender runs.
- The current deterministic evidence reports typecheck/lint/build PASS, zero QA assertions, four-viewport containment, and no broken images. Those scripted results were inspected as evidence but were not used as an automatic substantive approval.

## Evidence inspected

- Full original A-Modul master specification and full fast-execution override.
- R1 conversion/engineering report, current Milestone B `SPEC.md`, `DIFF-SUMMARY.md`, `TEST-RESULTS.md`, `qa-results.json`, evidence inventory, and accepted Milestone A conversion R2 report/history.
- Live application at `http://127.0.0.1:5175/modulnye-zdaniya/`, including the actual hero tender click from the base route and a separate direct tender-query load.
- Current source for the shared context, mini-brief, configurator, logistics, finder, risk, BIM, factory, price, dominant case, facts registry, and route integration.
- Approved local source registry plus current official pages for company/production counters, both case records, seismic evidence, and leasing availability.

## Gate decision

`BLOCKED`. Fix both P1 state-contract defects as one batch, rerun deterministic interaction QA with the real tender CTA click and the commissioning-clear/reverse-region/reload sequence, then invoke a fresh Conversion + Engineering/Factual Reviewer only. The existing P2 leasing item may remain in the Milestone C polish/conversion backlog under the Fast Execution Override.
