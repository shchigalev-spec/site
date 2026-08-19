<script lang="ts">
  import { onMount } from 'svelte';
  import ImageFrame from '$lib/components/ImageFrame.svelte';
  import CaseGraph from '$lib/components/CaseGraph.svelte';
  import { track } from '$lib/analytics';
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

<article class="case-detail-page">
  <header class="case-detail-head"><div><div class="section-label">{item.eyebrow}</div><h1>{item.title}</h1></div><p>{item.description}</p></header>
  <div class="case-detail-visual"><ImageFrame src={item.image} alt={`Иллюстративная визуализация результата ${item.title}`} fallback={`Измеренный результат ${item.title}`} /><CaseGraph {item} /></div>
  <div class="case-detail-facts">
    <div><div class="section-label">Что установлено</div><h3>Это достигнутый результат.</h3><p>{item.fact}</p></div>
    <div><div class="section-label">Что не заявляем</div><p>В доступных данных нет адреса, имени заказчика, точной системы, длительности, бюджета и дополнительных деталей протокола.</p><small>Иллюстративная визуализация, не фотография объекта заказчика.</small></div>
  </div>
  <div class="route-diagnosis"><div><h3>Ваш результат начинается с диагностики конкретного пути.</h3></div><div><p>Чужой показатель не становится обещанием для другой квартиры.</p><a class="primary-button" href={`/diagnostika-shuma/?case=${item.slug}`}>Записаться на диагностику</a></div></div>
</article>
