<script lang="ts">
  import { onMount } from 'svelte';
  import type { CaseStudy } from '$lib/content';

  export let item: CaseStudy;
  export let compact = false;

  let root: HTMLElement;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  });
</script>

<div
  bind:this={root}
  class:visible
  class:compact
  class={`case-graph-v2 case-${item.graph}`}
  role="img"
  aria-label={`График измеренного результата: ${item.title}`}
>
  {#if item.graph === 'vertical'}
    <svg viewBox="0 0 620 330" aria-hidden="true">
      <path class="axis" d="M72 34V274H572M72 214H572M72 154H572M72 94H572" />
      <text x="42" y="278">0</text><text x="32" y="218">20</text><text x="32" y="158">40</text><text x="32" y="98">60</text>
      <rect class="bar before" x="170" y="100" width="108" height="174" />
      <rect class="bar after" x="390" y="157" width="108" height="117" />
      <path class="reduction-band" d="M302 100H350V157H302" />
      <text class="value" x="224" y="82" text-anchor="middle">58 dB</text>
      <text class="value" x="444" y="139" text-anchor="middle">39 dB</text>
      <text class="state" x="224" y="308" text-anchor="middle">до</text><text class="state" x="444" y="308" text-anchor="middle">после</text>
      <text class="delta" x="326" y="133" text-anchor="middle">−19 dB</text>
    </svg>
  {:else if item.graph === 'peak'}
    <svg viewBox="0 0 620 330" aria-hidden="true">
      <path class="axis" d="M48 274H582M48 214H582M48 154H582M48 94H582" />
      <path class="peakline" pathLength="1" d="M48 254 L104 242 L154 249 L206 229 L248 246 L300 66 L336 232 L392 242 L444 222 L500 246 L582 236" />
      <circle class="peak" cx="300" cy="66" r="7" />
      <path class="reduction-bracket" d="M340 66H374V132H340" />
      <text class="value" x="300" y="44" text-anchor="middle">71 dB · пик до</text>
      <text class="delta" x="430" y="106">снижение −16 dB</text>
      <text class="state" x="48" y="310">событие / время</text>
    </svg>
  {:else}
    <svg viewBox="0 0 620 330" aria-hidden="true">
      <path class="axis" d="M92 52V274H574M92 112H574M92 192H574M92 272H574" />
      <text class="state" x="54" y="116">до</text><text class="state" x="40" y="196">после</text>
      <rect class="band before" x="92" y="80" width="430" height="48" />
      <rect class="band after" x="92" y="160" width="289" height="48" />
      <text class="value" x="532" y="112">64 dB</text><text class="value" x="391" y="192">43 dB</text>
      <path class="reduction-band" d="M381 226V250H522V226" />
      <text class="delta" x="451" y="276" text-anchor="middle">−21 dB</text>
    </svg>
  {/if}
  {#if compact}
    <div class="compact-summary" aria-hidden="true">
      {#if item.graph === 'peak'}
        <span><small>пик до</small><strong>71 dB</strong></span>
        <span><small>снижение</small><strong>−16 dB</strong></span>
        <span><small>ось</small><strong>событие / время</strong></span>
      {:else if item.graph === 'bands'}
        <span><small>до</small><strong>64 dB</strong></span>
        <span><small>после</small><strong>43 dB</strong></span>
        <span><small>разница</small><strong>−21 dB</strong></span>
      {/if}
    </div>
  {/if}
  <span class="measurement-label">измеренный результат · не прогноз</span>
</div>

<style>
  .case-graph-v2 {
    position: relative;
    min-height: 21rem;
    padding: 1rem;
    border: 1px solid rgba(242, 238, 230, 0.25);
    background: rgba(21, 25, 21, 0.86);
    color: #fbfaf6;
    overflow: hidden;
  }

  .case-graph-v2 svg { display: block; width: 100%; height: auto; }
  .case-graph-v2.compact { min-height: 15rem; padding: 0.55rem; }
  .case-graph-v2.compact .measurement-label { position: static; display: block; padding: 0.15rem 0.4rem 0.4rem; }
  .compact-summary { display: none; }
  .axis { fill: none; stroke: #9ba7a1; stroke-width: 1; }
  .case-graph-v2 text { fill: #d8dfdb; font: 14px 'IBM Plex Mono', monospace; }
  .case-graph-v2 .value { fill: #fbfaf6; font: 600 22px 'Geologica', sans-serif; }
  .case-graph-v2 .delta { fill: #efb8a8; font-weight: 600; }
  .case-graph-v2 .state { fill: #bec9c4; text-transform: uppercase; }
  .measurement-label {
    position: absolute;
    right: 1rem;
    bottom: 0.75rem;
    font: 0.75rem 'IBM Plex Mono', monospace;
    color: #bec9c4;
    text-transform: uppercase;
  }

  .bar,
  .band {
    transform-box: fill-box;
    transform-origin: bottom;
    transform: scaleY(0);
    fill: #879d95;
    stroke: #c8d4cf;
    stroke-width: 2;
  }

  .bar.after,
  .band.after { fill: #b4513d; }
  .reduction-band,
  .reduction-bracket { fill: none; stroke: #e6a18e; stroke-width: 3; stroke-dasharray: 1; stroke-dashoffset: 1; }
  .peakline { fill: none; stroke: #d96b55; stroke-width: 4; stroke-dasharray: 1; stroke-dashoffset: 1; }
  .peak { fill: #f2eee6; stroke: #d96b55; stroke-width: 3; opacity: 0; }
  .case-bands .band { transform-origin: left; transform: scaleX(0) scaleY(1); }
  .visible .bar,
  .visible .band { animation: case-rise 720ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
  .visible .bar.after,
  .visible .band.after { animation-delay: 180ms; }
  .visible .peakline { animation: case-draw 820ms ease both; }
  .visible .peak { animation: case-show 180ms 760ms ease both; }
  .visible .reduction-band,
  .visible .reduction-bracket { animation: case-draw 420ms 620ms ease both; }
  .case-bands.visible .band { animation-name: case-grow; }

  @keyframes case-rise { to { transform: scaleY(1); } }
  @keyframes case-draw { to { stroke-dashoffset: 0; } }
  @keyframes case-show { to { opacity: 1; } }
  @keyframes case-grow { to { transform: scaleX(1) scaleY(1); } }

  @media (max-width: 700px) {
    .case-graph-v2 { min-height: 0; padding: 0.45rem; }
    .case-graph-v2.compact { min-height: 11rem; }
    .case-graph-v2 .value { font-size: 20px; }
    .case-graph-v2 text { font-size: 13px; }
    .measurement-label { position: static; display: block; padding: 0.5rem; font-size: 0.75rem; }
    .compact-summary { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(251, 250, 246, 0.24); border-bottom: 1px solid rgba(251, 250, 246, 0.24); }
    .compact-summary span { min-width: 0; padding: 0.7rem 0.45rem; border-right: 1px solid rgba(251, 250, 246, 0.2); }
    .compact-summary span:last-child { border-right: 0; }
    .compact-summary small { display: block; color: #bec9c4; font: 0.75rem 'IBM Plex Mono', monospace; text-transform: uppercase; }
    .compact-summary strong { display: block; margin-top: 0.35rem; color: #fbfaf6; font: 600 0.85rem 'Geologica', sans-serif; line-height: 1.2; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bar,
    .band { transform: scaleY(1); }
    .case-bands .band { transform: scaleX(1) scaleY(1); }
    .peakline,
    .reduction-band,
    .reduction-bracket { stroke-dashoffset: 0; }
    .peak { opacity: 1; }
    .visible .bar,
    .visible .band,
    .visible .peakline,
    .visible .peak,
    .visible .reduction-band,
    .visible .reduction-bracket { animation: none; }
  }
</style>
