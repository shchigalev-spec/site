<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { replaceState } from '$app/navigation';
  import { renovationStages } from '$lib/content';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  let root: HTMLElement;
  let progress = 0;
  let activeIndex = 0;
  let mobile = false;
  let reduced = false;
  let frame = 0;
  let lastPersisted = 0;
  let images: HTMLImageElement[] = [];

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  $: timeline = mobile ? activeIndex / 2 : progress;
  $: stage = renovationStages[activeIndex];
  $: stage2Reveal = clamp((timeline - 0.18) / 0.24);
  $: stage2Opacity = Math.min(1, stage2Reveal * 1.25) * (1 - clamp((timeline - 0.56) / 0.18));
  $: stage3Reveal = clamp((timeline - 0.62) / 0.23);
  $: stageWeights = [clamp(1 - timeline / 0.34), clamp(1 - Math.abs(timeline - 0.5) / 0.28), clamp((timeline - 0.64) / 0.28)];
  $: diagnosisHref = buildDiagnosisHref($page.url, 'renovation_stage', { stage: stage.id, stageContext: stage.title });

  function persist(index: number, source: 'scroll' | 'stepper') {
    if (index === lastPersisted) return;
    lastPersisted = index;
    const item = renovationStages[index];
    sessionStorage.setItem('engineering:selectedStage', item.id);
    window.dispatchEvent(new CustomEvent('engineering:stage-selected', { detail: { stageId: item.id } }));
    const url = new URL(window.location.href);
    url.searchParams.set('stageId', item.id);
    replaceState(`${url.pathname}${url.search}${url.hash}`, history.state);
    track('renovation_stage_selected', { stage: item.id, source });
  }

  function selectStage(index: number) {
    activeIndex = index;
    progress = index / 2;
    persist(index, 'stepper');
  }

  function update() {
    frame = 0;
    if (!root || mobile || reduced) return;
    const rect = root.getBoundingClientRect();
    const range = Math.max(root.offsetHeight - window.innerHeight, 1);
    progress = clamp(-rect.top / range);
    const next = progress < 0.32 ? 0 : progress < 0.68 ? 1 : 2;
    if (next !== activeIndex) {
      activeIndex = next;
      persist(next, 'scroll');
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  onMount(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const size = window.matchMedia('(max-width: 767px)');
    const syncMedia = () => {
      reduced = motion.matches;
      mobile = size.matches;
      schedule();
    };
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('stageId') || sessionStorage.getItem('engineering:selectedStage');
    const restored = renovationStages.findIndex((item) => item.id === requested);
    if (restored >= 0) activeIndex = restored;
    lastPersisted = activeIndex;
    syncMedia();
    images.forEach((image) => image.decode?.().catch(() => undefined));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', syncMedia);
    size.addEventListener('change', syncMedia);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', syncMedia);
      size.removeEventListener('change', syncMedia);
    };
  });
</script>

<section bind:this={root} class="stage-v2" id="stages" data-chapter="03 · Этап ремонта" aria-labelledby="stage-v2-title" style={`--stage-progress:${timeline};--stage-two:${stage2Opacity};--stage-three:${stage3Reveal}`}>
  <div class="stage-v2-sticky">
    <header class="stage-v2-heading">
      <div class="section-label">03 / Этап ремонта</div>
      <h2 id="stage-v2-title">Одна комната. Три разных границы решения.</h2>
      <p>Камера и геометрия не меняются — меняются доступ к узлам, риск переделок и допустимое вмешательство.</p>
    </header>

    <figure class="stage-v2-visual">
      {#each renovationStages as item, index}
        <picture
          class={`stage-v2-plate stage-v2-plate-${index + 1}`}
          style={index === 1 ? `opacity:${stage2Opacity};clip-path:inset(0 ${(1 - stage2Reveal) * 100}% 0 0)` : index === 2 ? `opacity:${stage3Reveal};clip-path:inset(0 0 0 ${(1 - stage3Reveal) * 100}%)` : ''}
          aria-hidden="true"
        >
          <source type="image/webp" srcset={item.image} />
          <img bind:this={images[index]} src={item.image.replace('.webp', '.png')} alt="" width="1672" height="941" loading="lazy" decoding="async" />
        </picture>
      {/each}
      <div class="stage-v2-exposure" aria-hidden="true"></div>
      <svg class="stage-v2-overlay" viewBox="0 0 1000 563" aria-hidden="true">
        <g class="stage-v2-mark stage-v2-mark-new" style={`opacity:${stageWeights[0]}`}>
          <path d="M92 478 L845 478 L878 426" /><path d="M533 78 V470" /><circle cx="533" cy="78" r="7" /><circle cx="533" cy="470" r="7" />
        </g>
        <g class="stage-v2-mark stage-v2-mark-progress" style={`opacity:${stageWeights[1]}`}>
          <path d="M278 66 H590 V408 H278 Z" /><path d="M282 105 H586 M282 365 H586" /><path d="M92 478 H842" />
        </g>
        <g class="stage-v2-mark stage-v2-mark-finished" style={`opacity:${stageWeights[2]}`}>
          <path d="M498 98 V428" /><path d="M474 122 H522 M474 404 H522" /><rect x="474" y="244" width="48" height="74" />
        </g>
      </svg>
      <div class="stage-v2-risk" aria-live="polite">
        <span>Риск этапа · {String(activeIndex + 1).padStart(2, '0')}</span>
        <p>{stage.risk}</p>
      </div>
      <div class="stage-v2-progress" aria-hidden="true"><span>01</span><i><b style={`transform:scaleX(${timeline})`}></b></i><span>03</span></div>
      <figcaption>Иллюстративная архитектурная визуализация · одна камера и одна геометрия</figcaption>
    </figure>

    <div class="stage-v2-mobile-controls" role="group" aria-label="Выбрать этап ремонта">
      <button type="button" on:click={() => selectStage((activeIndex + 2) % 3)}>← Назад</button>
      <strong>{activeIndex + 1} / 3</strong>
      <button type="button" on:click={() => selectStage((activeIndex + 1) % 3)}>Далее →</button>
    </div>

    <div class="stage-v2-rail" aria-live="polite">
      {#each renovationStages as item, index}
        <article class:active={activeIndex === index} style={`--stage-weight:${Math.max(0.26, stageWeights[index])}`}>
          <span>{item.eyebrow}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <ul>{#each item.constraints as constraint}<li>{constraint}</li>{/each}</ul>
        </article>
      {/each}
    </div>

    <div class="stage-v2-action">
      <a class="primary-button" href={diagnosisHref} on:click={() => track('diagnostic_start', { source: 'renovation_stage', stage: stage.id })}>Обсудить мой этап</a>
      <small>Этап ремонта уточняет границы решения, но не заменяет диагностику пути.</small>
    </div>
  </div>

  <div class="stage-v2-reduced">
    {#each renovationStages as item}
      <article>
        <img src={item.image} alt={item.fallback} width="1672" height="941" loading="lazy" decoding="async" />
        <div><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.text}</p><ul>{#each item.constraints as constraint}<li>{constraint}</li>{/each}</ul><a class="primary-button" href={buildDiagnosisHref($page.url, 'renovation_stage_reduced', { stage: item.id, stageContext: item.title })}>Обсудить этот этап</a></div>
      </article>
    {/each}
  </div>
</section>
