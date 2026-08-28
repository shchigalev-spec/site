<script lang="ts">
  const risks = [
    { title: 'Исходные данные', risk: 'Неполный состав объекта меняет планировку и границы ответственности.', control: 'Фиксируем функции, численность, режим эксплуатации и площадку до расчёта.' },
    { title: 'Геология и основание', risk: 'Непроверенное основание переносит проблему на монтаж.', control: 'Связываем решения по основанию с исходными данными площадки и проектом.' },
    { title: 'Климат', risk: 'Температура, ветер и снеговая нагрузка влияют на ограждения и инженерию.', control: 'Учитываем региональные условия на этапе проектирования, без универсальной спецификации.' },
    { title: 'Сейсмика', risk: 'Нельзя подменять расчёт общей фразой о прочности.', control: 'Сейсмические условия конкретной площадки входят в проектные исходные данные.' },
    { title: 'Инженерия', risk: 'Разрыв между зданием и сетями тормозит ввод.', control: 'Сводим инженерные разделы, комплектацию и точки подключения в одном контуре.' },
    { title: 'Логистика', risk: 'Маршрут определяет ограничения по упаковке, перегрузке и графику.', control: 'Сначала проверяем сочетание видов транспорта, потом обсуждаем срок и стоимость.' },
    { title: 'Площадка', risk: 'Неготовая территория срывает последовательность поставки и монтажа.', control: 'Синхронизируем готовность площадки, основания, подъездов и разгрузки.' },
    { title: 'Монтаж', risk: 'Модули на площадке ещё не означают готовый объект.', control: 'Планируем стыковку групп, переходы, инженерию и завершение работ.' },
    { title: 'Запуск', risk: 'Без общего графика отдельные подрядчики передают риски друг другу.', control: 'Один проектный контур связывает производство, логистику, монтаж и пусконаладку.' }
  ];

  let active = 0;
  let tabButtons: HTMLButtonElement[] = [];

  function selectTab(index: number) {
    active = index;
    queueMicrotask(() => tabButtons[index]?.focus());
  }

  function handleTabKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % risks.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + risks.length) % risks.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = risks.length - 1;
    else return;
    event.preventDefault();
    selectTab(next);
  }
</script>

<section class="risk chapter" id="risk" aria-labelledby="risk-title">
  <div class="chapter__heading chapter__heading--wide">
    <p class="eyebrow">Управление проектом / 09 связей</p>
    <h2 id="risk-title">Главный риск — не изготовить модуль. Главный риск — запустить весь объект.</h2>
  </div>

  <div class="risk__board">
    <div class="risk__chain" role="tablist" aria-label="Цепочка проектных рисков">
      {#each risks as item, index}
        <button bind:this={tabButtons[index]} id={`risk-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="risk-panel" tabindex={active === index ? 0 : -1} class:active={active === index} onclick={() => active = index} onkeydown={(event) => handleTabKey(event, index)}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {item.title}
        </button>
      {/each}
    </div>

    <div class="risk__detail" id="risk-panel" role="tabpanel" tabindex="0" aria-labelledby={`risk-tab-${active}`} aria-live="polite">
      <p class="mono-label">{String(active + 1).padStart(2, '0')} / {risks[active].title}</p>
      <div>
        <span>Риск</span>
        <h3>{risks[active].risk}</h3>
      </div>
      <div>
        <span>Контроль</span>
        <p>{risks[active].control}</p>
      </div>
      <a class="button button--light" href="#project-brief">Разобрать риски проекта</a>
    </div>
  </div>

  <p class="risk__conclusion">Один проектный контур. Один график. Один ответственный за результат.</p>
</section>
