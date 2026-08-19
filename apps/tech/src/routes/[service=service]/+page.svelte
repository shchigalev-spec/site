<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import ServicePage from '$components/ServicePage.svelte';
  import { track } from '$lib/analytics';
  import type { ServicePage as ServicePageData } from '$lib/types';

  export let data: { service: ServicePageData };
  $: structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.service.h1,
    description: data.service.description,
    areaServed: 'Москва',
    provider: { '@type': 'Organization', name: 'Лаборатория тишины' },
    url: $page.url.href
  };

  onMount(() => track('service_page_view', { service: data.service.slug }));
</script>

<svelte:head>
  <title>{data.service.title}</title>
  <meta name="description" content={data.service.description} />
  <link rel="canonical" href={$page.url.origin + $page.url.pathname} />
  <meta property="og:title" content={data.service.title} />
  <meta property="og:description" content={data.service.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:image" content={$page.url.origin + '/generated/tech-hero-cutaway.png'} />
  {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<ServicePage page={data.service} />
