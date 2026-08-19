<script lang="ts">
  import { cases } from '$lib/content';
  import { track } from '$lib/analytics';
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Результаты шумоизоляции — измеренные случаи</title>
  <meta name="description" content="Три достигнутых измеренных результата: 58→39 dB, снижение пикового уровня 71 dB на 16 dB, 64→43 dB." />
  <link rel="canonical" href="/cases/" />
  <meta property="og:image" content={`${$page.url.origin}/generated/engineering-og.webp`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}/generated/engineering-og.webp`} />
</svelte:head>

<section class="case-index">
  <header class="case-index-header"><div class="section-label">Измеренные результаты</div><h1>Факты отделены от неизвестных.</h1><p class="lead">Показываем достигнутые величины и не выдумываем адреса, системы, сроки или бюджеты.</p></header>
  <div class="case-index-list">
    {#each cases as item, index}
      <article class="case-index-item">
        <span>{String(index + 1).padStart(2, '0')}</span><h2>{item.title}</h2><p>{item.description}</p><a class="text-link" href={`/cases/${item.slug}/`} on:click={() => track('case_open', { case: item.slug })}>Открыть</a>
      </article>
    {/each}
  </div>
</section>
