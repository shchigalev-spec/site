<script lang="ts">
  import { page } from '$app/stores';
  import { casePages } from '$lib/data/site';
  import { track } from '$lib/analytics';
  import { stableSiteUrl } from '$lib/metadata';
  $: canonicalUrl = stableSiteUrl($page.url);
</script>

<svelte:head>
  <title>Кейсы шумоизоляции с измеренными результатами</title>
  <meta name="description" content="Три достигнутых результата шумоизоляции: 58 dB → 39 dB, снижение пика 71 dB на 16 dB и 64 dB → 43 dB." />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content="Измеренные результаты — Лаборатория тишины" />
  <meta property="og:description" content="Результаты до и после без вымышленных адресов, цен и систем." />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={stableSiteUrl($page.url, '/generated/tech-og.png')} />
</svelte:head>

<section class="cases-hero">
  <div class="shell">
    <p class="mono">КЕЙСЫ / ИЗМЕРЕНИЕ</p>
    <h1 class="display">Не обещания.<br />Сопоставление.</h1>
    <p class="lead">Результаты показывают, что изменение можно измерять. Они не обещают то же значение в другой квартире без диагностики.</p>
  </div>
</section>

<section class="case-index">
  {#each casePages as item, index}
    <a class="case-link" href={`/cases/${item.slug}/`} on:click={() => track('case_open', { case: item.slug })}>
      <div class="shell case-grid">
        <span class="mono">0{index + 1}</span>
        <strong class="display">{item.result}</strong>
        <p>{item.narrative}</p>
        <i>↗</i>
      </div>
    </a>
  {/each}
</section>

<section class="cases-next warm"><div class="shell"><p class="display">Ваш симптом ещё не кейс. Сначала его нужно разобрать.</p><a class="button" href="/diagnostika-shuma/">Записаться на диагностику</a></div></section>

<style>
  .cases-hero{min-height:92svh;padding-top:24svh;background:radial-gradient(circle at 75% 35%,rgba(108,159,150,.17),transparent 32%),var(--ink-950)}.cases-hero .mono{color:var(--acoustic)}h1{margin:25px 0;font-size:clamp(4rem,9vw,11rem)}.cases-hero .lead{margin-left:8%;max-width:56ch}.case-link{display:block;border-top:1px solid var(--white-16);transition:background 220ms ease}.case-link:last-child{border-bottom:1px solid var(--white-16)}.case-link:hover{background:var(--ink-900)}.case-grid{min-height:48svh;display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:center}.case-grid>.mono{grid-column:1/3;color:var(--acoustic)}.case-grid strong{grid-column:3/10;font-size:clamp(3.2rem,7vw,8rem)}.case-grid p{grid-column:11/15;color:var(--white-64)}.case-grid i{grid-column:16;font-size:2rem;color:var(--signal)}.cases-next{min-height:75svh;display:grid;place-items:center}.cases-next>.shell{display:flex;justify-content:space-between;align-items:center;gap:60px}.cases-next p{max-width:12ch;font-size:clamp(3rem,6vw,7rem)}@media(max-width:767px){.case-grid{min-height:62svh;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}.cases-next>.shell{display:block}.cases-next .button{margin-top:20px}}
</style>
