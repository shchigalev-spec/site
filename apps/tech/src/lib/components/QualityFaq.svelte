<script lang="ts">
  import { track } from '$lib/analytics';

  const nodes = [
    { key: 'perimeter', label: 'Периметр', text: 'Проверяем непрерывность контура и зоны, где воздушный путь может обойти основную конструкцию.' },
    { key: 'fastener', label: 'Крепёж', text: 'Контролируем жёсткие связи и соответствие согласованному узлу до закрытия поверхности.' },
    { key: 'penetration', label: 'Проходка', text: 'Фиксируем инженерные проходы и герметизацию скрытых зон.' },
    { key: 'junction', label: 'Примыкание', text: 'Сверяем сопряжение стены, пола и потолка, чтобы не оставить фланговый маршрут.' }
  ];

  const faqs = [
    { q: 'Почему нельзя выбрать решение только по слышимой поверхности?', a: 'Звук может войти через соседнее примыкание, перекрытие, розетку или вентиляционный канал. Слышимая плоскость показывает симптом, но не всегда доминирующий путь передачи.' },
    { q: 'Что происходит после первичной диагностики?', a: 'Менеджер связывается, уточняет симптом и объект. Следующий коммерческий шаг — выездная диагностика, на которой проверяются вероятные маршруты и ограничения.' },
    { q: 'Можно ли работать в готовой квартире?', a: 'Да, но масштаб демонтажа, защита интерьера, пыль и потеря пространства оцениваются только после осмотра. Заранее обещать «без ремонта» было бы нечестно.' },
    { q: 'Зачем измерения до и после?', a: 'Они помогают зафиксировать исходное состояние и сопоставить его с результатом. Конкретный порядок и критерии приёмки согласуются до начала работ.' },
    { q: 'Поможет ли запись шума с телефона?', a: 'Она передаёт контекст: характер, время и повторяемость. Но микрофон телефона не заменяет профессиональный замер.' },
    { q: 'Почему на сайте нет цены за квадратный метр?', a: 'До понимания пути, конструкций, примыканий и стадии ремонта такая цена создаёт ложную точность. Сначала рассчитывается инженерное решение и только затем объём и бюджет.' },
    { q: 'От чего зависит потеря пространства?', a: 'От типа шума, оснований, выбранного принципа развязки, критических узлов и допустимых ограничений комнаты.' },
    { q: 'Как фиксируются гарантия и качество?', a: 'Условия гарантии фиксируются в договоре. Критерии приёмки согласуются до начала работ; скрытые работы и критические узлы фиксируются в процессе.' }
  ];

  let activeNode = 0;

  function toggleFaq(event: Event, question: string) {
    const detail = event.currentTarget as HTMLDetailsElement;
    if (detail.open) track('faq_open', { question });
  }
</script>

<section class="quality" aria-labelledby="quality-title">
  <div class="shell section-head">
    <p class="mono">КОНТРОЛЬ / 08</p>
    <h2 class="display" id="quality-title">Решение держится на узлах, которые потом не видны.</h2>
    <p>Выберите точку контроля. Скрытая работа становится частью согласованной приёмки.</p>
  </div>

  <div class="shell quality-grid">
    <div class="node-visual" data-node={nodes[activeNode].key}>
      <div class="macro-layers" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      {#each nodes as node, index}
        <button class={`hotspot hotspot-${index + 1}`} type="button" aria-pressed={index === activeNode} on:click={() => (activeNode = index)}><span>{index + 1}</span><b>{node.label}</b></button>
      {/each}
    </div>
    <aside class="node-output" aria-live="polite">
      <span class="mono">УЗЕЛ {String(activeNode + 1).padStart(2, '0')} / 04</span>
      <h3>{nodes[activeNode].label}</h3>
      <p>{nodes[activeNode].text}</p>
      <ul>
        <li>Контролируем технологию, монтаж и критические узлы.</li>
        <li>Фиксируем скрытые работы.</li>
        <li>Критерии приёмки согласуются до начала работ.</li>
        <li>Условия гарантии фиксируются в договоре.</li>
      </ul>
    </aside>
  </div>
</section>

<section class="faq warm" aria-labelledby="faq-title">
  <div class="shell faq-grid">
    <div class="faq-intro">
      <p class="mono">ЧЕСТНЫЕ ОГРАНИЧЕНИЯ / 09</p>
      <h2 class="display" id="faq-title">Знаем.<br />Проверяем.<br />Согласуем.</h2>
      <p>Диагностика уменьшает неизвестность, но не заменяет данные конкретной квартиры общими обещаниями.</p>
    </div>
    <div class="faq-list">
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
  .quality { padding: clamp(120px,14vw,240px) 0; background: var(--ink-950); }
  .quality-grid { min-height: 900px; display: grid; grid-template-columns: repeat(16,1fr); gap: 24px; align-items: center; margin-top: 80px; }
  .node-visual { grid-column: 1 / 12; position: relative; min-height: 720px; display: grid; place-items: center; border: 1px solid var(--white-16); border-radius: 40px; background: radial-gradient(circle at center,rgba(108,159,150,.11),transparent 58%),var(--ink-900); overflow: hidden; }
  .macro-layers { width: 66%; aspect-ratio: 1.15; display: grid; perspective: 900px; transform: rotate(-10deg); }
  .macro-layers i { grid-area: 1/1; border: 1px solid var(--white-16); background: rgba(23,28,26,.7); transform: translate3d(calc(var(--layer) * 34px),calc(var(--layer) * -25px),calc(var(--layer) * 22px)) rotateX(56deg); transition: border-color 350ms ease,transform 500ms ease; }
  .macro-layers i:nth-child(1) { --layer: -1.5; } .macro-layers i:nth-child(2) { --layer: -.5; border-color: var(--acoustic); } .macro-layers i:nth-child(3) { --layer: .5; border-color: var(--signal); } .macro-layers i:nth-child(4) { --layer: 1.5; }
  [data-node='fastener'] .macro-layers i { transform: translate3d(calc(var(--layer) * 18px),calc(var(--layer) * -14px),0) rotateX(56deg); }
  [data-node='penetration'] .macro-layers i:nth-child(3) { border-radius: 50%; transform: scale(.28) rotateX(56deg); }
  [data-node='junction'] .macro-layers i { border-right-color: var(--signal); }
  .hotspot { position: absolute; min-width: 44px; min-height: 44px; border: 0; background: transparent; color: var(--white); cursor: pointer; }
  .hotspot span { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--white-16); border-radius: 50%; background: var(--ink-950); font: 500 .65rem/1 'IBM Plex Mono',monospace; }
  .hotspot b { position: absolute; left: 50px; top: 10px; font-size: .72rem; font-weight: 500; white-space: nowrap; color: var(--white-64); }
  .hotspot[aria-pressed='true'] span { border-color: var(--signal); background: var(--signal); color: var(--ink-950); }
  .hotspot-1 { left: 12%; top: 18%; } .hotspot-2 { right: 23%; top: 15%; } .hotspot-3 { left: 20%; bottom: 16%; } .hotspot-4 { right: 17%; bottom: 20%; }
  .node-output { grid-column: 13 / -1; }
  .node-output > .mono { color: var(--acoustic); }
  .node-output h3 { margin: 20px 0; font-family:'Geologica',sans-serif;font-size:clamp(2rem,3.3vw,4rem);letter-spacing:-.04em; }
  .node-output p,.node-output li { color: var(--white-64); }
  .node-output ul { list-style:none;padding:0;margin:35px 0; }
  .node-output li { padding:12px 0;border-bottom:1px solid var(--white-16);font-size:.82rem; }
  .node-output li::before { content:'✓';margin-right:10px;color:var(--acoustic); }
  .faq { padding: clamp(110px,13vw,220px) 0; }
  .faq-grid { display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:start; }
  .faq-intro { grid-column:1/7;position:sticky;top:130px; }
  .faq-intro > .mono { color:var(--acoustic-dark); }
  .faq-intro h2 { margin:24px 0;font-size:clamp(3.3rem,6.5vw,7.2rem); }
  .faq-intro > p:last-child { max-width:43ch;color:rgba(7,9,8,.62); }
  .faq-list { grid-column:8/-1; }
  details { border-top:1px solid rgba(7,9,8,.18); }
  details:last-child { border-bottom:1px solid rgba(7,9,8,.18); }
  summary { display:grid;grid-template-columns:54px 1fr;gap:14px;align-items:baseline;padding:24px 0;cursor:pointer;list-style:none; }
  summary::-webkit-details-marker { display:none; }
  summary strong { font-family:'Geologica',sans-serif;font-size:clamp(1.15rem,1.7vw,1.8rem);line-height:1.2;letter-spacing:-.025em; }
  details[open] summary strong { color:var(--acoustic-dark); }
  details > p { margin:0 0 26px 68px;max-width:58ch;color:rgba(7,9,8,.66); }
  @media(max-width:900px){.quality-grid,.faq-grid{grid-template-columns:repeat(8,1fr)}.node-visual{grid-column:1/7}.node-output{grid-column:7/-1}.faq-intro{grid-column:1/4}.faq-list{grid-column:4/-1}}
  @media(max-width:767px){.quality-grid{display:flex;min-height:0;flex-direction:column;align-items:stretch}.node-visual{min-height:520px}.hotspot b{display:none}.node-output{margin-top:30px}.faq-grid{display:block}.faq-intro{position:static}.faq-list{margin-top:60px}details>p{margin-left:0}}
</style>
