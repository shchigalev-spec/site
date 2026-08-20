<script lang="ts">
  export let step = 0;
  $: expanded = step >= 1 ? 1 : 0;
  $: bridgeActive = step >= 2 && step < 4;
  $: bypass = step >= 3;
  $: controlled = step >= 4;
  $: stopped = step >= 5;
  $: checkpoint = step >= 6;
</script>

<svg class="assembly wall-assembly" viewBox="0 0 900 600" aria-hidden="true" data-step={step}>
  <g class="building-shell">
    <path d="M90 92 H820 L850 120 H120 Z" class="slab" />
    <path d="M90 492 H820 L850 520 H120 Z" class="slab" />
    <path d="M675 120 H820 V492 H675 Z" class="source-wall" />
    <path d="M690 270 H742 V340 H690 Z" class="socket-box" />
  </g>
  <g class="system" style={`transform:translateX(${expanded * -28}px)`}>
    <path d="M625 120 H662 V492 H625 Z" class="layer mass" />
    <path d="M585 120 H610 V492 H585 Z" class="layer decoupling" style={`transform:translateX(${expanded * -28}px)`} />
    <path d="M525 120 H570 V492 H525 Z" class="layer absorption" style={`transform:translateX(${expanded * -56}px)`} />
    <path d="M485 120 H510 V492 H485 Z" class="layer finish" style={`transform:translateX(${expanded * -84}px)`} />
    <path d="M470 120 H625 M470 492 H625" class:controlled class="perimeter-seal" />
  </g>
  <g class="junctions">
    <path d="M662 112 V132 M662 482 V502" class="flanking" />
    <path d="M610 305 H702" class:active={bridgeActive} class:controlled class="rigid-bridge" />
    <circle cx="702" cy="305" r="10" class:active={bridgeActive} class:controlled class="bridge-marker" />
  </g>
  <path d="M790 178 C725 190 700 242 702 305 C705 382 665 420 605 438" class="selected-surface-path" />
  <path d="M790 178 C725 190 700 242 702 305 C670 315 640 315 605 315" class:visible={bypass} class:stopped class="bypass-path" />
  {#if stopped}<path d="M610 285 V335" class="stop-boundary" />{/if}
  {#if checkpoint}
    <g class="checkpoint"><circle cx="610" cy="305" r="13" /><path d="M610 305 L478 230" /><text x="308" y="224">СКРЫТЫЙ УЗЕЛ ЗАФИКСИРОВАН</text></g>
  {/if}
  <g class="labels">
    <text x="700" y="150">ИСХОДНАЯ СТЕНА</text>
    <text x="466" y="548">масса · развязка · поглощение</text>
    <text x="704" y="363">РОЗЕТКА / РИСК</text>
    <text x="154" y="132">ПРИМЫКАНИЕ К ПОТОЛКУ</text>
    <text x="154" y="486">ПРИМЫКАНИЕ К ПОЛУ</text>
  </g>
</svg>

<style>
  .assembly { width: 100%; height: 100%; overflow: visible; }
  path, circle { vector-effect: non-scaling-stroke; }
  .building-shell path { fill: rgba(35,39,36,.08); stroke: rgba(13,16,14,.38); stroke-width: 1.2; }
  .source-wall { fill: rgba(35,39,36,.13) !important; }
  .socket-box { fill: rgba(255,101,79,.06) !important; stroke: rgba(255,101,79,.6) !important; }
  .system, .layer { transition: transform 300ms var(--tech-v2-ease-out); }
  .layer { stroke-width: 1.4; }
  .mass { fill: rgba(13,16,14,.18); stroke: rgba(13,16,14,.72); }
  .decoupling { fill: rgba(122,168,159,.15); stroke: #507e75; }
  .absorption { fill: rgba(215,170,109,.17); stroke: #9d7642; }
  .finish { fill: rgba(255,253,248,.7); stroke: rgba(13,16,14,.56); }
  .perimeter-seal { fill: none; stroke: #ff654f; stroke-width: 3; stroke-dasharray: 1; transition: stroke-width 240ms ease; }
  .perimeter-seal.controlled { stroke-width: 6; }
  .flanking { fill: none; stroke: rgba(13,16,14,.48); stroke-width: 3; }
  .rigid-bridge { fill: none; stroke: rgba(13,16,14,.28); stroke-width: 5; transition: stroke 240ms ease, stroke-width 240ms ease; }
  .rigid-bridge.active { stroke: #ff654f; stroke-width: 8; }
  .rigid-bridge.controlled { stroke: #507e75; stroke-dasharray: 3 4; }
  .bridge-marker { fill: #f3eee4; stroke: rgba(13,16,14,.35); stroke-width: 2; transition: fill 240ms ease; }
  .bridge-marker.active { fill: #ff654f; }
  .bridge-marker.controlled { fill: #507e75; }
  .selected-surface-path, .bypass-path { fill: none; stroke-linecap: round; }
  .selected-surface-path { stroke: rgba(255,101,79,.38); stroke-width: 2; stroke-dasharray: 7 9; }
  .bypass-path { opacity: 0; stroke: #ff654f; stroke-width: 5; filter: drop-shadow(0 0 5px rgba(255,101,79,.42)); transition: opacity 260ms ease, stroke 260ms ease; }
  .bypass-path.visible { opacity: 1; }
  .bypass-path.stopped { stroke: #507e75; opacity: .72; }
  .stop-boundary { stroke: #507e75; stroke-width: 8; }
  .checkpoint { animation: checkpoint 260ms var(--tech-v2-ease-out) both; }
  .checkpoint circle { fill: #f3eee4; stroke: #507e75; stroke-width: 3; }
  .checkpoint path { fill: none; stroke: #507e75; stroke-width: 1.4; }
  .checkpoint text, .labels text { fill: rgba(13,16,14,.66); font: 500 10px/1 'IBM Plex Mono', monospace; letter-spacing: .07em; }
  @keyframes checkpoint { from { opacity: 0; transform: translateY(8px); } }
  @media (prefers-reduced-motion: reduce) { .system, .layer, .rigid-bridge, .bridge-marker, .bypass-path, .checkpoint { transition: none; animation: none; } }
</style>
