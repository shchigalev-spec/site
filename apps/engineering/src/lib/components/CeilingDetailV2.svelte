<script lang="ts">export let state = 0;</script>

<svg class:separated={state >= 1} class:bridge={state === 2} class:controlled={state >= 3} class:checkpoint={state === 4} viewBox="0 0 720 500" role="img" aria-labelledby="ceiling-title ceiling-desc">
  <title id="ceiling-title">Узел шумоизоляции потолка</title>
  <desc id="ceiling-desc">Перекрытие, виброразвязанные подвесы, каркас, поглощение, потолочная облицовка и верхнее примыкание стены.</desc>
  <defs><pattern id="ceil-slab" width="22" height="16" patternUnits="userSpaceOnUse"><path d="M0 14 16 0M12 18 28 4" stroke="#8b8d86" stroke-width="2"/></pattern><marker id="ceil-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#a94332"/></marker></defs>
  <rect x="48" y="46" width="624" height="408" fill="#f2eee6" stroke="#b9b7af"/>
  <g class="assembly">
    <rect class="slab" x="78" y="82" width="566" height="108" fill="url(#ceil-slab)" stroke="#343833" stroke-width="2"/>
    <g class="hangers" stroke="#40554f" stroke-width="8" fill="none"><path d="M190 190v66h42v46"/><path d="M356 190v66h42v46"/><path d="M522 190v66h42v46"/></g>
    <g class="isolators" fill="#80978e" stroke="#334a43" stroke-width="2"><rect x="178" y="226" width="66" height="32" rx="10"/><rect x="344" y="226" width="66" height="32" rx="10"/><rect x="510" y="226" width="66" height="32" rx="10"/></g>
    <rect class="absorb" x="108" y="276" width="470" height="66" fill="#d0bba5" opacity=".8" stroke="#9b704f"/>
    <path class="frame" d="M104 342H584M140 320v42m128-42v42m128-42v42m128-42v42" stroke="#4e5550" stroke-width="9"/>
    <rect class="lining" x="92" y="362" width="506" height="34" fill="#ddd6c9" stroke="#343833" stroke-width="2"/>
    <rect class="wall" x="578" y="176" width="66" height="260" fill="#c7c0b5" stroke="#343833" stroke-width="2"/>
    <path class="seal" d="M584 354v48" stroke="#a94332" stroke-width="9" stroke-linecap="round"/>
  </g>
  <g class="bridge-mark"><path d="M356 118V368" stroke="#a94332" stroke-width="8" marker-end="url(#ceil-arrow)"/><circle cx="377" cy="242" r="22" fill="#f2eee6" stroke="#a94332" stroke-width="5"/><text x="418" y="224">жёсткий подвес</text></g>
  <g class="controlled-mark"><path d="M356 118v100" stroke="#a94332" stroke-width="5"/><path d="M377 262v100" stroke="#698078" stroke-width="5" stroke-dasharray="8 8"/><text x="424" y="224">развязанный подвес</text></g>
  <g class="flank"><path d="M356 126C512 126 604 162 612 270" fill="none" stroke="#a94332" stroke-width="4" stroke-dasharray="7 8" marker-end="url(#ceil-arrow)"/><text x="488" y="106">энергия во фланговой стене</text></g>
  <g class="checks"><circle cx="211" cy="242" r="18"/><path d="m201 242 7 7 13-16"/><circle cx="543" cy="242" r="18"/><path d="m533 242 7 7 13-16"/><circle cx="587" cy="377" r="18"/><path d="m577 377 7 7 13-16"/></g>
  <g class="labels"><path d="M180 114V54H100"/><text x="94" y="49">перекрытие</text><path d="M190 242H94"/><text x="88" y="246" text-anchor="end">подвес</text><path d="M290 326H140"/><text x="132" y="330" text-anchor="end">поглощение</text><path d="M466 378v64H360"/><text x="352" y="447" text-anchor="end">подвесная система</text><path d="M610 352h62"/><text x="666" y="346" text-anchor="end">примыкание</text></g>
</svg>

<style>
  svg{display:block;width:100%;height:auto}.assembly>*{transition:transform 520ms cubic-bezier(.2,.8,.2,1)}
  .separated .slab{transform:translateY(-18px)}.separated .hangers,.separated .isolators{transform:translateY(-4px)}.separated .absorb,.separated .frame{transform:translateY(12px)}.separated .lining{transform:translateY(26px)}
  text{font:16px 'IBM Plex Mono',monospace;fill:#343833}.labels path{fill:none;stroke:#777d77;stroke-width:1.5}.bridge-mark,.controlled-mark,.flank,.checks{opacity:0;transition:opacity 240ms ease}.bridge-mark text,.controlled-mark text{paint-order:stroke;stroke:#f2eee6;stroke-width:10px;stroke-linejoin:round}.bridge .bridge-mark,.bridge .flank,.controlled .controlled-mark,.controlled .flank,.checkpoint .controlled-mark,.checkpoint .flank,.checkpoint .checks{opacity:1}.checks circle{fill:#fbfaf6;stroke:#698078;stroke-width:3}.checks path{fill:none;stroke:#698078;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}@media(prefers-reduced-motion:reduce){.assembly>*,.bridge-mark,.controlled-mark,.flank,.checks{transition:none}}
  @media(max-width:800px){.labels{display:none}.bridge-mark text,.controlled-mark text,.flank text{font-size:23px}}
</style>
