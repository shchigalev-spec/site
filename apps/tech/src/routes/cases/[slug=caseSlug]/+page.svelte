<script lang="ts">
  import { page } from '$app/stores';
  import type { CasePage } from '$lib/types';
  export let data: { item: CasePage };
  $: schema = { '@context':'https://schema.org','@type':'Article',headline:data.item.title,description:data.item.description,author:{'@type':'Organization',name:'Лаборатория тишины'},url:$page.url.href };
</script>

<svelte:head>
  <title>{data.item.title}</title>
  <meta name="description" content={data.item.description} />
  <link rel="canonical" href={$page.url.origin + $page.url.pathname} />
  <meta property="og:title" content={data.item.title} />
  <meta property="og:description" content={data.item.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:image" content={$page.url.origin + data.item.asset} />
  {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<article class="case-page">
  <section class="case-hero">
    <picture class="case-visual">
      <source media="(max-width: 960px)" srcset={data.item.asset.replace('.png', '-960.webp')} type="image/webp" />
      <source srcset={data.item.asset.replace('.png', '.webp')} type="image/webp" />
      <img src={data.item.asset} alt="Визуализация кейса; не фотография реального объекта" width="1672" height="941" />
    </picture>
    <div class="shade"></div>
    <div class="shell case-hero-grid">
      <p class="mono">{data.item.eyebrow}</p>
      <h1 class="display">{data.item.result}</h1>
      <p class="lead">{data.item.narrative}</p>
      <small>Визуализация кейса. Изображение не является фотографией объекта.</small>
    </div>
  </section>
  <section class="measurement">
    <div class="shell measurement-grid">
      <p class="mono">СОПОСТАВЛЕНИЕ</p>
      <h2 class="display">Данные фиксируют изменение, а не универсальное обещание.</h2>
      <div class="meter"><span>{data.item.resultParts[0]}</span><i></i><b>{data.item.resultParts[1]}</b></div>
      <ul>{#each data.item.measured as fact}<li>{fact}</li>{/each}</ul>
      <aside><span class="mono">ОГРАНИЧЕНИЕ</span><p>{data.item.caveat}</p></aside>
    </div>
  </section>
  <section class="case-cta warm"><div class="shell"><p class="display">Сопоставить этот результат с вашей квартирой можно только через диагностику.</p><a class="button" href="/diagnostika-shuma/">Разобрать мой шум</a></div></section>
</article>

<style>
  .case-hero{position:relative;min-height:100svh;display:flex;align-items:end;overflow:hidden;isolation:isolate}.case-visual{position:absolute;inset:0;z-index:-2}.case-visual img{width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(.65)}.shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(0deg,var(--ink-950),transparent 65%),linear-gradient(90deg,rgba(7,9,8,.7),transparent)}.case-hero-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px;padding-bottom:80px}.case-hero-grid>.mono{grid-column:1/5;color:var(--acoustic)}h1{grid-column:1/14;margin:20px 0;font-size:clamp(5rem,11vw,13rem);font-variant-numeric:tabular-nums}.lead{grid-column:2/10}.case-hero-grid small{grid-column:12/-1;align-self:end;color:var(--white-64)}.measurement{padding:clamp(110px,14vw,230px) 0}.measurement-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px}.measurement-grid>.mono{grid-column:1/4;color:var(--acoustic)}.measurement-grid h2{grid-column:4/14;margin:0;font-size:clamp(3rem,5.8vw,6.8rem)}.meter{grid-column:2/11;margin-top:80px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;font-family:'Geologica',sans-serif;font-size:clamp(2.4rem,5vw,6rem)}.meter i{height:3px;background:linear-gradient(90deg,var(--signal),var(--acoustic));box-shadow:0 0 20px rgba(108,159,150,.4)}.meter b{color:var(--acoustic);font-weight:500}.measurement-grid ul{grid-column:3/10;list-style:none;padding:0;margin:50px 0}.measurement-grid li{padding:15px 0;border-bottom:1px solid var(--white-16);color:var(--white-64)}.measurement-grid aside{grid-column:12/-1;margin-top:80px;padding:24px;border-left:1px solid var(--white-16)}.measurement-grid aside>.mono{color:var(--warning)}.measurement-grid aside p{color:var(--white-64)}.case-cta{min-height:80svh;display:grid;place-items:center}.case-cta>.shell{display:flex;justify-content:space-between;align-items:center;gap:60px}.case-cta p{max-width:13ch;font-size:clamp(3rem,6vw,7rem)}@media(max-width:767px){.case-hero-grid,.measurement-grid{display:block}.case-hero-grid h1{font-size:clamp(4rem,18vw,7rem)}.case-hero-grid small{display:block;margin-top:28px}.measurement-grid h2{margin-top:20px}.meter{margin-top:60px;gap:12px}.measurement-grid ul,.measurement-grid aside{margin-top:40px}.case-cta>.shell{display:block}.case-cta .button{margin-top:24px}}
</style>
