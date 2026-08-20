<script lang="ts">
  export let step = 0;
  $: expanded = step >= 1 ? 1 : 0;
  $: bridgeActive = step >= 2 && step < 4;
  $: bypass = step >= 3;
  $: controlled = step >= 4;
  $: stopped = step >= 5;
  $: checkpoint = step >= 6;
</script>

<svg class="assembly ceiling-assembly" viewBox="0 0 900 600" aria-hidden="true" data-step={step}>
  <g class="building-shell">
    <path d="M100 112 H790 L840 148 H150 Z" class="slab" />
    <path d="M150 148 H840 V485 H805 V182 H150 Z" class="upper-wall" />
  </g>
  <g class="suspension">
    <path d="M260 148 V250 M450 148 V250 M640 148 V250" class="hanger" />
    <path d="M238 250 H282 M428 250 H472 M618 250 H662" class="clip" />
    <path d="M205 275 H700" class="layer decoupled" style={`transform:translateY(${expanded * 48}px)`} />
    <path d="M190 305 H715" class="layer absorption" style={`transform:translateY(${expanded * 78}px)`} />
    <path d="M175 337 H730" class="layer ceiling-finish" style={`transform:translateY(${expanded * 108}px)`} />
  </g>
  <path d="M820 174 C720 182 650 152 560 132 C470 112 390 142 300 180" class="selected-surface-path" />
  <path d="M640 148 V250 L640 337 H730 V430" class:active={bridgeActive} class:controlled class="rigid-bridge" />
  <path d="M820 174 C720 180 670 205 640 250 L640 337 H730 V430" class:visible={bypass} class:stopped class="bypass-path" />
  {#if stopped}<path d="M610 250 H670" class="stop-boundary" />{/if}
  {#if checkpoint}
    <g class="checkpoint"><circle cx="640" cy="250" r="13" /><path d="M640 250 L510 205" /><text x="340" y="198">СОЕДИНЕНИЕ ЗАФИКСИРОВАНО</text></g>
  {/if}
  <g class="labels">
    <text x="130" y="96">НЕСУЩАЯ ПЛИТА</text>
    <text x="230" y="267">ПОДВЕС / СОЕДИНЕНИЕ</text>
    <text x="214" y="472">РАЗВЯЗАННЫЙ КОНТУР</text>
    <text x="732" y="456">ЭНЕРГИЯ В СТЕНУ</text>
    <text x="700" y="150">ВЕРХНИЙ УЗЕЛ</text>
  </g>
</svg>

<style>
  .assembly { width: 100%; height: 100%; overflow: visible; }
  path, circle { vector-effect: non-scaling-stroke; }
  .building-shell path { fill: rgba(35,39,36,.09); stroke: rgba(13,16,14,.42); stroke-width: 1.2; }
  .upper-wall { fill: rgba(35,39,36,.04) !important; }
  .hanger { fill: none; stroke: rgba(13,16,14,.58); stroke-width: 3; }
  .clip { fill: none; stroke: #507e75; stroke-width: 7; }
  .layer { fill: none; transition: transform 300ms var(--tech-v2-ease-out); }
  .decoupled { stroke: #507e75; stroke-width: 8; }
  .absorption { stroke: #9d7642; stroke-width: 22; stroke-dasharray: 2 5; }
  .ceiling-finish { stroke: rgba(13,16,14,.72); stroke-width: 13; }
  .selected-surface-path, .bypass-path { fill: none; stroke-linecap: round; }
  .selected-surface-path { stroke: rgba(255,101,79,.38); stroke-width: 2; stroke-dasharray: 7 9; }
  .rigid-bridge { fill: none; stroke: rgba(13,16,14,.24); stroke-width: 4; transition: stroke 240ms ease, stroke-width 240ms ease; }
  .rigid-bridge.active { stroke: #ff654f; stroke-width: 8; }
  .rigid-bridge.controlled { stroke: #507e75; stroke-dasharray: 3 4; }
  .bypass-path { opacity: 0; stroke: #ff654f; stroke-width: 5; filter: drop-shadow(0 0 5px rgba(255,101,79,.42)); transition: opacity 260ms ease, stroke 260ms ease; }
  .bypass-path.visible { opacity: 1; }
  .bypass-path.stopped { stroke: #507e75; opacity: .7; }
  .stop-boundary { stroke: #507e75; stroke-width: 9; }
  .checkpoint { animation: checkpoint 260ms var(--tech-v2-ease-out) both; }
  .checkpoint circle { fill: #f3eee4; stroke: #507e75; stroke-width: 3; }
  .checkpoint path { fill: none; stroke: #507e75; stroke-width: 1.4; }
  .checkpoint text, .labels text { fill: rgba(13,16,14,.66); font: 500 10px/1 'IBM Plex Mono', monospace; letter-spacing: .07em; }
  @keyframes checkpoint { from { opacity: 0; transform: translateY(8px); } }
  @media (prefers-reduced-motion: reduce) { .layer, .rigid-bridge, .bypass-path, .checkpoint { transition: none; animation: none; } }
</style>
