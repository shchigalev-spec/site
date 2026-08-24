<script lang="ts">
  export let step = 0;
  $: expanded = step >= 1 ? 1 : 0;
  $: bridgeActive = step >= 2 && step < 4;
  $: bypass = step >= 3;
  $: controlled = step >= 4;
  $: stopped = step >= 5;
  $: checkpoint = step >= 6;
</script>

<svg class="assembly floor-assembly" viewBox="0 0 900 600" aria-hidden="true" data-step={step}>
  <g class="building-shell">
    <path d="M120 380 H790 L840 420 H170 Z" class="slab" />
    <path d="M730 115 H805 V400 H730 Z" class="perimeter-wall" />
  </g>
  <g class="floor-system">
    <path d="M150 305 H730 L774 335 H195 Z" class="layer finish" style={`transform:translateY(${expanded * -118}px)`} />
    <path d="M145 325 H730 L779 358 H190 Z" class="layer load" style={`transform:translateY(${expanded * -82}px)`} />
    <path d="M138 350 H730 L786 383 H185 Z" class="layer resilient" style={`transform:translateY(${expanded * -42}px)`} />
  </g>
  <path d="M770 150 V355" class:controlled class="perimeter" />
  <path d="M260 398 C360 350 525 352 676 375 C725 382 755 350 770 310" class="selected-surface-path" />
  <path d="M620 350 L700 350 L770 310 V180" class:active={bridgeActive} class:controlled class="rigid-bridge" />
  <path d="M260 398 C420 350 610 350 700 350 L770 310 V180" class:visible={bypass} class:stopped class="bypass-path" />
  {#if stopped}<path d="M742 285 H796" class="stop-boundary" />{/if}
  {#if checkpoint}
    <g class="checkpoint"><circle cx="770" cy="310" r="13" /><path d="M770 310 L615 225" /><text x="445" y="218">ПЕРИМЕТР СНЯТ ДО ЗАКРЫТИЯ</text></g>
  {/if}
  <g class="labels">
    <text x="154" y="175">ФИНИШ / НАГРУЗОЧНЫЙ СЛОЙ</text>
    <text x="154" y="270">УПРУГОЕ РАЗДЕЛЕНИЕ</text>
    <text x="154" y="456">НЕСУЩАЯ ПЛИТА</text>
    <text x="748" y="110">ПЕРИМЕТР</text>
    <text x="638" y="374">ЖЁСТКИЙ МОСТИК</text>
  </g>
</svg>

<style>
  .assembly { width: 100%; height: 100%; overflow: visible; }
  path, circle { vector-effect: non-scaling-stroke; }
  .building-shell path { fill: rgba(35,39,36,.09); stroke: rgba(13,16,14,.42); stroke-width: 1.2; }
  .perimeter-wall { fill: rgba(35,39,36,.05) !important; }
  .layer { transition: transform 300ms var(--tech-v2-ease-out); stroke-width: 1.6; }
  .finish { fill: rgba(255,253,248,.7); stroke: rgba(13,16,14,.58); }
  .load { fill: rgba(13,16,14,.15); stroke: rgba(13,16,14,.7); }
  .resilient { fill: rgba(122,168,159,.16); stroke: #507e75; stroke-dasharray: 5 5; }
  .perimeter { fill: none; stroke: #ff654f; stroke-width: 4; transition: stroke-width 240ms ease, stroke 240ms ease; }
  .perimeter.controlled { stroke: #507e75; stroke-width: 8; }
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
  @media (prefers-reduced-motion: reduce) { .layer, .perimeter, .rigid-bridge, .bypass-path, .checkpoint { transition: none; animation: none; } }
</style>
