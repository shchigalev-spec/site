# Accessibility / Performance — PASS

The first accessibility cycle failed because meaningful axis/grid strokes measured only about 2:1 against their graph backgrounds. The revision makes the stroke explicit `#9ba7a1`; measured contrast is 7.04:1 in the dominant graph and 4.86:1 in the supporting graphs, both above the 3:1 non-text threshold.

Scoped axe reports zero violations on the homepage case chapter, and the repeated full primary-detail run reports zero violations. Labels and mobile compact summaries are at least 12 px. The 1440/390/320 routes show no horizontal overflow, broken imagery, looping graph animation, or error overlay; reduced-motion exposes final states without animation.
