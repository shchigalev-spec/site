<script lang="ts">
  import type { CasePage } from '$lib/types';
  import { track } from '$lib/analytics';
  import FiniteEvidenceGraph from './FiniteEvidenceGraph.svelte';
  export let item: CasePage;
</script>

<article class={`case-evidence-page case-${item.graphType}`}>
  <section class="case-hero" aria-labelledby="case-title">
    <picture class="case-image" aria-hidden="true">
      <source media="(max-width: 960px)" srcset={item.asset.replace('.png', '-960.webp')} type="image/webp" />
      <source srcset={item.asset.replace('.png', '.webp')} type="image/webp" />
      <img src={item.asset} alt="" width="1672" height="941" decoding="async" />
    </picture>
    <div class="hero-shade"></div>
    <div class="shell hero-layout">
      <p class="mono">{item.eyebrow}</p>
      <h1 class="display" id="case-title">{item.result}</h1>
      <p class="lead">{item.engineeringConclusion}</p>
      <p class="image-note">Иллюстративная визуализация, не фотография объекта заказчика.</p>
    </div>
  </section>

  <section class="evidence-bounds" aria-labelledby="bounds-title">
    <div class="shell">
      <header class="bounds-heading">
        <p class="mono">ГРАНИЦЫ ДАННЫХ</p>
        <h2 class="display" id="bounds-title">Знаем только то, что опубликовано.</h2>
      </header>
      <div class="known-unknown-panel">
        <section class="known" aria-labelledby="known-title">
          <div class="panel-label"><span class="mono">KNOWN</span><h3 id="known-title">Известно</h3></div>
          <ul>{#each item.known as fact}<li>{fact}</li>{/each}</ul>
        </section>
        <section class="unknown" aria-labelledby="unknown-title">
          <div class="panel-label"><span class="mono">UNKNOWN</span><h3 id="unknown-title">Неизвестно</h3></div>
          <ul>{#each item.unknown as fact}<li>{fact}</li>{/each}</ul>
        </section>
      </div>
    </div>
  </section>

  <section class="case-reconstruction warm" aria-labelledby="reconstruction-title">
    <div class="shell reconstruction-layout">
      <header>
        <p class="mono">ДОКАЗАТЕЛЬНАЯ ЦЕПОЧКА</p>
        <h2 class="display" id="reconstruction-title">Не заполняем пробелы догадками.</h2>
      </header>
      <dl class="case-ledger">
        <div><dt><span class="mono">01</span> Симптом</dt><dd>{item.symptom}</dd></div>
        <div><dt><span class="mono">02</span> Диагностическая гипотеза</dt><dd>{item.hypothesis}</dd></div>
        <div><dt><span class="mono">03</span> Осмотренные зоны</dt><dd><ul>{#each item.inspectedZones as zone}<li>{zone}</li>{/each}</ul></dd></div>
        <div><dt><span class="mono">04</span> Принципы вмешательства</dt><dd><ul>{#each item.interventionPrinciples as principle}<li>{principle}</li>{/each}</ul></dd></div>
        <div><dt><span class="mono">05</span> Инженерный вывод</dt><dd>{item.engineeringConclusion}</dd></div>
      </dl>
      <aside class="result-object" aria-label={`Измеренный результат: ${item.result}`}>
        <p class="mono">РЕЗУЛЬТАТ / ИЗМЕРЕНО</p>
        <strong class="display">{item.result}</strong>
        <FiniteEvidenceGraph {item} />
      </aside>
    </div>
  </section>

  <section class="limitations" aria-labelledby="limitations-title">
    <div class="shell limitation-layout">
      <p class="mono">ОГРАНИЧЕНИЯ</p>
      <h2 class="display" id="limitations-title">Кейс не становится обещанием.</h2>
      <p>{item.caveat}</p>
      <p>Показанная схема объясняет тип сопоставления и не является протоколом измерения.</p>
    </div>
  </section>

  <section class="case-cta warm">
    <div class="shell">
      <p class="display">Чтобы получить вывод по вашей квартире, сначала нужно измерить и проверить ваш маршрут.</p>
      <a class="button" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: 'case_page', case: item.slug })}>Разобрать мой шум</a>
    </div>
  </section>
</article>

<style>
  .case-hero{position:relative;isolation:isolate;min-height:100svh;display:flex;align-items:end;overflow:hidden}.case-image{position:absolute;z-index:-2;inset:0}.case-image,.case-image img{display:block;width:100%;height:100%}.case-image img{object-fit:cover;filter:brightness(.55) saturate(.68)}.case-peak .case-image img{object-position:center 44%}.hero-shade{position:absolute;z-index:-1;inset:0;background:linear-gradient(0deg,var(--ink-950) 0,rgba(7,9,8,.72) 38%,rgba(7,9,8,.12) 75%),linear-gradient(90deg,rgba(7,9,8,.76),transparent 68%)}
  .hero-layout{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;padding-bottom:clamp(54px,7vw,110px)}.hero-layout>.mono{grid-column:1/6;color:var(--acoustic)}h1{grid-column:1/15;margin:20px 0;font-size:clamp(5rem,12vw,14rem);font-variant-numeric:tabular-nums}.hero-layout .lead{grid-column:2/10}.image-note{grid-column:12/-1;align-self:end;margin:0;font-size:.72rem;color:var(--white-64)}
  .evidence-bounds{padding-block:clamp(100px,13vw,210px);background:var(--ink-950)}.bounds-heading{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:end;margin-bottom:72px}.bounds-heading>.mono{grid-column:1/4;color:var(--acoustic)}.bounds-heading h2{grid-column:4/14;margin:0;font-size:clamp(3rem,6vw,7rem)}
  .known-unknown-panel{display:grid;grid-template-columns:5fr 7fr;border:1px solid var(--white-16)}.known-unknown-panel>section{min-height:430px;padding:clamp(28px,4vw,64px)}.known{background:rgba(108,159,150,.1)}.unknown{border-left:1px solid var(--white-16);background:rgba(255,101,79,.035)}.panel-label{display:flex;justify-content:space-between;gap:22px;align-items:baseline;padding-bottom:24px;border-bottom:1px solid var(--white-16)}.panel-label .mono{color:var(--acoustic)}.unknown .panel-label .mono{color:var(--signal)}.panel-label h3{margin:0;font-family:'Geologica',sans-serif;font-size:clamp(2rem,4vw,4.4rem);font-weight:500;letter-spacing:-.04em}.known-unknown-panel ul{list-style:none;margin:28px 0 0;padding:0}.known-unknown-panel li{position:relative;padding:15px 0 15px 24px;border-bottom:1px solid var(--white-16);color:var(--white-64)}.known-unknown-panel li::before{content:'';position:absolute;top:25px;left:0;width:7px;height:7px;border-radius:50%;background:var(--acoustic)}.unknown li::before{border:1px solid var(--signal);background:transparent}
  .case-reconstruction{padding-block:clamp(100px,13vw,210px)}.reconstruction-layout{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:start}.reconstruction-layout>header{grid-column:1/13;display:grid;grid-template-columns:subgrid}.reconstruction-layout>header .mono{grid-column:1/4;color:var(--acoustic-dark)}.reconstruction-layout>header h2{grid-column:4/-1;margin:0;font-size:clamp(3rem,5.7vw,6.6rem)}.case-ledger{grid-column:1/9;margin:90px 0 0;border-top:1px solid rgba(7,9,8,.2)}.case-ledger>div{display:grid;grid-template-columns:1fr 1.35fr;gap:28px;padding:24px 0;border-bottom:1px solid rgba(7,9,8,.2)}.case-ledger dt{font-family:'Geologica',sans-serif;font-weight:500}.case-ledger dt span{display:inline-block;min-width:36px;color:var(--acoustic-dark)}.case-ledger dd{margin:0;color:rgba(7,9,8,.64)}.case-ledger ul{margin:0;padding-left:18px}.result-object{grid-column:10/-1;margin-top:90px;padding:clamp(24px,3vw,42px);color:var(--white);background:var(--ink-950)}.result-object>.mono{color:var(--acoustic)}.result-object>strong{display:block;margin:26px 0 42px;font-size:clamp(3.5rem,7vw,8.5rem);font-weight:500;font-variant-numeric:tabular-nums}
  .limitations{padding-block:clamp(100px,12vw,190px);background:var(--ink-950)}.limitation-layout{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px}.limitation-layout>.mono{grid-column:1/4;color:var(--warning)}.limitation-layout h2{grid-column:4/13;margin:0 0 54px;font-size:clamp(3rem,6vw,7rem)}.limitation-layout>p:nth-of-type(2){grid-column:4/10;color:var(--white-64)}.limitation-layout>p:nth-of-type(3){grid-column:11/-1;color:var(--white-64)}.case-cta{min-height:76svh;display:grid;place-items:center}.case-cta>.shell{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:center}.case-cta p{grid-column:2/11;margin:0;font-size:clamp(3rem,6vw,7rem)}.case-cta .button{grid-column:12/-1}
  @media(max-width:1023px){.hero-layout{grid-template-columns:repeat(8,minmax(0,1fr))}.hero-layout>.mono,h1{grid-column:1/-1}.hero-layout .lead{grid-column:1/7}.image-note{grid-column:6/-1}.bounds-heading{grid-template-columns:repeat(8,minmax(0,1fr))}.bounds-heading>.mono{grid-column:1/3}.bounds-heading h2{grid-column:3/-1}.known-unknown-panel{grid-template-columns:1fr 1fr}.reconstruction-layout{grid-template-columns:repeat(8,minmax(0,1fr))}.reconstruction-layout>header{grid-column:1/-1;display:block}.reconstruction-layout>header h2{margin-top:18px}.case-ledger{grid-column:1/-1}.result-object{grid-column:2/8;margin-top:40px}}
  @media(max-width:767px){.case-hero{min-height:94svh}.hero-layout{display:block;padding-bottom:42px}h1{font-size:clamp(4rem,20vw,7rem)}.image-note{margin-top:30px}.bounds-heading{display:block;margin-bottom:46px}.bounds-heading h2{margin-top:18px;font-size:clamp(3rem,14vw,5.2rem)}.known-unknown-panel{display:block}.known-unknown-panel>section{min-height:auto;padding:28px 22px}.unknown{border-top:1px solid var(--white-16);border-left:0}.panel-label{display:block}.panel-label h3{margin-top:8px}.reconstruction-layout{display:block}.reconstruction-layout>header h2{font-size:clamp(3rem,14vw,5.2rem)}.case-ledger{margin-top:58px}.case-ledger>div{display:block}.case-ledger dd{margin-top:12px}.result-object{margin-top:54px;padding:22px}.limitation-layout{display:block}.limitation-layout h2{margin-top:18px;font-size:clamp(3rem,14vw,5.2rem)}.limitation-layout>p{margin-top:28px}.case-cta>.shell{display:block}.case-cta p{font-size:clamp(3rem,14vw,5rem)}.case-cta .button{width:100%;margin-top:30px}}
</style>
