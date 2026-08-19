<script lang="ts">
  import type { ServicePage as ServicePageData } from '$lib/types';
  import { track } from '$lib/analytics';
  export let page: ServicePageData;
</script>

<article class={`service-page mode-${page.visualMode}`}>
  <section class="service-hero">
    <picture class="service-visual">
      <source media="(max-width: 960px)" srcset="/generated/tech-style-anchor-960.webp" type="image/webp" />
      <source srcset="/generated/tech-style-anchor.webp" type="image/webp" />
      <img src="/generated/tech-style-anchor.png" alt="Архитектурная визуализация квартиры для анализа путей шума" width="1672" height="941" />
    </picture>
    <div class="service-overlay"></div>
    <div class="service-diagram" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
    <div class="shell service-hero-grid">
      <p class="mono">{page.eyebrow}</p>
      <h1 class="display">{page.h1}</h1>
      <p class="lead">{page.lead}</p>
      <a class="button" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: page.slug })}>Разобрать мой шум</a>
    </div>
  </section>

  <section class="route-explanation">
    <div class="shell route-grid">
      <p class="mono">ПОЧЕМУ НУЖНА ДИАГНОСТИКА</p>
      <h2 class="display">Очевидная поверхность — ещё не инженерный вывод.</h2>
      <p class="problem">{page.problem}</p>
      <div class="diagnostic-focus">
        <span class="mono">ПРОВЕРЯЕМ</span>
        {#each page.diagnosticFocus as item, index}<div><i>0{index + 1}</i><strong>{item}</strong></div>{/each}
      </div>
    </div>
  </section>

  <section class="route-method warm">
    <div class="shell method-grid">
      <p class="mono">КАК СОБИРАЕТСЯ РЕШЕНИЕ</p>
      <h2 class="display">Путь → узлы → конструкция → контроль.</h2>
      <ol>{#each page.approach as item, index}<li><span class="mono">{String(index + 1).padStart(2,'0')}</span><strong>{item}</strong></li>{/each}</ol>
      <aside><span class="mono">ОГРАНИЧЕНИЕ</span><p>{page.limitation}</p></aside>
    </div>
  </section>

  <section class="route-cta">
    <div class="shell cta-grid">
      <p class="mono">СЛЕДУЮЩИЙ ШАГ</p>
      <h2 class="display">Сначала опишите шум. Мы вернёмся с уточнениями.</h2>
      <div><p>Первичная диагностика бесплатна. После заявки менеджер свяжется; следующий коммерческий шаг — выездная диагностика.</p><a class="button" href="/diagnostika-shuma/">Записаться на диагностику</a></div>
      <nav aria-label="Связанные страницы">{#each page.related as item}<a href={item.href}>{item.label}<span>↗</span></a>{/each}</nav>
    </div>
  </section>
</article>

<style>
  .service-page{background:var(--ink-950)}.service-hero{position:relative;min-height:100svh;display:flex;align-items:end;overflow:hidden;isolation:isolate}.service-visual{position:absolute;inset:0;z-index:-3}.service-visual img{width:100%;height:100%;object-fit:cover;filter:brightness(.48) saturate(.68);transform:scale(1.04)}.service-overlay{position:absolute;inset:0;z-index:-2;background:linear-gradient(0deg,var(--ink-950) 0,transparent 60%),linear-gradient(90deg,rgba(7,9,8,.75),transparent 60%)}.service-hero-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:end;padding-bottom:clamp(70px,8vw,130px)}.service-hero-grid>.mono{grid-column:1/5;color:var(--acoustic)}.service-hero-grid h1{grid-column:1/13;margin:20px 0 0;font-size:clamp(3.6rem,7.5vw,8.6rem)}.service-hero-grid>.lead{grid-column:2/9;margin:30px 0 0}.service-hero-grid>.button{grid-column:12/-1;align-self:end}.service-diagram{position:absolute;right:4%;top:15%;width:38vw;height:38vw;border:1px solid var(--white-16);border-radius:50%;opacity:.7}.service-diagram i{position:absolute;border:1px solid var(--acoustic);inset:calc(10% * var(--i));border-radius:inherit}.service-diagram i:nth-child(1){--i:1}.service-diagram i:nth-child(2){--i:2}.service-diagram i:nth-child(3){--i:3}.service-diagram b{position:absolute;left:20%;top:50%;width:68%;height:2px;background:var(--signal);transform:rotate(-25deg);box-shadow:0 0 18px var(--signal)}.mode-vertical .service-diagram{transform:rotate(90deg);right:24%}.mode-layers .service-diagram{border-radius:4px;transform:perspective(800px) rotateX(58deg) rotateZ(-20deg)}.mode-lateral .service-diagram{right:-10%;top:28%}.mode-shell .service-diagram{border-style:dashed;transform:scale(1.2)}.mode-protected .service-diagram{border-color:var(--warning);clip-path:inset(10% 0 0 15% round 30px)}
  .route-explanation{padding:clamp(110px,14vw,230px) 0}.route-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:start}.route-grid>.mono{grid-column:1/4;color:var(--acoustic)}.route-grid h2{grid-column:4/14;margin:0;font-size:clamp(3rem,5.7vw,6.8rem)}.problem{grid-column:4/10;margin-top:50px;color:var(--white-64);font-size:clamp(1.2rem,1.8vw,2rem)}.diagnostic-focus{grid-column:11/-1;margin-top:50px}.diagnostic-focus>.mono{color:var(--signal)}.diagnostic-focus>div{display:grid;grid-template-columns:42px 1fr;padding:14px 0;border-bottom:1px solid var(--white-16)}.diagnostic-focus i{font:normal 500 .7rem/1.6 'IBM Plex Mono',monospace;color:var(--acoustic)}.diagnostic-focus strong{font-weight:500}
  .route-method{padding:clamp(100px,12vw,200px) 0}.method-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px}.method-grid>.mono{grid-column:1/4;color:var(--acoustic-dark)}.method-grid h2{grid-column:4/14;margin:0;font-size:clamp(3rem,5.4vw,6.2rem)}.method-grid ol{grid-column:2/11;list-style:none;padding:0;margin:80px 0 0}.method-grid li{display:grid;grid-template-columns:60px 1fr;padding:19px 0;border-top:1px solid rgba(7,9,8,.18)}.method-grid li strong{font-family:'Geologica',sans-serif;font-size:clamp(1.3rem,2vw,2.2rem);font-weight:500}.method-grid aside{grid-column:12/-1;margin-top:80px;padding:24px;border-left:1px solid rgba(7,9,8,.22)}.method-grid aside>.mono{color:var(--signal)}.method-grid aside p{color:rgba(7,9,8,.64)}
  .route-cta{padding:clamp(110px,14vw,240px) 0}.cta-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px}.cta-grid>.mono{grid-column:1/4;color:var(--acoustic)}.cta-grid h2{grid-column:4/14;margin:0;font-size:clamp(3rem,5.6vw,6.4rem)}.cta-grid>div{grid-column:10/-1;margin-top:45px;color:var(--white-64)}.cta-grid .button{margin-top:20px}.cta-grid nav{grid-column:1/9;margin-top:90px;display:grid}.cta-grid nav a{display:flex;justify-content:space-between;padding:18px 0;border-bottom:1px solid var(--white-16)}.cta-grid nav a:hover{color:var(--signal)}
  @media(max-width:767px){.service-hero-grid,.route-grid,.method-grid,.cta-grid{display:block}.service-hero-grid{padding-bottom:60px}.service-hero-grid h1{font-size:clamp(3rem,13vw,5.2rem)}.service-hero-grid>.button{margin-top:28px}.service-diagram{width:82vw;height:82vw;right:-25%;top:16%}.route-grid h2,.method-grid h2,.cta-grid h2{margin-top:18px}.problem,.diagnostic-focus,.method-grid ol,.method-grid aside,.cta-grid>div,.cta-grid nav{margin-top:45px}.method-grid aside{margin-left:0}.service-visual img{object-position:64% center}}
</style>
