# A-Modul Direct V2 — search intent and route plan

The historic report covers 2026-02-01 through 2026-08-25. Its conversion column mixes micro-goals and multiple goals per visit, so it is used for route/message architecture only—not as proof of qualified leads, CR, or CPA.

## Priority map

| Intent | Approximate relevant spend | Route | Opening decision |
|---|---:|---|---|
| Shift and construction camps | 39.7% | `/vahtovye-poselki/` | Composition, personnel, infrastructure, remote logistics |
| General modular buildings | 25.4% | `/modulnye-zdaniya/` | Object type, scope boundary, regional launch |
| Modular offices | 12.4% | `/modulnye-ofisy-abk/` | Workplace/room logic and factory readiness |
| Modular dormitories | 8.3% | `/modulnye-obshchezhitiya/` | Capacity, room/service composition, remote operation |
| ABK | 5.5% | `/modulnye-ofisy-abk/` | Staff functions, sanitary/technical zones, engineering |

These five clusters account for roughly 91% of relevant high-ticket spend. Secondary clusters are KPP/security (~2.7%), HASKI (~1.7%), canteens/food blocks (~1.5%), and separate modules/бытовки (~1.2%).

## Route contract

### `/modulnye-zdaniya/`

- Intent language: модульные здания, блочно-модульное здание, производство, строительство, под ключ, от производителя, расчёт стоимости.
- Hero: `Спроектируем, произведём и запустим модульный объект в вашем регионе.`
- Primary response: a preliminary scope, logistics logic, budget contour, missing inputs, and next engineering step.
- Dominant proof: a verified large remote modular-complex case.

### `/vahtovye-poselki/`

- Intent language: вахтовый поселок/городок, строительный городок, модульный городок, бытовой городок модульного типа.
- Hero: `Вахтовый поселок под ключ — от проекта до заселения.`
- Dominant proof: 58 realised shift camps and a verified Kamchatka composition case.
- Required decision support: personnel bands, functional composition, infrastructure, delivery route, seismic proof.

### `/modulnye-ofisy-abk/`

- Intent language: модульный офис, офис продаж, модульное здание под офис, строительство АБК, административно-бытовой комплекс.
- Hero: `Модульные офисы и АБК под задачу, численность и регион.`
- Required decision support: workplace count, room composition, sanitary/technical areas, engineering, factory readiness.
- Exact area is withheld until verified rules and inputs exist.

### `/modulnye-obshchezhitiya/`

- Intent language: модульное общежитие, общежития для рабочих, под ключ, стоимость, capacity-based accommodation.
- Hero: `Модульное общежитие с инженерией, мебелью и монтажом.`
- Dominant proof: `3 общежития / 300 человек / 3 200,4 м² / 180 модулей` with a generated-visualization label.
- Required decision support: personnel, occupancy preference, sanitary/service zones, furniture, climate, logistics.

## Commercial clarity

All routes must answer `строительство`, `производство`, `изготовление`, `завод`, `под ключ`, `цена`, `стоимость`, `расчёт`, `купить`, `заказать`, `проект`, `планировка`, and `регион` in natural Russian. Price clarity is expressed through scope completeness rather than a universal square-metre figure.

Primary CTA: `Получить КП за 1 рабочий день`
Required qualifier: `После получения основных исходных данных.`
Secondary mode: `Пригласить в тендер`
Contextual CTA: `Рассчитать логистику`

Every major CTA leads to diagnosis or an explicitly selected tender flow.

## Allowlisted region variants

| Query value | Public label |
|---|---|
| `moskva` | Москва и Московская область |
| `krasnoyarsk` | Красноярский край |
| `ural` | Урал |
| `dalniy-vostok` | Дальний Восток |
| `sibir` | Сибирь |
| `kurgan` | Курганская область |
| `rossiya` | Россия |

The region value is server-rendered, visible, preserved through forms and analytics, canonicalized to the base route, absent from the sitemap, and never used to create regional doorway pages. No IP-only personalization.

## Allowlisted object variants

`kpp`, `stolovaya`, `bpk`, `prorabskaya`, `office`, `abk`, and `other` are supported on `/modulnye-zdaniya/`. `haski` stays disabled unless explicitly included in the campaign test. Variants may change hero context, selected object, visual/case, form context, and analytics but canonicalize to the base route and remain non-indexable duplicates.

## Query-to-decision sequence

1. Confirm the requested object and region in the first screen.
2. Capture only object type, capacity or area, region, and desired commissioning date.
3. Explain the scope and launch-risk mechanism.
4. Let the visitor shape object composition without fake engineering precision.
5. Show a genuinely comparable verified case and disclose any mismatch.
6. Explain logistics before promising time/cost.
7. Compare full launch scope rather than module price alone.
8. Continue into the full brief or tender-specific fields with context preserved.

Broad low-ticket household `бытовка` traffic is excluded from the first test.
