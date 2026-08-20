<script lang="ts">export let state = 0;</script>

<svg class:separated={state >= 1} class:bridge={state === 2} class:controlled={state >= 3} class:checkpoint={state === 4} viewBox="0 0 720 500" role="img" aria-labelledby="floor-title floor-desc">
  <title id="floor-title">Узел плавающего пола</title>
  <desc id="floor-desc">Несущая плита, упругая развязка, нагруженный слой, финиш, периметральное примыкание и опасный жёсткий мост.</desc>
  <defs><pattern id="floor-slab" width="20" height="16" patternUnits="userSpaceOnUse"><path d="M0 14 16 0M12 18 28 4" stroke="#8b8d86" stroke-width="2"/></pattern><pattern id="floor-finish" width="44" height="14" patternUnits="userSpaceOnUse"><path d="M0 1h42v12H0z" fill="#a98b69" stroke="#6e5a43"/></pattern><marker id="floor-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#a94332"/></marker></defs>
  <rect x="48" y="46" width="624" height="408" fill="#f2eee6" stroke="#b9b7af"/>
  <g class="assembly">
    <rect class="slab" x="86" y="326" width="548" height="104" fill="url(#floor-slab)" stroke="#343833" stroke-width="2"/>
    <path class="resilient" d="M104 304q12-24 24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0" fill="none" stroke="#80978e" stroke-width="10"/>
    <rect class="load" x="110" y="220" width="498" height="70" fill="#c6bbaa" stroke="#343833" stroke-width="2"/>
    <rect class="finish" x="104" y="184" width="510" height="28" fill="url(#floor-finish)" stroke="#343833" stroke-width="2"/>
    <rect class="wall" x="86" y="88" width="72" height="238" fill="#c7c0b5" stroke="#343833" stroke-width="2"/>
    <path class="perimeter" d="M166 180v112" stroke="#a94332" stroke-width="12" stroke-linecap="round"/>
    <rect class="skirting" x="150" y="146" width="42" height="72" fill="#ddd6c9" stroke="#343833" stroke-width="2"/>
  </g>
  <g class="bridge-mark"><path d="M184 182V344" stroke="#a94332" stroke-width="9" marker-end="url(#floor-arrow)"/><circle cx="184" cy="255" r="22" fill="#f2eee6" stroke="#a94332" stroke-width="5"/><text x="224" y="164">жёсткий мост по периметру</text></g>
  <g class="controlled-mark"><path d="M182 182v34" stroke="#a94332" stroke-width="5"/><path d="M182 230v64" stroke="#698078" stroke-width="5" stroke-dasharray="8 8"/><text x="224" y="164">отделённое примыкание</text></g>
  <g class="impact"><path d="M460 100v66" stroke="#a94332" stroke-width="5" marker-end="url(#floor-arrow)"/><path d="m430 116 30-26 30 26" fill="none" stroke="#a94332" stroke-width="5"/><text x="460" y="72" text-anchor="middle">удар</text></g>
  <g class="checks"><circle cx="176" cy="198" r="18"/><path d="m166 198 7 7 13-16"/><circle cx="306" cy="304" r="18"/><path d="m296 304 7 7 13-16"/><circle cx="564" cy="304" r="18"/><path d="m554 304 7 7 13-16"/></g>
  <g class="labels"><path d="M468 196V84H600"/><text x="594" y="88" text-anchor="end">финиш / нагрузка</text><path d="M460 304H650"/><text x="644" y="296" text-anchor="end">упругая развязка</text><path d="M460 374H650"/><text x="644" y="366" text-anchor="end">несущая плита</text><path d="M166 270H140"/><text x="132" y="274" text-anchor="end">периметр</text></g>
</svg>

<style>
  svg{display:block;width:100%;height:auto}.assembly>*{transition:transform 520ms cubic-bezier(.2,.8,.2,1)}.separated .slab{transform:translateY(20px)}.separated .resilient{transform:translateY(4px)}.separated .load{transform:translateY(-14px)}.separated .finish,.separated .skirting{transform:translateY(-28px)}
  text{font:16px 'IBM Plex Mono',monospace;fill:#343833}.labels path{fill:none;stroke:#777d77;stroke-width:1.5}.bridge-mark,.controlled-mark,.impact,.checks{opacity:0;transition:opacity 240ms ease}.bridge-mark text,.controlled-mark text{paint-order:stroke;stroke:#f2eee6;stroke-width:10px;stroke-linejoin:round}.bridge .bridge-mark,.bridge .impact,.controlled .controlled-mark,.controlled .impact,.checkpoint .controlled-mark,.checkpoint .impact,.checkpoint .checks{opacity:1}.checks circle{fill:#fbfaf6;stroke:#698078;stroke-width:3}.checks path{fill:none;stroke:#698078;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}@media(prefers-reduced-motion:reduce){.assembly>*,.bridge-mark,.controlled-mark,.impact,.checks{transition:none}}
  @media(max-width:800px){.labels{display:none}.bridge-mark text,.controlled-mark text,.impact text{font-size:23px}}
</style>
