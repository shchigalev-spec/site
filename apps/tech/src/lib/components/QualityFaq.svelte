<script lang="ts">
  import { track } from '$lib/analytics';

  const checkpoints = [
    { key: 'path', title: 'Основание и реальный путь', text: 'До монтажа сверяем основание, примыкания и обходные маршруты. Слышимая поверхность сама по себе ещё не определяет решение.' },
    { key: 'decoupling', title: 'Развязка', text: 'До закрытия проверяем, что независимый контур не получил случайных жёстких связей с защищаемой конструкцией.' },
    { key: 'sealing', title: 'Герметизация и проходки', text: 'Контролируем непрерывность контура, акустическую герметизацию и каждую инженерную проходку.' },
    { key: 'acceptance', title: 'Скрытые работы и приёмка', text: 'Фиксируем критические узлы до закрытия. Порядок контроля и критерии приёмки согласуются до начала работ.' }
  ];

  const faqs = [
    { q: 'Можно ли обещать 100% тишину?', a: 'Нет. Результат зависит от источника, конструкций здания, фланговых путей и фонового шума. Мы сначала уменьшаем неизвестность диагностикой и заранее согласуем проверяемый критерий приёмки.' },
    { q: 'Почему недостаточно наклеить акустические панели?', a: 'Декоративные панели управляют отражениями внутри комнаты, но обычно не перекрывают путь шума через стену, перекрытие, примыкание, розетку или вентиляцию.' },
    { q: 'Поможет ли потолок от шагов сверху?', a: 'Иногда потолок входит в решение, но ударный шум может распространяться и по стенам. До осмотра нельзя честно назвать одну плоскость достаточной.' },
    { q: 'Можно ли работать в готовой квартире?', a: 'Можно, если после осмотра понятны защита интерьера, допустимый демонтаж и порядок восстановления отделки. Масштаб вмешательства оценивается по месту.' },
    { q: 'Сколько пространства потеряет комната?', a: 'Это зависит от основания, типа шума, требуемой развязки и критических узлов. До диагностики точная толщина создала бы ложное обещание.' },
    { q: 'Достаточно одной стены или нужен весь контур?', a: 'Решение определяется доминирующим и обходными путями передачи. Иногда достаточно одной зоны, иногда требуется связанный контур — это вывод измерения и осмотра, а не универсальное правило.' },
    { q: 'Когда станет понятна цена?', a: 'После того как определены вероятные маршруты, состояние оснований, стадия ремонта и допустимый масштаб. Тогда можно рассчитать конкретный состав работ без цены «из воздуха».' }
  ];

  let active = 0;
  let revealed = new Set<number>([0]);
  let revision = 0;

  function select(index: number) {
    active = index;
    if (!revealed.has(index)) {
      revealed = new Set([...revealed, index]);
      revision += 1;
    }
  }

  function toggleFaq(event: Event, question: string) {
    const detail = event.currentTarget as HTMLDetailsElement;
    if (detail.open) track('faq_open', { question });
  }
</script>

<section class="quality" aria-labelledby="quality-title" data-reveals={revealed.size}>
  <div class="shell section-head">
    <p class="mono">КОНТРОЛЬ / 08</p>
    <h2 class="display" id="quality-title">Проверяем до того,<br />как узел исчезнет.</h2>
    <p>Четыре контрольные точки идут в одной последовательности. Каждый следующий слой открывается один раз и остаётся в проверенном состоянии.</p>
  </div>

  <div class="shell quality-sequence">
    <div class="engineering-plate">
      <picture>
        <source media="(max-width: 960px)" srcset="/generated/tech-v2-quality-control-960.webp" type="image/webp" />
        <source srcset="/generated/tech-v2-quality-control.avif" type="image/avif" />
        <source srcset="/generated/tech-v2-quality-control.webp" type="image/webp" />
        <img src="/generated/tech-v2-quality-control.png" alt="Открытый узел стены и потолка с независимым каркасом, заполнением и герметизированной проходкой" width="1536" height="1024" loading="lazy" />
      </picture>
      <div class="plate-shade" aria-hidden="true"></div>
      <div class="checkpoint-markers" aria-label="Контрольные точки узла">
        {#each checkpoints as item, index}
          <button class:revealed={revealed.has(index)} type="button" aria-pressed={active === index} on:click={() => select(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span><b>{item.title}</b>
          </button>
        {/each}
      </div>
      {#key revision}<i class="inspection-line" aria-hidden="true"></i>{/key}
    </div>

    <aside class="checkpoint-output" aria-live="polite" aria-atomic="true">
      <p class="mono">ТОЧКА {String(active + 1).padStart(2, '0')} / 04</p>
      <h3>{checkpoints[active].title}</h3>
      <p>{checkpoints[active].text}</p>
      <div class="sequence-state">
        {#each checkpoints as item, index}
          <button type="button" class:active={active === index} class:done={revealed.has(index)} on:click={() => select(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><i>{revealed.has(index) ? 'проверено' : 'открыть'}</i>
          </button>
        {/each}
      </div>
    </aside>
  </div>
</section>

<section class="faq warm" aria-labelledby="faq-title">
  <div class="shell faq-grid">
    <div class="faq-intro">
      <p class="mono">СЕМЬ ПРЯМЫХ ОТВЕТОВ / 09</p>
      <h2 class="display" id="faq-title">Без обещаний<br />до измерения.</h2>
      <p>Диагностика не создаёт удобную легенду. Она показывает, какие данные уже известны и что ещё нужно проверить.</p>
    </div>
    <div class="faq-list" data-faq-count={faqs.length}>
      {#each faqs as item, index}
        <details on:toggle={(event) => toggleFaq(event, item.q)}>
          <summary><span class="mono">{String(index + 1).padStart(2, '0')}</span><strong>{item.q}</strong></summary>
          <p>{item.a}</p>
        </details>
      {/each}
    </div>
  </div>
</section>

<style>
  .quality{padding:clamp(110px,13vw,220px) 0;background:var(--ink-950)}.section-head{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:end}.section-head>.mono{grid-column:1/4;color:var(--acoustic)}.section-head h2{grid-column:4/14;margin:0;font-size:clamp(3.2rem,6.6vw,7.6rem)}.section-head>p:last-child{grid-column:11/-1;margin-top:42px;color:var(--white-64)}
  .quality-sequence{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:center;margin-top:clamp(60px,8vw,120px)}.engineering-plate{grid-column:1/12;position:relative;min-height:730px;border-radius:34px;overflow:hidden;background:var(--ink-900);isolation:isolate}.engineering-plate picture,.engineering-plate picture img{position:absolute;inset:0;width:100%;height:100%}.engineering-plate img{object-fit:cover}.plate-shade{position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(7,9,8,.58),transparent 48%),linear-gradient(0deg,rgba(7,9,8,.48),transparent 48%)}.checkpoint-markers{position:absolute;inset:0;z-index:2}.checkpoint-markers button{position:absolute;display:grid;grid-template-columns:42px max-content;gap:10px;align-items:center;min-height:46px;border:0;background:transparent;color:var(--white);cursor:pointer}.checkpoint-markers button:nth-child(1){left:7%;bottom:12%}.checkpoint-markers button:nth-child(2){left:29%;top:18%}.checkpoint-markers button:nth-child(3){right:8%;bottom:28%}.checkpoint-markers button:nth-child(4){right:9%;top:12%}.checkpoint-markers span{display:grid;place-items:center;width:42px;height:42px;border:1px solid var(--white-64);border-radius:50%;background:rgba(7,9,8,.76);font:500 .65rem 'IBM Plex Mono',monospace}.checkpoint-markers b{padding:8px 10px;background:rgba(7,9,8,.72);font-size:.7rem;font-weight:500}.checkpoint-markers button.revealed span{border-color:var(--acoustic)}.checkpoint-markers button[aria-pressed='true'] span{border-color:var(--signal);background:var(--signal);color:var(--ink-950)}.inspection-line{position:absolute;z-index:3;left:4%;right:4%;height:1px;top:50%;background:linear-gradient(90deg,transparent,var(--signal),transparent);animation:inspect-once 560ms ease-out both;pointer-events:none}
  .checkpoint-output{grid-column:12/-1;padding-left:12px}.checkpoint-output>.mono{color:var(--signal)}.checkpoint-output h3{margin:18px 0;font-family:'Geologica',sans-serif;font-size:clamp(2.2rem,3.4vw,4.2rem);line-height:1;letter-spacing:-.045em}.checkpoint-output>p:not(.mono){min-height:105px;color:var(--white-64)}.sequence-state{margin-top:32px;border-top:1px solid var(--white-16)}.sequence-state button{width:100%;display:grid;grid-template-columns:36px 1fr auto;gap:8px;align-items:center;min-height:64px;padding:10px 0;border:0;border-bottom:1px solid var(--white-16);background:transparent;color:var(--white-64);text-align:left;cursor:pointer}.sequence-state span,.sequence-state i{font:500 .6rem 'IBM Plex Mono',monospace}.sequence-state strong{font-size:.72rem;font-weight:500}.sequence-state i{font-style:normal;color:var(--white-64)}.sequence-state button.done i{color:var(--acoustic)}.sequence-state button.active strong{color:var(--white)}
  .faq{padding:clamp(110px,13vw,220px) 0}.faq-grid{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:start}.faq-intro{grid-column:1/7;position:sticky;top:130px}.faq-intro>.mono{color:var(--acoustic-dark)}.faq-intro h2{margin:24px 0;font-size:clamp(3.3rem,6.5vw,7.2rem)}.faq-intro>p:last-child{max-width:43ch;color:rgba(7,9,8,.62)}.faq-list{grid-column:8/-1}details{border-top:1px solid rgba(7,9,8,.18)}details:last-child{border-bottom:1px solid rgba(7,9,8,.18)}summary{display:grid;grid-template-columns:54px 1fr;gap:14px;align-items:baseline;padding:25px 0;cursor:pointer;list-style:none}summary::-webkit-details-marker{display:none}summary strong{font-family:'Geologica',sans-serif;font-size:clamp(1.15rem,1.7vw,1.8rem);line-height:1.2;letter-spacing:-.025em}details[open] summary strong{color:var(--acoustic-dark)}details>p{margin:0 0 28px 68px;max-width:60ch;color:rgba(7,9,8,.66)}
  @keyframes inspect-once{from{opacity:0;transform:scaleX(.1)}45%{opacity:1}to{opacity:0;transform:scaleX(1)}}
  @media(max-width:1000px){.section-head,.quality-sequence,.faq-grid{grid-template-columns:repeat(8,minmax(0,1fr))}.section-head>.mono{grid-column:1/3}.section-head h2{grid-column:3/-1}.section-head>p:last-child{grid-column:3/8}.engineering-plate{grid-column:1/7}.checkpoint-output{grid-column:7/-1}.faq-intro{grid-column:1/4}.faq-list{grid-column:4/-1}.checkpoint-markers b{display:none}}
  @media(max-width:767px){.section-head{display:block}.section-head h2{margin-top:20px;font-size:clamp(3rem,14vw,5.4rem)}.section-head>p:last-child{margin-top:25px}.quality-sequence{display:flex;flex-direction:column;align-items:stretch}.engineering-plate{min-height:520px}.checkpoint-output{padding:0}.checkpoint-output>p:not(.mono){min-height:0}.faq-grid{display:block}.faq-intro{position:static}.faq-list{margin-top:60px}details>p{margin-left:0}.sequence-state button{min-height:60px}}
  @media(prefers-reduced-motion:reduce){.inspection-line{display:none}}
</style>
