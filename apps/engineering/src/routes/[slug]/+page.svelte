<script lang="ts">
  import { onMount } from 'svelte';
  import ImageFrame from '$lib/components/ImageFrame.svelte';
  import LayerDetail from '$lib/components/LayerDetail.svelte';
  import { track } from '$lib/analytics';
  import { page } from '$app/stores';

  export let data;
  const { service } = data;
  const socialImage = service.image.replace(/\.png$/i, '.webp');
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    areaServed: { '@type': 'City', name: 'Москва' },
    provider: { '@type': 'ProfessionalService', name: 'Лаборатория тишины' }
  });
  onMount(() => track('service_page_view', { service: service.slug }));
</script>

<svelte:head>
  <title>{service.title} — Лаборатория тишины</title>
  <meta name="description" content={service.description} />
  <link rel="canonical" href={`/${service.slug}/`} />
  <meta property="og:title" content={`${service.title} — Лаборатория тишины`} />
  <meta property="og:description" content={service.description} />
  <meta property="og:image" content={`${$page.url.origin}${socialImage}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}${socialImage}`} />
  <script type="application/ld+json">{structuredData}</script>
</svelte:head>

<section class="route-hero">
  <div class="route-hero-copy">
    <div class="section-label">Инженерная шумоизоляция / Москва</div>
    <h1>{service.title}</h1>
    <p class="lead">{service.intro}</p>
    <a class="primary-button" href={`/diagnostika-shuma/?service=${service.slug}`} on:click={() => track('diagnostic_start', { source: 'service_hero', service: service.slug })}>Записаться на бесплатную диагностику</a>
  </div>
  <div class="route-hero-image"><ImageFrame src={service.image} alt={`Архитектурная схема: ${service.focus}`} fallback={service.focus} /></div>
</section>

<section class="route-content">
  <div class="route-content-grid">
    <h2>{service.focus}</h2>
    <div class="route-detail">
      <p>{service.mechanism}</p>
      <ul>{#each service.checks as check}<li>{check}</li>{/each}</ul>
      <p>Сначала инженер сравнивает гипотезы пути. Затем конструкция подбирается под задачу, здание, этап ремонта и физические ограничения.</p>
    </div>
  </div>
  <LayerDetail />
  <div class="route-diagnosis">
    <div><div class="section-label">Следующий шаг</div><h3>Не поверхность. Путь и его примыкания.</h3></div>
    <div><p>Опишите, что слышно. Менеджер уточнит задачу и согласует выездную диагностику.</p><a class="primary-button" href={`/diagnostika-shuma/?service=${service.slug}`}>Передать задачу инженеру</a></div>
  </div>
</section>
