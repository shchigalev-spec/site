<script lang="ts">
  import type { Noise } from '$lib/content';

  export let noise: Noise;
  export let compact = false;
</script>

<figure class:compact class="path-diagram">
  <svg viewBox={noise.viewBox} role="img" aria-labelledby={`path-title-${noise.id} path-desc-${noise.id}`}>
    <title id={`path-title-${noise.id}`}>Предварительная схема пути: {noise.title}</title>
    <desc id={`path-desc-${noise.id}`}>{noise.mechanism} Проверяем: {noise.inspect.join(', ')}.</desc>
    <g class="architecture" aria-hidden="true">
      <path d="M45 315 H615 V45 H45 Z" />
      <path d="M45 210 H615 M225 45 V315 M435 45 V315" />
      <path d="M225 112 H435 M225 258 H435" />
      <path d="M72 286 H190 V228 H72 Z M470 286 H585 V228 H470 Z" />
      <path d="M278 315 V273 H390 V315" />
    </g>
    <g class="candidates" aria-hidden="true">
      <path d="M86 56 L244 151 L402 92 L575 200" />
      <path d="M70 292 L228 236 L430 292 L590 115" />
    </g>
    {#key noise.id}
      <path class="active-route" d={noise.path} aria-hidden="true" pathLength="1" />
      <circle class="route-start" cx="0" cy="0" r="7" aria-hidden="true">
        <animateMotion dur="0.001s" fill="freeze" path={noise.path} />
      </circle>
    {/key}
    <g class="labels" aria-hidden="true">
      <text x="55" y="340">где слышно</text>
      <text x="485" y="340">проверить на месте</text>
    </g>
  </svg>
  <figcaption>
    <span>Предварительная гипотеза</span>
    <strong>{noise.source}</strong>
    <p>{noise.mechanism}</p>
  </figcaption>
</figure>
