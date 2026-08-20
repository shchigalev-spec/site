<script lang="ts">
  import { track } from '$lib/analytics';
  import type { ServicePage } from '$lib/types';
  export let page: ServicePage;
  let phase = 0;
  const phaseNames = ['состояние', 'маршрут', 'ограничение'];
  $: phaseText = [page.residentialState, page.likelyPaths?.join(' · '), page.interventionConstraints?.join(' · ')][phase] ?? '';
</script>

<article class={`situation-page situation-${page.slug}`} data-service-family="situation" data-service-slug={page.slug}>
  <section class="situation-hero">
    <picture class="hero-plate">
      <source media="(max-width: 960px)" srcset={`${page.asset}-960.webp`} type="image/webp" />
      <source srcset={`${page.asset}.webp`} type="image/webp" />
      <img src={`${page.asset}.png`} alt={page.assetAlt} width="1672" height="941" fetchpriority="high" />
    </picture>
    <div class="hero-shade"></div>
    <div class="shell hero-grid">
      <div class="hero-index"><a class="mono" href="/">← TECH</a><span class="mono">СИТУАЦИЯ / {page.slug.replace('shumoizolyatsiya-', '')}</span></div>
      <div class="hero-copy"><p class="mono">{page.eyebrow}</p><h1 class="display">{page.h1}</h1><p class="lead">{page.lead}</p></div>
      <a class="button" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: page.slug })}>Разобрать ситуацию</a>
    </div>
  </section>

  <section class="decision-lab" aria-labelledby="decision-title">
    <div class="shell decision-grid">
      <header><p class="mono">СЦЕНАРИЙ → РИСК РЕШЕНИЯ</p><h2 id="decision-title" class="display">Не поверхность. Сначала порядок решения.</h2><p>{page.problem}</p></header>
      <div class="decision-console" data-decision-phase={phaseNames[phase]}>
        <div class="phase-controls" role="group" aria-label="Этапы разбора ситуации">
          {#each phaseNames as name, index}<button type="button" aria-pressed={phase === index} on:click={() => { phase = index; track('situation_phase', { service: page.slug, phase: name }); }}><span class="mono">0{index + 1}</span>{name}</button>{/each}
        </div>
        <div class="phase-line" aria-hidden="true"><i style={`--phase:${phase}`}></i><b></b><b></b><b></b></div>
        <div class="phase-readout" aria-live="polite"><span class="mono">{phaseNames[phase]}</span><p>{phaseText}</p></div>
      </div>
      <aside><span class="mono">ГЛАВНЫЙ РИСК</span><p>{page.decisionRisk}</p></aside>
    </div>
  </section>

  <section class="paths warm">
    <div class="shell paths-grid">
      <div><p class="mono">ВЕРОЯТНЫЕ ПУТИ</p><h2 class="display">Где ищем передачу.</h2><ol>{#each page.likelyPaths ?? [] as item, index}<li><span class="mono">0{index + 1}</span><strong>{item}</strong></li>{/each}</ol></div>
      <div><p class="mono">ОГРАНИЧЕНИЯ ВМЕШАТЕЛЬСТВА</p><h2 class="display">Что влияет на масштаб.</h2><ol>{#each page.interventionConstraints ?? [] as item, index}<li><span class="mono">0{index + 1}</span><strong>{item}</strong></li>{/each}</ol></div>
    </div>
  </section>

  <section class="related-surfaces">
    <div class="shell related-grid"><header><p class="mono">СВЯЗАННЫЕ КОНТУРЫ</p><h2 class="display">После маршрута — к звукоизоляции поверхности.</h2></header><nav aria-label="Страницы поверхностей">{#each page.relatedSurfaces ?? [] as item}<a href={item.href}><span>{item.label}</span><i>↗</i></a>{/each}</nav></div>
  </section>

  <section class="situation-next warm">
    <div class="shell next-grid"><p class="mono">ДИАГНОСТИКА</p><h2 class="display">Опишите, что слышно и в каком состоянии квартира.</h2><p>{page.limitation}</p><a class="button" href="/diagnostika-shuma/">Передать контекст</a></div>
  </section>
</article>

<style>
  .situation-page{background:var(--ink-950)}.situation-hero{position:relative;min-height:92svh;overflow:hidden;isolation:isolate;display:flex;align-items:stretch}.hero-plate{position:absolute;inset:0 0 0 42%;z-index:-3}.hero-plate img{width:100%;height:100%;object-fit:cover;filter:saturate(.66) brightness(.72)}.hero-shade{position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,var(--ink-950) 0 44%,rgba(7,9,8,.72) 68%,rgba(7,9,8,.18)),linear-gradient(0deg,var(--ink-950),transparent 42%)}.hero-grid{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr auto;gap:24px;padding-top:116px;padding-bottom:68px;align-items:end}.hero-index{grid-column:1/-1;align-self:start;display:flex;justify-content:space-between;color:var(--white-48)}.hero-copy{grid-column:1/9;min-width:0}.hero-copy>p:first-child{color:var(--acoustic)}h1{font-size:clamp(3.7rem,7.2vw,8.6rem);line-height:.86;margin:18px 0 30px;max-width:12ch}.lead{max-width:650px;color:var(--white-64);font-size:clamp(1.05rem,1.5vw,1.45rem)}.hero-grid>.button{grid-column:10/-1;grid-row:3}.situation-shumoizolyatsiya-ot-sosedey .hero-plate{left:38%}.situation-shumoizolyatsiya-ot-sosedey .hero-copy{grid-column:1/8}.situation-shumoizolyatsiya-ot-sosedey .hero-grid>.button{grid-column:9/-1}.situation-shumoizolyatsiya-v-novostroyke .hero-plate{inset:0 8% 0 48%}.situation-shumoizolyatsiya-v-novostroyke .hero-copy{grid-column:1/9}.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-plate{inset:0 0 0 34%}.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-copy{grid-column:1/10}.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-grid>.button{grid-column:9/-1}
  .decision-lab{padding:clamp(110px,14vw,220px) 0}.decision-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}.decision-grid header{grid-column:1/8}.decision-grid h2{font-size:clamp(3rem,5.4vw,6.4rem);margin:18px 0 30px}.decision-grid header>p:last-child{max-width:55ch;color:var(--white-64)}.decision-console{grid-column:5/-1;margin-top:75px;border:1px solid var(--white-16);padding:clamp(20px,3vw,40px)}.phase-controls{display:grid;grid-template-columns:repeat(3,1fr)}.phase-controls button{min-height:72px;background:transparent;border:0;border-bottom:1px solid var(--white-16);color:var(--white-48);text-align:left;font:500 .86rem/1.2 'Geologica',sans-serif;text-transform:uppercase}.phase-controls button span{display:block;margin-bottom:10px}.phase-controls button[aria-pressed="true"]{color:var(--paper);border-color:var(--signal)}.phase-line{height:110px;position:relative;margin:20px 0}.phase-line:before{content:"";position:absolute;left:8%;right:8%;top:55px;height:1px;background:var(--white-16)}.phase-line i{position:absolute;top:52px;left:calc(8% + var(--phase) * 42%);width:7px;height:7px;border-radius:50%;background:var(--signal);box-shadow:0 0 22px var(--signal);transition:left .48s cubic-bezier(.2,.8,.2,1)}.phase-line b{position:absolute;top:48px;width:15px;height:15px;border:1px solid var(--acoustic);border-radius:50%;transform:translateX(-50%)}.phase-line b:nth-of-type(1){left:8%}.phase-line b:nth-of-type(2){left:50%}.phase-line b:nth-of-type(3){left:92%}.phase-readout{display:grid;grid-template-columns:1fr 2fr;gap:20px;border-top:1px solid var(--white-16);padding-top:24px}.phase-readout span{color:var(--signal)}.phase-readout p{margin:0;color:var(--white-72)}.decision-grid aside{grid-column:1/5;margin-top:-100px;padding:23px;border-left:2px solid var(--signal)}.decision-grid aside span{color:var(--signal)}.decision-grid aside p{color:var(--white-64)}
  .paths{padding:clamp(100px,12vw,190px) 0}.paths-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(50px,9vw,150px)}.paths h2{font-size:clamp(2.8rem,4.6vw,5.3rem);margin:16px 0 45px}.paths ol{list-style:none;padding:0;margin:0}.paths li{display:grid;grid-template-columns:50px 1fr;border-top:1px solid rgba(7,9,8,.18);padding:18px 0}.paths li strong{font:500 clamp(1.1rem,1.55vw,1.55rem)/1.3 'Geologica',sans-serif}.related-surfaces{padding:clamp(100px,13vw,200px) 0}.related-grid{display:grid;grid-template-columns:5fr 7fr;gap:clamp(50px,9vw,140px)}.related-grid h2{font-size:clamp(3rem,5vw,5.8rem);margin:16px 0}.related-grid nav{display:grid;align-content:start}.related-grid a{display:flex;justify-content:space-between;border-top:1px solid var(--white-16);padding:22px 0;font:500 clamp(1.35rem,2vw,2.1rem)/1.1 'Geologica',sans-serif}.related-grid i{font-style:normal;color:var(--signal)}.situation-next{padding:clamp(100px,13vw,200px) 0}.next-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}.next-grid>p:first-child{grid-column:1/4;color:var(--acoustic-dark)}.next-grid h2{grid-column:4/-1;font-size:clamp(3rem,5.3vw,6.2rem);margin:0}.next-grid>p:not(:first-child){grid-column:5/9;margin-top:35px;color:rgba(7,9,8,.64)}.next-grid>.button{grid-column:9/-1;margin-top:35px}
  @media(prefers-reduced-motion:reduce){.phase-line i{transition:none}}@media(max-width:800px){.situation-page,.situation-hero,.hero-grid{min-width:0;max-width:100%}.situation-hero{min-height:100svh}.hero-plate,.situation-shumoizolyatsiya-ot-sosedey .hero-plate,.situation-shumoizolyatsiya-v-novostroyke .hero-plate,.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-plate{inset:62px 0 auto;height:43vh;opacity:1}.situation-shumoizolyatsiya-kvartiry .hero-plate{height:40vh}.situation-shumoizolyatsiya-ot-sosedey .hero-plate{height:36vh}.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-plate{height:48vh}.hero-plate img{filter:saturate(.72) brightness(.86)}.situation-shumoizolyatsiya-ot-sosedey .hero-plate img{object-position:68% center}.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-plate img{object-position:57% center}.hero-shade{background:linear-gradient(0deg,var(--ink-950) 0 47%,rgba(7,9,8,.76) 68%,rgba(7,9,8,.14) 100%)}.hero-grid{display:flex;flex-direction:column;justify-content:space-between;padding-top:102px}.hero-index{width:100%;min-width:0;gap:18px}.hero-index span{min-width:0;max-width:68%;text-align:right;overflow-wrap:anywhere}.hero-copy,.situation-shumoizolyatsiya-ot-sosedey .hero-copy,.situation-shumoizolyatsiya-v-novostroyke .hero-copy,.situation-shumoizolyatsiya-v-gotovoy-kvartire .hero-copy{width:100%;min-width:0;margin-top:auto}.hero-copy h1{max-width:100%;font-size:clamp(2.9rem,11.5vw,5rem);text-wrap:wrap;overflow-wrap:anywhere}.hero-copy .lead,.decision-grid h2,.paths h2,.related-grid h2,.next-grid h2{max-width:100%;overflow-wrap:anywhere}.hero-grid>.button{max-width:100%;align-self:stretch}.decision-grid,.next-grid{display:block;min-width:0}.decision-console{min-width:0;margin-top:48px}.decision-grid aside{margin-top:30px}.paths-grid,.related-grid{grid-template-columns:minmax(0,1fr)}.phase-controls{grid-template-columns:repeat(3,minmax(0,1fr))}.phase-controls button{min-width:0;min-height:64px;padding-inline:4px;font-size:.68rem;overflow-wrap:anywhere}.phase-readout{grid-template-columns:1fr}.next-grid>p:not(:first-child),.next-grid>.button{margin-top:34px}.related-grid nav{margin-top:20px}}
</style>
