<script lang="ts">
  import { onMount } from 'svelte';
  import ImageFrame from '$lib/components/ImageFrame.svelte';
  import CaseGraph from '$lib/components/CaseGraph.svelte';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';
  import { page } from '$app/stores';

  export let data;
  const { item } = data;
  const socialImage = item.image.replace(/\.png$/i, '.webp');

  onMount(() => track('case_open', { case: item.slug }));
</script>

<svelte:head>
  <title>{item.title} — измеренный результат шумоизоляции</title>
  <meta name="description" content={`${item.description} ${item.fact}`} />
  <link rel="canonical" href={`/cases/${item.slug}/`} />
  <meta property="og:title" content={`${item.title} — Лаборатория тишины`} />
  <meta property="og:description" content={item.description} />
  <meta property="og:image" content={`${$page.url.origin}${socialImage}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}${socialImage}`} />
</svelte:head>

<article class="case-detail-v2" data-chapter="05 · Кейсы">
  <header class="case-hero">
    <div>
      <div class="section-label">05 / {item.eyebrow}</div>
      <h1>{item.title}</h1>
    </div>
    <div class="hero-claim">
      <p>{item.description}</p>
      <strong>Это достигнутый измеренный результат, а не прогноз для другой квартиры.</strong>
    </div>
  </header>

  <div class="case-evidence">
    <div class="case-image">
      <ImageFrame src={item.image} alt={`Иллюстративная визуализация результата ${item.title}`} fallback={`Измеренный результат ${item.title}`} eager />
      <small>Иллюстративная визуализация, не фотография объекта заказчика.</small>
    </div>
    <CaseGraph {item} />
  </div>

  <section class="case-narrative" aria-labelledby="case-narrative-title">
    <header>
      <div class="section-label">От симптома к проверяемому факту</div>
      <h2 id="case-narrative-title">Показываем границы данных на каждом шаге.</h2>
    </header>
    <div class="narrative-list">
      <article><span>01 / Что слышали</span><h3>Симптом</h3><p>{item.heard}</p></article>
      <article><span>02 / Что предполагали</span><h3>Исходная гипотеза</h3><p>{item.assumption}</p></article>
      <article><span>03 / Что обследовали</span><h3>Зоны проверки</h3><p>{item.inspected}</p></article>
      <article><span>04 / Инженерный вывод</span><h3>Что изменил диагноз</h3><p>{item.diagnosticChange}</p></article>
      <article class="intervention-card">
        <span>05 / Вмешательство</span><h3>Опубликованные принципы</h3>
        <ul>{#each item.intervention as principle}<li>{principle}</li>{/each}</ul>
      </article>
      <article class="result-card"><span>06 / Проверка</span><h3>Измеренный результат</h3><p>{item.result}</p></article>
      <article><span>07 / Ограничение</span><h3>Что нельзя переносить</h3><p>{item.limitation}</p></article>
      <article><span>08 / Полнота</span><h3>Что ещё неизвестно</h3><p>{item.fact}</p></article>
    </div>
  </section>

  <section class="known-unknown" aria-labelledby="known-unknown-title">
    <header><div class="section-label">Evidence panel</div><h2 id="known-unknown-title">Известно / неизвестно.</h2></header>
    <div class="evidence-columns">
      <div class="known">
        <span>Подтверждено исходными данными</span>
        <ul>{#each item.known as fact}<li>{fact}</li>{/each}</ul>
      </div>
      <div class="unknown">
        <span>Не опубликовано — не додумываем</span>
        <ul>{#each item.unknown as gap}<li>{gap}</li>{/each}</ul>
      </div>
    </div>
  </section>

  <section class="case-diagnosis">
    <div><div class="section-label">Следующий шаг</div><h2>Ваш результат начинается с диагностики конкретного пути.</h2></div>
    <div><p>Чужой показатель не становится обещанием для другой квартиры. Сначала проверяем ваш симптом, конструкции и ограничения.</p><a class="primary-button" href={buildDiagnosisHref($page.url, 'case_detail', { case: item.slug })} on:click={() => track('diagnostic_start', { placement: 'case-detail-v2', case: item.slug })}>Начать диагностику</a></div>
  </section>
</article>

<style>
  .case-detail-v2 { background: #f2eee6; color: #242824; }
  .case-hero { display: grid; grid-template-columns: 7fr 5fr; gap: var(--gutter); align-items: end; min-height: 70svh; padding: 10rem var(--margin) 5rem; }
  .case-hero .section-label { color: #48635f; }
  .case-hero > div { min-width: 0; }
  .case-hero h1 { max-width: 8ch; margin: 1.2rem 0 0; font-size: clamp(4.5rem, 11vw, 12rem); line-height: 0.82; letter-spacing: -0.075em; }
  .hero-claim { max-width: 34rem; padding-top: 1.5rem; border-top: 2px solid #2d332e; }
  .hero-claim p { font-size: clamp(1.15rem, 2vw, 1.65rem); }
  .hero-claim strong { display: block; margin-top: 1.5rem; color: #48635f; }

  .case-evidence { display: grid; grid-template-columns: 7fr 5fr; min-height: 40rem; background: #20231f; }
  .case-image { position: relative; min-height: 40rem; overflow: hidden; }
  .case-image :global(.image-frame),
  .case-image :global(picture),
  .case-image :global(img) { width: 100%; height: 100%; }
  .case-image :global(img) { object-fit: cover; }
  .case-image small { position: absolute; left: 1rem; right: 1rem; bottom: 1rem; padding: 0.7rem 0.9rem; background: rgba(20, 24, 21, 0.9); color: #f8f4ed; font: 0.75rem 'IBM Plex Mono', monospace; }
  .case-evidence :global(.case-graph-v2) { align-self: center; margin: clamp(1rem, 4vw, 4rem); }

  .case-narrative { padding: clamp(7rem, 11vw, 11rem) var(--margin); }
  .case-narrative > header { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); }
  .case-narrative .section-label { color: #48635f; }
  .case-narrative h2 { max-width: 14ch; margin: 0; }
  .narrative-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 var(--gutter); margin-top: 6rem; border-top: 1px solid #aeb8b0; }
  .narrative-list article { min-height: 19rem; padding: 2rem 0; border-bottom: 1px solid #aeb8b0; }
  .narrative-list article:nth-child(odd) { padding-right: 2rem; border-right: 1px solid #aeb8b0; }
  .narrative-list span { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .narrative-list h3 { margin: 2.5rem 0 1rem; font-size: clamp(1.8rem, 3vw, 3.2rem); }
  .narrative-list p,
  .narrative-list li { max-width: 45ch; color: #4e5650; }
  .narrative-list ul { margin: 1rem 0 0; padding: 0; list-style: none; }
  .narrative-list li { position: relative; padding: 0.45rem 0 0.45rem 1.3rem; }
  .narrative-list li::before { content: ''; position: absolute; left: 0; top: 0.95rem; width: 0.42rem; height: 0.42rem; background: #a94332; transform: rotate(45deg); }
  .result-card { background: #dfe4de; padding-inline: 2rem !important; }
  .result-card p { color: #242824; font-size: 1.25rem; }

  .known-unknown { padding: clamp(6rem, 9vw, 9rem) var(--margin); background: #20231f; color: #fbfaf6; }
  .known-unknown > header { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); }
  .known-unknown .section-label { color: #b9c9c2; }
  .known-unknown h2 { margin: 0; }
  .evidence-columns { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gutter); margin-top: 5rem; }
  .evidence-columns > div { padding: 2rem; border-top: 4px solid #879d95; background: #292d28; }
  .evidence-columns .unknown { border-color: #d96b55; }
  .evidence-columns span { font: 0.75rem 'IBM Plex Mono', monospace; color: #c6d5cf; text-transform: uppercase; }
  .evidence-columns ul { margin: 2rem 0 0; padding: 0; list-style: none; }
  .evidence-columns li { display: flex; gap: 0.9rem; padding: 0.9rem 0; border-top: 1px solid rgba(251, 250, 246, 0.18); }
  .evidence-columns li::before { content: '◆'; color: #b9c9c2; font-size: 0.65rem; }
  .evidence-columns .unknown li::before { color: #efb8a8; }

  .case-diagnosis { display: grid; grid-template-columns: 7fr 5fr; gap: var(--gutter); align-items: end; padding: clamp(7rem, 11vw, 11rem) var(--margin); background: #dfe4de; }
  .case-diagnosis .section-label { color: #48635f; }
  .case-diagnosis h2 { max-width: 13ch; margin: 1.2rem 0 0; }
  .case-diagnosis > div:last-child { max-width: 34rem; }
  .case-diagnosis .primary-button { margin-top: 2rem; }

  @media (max-width: 800px) {
    .case-hero,
    .case-evidence,
    .case-narrative > header,
    .known-unknown > header,
    .case-diagnosis { grid-template-columns: 1fr; }
    .case-hero { min-height: 0; padding: 8rem 1.1rem 3rem; }
    .case-hero h1 { font-size: clamp(3.4rem, 18vw, 6rem); overflow-wrap: break-word; }
    .hero-claim { margin-top: 2rem; }
    .case-evidence { min-height: 0; }
    .case-image { min-height: 25rem; }
    .case-evidence :global(.case-graph-v2) { margin: 1rem; }
    .case-narrative,
    .known-unknown,
    .case-diagnosis { padding-inline: 1.1rem; }
    .case-narrative h2,
    .known-unknown h2 { margin-top: 1.2rem; }
    .narrative-list { grid-template-columns: 1fr; margin-top: 3.5rem; }
    .narrative-list article { min-height: 0; }
    .narrative-list article:nth-child(odd) { padding-right: 0; border-right: 0; }
    .result-card { margin-inline: -1.1rem; padding-inline: 1.1rem !important; }
    .evidence-columns { grid-template-columns: 1fr; margin-top: 3rem; }
    .case-diagnosis > div:last-child { margin-top: 2rem; }
    .case-diagnosis .primary-button { width: 100%; justify-content: center; }
  }
</style>
