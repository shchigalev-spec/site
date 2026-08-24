<script lang="ts">
  import { page } from '$app/stores';
  import CaseEvidencePageV2 from '$components/CaseEvidencePageV2.svelte';
  import { stableSiteUrl } from '$lib/metadata';
  import type { CasePage } from '$lib/types';
  export let data: { item: CasePage };
  $: stableUrl = stableSiteUrl($page.url);
  $: schema = { '@context': 'https://schema.org', '@type': 'Article', headline: data.item.title, description: data.item.description, author: { '@type': 'Organization', name: 'Лаборатория тишины' }, url: stableUrl };
</script>

<svelte:head>
  <title>{data.item.title}</title>
  <meta name="description" content={data.item.description} />
  <link rel="canonical" href={stableUrl} />
  <meta property="og:title" content={data.item.title} />
  <meta property="og:description" content={data.item.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={stableUrl} />
  <meta property="og:image" content={stableSiteUrl($page.url, data.item.asset)} />
  {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<CaseEvidencePageV2 item={data.item} />
