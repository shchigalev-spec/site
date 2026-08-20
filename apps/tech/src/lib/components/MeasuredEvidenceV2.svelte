<script lang="ts">
  import { casePages } from '$lib/data/site';
  import { track } from '$lib/analytics';
  import FiniteEvidenceGraph from './FiniteEvidenceGraph.svelte';

  const dominant = casePages[0];
  const supporting = casePages.slice(1);
</script>

<section class="measured-evidence warm" id="measured-evidence" aria-labelledby="evidence-title">
  <header class="shell evidence-heading">
    <p class="mono">05 / ИЗМЕРЕННЫЕ ДАННЫЕ</p>
    <h2 class="display" id="evidence-title">Не обещание.<br />Измерённое изменение.</h2>
    <p>Кейс показывает достигнутый результат. Он не подменяет диагностику другой квартиры.</p>
  </header>

  <article class="dominant-case" aria-labelledby="dominant-case-title">
    <div class="dominant-image">
      <picture aria-hidden="true">
        <source media="(max-width: 960px)" srcset={dominant.asset.replace('.png', '-960.webp')} type="image/webp" />
        <source srcset={dominant.asset.replace('.png', '.webp')} type="image/webp" />
        <img src={dominant.asset} alt="" width="1672" height="941" loading="lazy" decoding="async" />
      </picture>
      <div class="image-shade" aria-hidden="true"></div>
      <p class="illustrative-label">Иллюстративная визуализация, не фотография объекта заказчика.</p>
    </div>

    <div class="shell dominant-layout">
      <div class="dominant-result">
        <p class="mono">ДОМИНИРУЮЩИЙ КЕЙС / 01</p>
        <h3 class="display" id="dominant-case-title">{dominant.result}</h3>
        <p>{dominant.engineeringConclusion}</p>
      </div>

      <div class="dominant-graph">
        <FiniteEvidenceGraph item={dominant} />
      </div>

      <dl class="evidence-ledger">
        <div>
          <dt class="mono">СИМПТОМ</dt>
          <dd>{dominant.symptom}</dd>
        </div>
        <div>
          <dt class="mono">НАЧАЛЬНАЯ ГИПОТЕЗА</dt>
          <dd>{dominant.hypothesis}</dd>
        </div>
        <div>
          <dt class="mono">ФОКУС ОСМОТРА</dt>
          <dd>{dominant.inspectedZones.join(' ')}</dd>
        </div>
        <div>
          <dt class="mono">ИНЖЕНЕРНЫЙ ВЫВОД</dt>
          <dd>{dominant.engineeringConclusion}</dd>
        </div>
        <div>
          <dt class="mono">ПРИНЦИПЫ ВМЕШАТЕЛЬСТВА</dt>
          <dd>{dominant.interventionPrinciples.join(' ')}</dd>
        </div>
        <div class="limitation-row">
          <dt class="mono">ОГРАНИЧЕНИЕ</dt>
          <dd>{dominant.caveat}</dd>
        </div>
      </dl>

      <a class="case-link" href={`/cases/${dominant.slug}/`} on:click={() => track('case_open', { case: dominant.slug, placement: 'dominant_evidence' })}>
        <span>Открыть полный кейс</span><span aria-hidden="true">↗</span>
      </a>
    </div>
  </article>

  <div class="shell supporting-grid" aria-label="Два дополнительных измеренных кейса">
    {#each supporting as item, index}
      <article class:support-peak={index === 0} class:support-band={index === 1} class="support-case" aria-labelledby={`support-${item.slug}`}>
        <div class="support-image" aria-hidden="true">
          <picture>
            <source media="(max-width: 960px)" srcset={item.asset.replace('.png', '-960.webp')} type="image/webp" />
            <source srcset={item.asset.replace('.png', '.webp')} type="image/webp" />
            <img src={item.asset} alt="" width="1672" height="941" loading="lazy" decoding="async" />
          </picture>
        </div>
        <div class="support-copy">
          <p class="mono">ПОДДЕРЖИВАЮЩИЙ КЕЙС / 0{index + 2}</p>
          <h3 class="display" id={`support-${item.slug}`}>{item.result}</h3>
          <p>{item.engineeringConclusion}</p>
        </div>
        <FiniteEvidenceGraph {item} compact />
        <div class="support-footer">
          <small>Иллюстративная визуализация, не фотография объекта заказчика.</small>
          <a href={`/cases/${item.slug}/`} on:click={() => track('case_open', { case: item.slug, placement: 'supporting_evidence' })}>Кейс и границы данных <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    {/each}
  </div>

  <div class="shell evidence-close">
    <p class="display">Ваш результат начинается не с чужой цифры, а с вашего пути шума.</p>
    <a class="button" href="/diagnostika-shuma/">Сопоставить с моей ситуацией</a>
  </div>
</section>

<style>
  .measured-evidence {
    padding-top: clamp(100px, 11vw, 180px);
    overflow: clip;
  }

  .evidence-heading {
    display: grid;
    grid-template-columns: repeat(16, minmax(0, 1fr));
    gap: clamp(12px, 1.1vw, 24px);
    align-items: end;
    padding-bottom: clamp(64px, 8vw, 120px);
  }

  .evidence-heading > .mono { grid-column: 1 / 4; color: var(--acoustic-dark); }
  .evidence-heading h2 { grid-column: 4 / 13; margin: 0; font-size: clamp(3rem, 6.5vw, 7.2rem); }
  .evidence-heading > p:last-child { grid-column: 13 / -1; margin: 0; color: rgba(7, 9, 8, .64); }

  .dominant-case {
    position: relative;
    isolation: isolate;
    min-height: 118svh;
    padding-block: clamp(76px, 8vw, 130px);
    color: var(--white);
    background: var(--ink-950);
  }

  .dominant-image {
    position: absolute;
    z-index: -1;
    inset: 0 0 0 42%;
    overflow: hidden;
  }

  .dominant-image picture,
  .dominant-image img { display: block; width: 100%; height: 100%; }
  .dominant-image img { object-fit: cover; filter: saturate(.72) brightness(.62); }
  .image-shade { position: absolute; inset: 0; background: linear-gradient(90deg, var(--ink-950) 0, rgba(7,9,8,.86) 20%, rgba(7,9,8,.18) 70%), linear-gradient(0deg, rgba(7,9,8,.72), transparent 45%); }
  .illustrative-label { position: absolute; right: var(--gutter); bottom: 28px; max-width: 34ch; margin: 0; font-size: .68rem; color: rgba(255,253,248,.7); }

  .dominant-layout {
    display: grid;
    grid-template-columns: repeat(16, minmax(0, 1fr));
    gap: clamp(18px, 1.6vw, 30px);
    align-items: start;
  }

  .dominant-result { grid-column: 1 / 11; }
  .dominant-result > .mono { color: var(--acoustic); }
  .dominant-result h3 { margin: 18px 0 24px; font-size: clamp(5rem, 11vw, 13rem); font-variant-numeric: tabular-nums; }
  .dominant-result > p:last-child { max-width: 48ch; margin: 0 0 50px 8%; color: var(--white-64); }
  .dominant-graph { grid-column: 1 / 9; }

  .evidence-ledger {
    grid-column: 10 / -1;
    margin: 70px 0 0;
    border-top: 1px solid var(--white-16);
    background: rgba(7, 9, 8, .72);
    backdrop-filter: blur(12px);
  }

  .evidence-ledger div { display: grid; grid-template-columns: minmax(140px, .8fr) 1.5fr; gap: 22px; padding: 17px 0; border-bottom: 1px solid var(--white-16); }
  .evidence-ledger dt { color: var(--acoustic); }
  .evidence-ledger dd { margin: 0; color: var(--white-64); }
  .evidence-ledger .limitation-row dt { color: var(--warning); }

  .case-link {
    grid-column: 10 / -1;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    margin-top: 18px;
    padding: 18px 0;
    border-bottom: 1px solid var(--white-16);
    font-weight: 500;
  }
  .case-link span:last-child { color: var(--signal); }

  .supporting-grid {
    display: grid;
    grid-template-columns: repeat(16, minmax(0, 1fr));
    gap: clamp(18px, 2vw, 34px);
    padding-block: clamp(90px, 11vw, 170px);
    align-items: start;
  }

  .support-case {
    position: relative;
    display: grid;
    gap: 24px;
    padding: clamp(24px, 3vw, 46px);
    border: 1px solid rgba(7, 9, 8, .18);
    overflow: hidden;
  }
  .support-peak { grid-column: 1 / 8; margin-top: 110px; background: #e8e0d4; }
  .support-band { grid-column: 8 / -1; background: #d7ded7; }
  .support-image { height: clamp(220px, 27vw, 410px); margin: calc(clamp(24px, 3vw, 46px) * -1) calc(clamp(24px, 3vw, 46px) * -1) 0; overflow: hidden; }
  .support-image picture,
  .support-image img { display: block; width: 100%; height: 100%; }
  .support-image img { object-fit: cover; filter: saturate(.64) contrast(.95); }
  .support-copy > .mono { color: var(--acoustic-dark); }
  .support-copy h3 { margin: 15px 0; font-size: clamp(2.8rem, 5vw, 6rem); font-variant-numeric: tabular-nums; }
  .support-copy > p:last-child { max-width: 48ch; color: rgba(7, 9, 8, .66); }
  .support-footer { display: grid; grid-template-columns: 1fr auto; gap: 26px; align-items: end; }
  .support-footer small { max-width: 34ch; color: rgba(7, 9, 8, .55); }
  .support-footer a { padding-bottom: 3px; border-bottom: 1px solid currentColor; font-weight: 500; }

  .evidence-close {
    min-height: 68svh;
    display: grid;
    grid-template-columns: repeat(16, minmax(0, 1fr));
    gap: 24px;
    align-items: center;
    border-top: 1px solid rgba(7, 9, 8, .16);
  }
  .evidence-close p { grid-column: 2 / 11; margin: 0; font-size: clamp(3rem, 6vw, 7rem); }
  .evidence-close .button { grid-column: 12 / -1; }

  @media (max-width: 1023px) {
    .evidence-heading { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .evidence-heading > .mono { grid-column: 1 / 3; }
    .evidence-heading h2 { grid-column: 3 / -1; }
    .evidence-heading > p:last-child { grid-column: 3 / 8; margin-top: 20px; }
    .dominant-case { min-height: auto; }
    .dominant-image { inset: 0 0 46% 28%; }
    .dominant-layout { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .dominant-result { grid-column: 1 / -1; }
    .dominant-graph { grid-column: 1 / 6; }
    .evidence-ledger { grid-column: 1 / -1; margin-top: 30px; }
    .case-link { grid-column: 1 / -1; }
    .supporting-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .support-peak { grid-column: 1 / 5; }
    .support-band { grid-column: 5 / -1; }
    .support-footer { grid-template-columns: 1fr; }
  }

  @media (max-width: 767px) {
    .measured-evidence { padding-top: 86px; }
    .evidence-heading { display: block; padding-bottom: 64px; }
    .evidence-heading h2 { margin-top: 18px; font-size: clamp(3rem, 14vw, 5rem); }
    .evidence-heading > p:last-child { margin-top: 24px; }
    .dominant-case { padding-block: 72px; }
    .dominant-image { inset: 0 0 auto 15%; height: 440px; }
    .image-shade { background: linear-gradient(0deg, var(--ink-950), rgba(7,9,8,.12) 70%); }
    .illustrative-label { right: 18px; bottom: 24px; left: 18px; }
    .dominant-layout { display: block; }
    .dominant-result { position: relative; padding-top: 390px; }
    .dominant-result h3 { font-size: clamp(4.2rem, 20vw, 7rem); }
    .dominant-result > p:last-child { margin-left: 0; }
    .dominant-graph { margin-top: 32px; }
    .evidence-ledger { margin-top: 46px; }
    .evidence-ledger div { display: block; }
    .evidence-ledger dd { margin-top: 8px; }
    .supporting-grid { display: block; padding-block: 70px; }
    .support-case { margin: 0 0 28px; }
    .support-image { height: 240px; }
    .support-copy h3 { font-size: clamp(2.8rem, 14vw, 4.7rem); }
    .support-footer { display: block; }
    .support-footer a { display: block; margin-top: 20px; }
    .evidence-close { min-height: 66svh; display: flex; flex-direction: column; justify-content: center; align-items: stretch; }
    .evidence-close p { font-size: clamp(3rem, 14vw, 5rem); }
  }
</style>
