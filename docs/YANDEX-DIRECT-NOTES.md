# Yandex Direct notes

## Routing

- Broad Moscow, turnkey, installation: `/`.
- Walls: `/shumoizolyatsiya-sten/`.
- Ceiling: `/shumoizolyatsiya-potolka/`.
- Floor and screed: `/shumoizolyatsiya-pola/`.
- Neighbours, footsteps, voices: `/shumoizolyatsiya-ot-sosedey/?noise=...`.
- Stretch ceiling: `/shumoizolyatsiya-potolka/pod-natyazhnoy-potolok/`.
- New building: `/shumoizolyatsiya-v-novostroyke/?stage=new`.
- Finished apartment: `/shumoizolyatsiya-v-gotovoy-kvartire/?stage=finished`.

Supported context parameters are `noise`, `stage`, and `surface`. UTM values
are stored per session and included in the lead payload.

## Negative keyword warning

The broad query set is contaminated by entrance-door intent. Until the business
confirms a door service, isolate or exclude: `дверь`, `двери`, `входная`,
`металлическая`, `купить дверь`, `рейтинг дверей`, `замена двери`.

Do not sum the supplied Wordstat values as independent market volume: they are
overlapping “queries containing words” values.

