<script lang="ts">
  import ImageFrame from './ImageFrame.svelte';
  import CaseGraph from './CaseGraph.svelte';
  import { cases } from '$lib/content';
  import { track } from '$lib/analytics';

  const [primary, ...supporting] = cases;
</script>

<section class="cases-v2" id="results" data-chapter="05 · Кейсы">
  <header class="cases-intro">
    <div class="section-label">05 / Измеренные результаты</div>
    <h2>Один подробный разбор.<br />Два контрольных результата.</h2>
    <p>Публикуем только известные величины. Контекст, которого нет в исходных данных, прямо оставляем неизвестным — без адресов, отзывов и придуманного состава работ.</p>
  </header>

  <article class="case-primary">
    <div class="primary-copy">
      <span class="case-kicker">{primary.eyebrow} · подробный разбор</span>
      <h3>{primary.title}</h3>
      <p class="case-lead">{primary.description}</p>

      <dl class="case-diagnostic-sequence">
        <div><dt>Проблема</dt><dd>{primary.heard}</dd></div>
        <div><dt>Исходная гипотеза</dt><dd>{primary.assumption}</dd></div>
        <div><dt>Что обследовали</dt><dd>{primary.inspected}</dd></div>
        <div><dt>Что изменил диагноз</dt><dd>{primary.diagnosticChange}</dd></div>
      </dl>

      <div class="principles">
        <span>Принципы вмешательства</span>
        <ul>{#each primary.intervention as principle}<li>{principle}</li>{/each}</ul>
      </div>

      <div class="result-limit">
        <div><span>Измеренный результат</span><strong>{primary.result}</strong></div>
        <div><span>Ограничение</span><p>{primary.limitation}</p></div>
      </div>

      <a class="case-link" href={`/cases/${primary.slug}/`} on:click={() => track('case_open', { case: primary.slug, placement: 'cases-v2-primary' })}>
        Открыть полный разбор <span aria-hidden="true">↗</span>
      </a>
    </div>

    <div class="primary-evidence">
      <div class="case-image">
        <ImageFrame src={primary.image} alt={`Иллюстративный интерьер к результату ${primary.title}`} fallback={`Результат ${primary.title}`} />
        <small>Иллюстративная визуализация, не фотография объекта заказчика.</small>
      </div>
      <CaseGraph item={primary} />
    </div>
  </article>

  <div class="supporting-cases" role="region" aria-label="Дополнительные измеренные результаты">
    {#each supporting as item, index}
      <article class="case-supporting">
        <div class="supporting-image">
          <ImageFrame src={item.image} alt={`Иллюстративный интерьер к результату ${item.title}`} fallback={`Результат ${item.title}`} />
          <small>Иллюстративная визуализация, не фотография объекта заказчика.</small>
        </div>
        <div class="supporting-copy">
          <span class="case-kicker">05.{index + 2} / контрольный результат</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div class="compact-result"><span>Зафиксировано</span><strong>{item.result}</strong></div>
          <p class="case-limit"><span>Граница данных</span>{item.limitation}</p>
          <a class="case-link" href={`/cases/${item.slug}/`} on:click={() => track('case_open', { case: item.slug, placement: 'cases-v2-supporting' })}>
            Что известно и неизвестно <span aria-hidden="true">↗</span>
          </a>
        </div>
        <CaseGraph {item} compact />
      </article>
    {/each}
  </div>
</section>

<style>
  .cases-v2 { padding: clamp(4.5rem, 6.5vw, 6.5rem) var(--margin); background: #dfe4de; color: #242824; }
  .cases-intro { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--gutter); align-items: end; }
  .cases-intro .section-label { grid-column: 1 / 4; color: #48635f; font-size: 0.75rem; }
  .cases-intro h2 { grid-column: 1 / 9; max-width: 13ch; margin: 1.5rem 0 0; }
  .cases-intro > p { grid-column: 9 / 13; max-width: 42ch; margin: 0; color: #4e5650; }

  .case-primary { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(2rem, 4vw, 4rem); margin-top: 3.5rem; padding: clamp(1.5rem, 3vw, 3rem); background: #20231f; color: #fbfaf6; }
  .primary-copy { display: flex; flex-direction: column; }
  .case-kicker { font: 0.75rem 'IBM Plex Mono', monospace; color: #c6d5cf; text-transform: uppercase; }
  .case-primary h3 { margin: 1.2rem 0; font-size: clamp(3.3rem, 7vw, 7.8rem); line-height: 0.88; letter-spacing: -0.065em; }
  .case-lead { max-width: 38ch; color: #d6dcd7; font-size: 1.05rem; }
  .case-diagnostic-sequence { display: grid; grid-template-columns: 1fr 1fr; margin: 1.6rem 0 0; }
  .case-diagnostic-sequence div { display: block; padding: 0.75rem 0.75rem 0.75rem 0; border-top: 1px solid rgba(251, 250, 246, 0.2); }
  .case-diagnostic-sequence dt,
  .principles > span,
  .result-limit span,
  .compact-result span,
  .case-limit span { font: 0.75rem 'IBM Plex Mono', monospace; color: #b9c9c2; text-transform: uppercase; }
  .case-diagnostic-sequence dd { margin: 0.45rem 0 0; color: #e0e4e0; font-size: 0.88rem; }
  .principles { margin-top: 1.3rem; }
  .principles ul { display: grid; grid-template-columns: 1fr 1fr; gap: 0 0.75rem; margin: 0.5rem 0 0; padding: 0; list-style: none; }
  .principles li { position: relative; padding: 0.4rem 0 0.4rem 1.2rem; color: #e0e4e0; }
  .principles li::before { content: ''; position: absolute; left: 0; top: 1.05rem; width: 0.45rem; height: 0.45rem; background: #d96b55; transform: rotate(45deg); }
  .result-limit { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.3rem; }
  .result-limit > div { padding-top: 1rem; border-top: 2px solid #879d95; }
  .result-limit strong { display: block; margin-top: 0.8rem; color: #fbfaf6; font-size: 1.05rem; line-height: 1.35; }
  .result-limit p { margin: 0.8rem 0 0; color: #d6dcd7; font-size: 0.9rem; }
  .case-link { display: inline-flex; align-items: center; justify-content: space-between; gap: 2rem; min-height: 52px; margin-top: 2rem; padding: 0.8rem 0; border-top: 1px solid rgba(251, 250, 246, 0.35); border-bottom: 1px solid rgba(251, 250, 246, 0.35); color: #fbfaf6; text-decoration: none; }
  .case-link span { font-size: 1.35rem; }
  .case-link:hover { color: #efb8a8; }
  .primary-evidence { display: grid; align-content: start; gap: 1rem; }
  .case-image { position: relative; min-height: 26rem; overflow: hidden; }
  .case-image :global(.image-frame),
  .case-image :global(picture),
  .case-image :global(img) { width: 100%; height: 100%; }
  .case-image :global(img) { object-fit: cover; }
  .case-image small,
  .supporting-image small { position: absolute; left: 0.75rem; right: 0.75rem; bottom: 0.75rem; padding: 0.6rem 0.75rem; background: rgba(20, 24, 21, 0.88); color: #f8f4ed; font: 0.75rem 'IBM Plex Mono', monospace; }

  .supporting-cases { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gutter); margin-top: var(--gutter); }
  .case-supporting { display: grid; grid-template-columns: minmax(11rem, 0.85fr) minmax(0, 1.15fr); grid-template-rows: auto auto; gap: 1.25rem; padding: 1.25rem; border: 1px solid #aeb8b0; background: #f2eee6; }
  .supporting-image { position: relative; min-height: 14rem; grid-column: 1; grid-row: 1; overflow: hidden; }
  .supporting-image :global(.image-frame),
  .supporting-image :global(picture),
  .supporting-image :global(img) { width: 100%; height: 100%; }
  .supporting-image :global(img) { object-fit: cover; }
  .supporting-copy { display: flex; grid-column: 2; grid-row: 1 / span 2; flex-direction: column; }
  .case-supporting :global(.case-graph-v2) { grid-column: 1; grid-row: 2; }
  .supporting-copy .case-kicker { color: #48635f; }
  .supporting-copy h3 { margin: 0.75rem 0; font-size: clamp(2rem, 3.4vw, 3.4rem); line-height: 0.95; }
  .supporting-copy > p { color: #4e5650; }
  .compact-result { margin-top: auto; padding-top: 1rem; border-top: 1px solid #abb4ad; }
  .compact-result span,
  .case-limit span { display: block; margin-bottom: 0.55rem; color: #48635f; }
  .compact-result strong { display: block; font-size: 1rem; }
  .case-limit { margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid #abb4ad; font-size: 0.88rem; }
  .supporting-copy .case-link { margin-top: auto; border-color: #abb4ad; color: #242824; }

  @media (max-width: 1050px) {
    .case-primary { grid-template-columns: 1fr; }
    .primary-evidence { grid-template-columns: 1fr 1fr; }
    .case-image { min-height: 23rem; }
    .supporting-cases { grid-template-columns: 1fr; }
  }

  @media (max-width: 700px) {
    .cases-v2 { padding: 4rem 1.1rem; }
    .cases-intro { display: block; }
    .cases-intro h2 { margin: 1.2rem 0 1.5rem; }
    .case-primary { display: flex; flex-direction: column; margin-top: 2rem; padding: 1rem; }
    .primary-copy { display: contents; }
    .primary-copy .case-kicker { order: 1; }
    .case-primary h3 { order: 2; margin: 0.8rem 0 0; font-size: clamp(3rem, 14.5vw, 4.5rem); }
    .case-lead { order: 3; }
    .primary-evidence { display: contents; }
    .case-image { order: 4; min-height: 11rem; }
    .primary-evidence :global(.case-graph-v2) { order: 5; }
    .case-diagnostic-sequence { order: 6; }
    .principles { order: 7; }
    .result-limit { order: 8; }
    .primary-copy > .case-link { order: 9; }
    .case-diagnostic-sequence div { padding: 0.55rem 0.45rem 0.55rem 0; }
    .case-diagnostic-sequence dd,
    .principles li,
    .result-limit p { font-size: 0.82rem; line-height: 1.35; }
    .principles { margin-top: 0.9rem; }
    .principles li { padding-block: 0.3rem; }
    .result-limit { margin-top: 0.9rem; }
    .primary-copy > .case-link { margin-top: 1rem; }
    .supporting-cases { margin-top: 1rem; }
    .case-supporting { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 0.7rem; padding: 0.85rem; }
    .supporting-copy { grid-column: 1 / -1; grid-row: 1; }
    .supporting-image { grid-column: 1; grid-row: 2; min-height: 10rem; }
    .case-supporting :global(.case-graph-v2) { grid-column: 2; grid-row: 2; align-self: stretch; }
    .case-supporting :global(.compact-summary) { display: none; }
    .supporting-copy h3 { margin: 0.5rem 0; font-size: clamp(1.75rem, 8.2vw, 2.5rem); }
    .supporting-copy > p { margin: 0.25rem 0; font-size: 0.82rem; line-height: 1.35; }
    .compact-result { margin-top: 0.4rem; padding-top: 0.6rem; }
    .case-limit { margin-top: 0.65rem; padding-top: 0.65rem; }
    .supporting-copy .case-link { min-height: 44px; margin-top: 0.8rem; padding: 0.55rem 0; font-size: 0.86rem; }
  }

  @media (max-width: 360px) {
    .cases-v2 { padding-inline: 0.8rem; }
    .case-primary { padding: 0.8rem; }
    .case-image { min-height: 13rem; }
    .case-supporting { padding: 0.8rem; }
    .case-diagnostic-sequence,
    .principles ul,
    .result-limit { grid-template-columns: 1fr; }
  }
</style>
