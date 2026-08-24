<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import SituationServicePage from '$components/SituationServicePage.svelte';
  import SurfaceServicePage from '$components/SurfaceServicePage.svelte';
  import { track } from '$lib/analytics';
  import { stableSiteUrl } from '$lib/metadata';
  import type { ServicePage as ServicePageData } from '$lib/types';

  export let data: { service: ServicePageData };
  $: canonicalUrl = stableSiteUrl($page.url);
  $: structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.service.h1,
    description: data.service.description,
    areaServed: 'Москва',
    provider: { '@type': 'Organization', name: 'Лаборатория тишины' },
    url: canonicalUrl
  };

  onMount(() => track('service_page_view', { service: data.service.slug }));
</script>

<svelte:head>
  <title>{data.service.title}</title>
  <meta name="description" content={data.service.description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={data.service.title} />
  <meta property="og:description" content={data.service.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={stableSiteUrl($page.url, data.service.asset + '.png')} />
  {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

{#if data.service.family === 'surface'}
  <SurfaceServicePage page={data.service} />
{:else}
  <SituationServicePage page={data.service} />
{/if}
