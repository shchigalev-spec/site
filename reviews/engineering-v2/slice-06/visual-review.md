# Slice 06 — visual review

## First independent verdict: FAIL

At 320 × 568, the 443 px route map pushed the first answer 716 px below the map top. The user could not see the current question, answer, and changed route as one state.

## Revision

- Replaced the mobile map with a 108 px live route beside the current question.
- Added mobile state scroll alignment after each answer.
- Recaptured 320 and 390 states with zero overflow.

## Independent re-review: PASS

The live route, current question, and answers now form one mobile hierarchy. Desktop start/mid/end and mobile intermediate states remain legible, and the scenario no longer covers or competes with the sticky CTA.
