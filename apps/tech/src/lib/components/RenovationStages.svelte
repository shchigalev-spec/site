<script lang="ts">
  import { onMount } from 'svelte';
  import type { StageKey } from '$lib/types';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';

  const stages: { key: StageKey; index: string; label: string; title: string; text: string; zones: string[]; asset: string; cta: string }[] = [
    { key: 'new-build', index: '01', label: 'До ремонта', title: 'Доступны основания и открытые узлы объекта.', text: 'Можно заранее согласовать толщины, примыкания, перегородки и инженерные проходки.', zones: ['основания', 'перегородки', 'инженерия'], asset: '/generated/tech-stage-newbuild.png', cta: 'Разобрать шум до ремонта' },
    { key: 'renovation', index: '02', label: 'Ремонт идёт', title: 'Решение связывается с уже выполненными работами.', text: 'Важно не закрыть путь диагностики и согласовать конструкцию со смежными этапами.', zones: ['открытые зоны', 'закрываемые узлы', 'смежные работы'], asset: '/generated/tech-stage-renovation.png', cta: 'Проверить решение в ремонте' },
    { key: 'finished', index: '03', label: 'Готовая квартира', title: 'Сначала — маршрут и допустимый масштаб вмешательства.', text: 'Защита интерьера, локальные раскрытия и ограничения обсуждаются до решения без обещаний нулевой пыли.', zones: ['локальный доступ', 'защита интерьера', 'допустимый демонтаж'], asset: '/generated/tech-stage-finished.png', cta: 'Описать шум в готовой квартире' }
  ];

  let activeIndex = 0;
  let root: HTMLElement;
  $: active = stages[activeIndex];

  function choose(index: number) {
    activeIndex = index;
    diagnosticContext.update((context) => ({ ...context, stage: stages[index].key }));
    track('renovation_stage_selected', { stage: stages[index].key });

    if (
      root &&
      !window.matchMedia('(max-width: 767px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const rect = root.getBoundingClientRect();
      const scrollRange = Math.max(0, root.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: window.scrollY + rect.top + scrollRange * (index / (stages.length - 1)),
        behavior: 'smooth'
      });
    }
  }

  onMount(() => {
    if (
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    let frame = 0;
    const updateFromScroll = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const scrollRange = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(0.9999, -rect.top / scrollRange));
      activeIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  });

  function useFallback(event: Event) {
    const image = event.currentTarget as HTMLImageElement;
    if (!image.src.endsWith('/generated/tech-style-anchor.png')) image.src = '/generated/tech-style-anchor.png';
  }
</script>

<section class="stages" bind:this={root} aria-labelledby="stages-title" data-stage={active.key}>
  <div class="stage-frame">
    <picture>
      <source media="(max-width: 960px)" srcset={active.asset.replace('.png', '-960.webp')} type="image/webp" />
      <source srcset={active.asset.replace('.png', '.webp')} type="image/webp" />
      <img src={active.asset} alt={`Одна комната в состоянии: ${active.label}`} width="1672" height="941" loading="lazy" on:error={useFallback} />
    </picture>
    <div class="stage-shade"></div>
    <div class="shell stage-layout">
      <div class="stage-heading">
        <p class="mono">ОГРАНИЧЕНИЯ / 05</p>
        <h2 class="display" id="stages-title">Одна комната. Три момента для решения.</h2>
      </div>
      <div class="stage-copy" aria-live="polite">
        <span class="mono">{active.index} / {active.label}</span>
        <h3>{active.title}</h3>
        <p>{active.text}</p>
        <ul>{#each active.zones as zone}<li>{zone}</li>{/each}</ul>
        <a class="button" href="/diagnostika-shuma/">{active.cta}</a>
      </div>
      <div class="stage-tabs" role="tablist" aria-label="Стадия объекта">
        {#each stages as stage, index}
          <button role="tab" aria-selected={index === activeIndex} class:active={index === activeIndex} on:click={() => choose(index)}>
            <span class="mono">{stage.index}</span><strong>{stage.label}</strong>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .stages { height: 245svh; background: var(--ink-950); }
  .stage-frame { position: sticky; top: 0; height: 100svh; overflow: hidden; isolation: isolate; }
  .stage-frame img { position: absolute; inset: 0; z-index: -3; width: 100%; height: 100%; object-fit: cover; object-position: center; filter: brightness(.64) saturate(.78); transition: filter 600ms ease, transform 700ms ease; }
  [data-stage='new-build'] .stage-frame img { filter: brightness(.46) saturate(.42) contrast(1.2); transform: scale(1.08); }
  [data-stage='renovation'] .stage-frame img { filter: brightness(.56) saturate(.62); transform: scale(1.04); }
  [data-stage='finished'] .stage-frame img { filter: brightness(.74) saturate(.9); transform: scale(1); }
  .stage-shade { position: absolute; inset: 0; z-index: -2; background: linear-gradient(90deg, rgba(7,9,8,.86), transparent 48%, rgba(7,9,8,.72)); }
  .stage-layout { height: 100%; display: grid; grid-template-columns: repeat(16,1fr); gap: 24px; align-content: center; }
  .stage-heading { grid-column: 1 / 9; align-self: start; }
  .stage-heading .mono { color: var(--acoustic); }
  .stage-heading h2 { margin: 20px 0; font-size: clamp(3rem, 6.2vw, 7.4rem); }
  .stage-copy { grid-column: 11 / -1; align-self: center; padding: 28px; border-left: 1px solid var(--white-16); background: rgba(7,9,8,.28); backdrop-filter: blur(8px); }
  .stage-copy > .mono { color: var(--signal); }
  .stage-copy h3 { margin: 20px 0; font-family: 'Geologica', sans-serif; font-size: clamp(1.8rem, 2.5vw, 3rem); line-height: 1.05; letter-spacing: -.04em; }
  .stage-copy p, .stage-copy li { color: var(--white-64); }
  .stage-copy ul { list-style: none; padding: 0; margin: 24px 0; display: flex; gap: 8px; flex-wrap: wrap; }
  .stage-copy li { padding: 8px 10px; border: 1px solid var(--white-16); border-radius: 100px; font-size: .72rem; }
  .stage-copy .button { width: 100%; font-size: .82rem; }
  .stage-tabs { grid-column: 1 / 10; align-self: end; display: grid; grid-template-columns: repeat(3,1fr); margin-top: 60px; }
  .stage-tabs button { min-height: 70px; display: flex; gap: 15px; align-items: center; border: 0; border-bottom: 1px solid var(--white-16); background: transparent; color: var(--white-64); cursor: pointer; }
  .stage-tabs button.active { border-color: var(--signal); color: var(--white); }
  .stage-tabs strong { font-weight: 500; }
  @media (max-width: 900px) { .stage-layout { grid-template-columns: repeat(8,1fr); } .stage-heading { grid-column: 1 / 6; } .stage-copy { grid-column: 5 / -1; } .stage-tabs { grid-column: 1 / 5; } }
  @media (max-width: 767px) { .stages { height: auto; } .stage-frame { position: relative; min-height: 1000px; height: auto; padding: 120px 0 30px; } .stage-layout { display: flex; flex-direction: column; min-height: 850px; } .stage-copy { margin-top: auto; } .stage-tabs { order: -1; margin: 12px 0 30px; overflow-x: auto; } .stage-tabs button { min-width: 135px; } .stage-shade { background: linear-gradient(0deg, rgba(7,9,8,.96), rgba(7,9,8,.2) 70%); } }
  @media (prefers-reduced-motion: reduce) { .stages { height: auto; } .stage-frame { position: relative; } }
</style>
