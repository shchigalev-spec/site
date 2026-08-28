# A-Modul logistics source register

Last verified: 2026-08-26.

This register limits the transport language used by the A-Modul landing page. The route visualisation is a planning aid, not a calculated itinerary, delivery promise, duration or price.

| Mode | Official source | What the source supports | Landing-page use | Limit |
| --- | --- | --- | --- | --- |
| Road | [Delivery — A-Modul](https://a-modul.ru/dostavka/) | Road delivery is listed among the available transport methods. | May be shown as a mode to be checked for any selected mainland region. | Do not publish distance, duration, price or route feasibility before calculation. |
| Rail | [Delivery — A-Modul](https://a-modul.ru/dostavka/) | Rail delivery is listed among the available transport methods. | May be shown for mainland and eastern routes as a mode to be checked. | Do not imply that every module or destination is rail-compatible. |
| Sea / water | [Delivery — A-Modul](https://a-modul.ru/dostavka/), [Shift camps — A-Modul](https://a-modul.ru/shift_camps/) | Water transport and marine-container delivery are described; the shift-camp page also describes mixed routes using marine and river transport. | May be shown for the Far East and in the Russia-wide planning view. | Do not render a sea leg for an inland destination by default. |
| Winter road | [Shift camps — A-Modul](https://a-modul.ru/shift_camps/) | Winter-road delivery is described as one of the route legs used for remote sites. | May be shown for Far East and Siberia planning scenarios only. | Seasonal availability must be checked; no guaranteed opening date or capacity. |
| Combined | [Delivery — A-Modul](https://a-modul.ru/dostavka/), [Shift camps — A-Modul](https://a-modul.ru/shift_camps/) | Mixed delivery using several transport modes is explicitly described. | May be shown for all regions as a route that requires engineering calculation. | The interface must not invent transfer points or order of legs. |

## Published project evidence

- The official Kamchatka case in `docs/A-MODUL-SOURCE-FACTS.md` states that shipment was coordinated with vessel departures from Petropavlovsk-Kamchatsky. This supports the relevance of a sea or combined planning mode for the Far East; it does not support a fixed route for a new project.
- The official 300-person dormitory case states that 180 modules were supplied as transpacks. It supports factory and packing readiness, not a universal transport mode.
- The Novokuznetsk ABK case supports a Siberian industrial analogue. Its published facts must not be transferred to another site without naming the differences.

## Interface rules

- The origin marker is labelled `Точка предварительного расчёта`, not `завод` or `фактическая точка отгрузки`.
- `Россия` highlights the country and never appears as a destination point.
- All drawn lines are labelled as a preliminary calculation link.
- No kilometres, travel time, price, guaranteed season or unsupported transfer point is shown.
- The logistics CTA carries the selected region into the diagnosis context.
