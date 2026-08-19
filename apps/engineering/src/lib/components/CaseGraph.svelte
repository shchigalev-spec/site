<script lang="ts">
  import type { CaseStudy } from '$lib/content';
  export let item: CaseStudy;
</script>

<div class={`case-graph graph-${item.graph}`} role="img" aria-label={`Схема измеренного результата: ${item.title}`}>
  {#if item.graph === 'vertical'}
    <span class="datum before"><b>58</b><i>dB</i></span>
    <span class="datum after"><b>39</b><i>dB</i></span>
    <em>достигнутый результат</em>
  {:else if item.graph === 'peak'}
    <svg viewBox="0 0 600 240" aria-hidden="true">
      <path class="gridline" d="M20 200 H580 M20 140 H580 M20 80 H580" />
      <path class="peakline" pathLength="1" d="M20 188 L80 174 L135 184 L190 160 L235 180 L290 42 L330 168 L385 176 L440 156 L500 181 L580 172" />
    </svg>
    <span class="peak-label"><b>71 dB</b><i>пик до</i></span>
    <span class="reduction"><b>−16 dB</b><i>снижение</i></span>
  {:else}
    <span class="band before"><b>64 dB</b><i>до</i></span>
    <span class="band after"><b>43 dB</b><i>после</i></span>
  {/if}
</div>
