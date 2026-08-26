<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  const stages = [
    { title: 'Каркас', image: 'a-modul-factory-v2-frame', alt: 'Визуализация сборки стального каркаса модуля в рабочем производственном цехе', detail: 'Геометрия модуля и несущая схема переходят из документации в производственный контроль.' },
    { title: 'Тепловой контур', image: 'a-modul-factory-v2-envelope', alt: 'Визуализация устройства ограждающего контура модуля в производственном цехе', detail: 'Ограждение, кровля, окна и двери собираются в контролируемых условиях до выхода на площадку.' },
    { title: 'Инженерия', image: 'a-modul-factory-v2-engineering', alt: 'Визуализация монтажа инженерных систем внутри открытого модуля', detail: 'Кабельные трассы, щиты, трубопроводы и вентиляция монтируются в составе проектного решения.' },
    { title: 'Отделка', image: 'a-modul-factory-v2-finishing', alt: 'Визуализация внутренней отделки и комплектации модульного помещения', detail: 'Отделка, двери и предусмотренная комплектация доводят модуль до высокой заводской готовности.' },
    { title: 'Контроль', image: 'a-modul-factory-v2-control', alt: 'Визуализация контроля почти готового модуля в рабочей инспекционной зоне', detail: 'Поэтапный контроль связывает документацию, выполненные работы и готовность партии.' },
    { title: 'Отгрузка', image: 'a-modul-factory-v2-shipment', alt: 'Визуализация погрузки готового модуля на платформу у зимних ворот цеха', detail: 'Партии комплектуются под подтверждённую схему доставки и порядок монтажа.' }
  ];
  let active = 0;
  let tabButtons: HTMLButtonElement[] = [];
  let interactionStarted = false;

  function activate(index: number, moveFocus = false) {
    if (!interactionStarted) {
      interactionStarted = true;
      trackEvent('production_sequence_start');
    }
    active = index;
    if (index === stages.length - 1) trackEvent('production_sequence_complete', { stage: stages.length });
    if (moveFocus) queueMicrotask(() => tabButtons[index]?.focus());
  }

  function selectTab(index: number) {
    activate(index, true);
  }

  function handleTabKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stages.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + stages.length) % stages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stages.length - 1;
    else return;
    event.preventDefault();
    selectTab(next);
  }
</script>

<section class="factory chapter" id="factory" aria-labelledby="factory-title">
  <div class="factory__visual" data-active-stage={active}>
    {#key active}
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${stages[active].image}-mobile.avif`} />
        <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${stages[active].image}-mobile.webp`} />
        <source type="image/avif" srcset={`/generated/${stages[active].image}-desktop.avif`} />
        <img src={`/generated/${stages[active].image}-desktop.webp`} width="1600" height="900" alt={stages[active].alt} loading="lazy" />
      </picture>
    {/key}
    <span class="visualization-label">Визуализация производственного процесса</span>
    <div class="factory__facts" role="list" aria-label="Производственные показатели">
      <p role="listitem"><strong>25 000 м²</strong><span>производственных площадок</span></p>
      <p role="listitem"><strong>до 750</strong><span>модулей в месяц</span></p>
      <p role="listitem"><strong>до 25</strong><span>модулей в смену</span></p>
    </div>
  </div>

  <div class="factory__copy">
    <p class="eyebrow">Производство / реалистичный цикл</p>
    <h2 id="factory-title">Ключевые операции — в одном производственном контуре.</h2>
    <div class="factory__stages" role="tablist" aria-label="Этапы производства">
      {#each stages as stage, index}
        <button bind:this={tabButtons[index]} id={`factory-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="factory-panel" tabindex={active === index ? 0 : -1} class:active={active === index} onclick={() => activate(index)} onkeydown={(event) => handleTabKey(event, index)}><span>{String(index + 1).padStart(2, '0')}</span>{stage.title}</button>
      {/each}
    </div>
    <div class="factory__detail" id="factory-panel" role="tabpanel" tabindex="0" aria-labelledby={`factory-tab-${active}`} aria-live="polite">
      <span class="mono-label">{stages[active].title}</span>
      <p>{stages[active].detail}</p>
    </div>
    <p class="factory__note">Высокая заводская готовность сокращает объём операций на площадке. Показатели отражают опубликованные возможности производства, а не гарантированный темп конкретного проекта.</p>
  </div>
</section>
