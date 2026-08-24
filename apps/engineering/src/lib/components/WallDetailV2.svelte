<script lang="ts">
  export let state = 0;
  const separated = () => state >= 1;
</script>

<svg class:separated={separated()} class:bridge={state === 2} class:controlled={state >= 3} class:checkpoint={state === 4} viewBox="0 0 720 500" role="img" aria-labelledby="wall-title wall-desc">
  <title id="wall-title">Узел шумоизоляции стены</title>
  <desc id="wall-desc">Масса основания, развязанный каркас с поглощением, облицовка, герметичный периметр, розетка и обходные пути через пол и потолок.</desc>
  <defs>
    <pattern id="wall-mass" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 18 18 0M-5 5 5-5M13 23 23 13" stroke="#8c8a82" stroke-width="2"/></pattern>
    <pattern id="wall-absorb" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 8 Q4 0 8 8T16 8" fill="none" stroke="#9b704f" stroke-width="2"/></pattern>
    <marker id="wall-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#a94332"/></marker>
  </defs>

  <rect x="48" y="46" width="624" height="408" rx="2" fill="#f2eee6" stroke="#b9b7af"/>
  <path d="M48 420H672M48 82H672" stroke="#6d716b" stroke-width="14" opacity=".55"/>
  <g class="assembly">
    <rect class="substrate" x="152" y="84" width="122" height="334" fill="url(#wall-mass)" stroke="#343833" stroke-width="2"/>
    <rect class="isolation" x="286" y="104" width="18" height="294" fill="#80978e" stroke="#334a43" stroke-width="2"/>
    <rect class="cavity" x="308" y="104" width="122" height="294" fill="url(#wall-absorb)" stroke="#9b704f"/>
    <path class="frame" d="M318 112V390M420 112V390M318 124H420M318 378H420" fill="none" stroke="#4e5550" stroke-width="8"/>
    <rect class="lining" x="438" y="96" width="48" height="310" fill="#ddd6c9" stroke="#343833" stroke-width="2"/>
    <path class="seal" d="M432 96H492M432 406H492" stroke="#a94332" stroke-width="8" stroke-linecap="round"/>
    <g class="socket"><rect x="444" y="220" width="50" height="70" rx="3" fill="#fbfaf6" stroke="#343833" stroke-width="3"/><circle cx="459" cy="255" r="5" fill="#343833"/><circle cx="479" cy="255" r="5" fill="#343833"/></g>
  </g>

  <g class="bridge-mark">
    <path d="M246 250H458" stroke="#a94332" stroke-width="8" stroke-linecap="round" marker-end="url(#wall-arrow)"/>
    <circle cx="296" cy="250" r="18" fill="#f2eee6" stroke="#a94332" stroke-width="5"/>
    <text x="358" y="206" text-anchor="middle">жёсткий мост</text>
  </g>
  <g class="controlled-mark">
    <path d="M246 250H286" stroke="#a94332" stroke-width="5" stroke-linecap="round"/>
    <path d="M304 250H430" stroke="#698078" stroke-width="5" stroke-dasharray="8 8"/>
    <text x="359" y="206" text-anchor="middle">развязанный контур</text>
  </g>
  <g class="flanks">
    <path d="M214 128C116 120 104 90 82 90" fill="none" stroke="#a94332" stroke-width="4" stroke-dasharray="7 8" marker-end="url(#wall-arrow)"/>
    <path d="M214 366C116 374 104 420 82 420" fill="none" stroke="#a94332" stroke-width="4" stroke-dasharray="7 8" marker-end="url(#wall-arrow)"/>
    <text x="72" y="66">обход</text><text x="72" y="454">обход</text>
  </g>
  <g class="checks">
    <circle cx="461" cy="103" r="18"/><path d="m451 103 7 7 13-16"/>
    <circle cx="461" cy="398" r="18"/><path d="m451 398 7 7 13-16"/>
    <circle cx="469" cy="255" r="18"/><path d="m459 255 7 7 13-16"/>
  </g>

  <g class="labels">
    <path d="M212 138V52H112"/><text x="106" y="47">масса</text>
    <path d="M295 150V126H520"/><text x="528" y="130">развязка</text>
    <path d="M370 322V442H288"/><text x="278" y="447" text-anchor="end">поглощение</text>
    <path d="M466 112V62H502"/><text x="510" y="66">герметичный контур</text>
    <path d="M469 255H554"/><text x="562" y="259">розетка</text>
  </g>
</svg>

<style>
  svg { display:block; width:100%; height:auto; color:#242824; }
  .assembly > *, .assembly { transition: transform 520ms cubic-bezier(.2,.8,.2,1); }
  .separated .substrate { transform:translateX(-22px); }.separated .isolation { transform:translateX(-7px); }
  .separated .cavity, .separated .frame { transform:translateX(12px); }.separated .lining, .separated .seal, .separated .socket { transform:translateX(28px); }
  text { font: 16px 'IBM Plex Mono', monospace; fill:#343833; }
  .labels path { fill:none; stroke:#777d77; stroke-width:1.5; }
  .bridge-mark,.controlled-mark,.flanks,.checks { opacity:0; transition:opacity 240ms ease; }
  .bridge-mark text,.controlled-mark text { paint-order:stroke; stroke:#f2eee6; stroke-width:10px; stroke-linejoin:round; }
  .bridge .bridge-mark,.bridge .flanks,.controlled .controlled-mark,.controlled .flanks,.checkpoint .controlled-mark,.checkpoint .flanks,.checkpoint .checks { opacity:1; }
  .checks circle { fill:#fbfaf6; stroke:#698078; stroke-width:3; }.checks path { fill:none; stroke:#698078; stroke-width:4; stroke-linecap:round; stroke-linejoin:round; }
  @media (prefers-reduced-motion: reduce){ .assembly > *,.assembly,.bridge-mark,.controlled-mark,.flanks,.checks{transition:none} }
  @media (max-width:800px){ .labels{display:none}.bridge-mark text,.controlled-mark text,.flanks text{font-size:23px} }
</style>
