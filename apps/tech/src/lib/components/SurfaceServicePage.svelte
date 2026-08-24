<script lang="ts">
  import { tick } from 'svelte';
  import { track } from '$lib/analytics';
  import type { ServicePage } from '$lib/types';

  export let page: ServicePage;
  let routeMode: 'direct' | 'flanking' = 'direct';
  let tracing = true;

  async function selectRoute(mode: 'direct' | 'flanking') {
    if (routeMode === mode) return;
    routeMode = mode;
    tracing = false;
    await tick();
    tracing = true;
    track('service_route_toggle', { service: page.slug, route: mode });
  }

  $: routes = routeMode === 'direct' ? page.directRoutes ?? [] : page.flankingRoutes ?? [];
</script>

<article class="surface-page" data-service-family="surface" data-service-slug={page.slug} data-surface={page.surface}>
  <section class="surface-hero">
    <div class="shell hero-shell">
      <div class="hero-copy">
        <a class="back mono" href="/">← ТЕХНИЧЕСКАЯ ЛАБОРАТОРИЯ</a>
        <p class="eyebrow mono">{page.eyebrow}</p>
        <h1 class="display">{page.h1}</h1>
        <p class="lead">{page.lead}</p>
        <a class="button" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: page.slug })}>Разобрать мой шум</a>
      </div>
      <figure class="hero-plate">
        <picture>
          <source media="(max-width: 960px)" srcset={`${page.asset}-960.webp`} type="image/webp" />
          <source srcset={`${page.asset}.avif`} type="image/avif" />
          <source srcset={`${page.asset}.webp`} type="image/webp" />
          <img src={`${page.asset}.png`} alt={page.assetAlt} width="1672" height="941" fetchpriority="high" />
        </picture>
        <figcaption class="mono">АРХИТЕКТУРНАЯ ПЛАСТИНА / БЕЗ СХЕМЫ ПОВЕРХ ФОТО</figcaption>
      </figure>
    </div>
  </section>

  <section class="route-lab" aria-labelledby="surface-route-title">
    <div class="shell lab-grid">
      <header>
        <p class="mono">СИМПТОМ → МАРШРУТ</p>
        <h2 id="surface-route-title" class="display">Сначала отделяем прямой путь от флангового.</h2>
        <p>{page.symptom}</p>
      </header>

      <div class="route-console" class:tracing data-route-mode={routeMode}>
        <div class="route-switch" role="group" aria-label="Тип пути передачи">
          <button type="button" aria-pressed={routeMode === 'direct'} on:click={() => selectRoute('direct')}>Прямой путь</button>
          <button type="button" aria-pressed={routeMode === 'flanking'} on:click={() => selectRoute('flanking')}>Фланговый путь</button>
        </div>

        <div class="surface-diagram" data-surface-diagram={page.surface} aria-hidden="true">
          {#if page.surface === 'wall'}
            <svg viewBox="0 0 560 340"><path class="structure" d="M120 38v264M438 38v264M120 68h318M120 272h318"/><path class="assembly" d="M216 68v204M250 68v204M285 68v204"/><path class="direct" d="M36 170h180"/><path class="flank" d="M38 284h78V54h322"/><circle cx="36" cy="170" r="8"/><circle cx="38" cy="284" r="8"/></svg>
          {:else if page.surface === 'ceiling'}
            <svg viewBox="0 0 560 340"><path class="structure" d="M64 86h432M82 112h396"/><path class="assembly" d="M130 112v72M430 112v72M130 184h300M150 214h260"/><path class="direct" d="M280 24v190"/><path class="flank" d="M510 24v278H152"/><circle cx="280" cy="24" r="8"/><circle cx="510" cy="24" r="8"/></svg>
          {:else}
            <svg viewBox="0 0 560 340"><path class="structure" d="M64 246h432M84 274h392"/><path class="assembly" d="M106 208h348M124 178h312M142 146h276"/><path class="direct" d="M280 318V146"/><path class="flank" d="M510 316V112H142"/><circle cx="280" cy="318" r="8"/><circle cx="510" cy="316" r="8"/></svg>
          {/if}
        </div>

        <div class="route-readout" aria-live="polite">
          <span class="mono">{routeMode === 'direct' ? 'ПРОВЕРЯЕМ В ПОЛЕ' : 'ПРОВЕРЯЕМ ОБХОД'}</span>
          <ul>{#each routes as route}<li>{route}</li>{/each}</ul>
        </div>
      </div>
    </div>
  </section>

  <section class="surface-response warm">
    <div class="shell response-grid">
      <p class="mono">КОНСТРУКЦИОННЫЙ ОТВЕТ</p>
      <h2 class="display">Звукоизоляционный узел появляется только после проверки маршрута.</h2>
      <div class="response-steps">
        {#each page.approach as item, index}<div><span class="mono">{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>{/each}
      </div>
      <aside><span class="mono">ГРАНИЦА ВЫВОДА</span><p>{page.limitation}</p></aside>
    </div>
  </section>

  <section class="constraints">
    <div class="shell constraints-grid">
      <header><p class="mono">СТАДИЯ РЕМОНТА</p><h2 class="display">Что фиксируем до закрытия слоёв.</h2></header>
      <ol>{#each page.stageConstraints ?? [] as item, index}<li><span class="mono">0{index + 1}</span><strong>{item}</strong></li>{/each}</ol>
      {#if page.relatedCase}<a class="case-link" href={page.relatedCase.href}><span class="mono">СВЯЗАННОЕ ИЗМЕРЕНИЕ</span><strong>{page.relatedCase.label}</strong><i>↗</i></a>{/if}
    </div>
  </section>

  <section class="service-faq warm" aria-labelledby="surface-faq-title">
    <div class="shell faq-grid">
      <header><p class="mono">FAQ / {page.surface}</p><h2 id="surface-faq-title" class="display">Вопросы именно об этом контуре.</h2></header>
      <div>{#each page.faq ?? [] as item}<details><summary>{item.question}</summary><p>{item.answer}</p></details>{/each}</div>
    </div>
  </section>

  <section class="service-next">
    <div class="shell next-grid">
      <p class="mono">СЛЕДУЮЩИЙ ШАГ</p>
      <h2 class="display">Опишите слышимый симптом — не выбранную конструкцию.</h2>
      <a class="button" href="/diagnostika-shuma/">Начать диагностику</a>
      <nav aria-label="Связанные страницы">{#each page.related as item}<a href={item.href}>{item.label}<span>↗</span></a>{/each}</nav>
    </div>
  </section>
</article>

<style>
  .surface-page{background:var(--ink-950)}.surface-hero{padding:clamp(110px,12vw,180px) 0 clamp(76px,9vw,130px);min-height:82svh;display:flex;align-items:center}.hero-shell{display:grid;grid-template-columns:minmax(0,7fr) minmax(320px,5fr);gap:clamp(36px,6vw,100px);align-items:end}.surface-page[data-surface="ceiling"] .hero-shell{grid-template-columns:minmax(0,6fr) minmax(360px,6fr)}.surface-page[data-surface="floor"] .hero-shell{grid-template-columns:minmax(0,8fr) minmax(300px,4fr)}.back{display:inline-block;color:var(--white-48);margin-bottom:clamp(42px,7vw,90px)}.eyebrow{color:var(--acoustic)}h1{font-size:clamp(3.4rem,6.3vw,7.6rem);line-height:.88;margin:18px 0 28px;max-width:11ch}.surface-page[data-surface="ceiling"] h1{max-width:9ch}.surface-page[data-surface="floor"] h1{max-width:12ch}.lead{max-width:700px;color:var(--white-64);font-size:clamp(1.05rem,1.5vw,1.45rem)}.hero-copy .button{margin-top:34px}.hero-plate{margin:0;align-self:stretch;display:flex;flex-direction:column;justify-content:flex-end}.hero-plate picture{display:block;aspect-ratio:4/5;overflow:hidden;border-radius:3px}.surface-page[data-surface="ceiling"] .hero-plate picture{aspect-ratio:1/1}.surface-page[data-surface="floor"] .hero-plate picture{aspect-ratio:3/4}.hero-plate img{width:100%;height:100%;object-fit:cover;filter:saturate(.74) contrast(1.04)}.hero-plate figcaption{color:var(--white-40);font-size:.62rem;padding-top:12px}
  .route-lab{padding:clamp(100px,13vw,210px) 0}.lab-grid{display:grid;grid-template-columns:5fr 7fr;gap:clamp(46px,8vw,130px);align-items:start}.lab-grid header{position:sticky;top:110px}.lab-grid h2{font-size:clamp(3rem,5.2vw,6.2rem);margin:18px 0 34px}.lab-grid header>p:last-child{color:var(--white-64);max-width:48ch}.route-console{border:1px solid var(--white-16);background:rgba(255,255,255,.025);padding:clamp(18px,3vw,38px)}.route-switch{display:grid;grid-template-columns:1fr 1fr}.route-switch button{min-height:52px;border:1px solid var(--white-16);background:transparent;color:var(--white-64);font:500 .78rem/1 'IBM Plex Mono',monospace;text-transform:uppercase}.route-switch button[aria-pressed="true"]{background:var(--paper);color:var(--ink-950);border-color:var(--paper)}.surface-diagram{margin-top:30px;aspect-ratio:14/8;background:linear-gradient(135deg,rgba(255,255,255,.025),transparent);overflow:hidden}.surface-diagram svg{width:100%;height:100%}.surface-diagram path{fill:none;vector-effect:non-scaling-stroke}.structure{stroke:rgba(248,245,237,.24);stroke-width:6}.assembly{stroke:var(--acoustic);stroke-width:3}.direct,.flank{stroke:var(--signal);stroke-width:3;opacity:.12}.surface-diagram circle{fill:var(--signal);opacity:.12}.route-console[data-route-mode="direct"] .direct,.route-console[data-route-mode="direct"] circle:first-of-type,.route-console[data-route-mode="flanking"] .flank,.route-console[data-route-mode="flanking"] circle:last-of-type{opacity:1}.tracing[data-route-mode="direct"] .direct,.tracing[data-route-mode="flanking"] .flank{stroke-dasharray:700;stroke-dashoffset:700;animation:trace-route .78s cubic-bezier(.2,.8,.2,1) forwards}.route-readout{border-top:1px solid var(--white-16);padding-top:24px;display:grid;grid-template-columns:1fr 1.4fr;gap:20px}.route-readout>span{color:var(--signal)}.route-readout ul{margin:0;padding-left:18px;color:var(--white-72)}
  .surface-response{padding:clamp(100px,12vw,190px) 0}.response-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}.response-grid>p{grid-column:1/4;color:var(--acoustic-dark)}.response-grid h2{grid-column:4/-1;font-size:clamp(3rem,5.2vw,6.2rem);margin:0}.response-steps{grid-column:2/9;margin-top:62px}.response-steps div{display:grid;grid-template-columns:58px 1fr;border-top:1px solid rgba(7,9,8,.17);padding:18px 0}.response-steps p{margin:0;font-family:'Geologica',sans-serif;font-size:clamp(1.2rem,1.8vw,1.9rem)}.response-grid aside{grid-column:10/-1;margin-top:62px;border-left:2px solid var(--signal);padding-left:22px;color:rgba(7,9,8,.64)}.response-grid aside span{color:var(--signal)}
  .constraints{padding:clamp(100px,13vw,210px) 0}.constraints-grid{display:grid;grid-template-columns:5fr 7fr;gap:clamp(44px,8vw,130px)}.constraints h2{font-size:clamp(2.8rem,4.8vw,5.6rem);margin:18px 0 0}.constraints ol{list-style:none;padding:0;margin:0}.constraints li{display:grid;grid-template-columns:58px 1fr;padding:20px 0;border-top:1px solid var(--white-16)}.constraints li strong{font:500 clamp(1.15rem,1.7vw,1.7rem)/1.3 'Geologica',sans-serif}.case-link{grid-column:2;margin-top:30px;padding:24px;border:1px solid var(--white-16);display:grid;grid-template-columns:1fr auto;gap:12px}.case-link span{grid-column:1/-1;color:var(--acoustic)}.case-link strong{font:500 clamp(1.2rem,1.7vw,1.7rem)/1.2 'Geologica',sans-serif}.case-link i{font-style:normal;color:var(--signal)}
  .service-faq{padding:clamp(90px,11vw,170px) 0}.faq-grid{display:grid;grid-template-columns:5fr 7fr;gap:clamp(44px,8vw,130px)}.faq-grid h2{font-size:clamp(2.8rem,4.6vw,5.4rem);margin:18px 0}.faq-grid details{border-top:1px solid rgba(7,9,8,.17);padding:20px 0}.faq-grid summary{font:500 clamp(1.15rem,1.7vw,1.7rem)/1.25 'Geologica',sans-serif;cursor:pointer}.faq-grid details p{max-width:55ch;color:rgba(7,9,8,.64)}
  .service-next{padding:clamp(100px,13vw,210px) 0}.next-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}.next-grid>p{grid-column:1/4;color:var(--acoustic)}.next-grid h2{grid-column:4/-1;font-size:clamp(3rem,5.4vw,6.4rem);margin:0}.next-grid>.button{grid-column:9/-1;margin-top:32px}.next-grid nav{grid-column:1/7;margin-top:75px;display:grid}.next-grid nav a{display:flex;justify-content:space-between;padding:17px 0;border-bottom:1px solid var(--white-16)}
  @keyframes trace-route{to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.tracing[data-route-mode] .direct,.tracing[data-route-mode] .flank{animation:none;stroke-dashoffset:0}}@media(max-width:800px){.surface-page,.surface-hero,.hero-shell,.lab-grid,.response-grid,.constraints-grid,.faq-grid,.next-grid{min-width:0;max-width:100%}.surface-hero{padding-top:92px}.hero-shell,.surface-page[data-surface="ceiling"] .hero-shell,.surface-page[data-surface="floor"] .hero-shell,.lab-grid,.constraints-grid,.faq-grid{grid-template-columns:minmax(0,1fr)}.hero-copy{order:1;min-width:0}.hero-plate{order:0;min-width:0}.hero-plate picture{aspect-ratio:16/10}.surface-page[data-surface="wall"] .hero-plate picture{aspect-ratio:16/9}.surface-page[data-surface="floor"] .hero-plate picture{aspect-ratio:3/2}.back{margin-bottom:28px}.hero-copy h1,.lab-grid h2,.response-grid h2,.constraints h2,.faq-grid h2,.next-grid h2{max-width:100%;overflow-wrap:anywhere}.hero-copy h1{font-size:clamp(2.9rem,12vw,5.1rem)}.lab-grid header{position:static;min-width:0}.route-readout{grid-template-columns:1fr}.response-grid,.next-grid{display:block}.response-steps,.response-grid aside,.next-grid>.button,.next-grid nav{margin-top:42px}.case-link{grid-column:auto}.route-switch{grid-template-columns:repeat(2,minmax(0,1fr))}.route-switch button{min-width:0;min-height:56px}.surface-diagram{aspect-ratio:1/1}.surface-diagram svg{transform:scale(1.22)}.faq-grid>div{margin-top:12px}}
</style>
