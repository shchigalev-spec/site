<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ImageFrame from '$lib/components/ImageFrame.svelte';
  import WallDetailV2 from '$lib/components/WallDetailV2.svelte';
  import CeilingDetailV2 from '$lib/components/CeilingDetailV2.svelte';
  import FloorDetailV2 from '$lib/components/FloorDetailV2.svelte';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  export let data;
  const { service } = data;
  const socialImage = service.image.replace(/\.png$/i, '.webp');
  const Diagram = service.diagram === 'wall' ? WallDetailV2 : service.diagram === 'ceiling' ? CeilingDetailV2 : FloorDetailV2;
  const relatedCase = service.relatedCase;
  $: diagnosisHref = buildDiagnosisHref($page.url, 'service-page');
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${$page.url.origin}/${service.slug}/`,
    areaServed: { '@type': 'City', name: 'Москва' },
    provider: { '@type': 'ProfessionalService', name: 'Лаборатория тишины' }
  });

  function startDiagnosis(source: string) {
    track('diagnostic_start', { source, service: service.slug, family: service.family });
  }

  function faqToggle(event: Event, index: number) {
    if ((event.currentTarget as HTMLDetailsElement).open) track('faq_open', { source: 'service', service: service.slug, index });
  }

  onMount(() => track('service_page_view', { service: service.slug, family: service.family }));
</script>

<svelte:head>
  <title>{service.title} — Лаборатория тишины</title>
  <meta name="description" content={service.description} />
  <link rel="canonical" href={`${$page.url.origin}/${service.slug}/`} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${service.title} — Лаборатория тишины`} />
  <meta property="og:description" content={service.description} />
  <meta property="og:url" content={`${$page.url.origin}/${service.slug}/`} />
  <meta property="og:image" content={`${$page.url.origin}${socialImage}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}${socialImage}`} />
  {@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

{#if service.family === 'surface'}
  <article class="service-page surface-page" data-service-family="surface" data-chapter={`Узел · ${service.focus}`}>
    <header class="surface-hero">
      <div class="surface-hero-copy">
        <div class="section-label">Поверхность / инженерный узел</div>
        <h1>{service.title}</h1>
        <p class="lead">{service.intro}</p>
        <p class="hero-note">{service.heroNote}</p>
        <a class="primary-button" href={diagnosisHref} on:click={() => startDiagnosis('surface_hero')}>Начать с диагностики</a>
      </div>
      <figure class="surface-hero-image">
        <ImageFrame src={service.image} alt={service.imageAlt} fallback={service.focus} eager />
        <figcaption>Иллюстративный узел · не схема для переноса без обследования</figcaption>
      </figure>
    </header>

    <section class="symptom-profile" aria-labelledby="symptom-title">
      <header><div class="section-label">01 / Профиль симптома</div><h2 id="symptom-title">Когда проверяем {service.focus.toLowerCase()}.</h2></header>
      <div class="symptom-list">
        {#each service.symptoms as symptom, index}<article><span>0{index + 1}</span><p>{symptom}</p></article>{/each}
      </div>
      <p class="profile-caveat">Симптом задаёт рабочую гипотезу. Поверхность становится рабочей зоной только после сравнения маршрутов.</p>
    </section>

    <section class="surface-diagram" aria-labelledby="diagram-title">
      <header>
        <div><div class="section-label">02 / Конструктивный разбор</div><h2 id="diagram-title">Узел читаем по связям, а не по слоям в каталоге.</h2></div>
        <p>{service.mechanism}</p>
      </header>
      <div class="diagram-frame"><svelte:component this={Diagram} state={4} /></div>
      <div class="path-columns">
        <article><span>Прямые пути</span><ul>{#each service.directPaths as item}<li>{item}</li>{/each}</ul></article>
        <article><span>Обходные пути</span><ul>{#each service.flankingPaths as item}<li>{item}</li>{/each}</ul></article>
        <article class="risk"><span>Главный риск решения</span><p>{service.decisionRisk}</p></article>
      </div>
    </section>

    <section class="surface-stages" aria-labelledby="stages-title">
      <header><div class="section-label">03 / Этап квартиры</div><h2 id="stages-title">Один узел — разные ограничения вмешательства.</h2></header>
      <ol>{#each service.constraints as item, index}<li><span>0{index + 1}</span><p>{item}</p></li>{/each}</ol>
      <div class="checks-panel"><span>На диагностике проверяем</span><ul>{#each service.checks as check}<li>{check}</li>{/each}</ul></div>
    </section>

    {#if relatedCase}
      <section class="related-case" aria-labelledby="case-title">
        <div class="section-label">04 / Связанный разбор результата</div>
        <h2 id="case-title">{relatedCase.title}</h2>
        <div><p>{relatedCase.note}</p><a class="text-link" href={`/cases/${relatedCase.slug}/`} on:click={() => track('case_open', { source: 'service', case: relatedCase.slug })}>Открыть известные и неизвестные</a></div>
      </section>
    {/if}

    <section class="service-faq" aria-labelledby="faq-title">
      <header><div class="section-label">05 / По этой поверхности</div><h2 id="faq-title">Короткие ответы без универсальной системы.</h2></header>
      <div>{#each service.faq as item, index}<details on:toggle={(event) => faqToggle(event, index)}><summary>{item.question}</summary><p>{item.answer}</p></details>{/each}</div>
    </section>

    <section class="service-diagnosis">
      <div><div class="section-label">Следующий шаг</div><h2>Проверить путь до выбора конструкции.</h2></div>
      <div><p>Опишите, что слышно, этап квартиры и ограничения. Первичный бриф не выдаёт цену или обещание результата.</p><a class="primary-button" href={diagnosisHref} on:click={() => startDiagnosis('surface_final')}>Передать задачу инженеру</a></div>
    </section>
  </article>
{:else}
  <article class="service-page situation-page" data-service-family="situation" data-chapter={`Ситуация · ${service.focus}`}>
    <header class="situation-hero">
      <div class="situation-image"><ImageFrame src={service.image} alt={service.imageAlt} fallback={service.focus} eager /></div>
      <div class="situation-wash" aria-hidden="true"></div>
      <div class="situation-hero-copy">
        <div class="section-label">Жилая ситуация / Москва</div>
        <h1>{service.title}</h1>
        <p class="lead">{service.intro}</p>
        <a class="primary-button" href={diagnosisHref} on:click={() => startDiagnosis('situation_hero')}>Разобрать мою ситуацию</a>
      </div>
      <div class="situation-note" role="note"><span>Рабочий принцип</span><p>{service.heroNote}</p></div>
    </header>

    <section class="situation-story" aria-labelledby="situation-title">
      <header><div class="section-label">01 / Ситуация</div><h2 id="situation-title">{service.focus}</h2></header>
      <div class="story-body"><p class="lead">{service.mechanism}</p><div class="story-symptoms">{#each service.symptoms as item, index}<article><span>0{index + 1}</span><p>{item}</p></article>{/each}</div></div>
      <blockquote><span>Главный риск решения</span><p>{service.decisionRisk}</p></blockquote>
    </section>

    <section class="situation-route" aria-labelledby="route-title">
      <header><div><div class="section-label">02 / Логика пути</div><h2 id="route-title">Слышим симптом. Проверяем несколько связей.</h2></div><p>{service.routeLabel}</p></header>
      <figure>
        <svg viewBox="0 0 700 410" role="img" aria-labelledby="situation-route-svg-title situation-route-svg-desc">
          <title id="situation-route-svg-title">Схема вероятного пути шума</title>
          <desc id="situation-route-svg-desc">Жилая планировка, несколько возможных маршрутов и один выделенный путь для проверки.</desc>
          <path class="plan" d="M45 48H655V362H45ZM45 205H655M238 48V362M466 48V362" />
          <path class="candidate" d="M72 318H238V205H466V94H622" />
          <path class="candidate" d="M72 98C218 98 208 314 390 314S516 112 622 112" />
          <path class="selected" d={service.routePath} />
          <circle class="source" cx="70" cy="92" r="12" /><circle class="heard" cx="615" cy="330" r="12" />
          <text x="54" y="72">источник?</text><text x="540" y="356">слышно здесь</text>
        </svg>
        <figcaption>Схема объясняет порядок проверки, а не утверждает маршрут конкретной квартиры.</figcaption>
      </figure>
      <div class="route-lists"><article><span>Прямые версии</span><ul>{#each service.directPaths as item}<li>{item}</li>{/each}</ul></article><article><span>Обходные версии</span><ul>{#each service.flankingPaths as item}<li>{item}</li>{/each}</ul></article></div>
    </section>

    <section class="situation-constraints" aria-labelledby="constraints-title">
      <header><div class="section-label">03 / Границы вмешательства</div><h2 id="constraints-title">Решение зависит от того, что уже построено и что можно менять.</h2></header>
      <div class="constraint-grid">{#each service.constraints as item, index}<article><span>0{index + 1}</span><p>{item}</p></article>{/each}</div>
      <div class="checks-panel"><span>На диагностике сверяем</span><ul>{#each service.checks as check}<li>{check}</li>{/each}</ul></div>
    </section>

    {#if service.relatedSurfaces}
      <section class="related-surfaces" aria-labelledby="surfaces-title">
        <header><div class="section-label">04 / Связанные поверхности</div><h2 id="surfaces-title">Из ситуации — к конкретному узлу.</h2></header>
        <div>{#each service.relatedSurfaces as item}<a href={`/${item.slug}/`}><span>{item.title}</span><p>{item.note}</p><b aria-hidden="true">↗</b></a>{/each}</div>
      </section>
    {/if}

    <section class="service-faq situation-faq" aria-labelledby="situation-faq-title">
      <header><div class="section-label">05 / Перед диагностикой</div><h2 id="situation-faq-title">Что можно определить заранее.</h2></header>
      <div>{#each service.faq as item, index}<details on:toggle={(event) => faqToggle(event, index)}><summary>{item.question}</summary><p>{item.answer}</p></details>{/each}</div>
    </section>

    <section class="service-diagnosis">
      <div><div class="section-label">Следующий шаг</div><h2>Перевести бытовое описание в проверяемый маршрут.</h2></div>
      <div><p>Первичная диагностика собирает симптом и ограничения. Выездное обследование следует отдельным согласованным шагом.</p><a class="primary-button" href={diagnosisHref} on:click={() => startDiagnosis('situation_final')}>Начать диагностику</a></div>
    </section>
  </article>
{/if}

<style>
  .service-page { background: #f2eee6; color: #242824; }
  .service-page .section-label { color: #48635f; }
  .surface-hero { display: grid; grid-template-columns: minmax(0, 7fr) minmax(24rem, 5fr); min-height: 92svh; padding-top: 4rem; background: #dfe4de; }
  .surface-hero-copy { display: flex; flex-direction: column; justify-content: flex-end; padding: 8rem clamp(2rem, 6vw, 7rem) 5rem var(--margin); }
  .surface-hero-copy h1 { max-width: 10.5ch; margin: 1.5rem 0 2rem; font-size: clamp(4rem, 7.2vw, 8.4rem); }
  .surface-hero-copy .primary-button { align-self: flex-start; margin-top: 2rem; }
  .hero-note { max-width: 39rem; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid #82928b; color: #48635f; }
  .surface-hero-image { position: relative; min-height: 42rem; margin: 0; background: #c7c8c0; }
  .surface-hero-image :global(.image-frame), .surface-hero-image :global(picture), .surface-hero-image :global(img) { width: 100%; height: 100%; }
  .surface-hero-image :global(img) { object-fit: cover; }
  .surface-hero-image figcaption { position: absolute; right: 1rem; bottom: 1rem; max-width: 24rem; padding: .45rem .6rem; background: rgba(21,25,21,.78); color: #fbfaf6; font: .75rem 'IBM Plex Mono', monospace; }

  .symptom-profile { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(3rem, 8vw, 9rem); padding: clamp(7rem, 11vw, 11rem) var(--margin); background: #20231f; color: #fbfaf6; }
  .symptom-profile .section-label, .related-case .section-label, .service-diagnosis .section-label { color: #c6d5cf; }
  .symptom-profile h2 { max-width: 11ch; margin-top: 1.2rem; }
  .symptom-list article { display: grid; grid-template-columns: 3rem 1fr; gap: 1rem; padding: 1.25rem 0; border-top: 1px solid #879d95; }
  .symptom-list span, .path-columns span, .route-lists span, .checks-panel > span { font: .75rem 'IBM Plex Mono', monospace; text-transform: uppercase; color: #c6d5cf; }
  .profile-caveat { grid-column: 2; max-width: 42rem; margin-top: 1.5rem; color: #cdd4cf; }

  .surface-diagram { padding: clamp(7rem, 10vw, 10rem) var(--margin); }
  .surface-diagram > header, .situation-route > header { display: grid; grid-template-columns: 7fr 4fr; gap: 5rem; align-items: end; }
  .surface-diagram h2, .situation-route h2 { max-width: 13ch; margin-top: 1.2rem; }
  .surface-diagram > header > p, .situation-route > header > p { color: #4e5650; }
  .diagram-frame { width: min(70rem, 88%); margin: 6rem auto 3rem; padding: clamp(1rem, 4vw, 4rem); background: #e4e0d8; }
  .path-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .path-columns article { min-height: 13rem; padding: 1.2rem; border-top: 2px solid #698078; background: #fbfaf6; }
  .path-columns span, .route-lists span, .checks-panel > span { color: #48635f; }
  .path-columns ul, .route-lists ul, .checks-panel ul { margin: 1rem 0 0; padding-left: 1.1rem; }
  .path-columns li, .route-lists li, .checks-panel li { margin-top: .65rem; }
  .path-columns .risk { background: #a94332; color: #fbfaf6; border-top-color: #20231f; }
  .path-columns .risk span { color: #fbfaf6; }
  .path-columns .risk p { margin-top: 1rem; }

  .surface-stages, .situation-constraints { padding: clamp(7rem, 10vw, 10rem) var(--margin); background: #dfe4de; }
  .surface-stages > header, .situation-constraints > header, .related-surfaces > header, .service-faq > header { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); }
  .surface-stages h2, .situation-constraints h2, .related-surfaces h2, .service-faq h2 { max-width: 13ch; }
  .surface-stages ol, .constraint-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gutter); margin: 5rem 0 0; padding: 0; list-style: none; }
  .surface-stages li, .constraint-grid article { min-height: 13rem; padding: 1rem 0; border-top: 2px solid #698078; }
  .surface-stages li span, .constraint-grid span { font: .75rem 'IBM Plex Mono', monospace; color: #48635f; }
  .surface-stages li p, .constraint-grid p { margin-top: 4rem; }
  .checks-panel { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); margin-top: 5rem; padding: 1.3rem; border: 1px solid #98aaa2; background: #f2eee6; }
  .checks-panel ul { display: flex; flex-wrap: wrap; gap: .65rem 2rem; margin: 0; padding: 0; list-style: none; }
  .checks-panel li { margin: 0; }
  .checks-panel li::before { content: '◇'; margin-right: .55rem; color: #a94332; }

  .related-case { display: grid; grid-template-columns: 3fr 5fr 4fr; gap: var(--gutter); align-items: end; padding: clamp(7rem, 10vw, 10rem) var(--margin); background: #20231f; color: #fbfaf6; }
  .related-case .section-label { align-self: start; color: #c6d5cf; }
  .related-case h2 { max-width: 8ch; }
  .related-case p { color: #d4dad5; }
  .related-case .text-link { margin-top: 1.5rem; }

  .service-faq { display: grid; grid-template-columns: 6fr 6fr; gap: clamp(3rem, 8vw, 8rem); padding: clamp(7rem, 10vw, 10rem) var(--margin); }
  .service-faq > header { display: block; }
  .service-faq h2 { margin-top: 1.2rem; }
  .service-faq details { border-top: 1px solid #9ba7a1; }
  .service-faq details:last-child { border-bottom: 1px solid #9ba7a1; }
  .service-faq summary { min-height: 64px; display: flex; align-items: center; cursor: pointer; font-weight: 600; }
  .service-faq details p { padding: 0 0 1.5rem; color: #4e5650; }

  .service-diagnosis { display: grid; grid-template-columns: 7fr 4fr; gap: 5rem; align-items: center; padding: clamp(5rem, 8vw, 8rem) var(--margin); background: #20231f; color: #fbfaf6; }
  .service-diagnosis h2 { max-width: 12ch; margin-top: 1rem; }
  .service-diagnosis p { color: #d4dad5; }
  .service-diagnosis .primary-button { margin-top: 1.5rem; }

  .situation-hero { position: relative; min-height: 100svh; overflow: hidden; background: #20231f; color: #fbfaf6; }
  .situation-image, .situation-image :global(.image-frame), .situation-image :global(picture), .situation-image :global(img) { position: absolute; inset: 0; width: 100%; height: 100%; }
  .situation-image :global(img) { object-fit: cover; }
  .situation-wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(21,25,21,.9) 0, rgba(21,25,21,.66) 44%, rgba(21,25,21,.05) 72%), linear-gradient(0deg, rgba(21,25,21,.58), transparent 45%); }
  .situation-hero-copy { position: relative; z-index: 2; display: flex; min-height: 100svh; flex-direction: column; justify-content: flex-end; padding: 9rem var(--margin) 5rem; }
  .situation-hero-copy .section-label { color: #c6d5cf; }
  .situation-hero-copy h1 { max-width: 10ch; margin: 1.5rem 0 2rem; font-size: clamp(4rem, 7.6vw, 9rem); }
  .situation-hero-copy .lead { color: #e0e5e1; }
  .situation-hero-copy .primary-button { align-self: flex-start; margin-top: 2rem; }
  .situation-note { position: absolute; z-index: 3; right: var(--margin); bottom: 5rem; width: min(27rem, 34vw); padding: 1.2rem; border-top: 2px solid #d96b55; background: rgba(21,25,21,.74); }
  .situation-note span { font: .75rem 'IBM Plex Mono', monospace; text-transform: uppercase; color: #c6d5cf; }
  .situation-note p { margin-top: .7rem; }

  .situation-story { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(3rem, 8vw, 9rem); padding: clamp(8rem, 12vw, 12rem) var(--margin); }
  .situation-story h2 { max-width: 11ch; margin-top: 1.2rem; }
  .story-body .lead { margin-bottom: 3rem; }
  .story-symptoms article { display: grid; grid-template-columns: 3rem 1fr; gap: 1rem; padding: 1rem 0; border-top: 1px solid #9ba7a1; }
  .story-symptoms span { font: .75rem 'IBM Plex Mono', monospace; color: #48635f; }
  .situation-story blockquote { grid-column: 2; margin: 2rem 0 0; padding: 1.4rem; border-left: 5px solid #a94332; background: #ead9d2; }
  .situation-story blockquote span { font: .75rem 'IBM Plex Mono', monospace; text-transform: uppercase; color: #7f3f32; }
  .situation-story blockquote p { margin-top: .8rem; font-size: 1.15rem; }

  .situation-route { padding: clamp(7rem, 10vw, 10rem) var(--margin); background: #dfe4de; }
  .situation-route figure { width: min(68rem, 86%); margin: 5rem auto 0; }
  .situation-route svg { width: 100%; height: auto; background: #f2eee6; }
  .situation-route .plan { fill: none; stroke: #77827b; stroke-width: 3; }
  .situation-route .candidate { fill: none; stroke: #8da199; stroke-width: 4; stroke-dasharray: 10 10; }
  .situation-route .selected { fill: none; stroke: #a94332; stroke-width: 7; }
  .situation-route .source { fill: #a94332; } .situation-route .heard { fill: #20231f; }
  .situation-route text { fill: #38413b; font: 15px 'IBM Plex Mono', monospace; }
  .situation-route figcaption { margin-top: 1rem; color: #4e5650; font-size: .85rem; }
  .route-lists { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gutter); margin-top: 3rem; }
  .route-lists article { padding: 1.2rem; border-top: 2px solid #698078; background: #f2eee6; }

  .related-surfaces { padding: clamp(7rem, 10vw, 10rem) var(--margin); }
  .related-surfaces > div { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gutter); margin-top: 5rem; }
  .related-surfaces a { position: relative; min-height: 15rem; padding: 1.3rem; border: 1px solid #9ba7a1; background: #fbfaf6; }
  .related-surfaces a:hover { border-color: #a94332; }
  .related-surfaces a span { font-family: 'Geologica', sans-serif; font-size: 1.6rem; }
  .related-surfaces a p { margin-top: 4rem; color: #4e5650; }
  .related-surfaces a b { position: absolute; right: 1.2rem; top: 1rem; color: #a94332; }
  .situation-faq { background: #e7e0d4; }

  @media (max-width: 800px) {
    .surface-hero { display: flex; flex-direction: column; min-height: 0; padding-top: 4.5rem; }
    .surface-hero-copy { padding: 4rem 1rem 3rem; }
    .surface-hero-copy h1, .situation-hero-copy h1 { max-width: 100%; font-size: clamp(2.65rem, 11.2vw, 4rem); hyphens: auto; overflow-wrap: break-word; }
    .service-page h2 { max-width: 100%; font-size: clamp(2.35rem, 10.5vw, 3.4rem); hyphens: auto; overflow-wrap: anywhere; }
    .surface-hero-copy .primary-button, .situation-hero-copy .primary-button { width: 100%; }
    .surface-hero-image { min-height: 25rem; }
    .symptom-profile, .situation-story { display: block; padding-inline: 1rem; }
    .symptom-list, .story-body { margin-top: 3rem; }
    .profile-caveat, .situation-story blockquote { margin-top: 2rem; }
    .surface-diagram, .surface-stages, .related-case, .service-faq, .service-diagnosis, .situation-route, .situation-constraints, .related-surfaces { padding-inline: 1rem; }
    .surface-diagram > header, .situation-route > header, .surface-stages > header, .situation-constraints > header, .related-surfaces > header, .service-diagnosis { display: block; }
    .surface-diagram > header > p, .situation-route > header > p { margin-top: 2rem; }
    .diagram-frame, .situation-route figure { width: 100%; margin-top: 3rem; padding: .4rem; overflow: hidden; }
    .path-columns, .surface-stages ol, .constraint-grid, .related-surfaces > div, .route-lists { grid-template-columns: 1fr; }
    .path-columns article, .surface-stages li, .constraint-grid article { min-height: 0; }
    .surface-stages li p, .constraint-grid p { margin-top: 1.5rem; }
    .checks-panel { display: block; }
    .checks-panel ul { display: grid; margin-top: 1rem; }
    .related-case { display: block; }
    .related-case h2 { margin: 1.5rem 0; }
    .service-faq { display: block; }
    .service-faq > div { margin-top: 3rem; }
    .service-diagnosis > div:last-child { margin-top: 2rem; }
    .service-diagnosis .primary-button { width: 100%; }

    .situation-hero { min-height: 52rem; }
    .situation-hero-copy { min-height: 52rem; padding: 7rem 1rem 12rem; }
    .situation-wash { background: linear-gradient(0deg, rgba(21,25,21,.94) 0 50%, rgba(21,25,21,.18) 82%); }
    .situation-note { left: 1rem; right: 1rem; bottom: 1rem; width: auto; }
    .situation-story blockquote { grid-column: auto; }
    .situation-route svg { min-width: 0; }
    .related-surfaces a { min-height: 11rem; }
    .related-surfaces a p { margin-top: 2.5rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .service-page * { scroll-behavior: auto; }
  }
</style>
