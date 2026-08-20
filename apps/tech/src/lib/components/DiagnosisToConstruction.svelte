<script lang="ts">
  import { onMount } from 'svelte';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';
  import TechWallAssemblyV2 from './TechWallAssemblyV2.svelte';
  import TechCeilingAssemblyV2 from './TechCeilingAssemblyV2.svelte';
  import TechFloorAssemblyV2 from './TechFloorAssemblyV2.svelte';

  const contexts = [
    {
      key: 'wall',
      code: '01',
      label: 'Стена',
      component: TechWallAssemblyV2,
      source: 'Боковой путь / розетка / примыкания',
      conclusion: 'Система стены работает только вместе с периметром, розетками и двумя фланговыми узлами.',
      principles: ['масса', 'развязка', 'герметизация периметра', 'контроль розеток']
    },
    {
      key: 'ceiling',
      code: '02',
      label: 'Потолок',
      component: TechCeilingAssemblyV2,
      source: 'Перекрытие / подвес / верхний узел',
      conclusion: 'Потолочная система оценивается вместе с соединением подвеса и энергией, уходящей в стены.',
      principles: ['несущая плита', 'соединение подвеса', 'развязанный слой', 'верхнее примыкание']
    },
    {
      key: 'floor',
      code: '03',
      label: 'Пол',
      component: TechFloorAssemblyV2,
      source: 'Плита / упругий слой / периметр',
      conclusion: 'Пол держит контур, пока нагрузочный слой нигде не создаёт жёсткий мостик к стене или проходке.',
      principles: ['нагрузочный слой', 'упругое разделение', 'несущая плита', 'непрерывный периметр']
    }
  ];

  const sequence = [
    { code: '01', label: 'Собрано', note: 'Исходная конструкция' },
    { code: '02', label: 'Слои', note: 'Разделяем функции' },
    { code: '03', label: 'Мостик', note: 'Находим жёсткую связь' },
    { code: '04', label: 'Обход', note: 'Показываем путь энергии' },
    { code: '05', label: 'Контроль', note: 'Меняем критический узел' },
    { code: '06', label: 'Граница', note: 'Энергия останавливается' },
    { code: '07', label: 'Скрытые работы', note: 'Фиксируем до закрытия' },
    { code: '08', label: 'Проверка', note: 'Финальное состояние' }
  ];

  const method = [
    ['Зафиксировать симптом', 'Записываем характер, время и воспринимаемое направление.'],
    ['Сравнить пути', 'Не принимаем слышимую поверхность за единственную.'],
    ['Осмотреть объект', 'Проверяем основания, проходки и конструктивные связи.'],
    ['Спроектировать узлы', 'Связываем слои с периметром и критическими соединениями.'],
    ['Рассчитать объём', 'Смета появляется после выбранного контура и ограничений.'],
    ['Смонтировать и проверить', 'Фиксируем скрытые работы и сверяем результат.']
  ];

  let contextIndex = 0;
  let contextTabs: HTMLButtonElement[] = [];
  let step = 0;
  let playing = false;
  let reduced = false;
  let timers: number[] = [];
  $: active = contexts[contextIndex];

  function clearSequence() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
    playing = false;
  }

  function playSequence(index = contextIndex, focus = false) {
    clearSequence();
    contextIndex = (index + contexts.length) % contexts.length;
    if (focus) contextTabs[contextIndex]?.focus();
    if (reduced) {
      step = 7;
      return;
    }
    step = 0;
    playing = true;
    for (let next = 1; next < sequence.length; next += 1) {
      timers.push(window.setTimeout(() => {
        step = next;
        if (next === sequence.length - 1) {
          playing = false;
          track('construction_sequence_complete', { context: contexts[contextIndex].key });
        }
      }, next * 260));
    }
  }

  function onContextKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); playSequence(index + 1, true); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); playSequence(index - 1, true); }
    if (event.key === 'Home') { event.preventDefault(); playSequence(0, true); }
    if (event.key === 'End') { event.preventDefault(); playSequence(contexts.length - 1, true); }
  }

  function showStep(next: number) {
    clearSequence();
    step = Math.max(0, Math.min(sequence.length - 1, next));
  }

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = $diagnosticContext.path;
    const preferred = path === 'ceiling' ? 1 : path === 'floor' ? 2 : 0;
    playSequence(preferred);
    return clearSequence;
  });
</script>

<section class="construction-decision" id="diagnosis-construction" aria-labelledby="construction-title" data-context={active.key} data-step={step}>
  <div class="shell chapter-head">
    <p class="mono">МЕТОД / 03</p>
    <h2 class="display" id="construction-title">Смета появляется после диагноза.</h2>
    <p>Жалоба превращается в решение только после сравнения путей, проверки основания и проектирования критических узлов.</p>
  </div>

  <ol class="method-strip shell" aria-label="Метод от симптома до проверки">
    {#each method as item, index}
      <li><span class="mono">0{index + 1}</span><strong>{item[0]}</strong><p>{item[1]}</p></li>
    {/each}
  </ol>

  <div class="decision-shell shell">
    <div class="context-tabs" role="tablist" aria-label="Выберите конструктивный контекст">
      {#each contexts as item, index}
        <button
          bind:this={contextTabs[index]}
          id={`construction-tab-${item.key}`}
          type="button"
          role="tab"
          aria-selected={contextIndex === index}
          aria-controls="construction-panel"
          tabindex={contextIndex === index ? 0 : -1}
          class:active={contextIndex === index}
          on:click={() => playSequence(index)}
          on:keydown={(event) => onContextKeydown(event, index)}
        ><span class="mono">{item.code}</span><strong>{item.label}</strong></button>
      {/each}
    </div>

    <div class="engineering-object" id="construction-panel" role="tabpanel" tabindex="0" aria-labelledby={`construction-tab-${active.key}`}>
      <div class="object-head">
        <div><span class="mono">ИСТОЧНИК В РЕШЕНИИ</span><strong>{active.source}</strong></div>
        <span class:running={playing} class="sequence-status mono">{playing ? `ПОСЛЕДОВАТЕЛЬНОСТЬ ${step + 1} / 8` : 'СОСТОЯНИЕ ЗАФИКСИРОВАНО'}</span>
      </div>
      <div class="model-frame">
        <svelte:component this={active.component} {step} />
      </div>
      <div class="object-foot">
        <p class="mono">{sequence[step].code} / {sequence[step].label}</p>
        <strong>{sequence[step].note}</strong>
      </div>
    </div>

    <ol class="datum-rail" aria-label="Состояния конструктивной проверки">
      {#each sequence as item, index}
        <li class:active={step === index} class:complete={step > index}>
          <button type="button" aria-current={step === index ? 'step' : undefined} on:click={() => showStep(index)}>
            <span class="mono">{item.code}</span><strong>{item.label}</strong><small>{item.note}</small>
          </button>
        </li>
      {/each}
    </ol>

    <div class="mobile-model-controls" role="group" aria-label="Ключевые состояния модели">
      <div class="assembled-toggle" role="group" aria-label="Собранная или разнесённая модель">
        <button class:active={step === 0} aria-pressed={step === 0} type="button" on:click={() => showStep(0)}>Собрано</button>
        <button class:active={step === 1} aria-pressed={step === 1} type="button" on:click={() => showStep(1)}>Разнесено</button>
      </div>
      <button class:active={step >= 2 && step < 5} aria-pressed={step >= 2 && step < 5} type="button" on:click={() => showStep(3)}>Критический мостик</button>
      <button class:active={step >= 5} aria-pressed={step >= 5} type="button" on:click={() => showStep(7)}>Контролируемый узел</button>
    </div>

    <aside class="decision-output" aria-live="polite">
      <p class="mono">{active.label.toUpperCase()} / КОНТРОЛЬ УЗЛА</p>
      <h3>{active.conclusion}</h3>
      <ul>{#each active.principles as item}<li>{item}</li>{/each}</ul>
      <p class="verification"><span>После монтажа</span> скрытые работы документируются, а результат проверяется в согласованном контексте.</p>
      <a class="button" href="/diagnostika-shuma/">Разобрать узел на объекте</a>
    </aside>
  </div>
</section>

<style>
  .construction-decision { padding: clamp(112px, 12vw, 210px) 0 clamp(128px, 14vw, 230px); color: var(--tech-v2-ink); background: var(--tech-v2-paper); }
  .chapter-head { display: grid; grid-template-columns: 2fr 8fr 4fr; gap: var(--tech-v2-grid-gap); align-items: end; }
  .chapter-head > .mono { color: #507e75; align-self: start; }
  .chapter-head h2 { grid-column: 2; margin: 0; max-width: 850px; font-size: clamp(3.2rem, 6vw, 7.2rem); line-height: .9; }
  .chapter-head > p:last-child { grid-column: 3; margin: 0 0 8px; color: rgba(13,16,14,.64); }

  .method-strip { display: grid; grid-template-columns: 1.1fr 1fr 1.2fr 1.4fr 1.15fr 1.55fr; margin-top: clamp(68px, 7vw, 110px); padding: 0; list-style: none; border-top: 1px solid rgba(13,16,14,.2); }
  .method-strip li { min-height: 180px; padding: 18px 18px 18px 0; border-right: 1px solid rgba(13,16,14,.16); }
  .method-strip li + li { padding-left: 18px; }
  .method-strip .mono { color: #ff654f; }
  .method-strip strong { display: block; margin-top: 28px; font-size: .82rem; }
  .method-strip p { margin: 10px 0 0; color: rgba(13,16,14,.58); font-size: .72rem; line-height: 1.45; }

  .decision-shell { margin-top: clamp(72px, 9vw, 140px); display: grid; grid-template-columns: 1.6fr 8.4fr 2.2fr; gap: clamp(18px, 2vw, 34px); align-items: start; }
  .context-tabs { display: flex; flex-direction: column; }
  .context-tabs button { min-height: 72px; display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: center; border: 0; border-bottom: 1px solid rgba(13,16,14,.18); background: transparent; color: rgba(13,16,14,.48); text-align: left; cursor: pointer; }
  .context-tabs button.active { color: var(--tech-v2-ink); border-color: #ff654f; }
  .context-tabs button.active .mono { color: #ff654f; }
  .context-tabs button:focus-visible,
  .datum-rail button:focus-visible,
  .mobile-model-controls button:focus-visible { outline: 2px solid #ff654f; outline-offset: 3px; }

  .engineering-object { min-width: 0; outline: none; }
  .object-head { min-height: 58px; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; border-top: 1px solid rgba(13,16,14,.2); padding-top: 12px; }
  .object-head > div { display: grid; gap: 5px; }
  .object-head .mono { color: #507e75; font-size: .58rem; }
  .object-head strong { font-size: .78rem; }
  .sequence-status { color: rgba(13,16,14,.48); font-size: .58rem; }
  .sequence-status.running { color: #ff654f; }
  .model-frame { height: clamp(470px, 46vw, 680px); overflow: hidden; border-bottom: 1px solid rgba(13,16,14,.2); background: radial-gradient(circle at 50% 50%, rgba(255,253,248,.82), rgba(232,225,212,.3)); }
  .object-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
  .object-foot p { margin: 0; color: #ff654f; }
  .object-foot strong { font-size: .75rem; }

  .datum-rail { margin: 58px 0 0; padding: 0; list-style: none; }
  .datum-rail li { position: relative; border-left: 1px solid rgba(13,16,14,.2); }
  .datum-rail li::before { content: ''; position: absolute; left: -4px; top: 20px; width: 7px; height: 7px; border-radius: 50%; background: var(--tech-v2-paper); border: 1px solid rgba(13,16,14,.28); }
  .datum-rail li.active::before { background: #ff654f; border-color: #ff654f; }
  .datum-rail li.complete::before { background: #507e75; border-color: #507e75; }
  .datum-rail button { width: 100%; min-height: 58px; display: grid; grid-template-columns: 28px 1fr; gap: 2px 8px; padding: 8px 0 8px 16px; border: 0; background: transparent; color: rgba(13,16,14,.46); text-align: left; cursor: pointer; }
  .datum-rail button strong { font-size: .7rem; }
  .datum-rail button small { grid-column: 2; font-size: .58rem; }
  .datum-rail li.active button { color: var(--tech-v2-ink); }
  .datum-rail li.active .mono { color: #ff654f; }
  .datum-rail li.complete button { color: #507e75; }

  .mobile-model-controls { display: none; }
  .decision-output { grid-column: 2 / 3; margin-top: 20px; padding-top: 30px; display: grid; grid-template-columns: 2fr 4fr 2fr; gap: 20px; border-top: 1px solid rgba(13,16,14,.2); }
  .decision-output > .mono { color: #507e75; }
  .decision-output h3 { margin: 0; font-family: 'Geologica', sans-serif; font-size: clamp(1.45rem, 2.1vw, 2.75rem); line-height: 1.05; letter-spacing: -.04em; }
  .decision-output ul { margin: 0; padding: 0; list-style: none; }
  .decision-output li { padding: 6px 0; border-bottom: 1px solid rgba(13,16,14,.14); color: rgba(13,16,14,.64); font-size: .72rem; }
  .decision-output li::before { content: '↳'; margin-right: 8px; color: #ff654f; }
  .verification { grid-column: 2; margin: 8px 0 0; color: rgba(13,16,14,.58); font-size: .72rem; }
  .verification span { display: block; color: #507e75; font: 500 .58rem/1.4 'IBM Plex Mono', monospace; text-transform: uppercase; }
  .decision-output .button { grid-column: 3; grid-row: 1 / 3; align-self: end; background: #ff654f; color: var(--tech-v2-ink); font-size: .72rem; }

  @media (max-width: 1050px) {
    .chapter-head { grid-template-columns: 2fr 6fr; }
    .chapter-head h2 { grid-column: 1 / -1; }
    .chapter-head > p:last-child { grid-column: 2; }
    .method-strip { grid-template-columns: repeat(3, 1fr); }
    .method-strip li { min-height: 150px; border-bottom: 1px solid rgba(13,16,14,.16); }
    .decision-shell { grid-template-columns: 1.5fr 6.5fr; }
    .datum-rail { grid-column: 1; grid-row: 2; margin-top: 0; }
    .decision-output { grid-column: 2; }
  }

  @media (max-width: 767px) {
    .construction-decision { padding: 92px 0 116px; }
    .chapter-head { display: block; }
    .chapter-head h2 { margin-top: 16px; font-size: clamp(2.55rem, 13vw, 4rem); }
    .chapter-head > p:last-child { margin-top: 18px; }
    .method-strip { display: block; margin-top: 54px; }
    .method-strip li { min-height: 0; display: grid; grid-template-columns: 34px 1fr; padding: 16px 0; border-right: 0; }
    .method-strip li + li { padding-left: 0; }
    .method-strip strong { margin: 0; }
    .method-strip p { grid-column: 2; }
    .decision-shell { display: flex; flex-direction: column; margin-top: 70px; }
    .context-tabs { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); }
    .context-tabs button { min-height: 54px; grid-template-columns: 24px 1fr; padding: 0 8px; border-right: 1px solid rgba(13,16,14,.16); }
    .engineering-object { width: 100%; }
    .object-head { min-height: 72px; }
    .sequence-status { max-width: 42%; text-align: right; }
    .model-frame { height: min(104vw, 440px); }
    .datum-rail { display: none; }
    .mobile-model-controls { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .assembled-toggle { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .mobile-model-controls button { min-height: 48px; padding: 8px; border: 1px solid rgba(13,16,14,.2); background: transparent; color: rgba(13,16,14,.66); }
    .mobile-model-controls button.active { color: var(--tech-v2-ink); border-color: #ff654f; }
    .decision-output { width: 100%; display: block; margin-top: 20px; }
    .decision-output h3 { margin-top: 14px; font-size: 1.8rem; }
    .decision-output ul { margin-top: 22px; }
    .verification { margin-top: 20px; }
    .decision-output .button { width: 100%; margin-top: 22px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sequence-status.running { color: rgba(13,16,14,.48); }
  }
</style>
