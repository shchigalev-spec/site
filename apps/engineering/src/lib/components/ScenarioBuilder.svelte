<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { noises } from '$lib/content';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  type ScenarioState = {
    noise: string;
    direction: string;
    stage: string;
    room: string;
    space: string;
    comment: string;
    step: number;
    completed: boolean;
  };

  const directions = ['сверху', 'сбоку', 'снизу', 'с улицы', 'не понимаю'];
  const stages = [
    ['new', 'новостройка до ремонта'],
    ['progress', 'ремонт идёт'],
    ['finished', 'готовая квартира']
  ];
  const rooms = ['спальня', 'детская', 'гостиная', 'кабинет', 'несколько комнат'];
  const spaces = [
    ['minimum', 'Важно сохранить максимум пространства'],
    ['balanced', 'Готов обсуждать баланс'],
    ['open', 'Масштаб вмешательства можно обсуждать']
  ];
  const questions = ['Что слышно?', 'С какой стороны?', 'На каком этапе квартира?', 'Где слышно?', 'Что важнее при вмешательстве?'];
  const miniRoutes = ['M18 20H108L150 42H242', 'M18 42H118L158 18H242', 'M18 62H92L142 34H242'];

  let noise = '';
  let direction = '';
  let stage = '';
  let room = '';
  let space = '';
  let comment = '';
  let step = 0;
  let completed = false;
  let started = false;
  let mounted = false;
  let stepperRoot: HTMLElement;

  $: selectedNoise = noises.find((item) => item.id === noise) ?? noises[0];
  $: routeIndex = direction === 'сбоку' ? 1 : direction === 'снизу' || direction === 'не понимаю' ? 2 : 0;
  $: currentRoute = selectedNoise.candidateRoutes[routeIndex];
  $: stageLabel = stages.find(([value]) => value === stage)?.[1] ?? 'не выбран';
  $: spaceLabel = spaces.find(([value]) => value === space)?.[1] ?? 'не выбран';
  $: interventionScale = stage === 'finished'
    ? 'локальная или поэтапная — после проверки границ вмешательства'
    : space === 'minimum'
      ? 'точечная проверка с приоритетом сохранения пространства'
      : 'контур определяется после обследования связанных зон';
  $: progress = completed ? 1 : (step + 1) / questions.length;
  $: hypothesisTitle = noise ? `${selectedNoise.short}${direction ? ` · ${currentRoute.label}` : ''}` : 'Выберите симптом';
  $: hypothesisDetail = [
    selectedNoise.noiseType,
    stage ? stageLabel : 'этап пока неизвестен',
    room ? `комната: ${room}` : 'комната не выбрана',
    space ? spaceLabel.toLowerCase() : 'приоритет вмешательства не выбран'
  ].join(' · ');
  $: href = buildDiagnosisHref($page.url, 'scenario_v2', {
    noise: selectedNoise.title,
    noiseId: noise,
    direction,
    route: currentRoute.label,
    stage,
    stageContext: stageLabel,
    room,
    space: spaceLabel,
    context: hypothesisDetail,
    comment
  });
  $: scenarioState = { noise, direction, stage, room, space, comment, step, completed };
  $: if (mounted) persist(scenarioState);

  function persist(state: ScenarioState) {
    sessionStorage.setItem('engineering:scenario-v2', JSON.stringify(state));
  }

  function begin() {
    if (started) return;
    started = true;
    track('scenario_started', { chapter: 'scenario-v2' });
  }

  function focusCurrentState(scrollOnMobile: boolean) {
    tick().then(() => {
      const focusTarget = stepperRoot?.querySelector(completed ? '.scenario-result h3' : 'fieldset legend') as HTMLElement | null;
      focusTarget?.focus({ preventScroll: true });
      if (scrollOnMobile && matchMedia('(max-width: 850px)').matches) {
        stepperRoot?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    });
  }

  function choose(value: string) {
    begin();
    if (step === 0) {
      noise = value;
      track('noise_selected', { noise: value, source: 'scenario-v2' });
    } else if (step === 1) {
      direction = value;
      track('path_selected', { direction: value, source: 'scenario-v2' });
    } else if (step === 2) {
      stage = value;
      track('renovation_stage_selected', { stage: value, source: 'scenario-v2' });
    } else if (step === 3) {
      room = value;
    } else {
      space = value;
    }

    if (step < questions.length - 1) {
      step += 1;
    } else {
      completed = true;
      track('scenario_completed', { noise, direction, stage, room, space: value });
    }
    focusCurrentState(true);
  }

  function back() {
    if (completed) completed = false;
    else if (step > 0) step -= 1;
    focusCurrentState(false);
  }

  function edit(index: number) {
    completed = false;
    step = index;
    focusCurrentState(false);
  }

  onMount(() => {
    const stored = sessionStorage.getItem('engineering:scenario-v2');
    if (stored) {
      try {
        const state = JSON.parse(stored) as Partial<ScenarioState>;
        noise = state.noise ?? noise;
        direction = state.direction ?? direction;
        stage = state.stage ?? stage;
        room = state.room ?? room;
        space = state.space ?? space;
        comment = state.comment ?? comment;
        step = Math.min(Math.max(state.step ?? step, 0), questions.length - 1);
        completed = state.completed ?? completed;
      } catch {
        sessionStorage.removeItem('engineering:scenario-v2');
      }
    } else {
      const inheritedNoise = sessionStorage.getItem('engineering:selectedNoise');
      const inheritedStage = sessionStorage.getItem('engineering:selectedStage');
      if (inheritedNoise && noises.some((item) => item.id === inheritedNoise)) noise = inheritedNoise;
      if (inheritedStage && stages.some(([value]) => value === inheritedStage)) stage = inheritedStage;
    }
    mounted = true;
  });
</script>

<section class="scenario-v2" id="brief" data-chapter="06 · Сценарий">
  <header class="scenario-intro">
    <div class="section-label">06 / Предварительный сценарий</div>
    <h2>Пять ответов.<br />Ни одной ложной цифры.</h2>
    <p>Это не калькулятор цены. Сценарий показывает вероятные маршруты, зоны проверки и неизвестные, которые нужно снять на объекте.</p>
  </header>

  <div class="scenario-workbench">
    <div class="scenario-stepper" bind:this={stepperRoot}>
      <div class="scenario-progress" role="progressbar" aria-label="Прогресс предварительного сценария" aria-valuemin="1" aria-valuemax="5" aria-valuenow={completed ? 5 : step + 1} aria-valuetext={completed ? 'Результат готов' : `Шаг ${step + 1} из 5`}>
        <span>{completed ? 'Результат' : `0${step + 1} / 05`}</span>
        <i><b style={`transform:scaleX(${progress})`}></b></i>
      </div>

      <div class={`mobile-live-route stage-${stage || 'unset'} scope-${space || 'unset'}`} aria-live="polite">
        <svg viewBox="0 0 260 82" role="img" aria-label={`Текущая гипотеза маршрута: ${hypothesisTitle}`}>
          <rect x="8" y="8" width="244" height="66" />
          <path d={miniRoutes[routeIndex]} />
          <circle cx="18" cy={routeIndex === 0 ? 20 : routeIndex === 1 ? 42 : 62} r="6" />
          <circle cx="242" cy={routeIndex === 0 ? 42 : routeIndex === 1 ? 18 : 34} r="6" />
        </svg>
        <div><span>Живая гипотеза</span><strong>{hypothesisTitle}</strong><small>{hypothesisDetail}</small></div>
      </div>

      {#if !completed}
        <fieldset>
          <legend tabindex="-1">{questions[step]}</legend>
          <p class="question-note">Выберите один вариант. Ответ можно изменить на следующем шаге.</p>
          <div class:noise-options={step === 0} class="answer-grid">
            {#if step === 0}
              {#each noises as item}<button type="button" aria-pressed={noise === item.id} on:click={() => choose(item.id)}><span>{item.share}</span><strong>{item.short}</strong></button>{/each}
            {:else if step === 1}
              {#each directions as item}<button type="button" aria-pressed={direction === item} on:click={() => choose(item)}><strong>{item}</strong></button>{/each}
            {:else if step === 2}
              {#each stages as item}<button type="button" aria-pressed={stage === item[0]} on:click={() => choose(item[0])}><strong>{item[1]}</strong></button>{/each}
            {:else if step === 3}
              {#each rooms as item}<button type="button" aria-pressed={room === item} on:click={() => choose(item)}><strong>{item}</strong></button>{/each}
            {:else}
              {#each spaces as item}<button type="button" aria-pressed={space === item[0]} on:click={() => choose(item[0])}><strong>{item[1]}</strong></button>{/each}
            {/if}
          </div>
        </fieldset>
        <div class="step-controls">
          <button type="button" class="back-button" on:click={back} disabled={step === 0}>← Назад</button>
          <span>Следующий вопрос откроется после выбора</span>
        </div>
      {:else}
        <div class="scenario-result">
          <span>Предварительный сценарий · не проект и не смета</span>
          <h3 tabindex="-1">{selectedNoise.noiseType}</h3>
          <dl>
            <div><dt>Вероятные маршруты</dt><dd>{selectedNoise.candidateRoutes.map((route) => route.label).join(', ')}</dd></div>
            <div><dt>Зоны проверки</dt><dd>{selectedNoise.likelyZones.join(', ')}</dd></div>
            <div><dt>Масштаб вмешательства</dt><dd>{interventionScale}</dd></div>
            <div><dt>Важные неизвестные</dt><dd>фактический состав конструкций, жёсткие связи, обходные пути и условия измерения</dd></div>
          </dl>
          <label for="scenario-comment">Комментарий для инженера <small>необязательно</small><textarea id="scenario-comment" bind:value={comment} rows="3" placeholder="Когда слышно, что уже пробовали, что нельзя демонтировать"></textarea></label>
          <div class="result-actions">
            <button type="button" class="back-button" on:click={back}>← Изменить ответ</button>
            <a class="primary-button" href={href} on:click={() => track('diagnostic_start', { source: 'scenario-v2', has_context: true })}>Передать контекст в диагностику</a>
          </div>
        </div>
      {/if}
    </div>

    <div class={`scenario-map stage-${stage || 'unset'} scope-${space || 'unset'}`} aria-live="polite">
      <div class="map-heading"><span>Рабочая гипотеза</span><strong>{hypothesisTitle}</strong></div>
      <svg viewBox="0 0 840 600" role="img" aria-label={`Предварительная схема маршрута: ${selectedNoise.title}`}>
        <path class="building" d="M90 95H760V515H90ZM90 300H760M330 95V515M590 95V515" />
        <rect class="room-focus" x="330" y="300" width="260" height="215" />
        {#each selectedNoise.candidateRoutes as route, index}
          <path class:active-route={direction !== '' && index === routeIndex} class="candidate" d={route.path} />
        {/each}
        <circle class="source" cx={selectedNoise.sourcePoint[0]} cy={selectedNoise.sourcePoint[1]} r="16" />
        <circle class="heard" cx={selectedNoise.heardPoint[0]} cy={selectedNoise.heardPoint[1]} r="16" />
        <text x={selectedNoise.sourcePoint[0]} y={selectedNoise.sourcePoint[1] - 28} text-anchor="middle">источник?</text>
        <text x={selectedNoise.heardPoint[0]} y={selectedNoise.heardPoint[1] + 42} text-anchor="middle">слышно: {room || 'здесь'}</text>
      </svg>
      <div class="context-list" role="group" aria-label="Ответы предварительного сценария">
        <button type="button" on:click={() => edit(0)}><span class="term">Симптом</span><span class="definition">{noise ? selectedNoise.short : 'не выбран'}</span></button>
        <button type="button" on:click={() => edit(1)}><span class="term">Направление</span><span class="definition">{direction || 'не выбрано'}</span></button>
        <button type="button" on:click={() => edit(2)}><span class="term">Этап</span><span class="definition">{stageLabel}</span></button>
        <button type="button" on:click={() => edit(3)}><span class="term">Комната</span><span class="definition">{room || 'не выбрана'}</span></button>
        <button type="button" on:click={() => edit(4)}><span class="term">Приоритет</span><span class="definition">{spaceLabel}</span></button>
      </div>
      <div class="live-summary">
        <span>Текущая инженерная версия</span>
        <strong>{selectedNoise.noiseType}</strong>
        <p>{direction ? `Проверяем путь «${currentRoute.label}».` : 'Сначала уточняем предполагаемое направление.'} {stage ? `Этап: ${stageLabel}.` : 'Этап ещё не выбран.'} {room ? `Зона симптома: ${room}.` : 'Комната ещё неизвестна.'} {space ? `Приоритет: ${spaceLabel.toLowerCase()}.` : 'Масштаб вмешательства ещё обсуждается.'}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .scenario-v2 { padding: clamp(7rem, 11vw, 11rem) var(--margin); background: #f2eee6; color: #242824; }
  .scenario-intro { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--gutter); align-items: end; }
  .scenario-intro .section-label { grid-column: 1 / 4; color: #48635f; font-size: 0.75rem; }
  .scenario-intro h2 { grid-column: 1 / 9; max-width: 12ch; margin: 1.5rem 0 0; }
  .scenario-intro > p { grid-column: 9 / 13; max-width: 40ch; color: #4e5650; }
  .scenario-workbench { display: grid; grid-template-columns: minmax(0, 7fr) minmax(20rem, 5fr); gap: clamp(2rem, 6vw, 7rem); align-items: start; margin-top: 6rem; }
  .scenario-stepper { min-height: 45rem; }
  .mobile-live-route { display: none; }
  .scenario-progress { display: grid; grid-template-columns: 7rem 1fr; gap: 1rem; align-items: center; }
  .scenario-progress span { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .scenario-progress i { height: 2px; overflow: hidden; background: #b5bdb6; }
  .scenario-progress b { display: block; width: 100%; height: 100%; transform-origin: left; background: #a94332; transition: transform 300ms ease; }
  fieldset { margin: 4rem 0 0; padding: 0; border: 0; }
  legend { max-width: 12ch; font: 500 clamp(3rem, 6vw, 6.8rem)/0.9 'Geologica', sans-serif; letter-spacing: -0.055em; }
  .question-note { margin: 1.5rem 0 2.5rem; color: #4e5650; }
  .answer-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.7rem; }
  .answer-grid button { display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; min-height: 6.6rem; padding: 1rem; border: 1px solid #aeb8b0; background: #fbfaf6; color: #242824; text-align: left; cursor: pointer; }
  .answer-grid button:hover,
  .answer-grid button:focus-visible { border-color: #a94332; background: #f0dfd8; }
  .answer-grid button[aria-pressed='true'] { border-color: #20231f; background: #20231f; color: #fbfaf6; }
  .answer-grid button span { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; }
  .answer-grid button[aria-pressed='true'] span { color: #c6d5cf; }
  .answer-grid strong { max-width: 22ch; font: 500 1.05rem 'Geologica', sans-serif; }
  .step-controls { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; }
  .step-controls > span { color: #5b635d; font-size: 0.82rem; }
  .back-button { min-height: 48px; padding: 0.6rem 0; border: 0; border-bottom: 1px solid #77827b; background: transparent; color: #242824; cursor: pointer; }
  .back-button:disabled { opacity: 0.45; cursor: default; }

  .scenario-map { position: sticky; top: 7rem; padding: 1.3rem; border: 1px solid #aeb8b0; background: #dfe4de; }
  .map-heading { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.85rem; }
  .map-heading span { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .scenario-map svg { width: 100%; height: auto; margin: 1.5rem 0; background: #ece9e1; }
  .building { fill: none; stroke: #77827b; stroke-width: 3; }
  .room-focus { fill: rgba(169, 67, 50, 0.08); stroke: #a94332; stroke-width: 2; }
  .candidate { fill: none; stroke: #71837c; stroke-width: 5; stroke-dasharray: 12 10; opacity: 0.55; transition: opacity 220ms ease, stroke-width 220ms ease; }
  .candidate.active-route { stroke: #a94332; stroke-width: 8; opacity: 1; }
  .scenario-map.stage-finished .room-focus { stroke-dasharray: 12 8; }
  .scenario-map.stage-progress .room-focus { fill: rgba(169, 67, 50, 0.15); }
  .scenario-map.stage-new .building { stroke-width: 5; }
  .scenario-map.scope-minimum .room-focus { stroke-width: 6; }
  .scenario-map.scope-open .room-focus { fill: rgba(169, 67, 50, 0.2); }
  .source { fill: #a94332; }
  .heard { fill: #20231f; }
  .scenario-map text { fill: #38413b; font: 18px 'IBM Plex Mono', monospace; }
  .context-list { display: grid; grid-template-columns: 1fr 1fr; margin: 0; }
  .context-list button { min-height: 74px; padding: 0.7rem; border: 0; border-top: 1px solid #aeb8b0; border-right: 1px solid #aeb8b0; background: transparent; color: #242824; text-align: left; cursor: pointer; }
  .context-list button:nth-child(even) { border-right: 0; }
  .context-list .term { display: block; font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .context-list .definition { display: block; margin-top: 0.4rem; font-size: 0.86rem; }
  .live-summary { margin-top: 1rem; padding: 1rem; border-left: 4px solid #a94332; background: #f2eee6; }
  .live-summary > span { display: block; font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .live-summary > strong { display: block; margin-top: 0.55rem; }
  .live-summary p { margin: 0.6rem 0 0; color: #4e5650; font-size: 0.86rem; }

  .scenario-result > span { display: block; margin-top: 4rem; font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .scenario-result h3 { max-width: 12ch; margin: 1.2rem 0 3rem; font-size: clamp(2.7rem, 5vw, 5rem); }
  .scenario-result dl { margin: 0; }
  .scenario-result dl div { display: grid; grid-template-columns: 11rem 1fr; gap: 1rem; padding: 1rem 0; border-top: 1px solid #aeb8b0; }
  .scenario-result dt { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .scenario-result dd { margin: 0; }
  .scenario-result label { display: grid; gap: 0.6rem; margin-top: 2rem; font-weight: 500; }
  .scenario-result label small { font-weight: 400; }
  .scenario-result textarea { width: 100%; min-height: 7rem; padding: 0.8rem; border: 1px solid #77827b; border-radius: 0; background: #fbfaf6; color: #242824; resize: vertical; }
  .result-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 2rem; }

  @media (max-width: 850px) {
    .scenario-v2 { padding-inline: 1.1rem; }
    .scenario-intro { display: block; }
    .scenario-intro h2 { margin: 1.2rem 0 1.5rem; }
    .scenario-workbench { display: flex; flex-direction: column; margin-top: 4rem; }
    .scenario-stepper { width: 100%; min-width: 0; min-height: 0; scroll-margin-top: 4.5rem; }
    .scenario-map { display: none; }
    .mobile-live-route { display: grid; grid-template-columns: 8.5rem 1fr; gap: 0.8rem; align-items: center; margin-top: 1rem; padding: 0.65rem; border: 1px solid #aeb8b0; background: #dfe4de; }
    .mobile-live-route svg { width: 100%; height: auto; }
    .mobile-live-route svg rect { fill: #ece9e1; stroke: #77827b; }
    .mobile-live-route svg path { fill: none; stroke: #a94332; stroke-width: 5; }
    .mobile-live-route svg circle:first-of-type { fill: #a94332; }
    .mobile-live-route svg circle:last-of-type { fill: #20231f; }
    .mobile-live-route.stage-finished svg rect { stroke-dasharray: 8 5; }
    .mobile-live-route.stage-progress svg rect { fill: #ead9d2; }
    .mobile-live-route.scope-minimum svg path { stroke-width: 7; }
    .mobile-live-route span { display: block; font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
    .mobile-live-route strong { display: block; margin-top: 0.25rem; font-size: 0.9rem; }
    .mobile-live-route small { display: block; max-height: 2.5rem; margin-top: 0.25rem; overflow: hidden; color: #4e5650; font-size: 0.75rem; line-height: 1.25; }
    fieldset { width: 100%; min-width: 0; margin-top: 1.5rem; }
    legend { max-width: 100%; font-size: clamp(2.45rem, 12vw, 4.5rem); overflow-wrap: anywhere; }
    .answer-grid { min-width: 0; grid-template-columns: 1fr; }
    .answer-grid button { min-width: 0; }
    .answer-grid.noise-options { grid-template-columns: 1fr 1fr; }
    .answer-grid button { min-height: 64px; }
    .step-controls > span { display: none; }
    .scenario-result dl div { grid-template-columns: 1fr; gap: 0.4rem; }
    .result-actions { align-items: stretch; flex-direction: column-reverse; }
    .result-actions .primary-button { justify-content: center; min-height: 54px; }
  }

  @media (max-width: 360px) {
    .scenario-v2 { padding-inline: 0.8rem; }
    .mobile-live-route { grid-template-columns: 6.8rem 1fr; }
    .answer-grid.noise-options { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .scenario-progress b,
    .candidate { transition: none; }
  }
</style>
