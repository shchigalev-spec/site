<script lang="ts">
  import { casePages } from '$lib/data/site';
  import { track } from '$lib/analytics';

  const graphShapes = [
    [82, 62, 76, 48, 71, 42, 66, 38, 58, 34, 52, 29],
    [24, 28, 26, 94, 22, 20, 34, 18, 22, 20, 16, 18],
    [76, 68, 74, 64, 70, 59, 62, 50, 56, 45, 48, 38]
  ];
</script>

<section class="cases" id="cases" aria-labelledby="cases-title">
  <div class="shell section-head cases-heading">
    <p class="mono">ДОКАЗАТЕЛЬСТВО / 06</p>
    <h2 class="display" id="cases-title">Результат читается в измерении.</h2>
    <p>Три достигнутых результата. Без вымышленных адресов, цен и названий систем.</p>
  </div>

  {#each casePages as item, caseIndex}
    <article class="case-chapter" class:reversed={caseIndex === 1}>
      <div class="case-visual">
        <picture>
          <source media="(max-width: 960px)" srcset={item.asset.replace('.png', '-960.webp')} type="image/webp" />
          <source srcset={item.asset.replace('.png', '.webp')} type="image/webp" />
          <img src={item.asset} alt="Визуализация жилого интерьера для истории измеренного результата" width="1672" height="941" loading="lazy" />
        </picture>
        <div class="case-shade"></div>
      </div>
      <div class="shell case-grid">
        <div class="case-number">
          <span class="mono">{item.eyebrow}</span>
          <p class="display">{item.result}</p>
        </div>
        <div class="case-graph" aria-label={`Графическое сопоставление: ${item.result}`}>
          {#each graphShapes[caseIndex] as value, index}
            <i style={`--value:${value}%;--index:${index}`}></i>
          {/each}
          <span class="graph-before mono">ДО</span><span class="graph-after mono">ПОСЛЕ</span>
        </div>
        <div class="case-copy">
          <p>{item.narrative}</p>
          <small>Визуализация кейса. Изображение не является фотографией объекта.</small>
          <a class="button secondary" href={`/cases/${item.slug}/`} on:click={() => track('case_open', { case: item.slug })}>Открыть кейс</a>
        </div>
      </div>
    </article>
  {/each}

  <div class="shell cases-caveat">
    <p>Показатели не заменяют диагностику вашей квартиры: здания, пути передачи и физические ограничения отличаются.</p>
    <a class="button" href="/diagnostika-shuma/">Сопоставить с моей ситуацией</a>
  </div>
</section>

<style>
  .cases { padding: clamp(110px,13vw,220px) 0 0; background: var(--ink-950); }
  .cases-heading { margin-bottom: 90px; }
  .case-chapter { position: relative; min-height: 112svh; display: flex; align-items: center; overflow: hidden; border-top: 1px solid var(--white-16); }
  .case-visual { position: absolute; inset: 8% 0 8% 48%; overflow: hidden; border-radius: 40px 0 0 40px; }
  .case-visual img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.56) saturate(.68); }
  .case-shade { position: absolute; inset: 0; background: linear-gradient(90deg,var(--ink-950),transparent 62%); }
  .reversed .case-visual { inset: 8% 48% 8% 0; border-radius: 0 40px 40px 0; }
  .reversed .case-shade { background: linear-gradient(-90deg,var(--ink-950),transparent 62%); }
  .case-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(16,1fr); gap: 24px; align-items: center; }
  .case-number { grid-column: 1 / 10; }
  .reversed .case-number { grid-column: 8 / -1; }
  .case-number > .mono { color: var(--acoustic); }
  .case-number p { margin: 22px 0; font-size: clamp(4rem,9vw,11rem); font-variant-numeric: tabular-nums; }
  .case-graph { grid-column: 2 / 9; height: 190px; display: flex; align-items: end; gap: 5px; padding: 24px 0; border-block: 1px solid var(--white-16); position: relative; }
  .reversed .case-graph { grid-column: 9 / -1; }
  .case-graph i { flex: 1; height: var(--value); min-width: 3px; background: linear-gradient(to top,var(--acoustic),var(--signal)); opacity: calc(.35 + var(--index) * .04); transform-origin: bottom; animation: graph 2.4s calc(var(--index) * 50ms) ease-in-out infinite alternate; }
  @keyframes graph { to { transform: scaleY(.56); filter: saturate(.65); } }
  .case-graph span { position: absolute; bottom: -25px; color: var(--white-64); }
  .graph-before { left: 0; } .graph-after { right: 0; }
  .case-copy { grid-column: 11 / -1; align-self: end; padding-bottom: 50px; }
  .reversed .case-copy { grid-column: 1 / 6; grid-row: 1; }
  .case-copy p { color: var(--white-64); }
  .case-copy small { display: block; margin: 18px 0 25px; color: var(--white-64); font-size: .68rem; }
  .case-copy .button { width: 100%; font-size: .82rem; }
  .cases-caveat { min-height: 70svh; display: flex; justify-content: space-between; align-items: center; gap: 60px; }
  .cases-caveat p { max-width: 48ch; font-size: clamp(1.4rem,2.4vw,2.8rem); line-height: 1.25; }
  @media (max-width: 767px) { .case-chapter { min-height: 900px; padding: 90px 0; align-items: flex-start; } .case-visual, .reversed .case-visual { inset: 34% 0 8% 18px; border-radius: 24px 0 0 24px; } .case-grid { display: flex; flex-direction: column; align-items: stretch; } .reversed .case-number, .reversed .case-graph, .reversed .case-copy { grid-column: auto; grid-row: auto; } .case-graph { order: 2; } .case-copy { order: 3; margin-top: 290px; padding: 0; } .cases-caveat { min-height: 70svh; flex-direction: column; justify-content: center; align-items: stretch; } }
  @media (prefers-reduced-motion: reduce) { .case-graph i { animation: none; } }
</style>
