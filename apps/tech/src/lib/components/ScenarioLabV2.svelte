<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { buildScenario, emptyScenario, type ScenarioInput } from '$lib/scenario';
  import { noiseProfiles } from '$lib/data/site';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';
  import type { PathKey } from '$lib/types';

  const directions = [
    ['above', 'Сверху'], ['side', 'Сбоку'], ['below', 'Снизу'], ['facade', 'С улицы'], ['ventilation', 'Из вентиляции'], ['unknown', 'Не уверен']
  ];
  const stages = [['new-build', 'До ремонта'], ['renovation', 'Ремонт идёт'], ['finished', 'Готовая квартира']];
  const rooms = ['Спальня', 'Гостиная', 'Детская', 'Кабинет', 'Вся квартира'];
  const paths: [PathKey | '', string][] = [['ceiling', 'Потолок'], ['wall', 'Стена'], ['floor', 'Пол'], ['socket', 'Розетки'], ['ventilation', 'Вентиляция'], ['junction', 'Примыкания'], ['', 'Пока не знаю']];
  const priorities = [['minimum', 'Минимум вмешательства'], ['balanced', 'Баланс'], ['result', 'Приоритет — результат']];
  const stepLabels = ['Что слышно?', 'Откуда?', 'Стадия ремонта', 'Комната', 'Подозреваемая зона', 'Приоритет', 'Комментарий'];

  const routePaths: Record<PathKey, string> = {
    ceiling: 'M92 62 C170 62 218 74 290 128 S410 180 508 178',
    wall: 'M88 182 C174 182 220 182 288 190 S420 222 512 220',
    floor: 'M92 320 C192 320 250 296 318 272 S426 248 510 250',
    socket: 'M92 184 C180 184 236 200 306 216 S430 232 510 226',
    ventilation: 'M92 92 C176 94 244 118 320 146 S430 166 510 158',
    junction: 'M92 278 C170 278 218 252 286 222 S404 184 510 184'
  };
  const sourcePoints: Record<string, { x: number; y: number }> = {
    above: { x: 94, y: 62 }, side: { x: 88, y: 182 }, below: { x: 92, y: 320 }, facade: { x: 88, y: 236 }, ventilation: { x: 92, y: 92 }, unknown: { x: 92, y: 278 }
  };

  let input: ScenarioInput = { ...emptyScenario };
  let step = 0;
  let complete = false;
  let revision = 0;
  let started = false;

  $: result = buildScenario(input);
  $: routeKey = input.path || ({ above: 'ceiling', side: 'wall', below: 'floor', facade: 'wall', ventilation: 'ventilation', unknown: 'junction' } as Record<string, PathKey>)[input.direction] || 'junction';
  $: source = sourcePoints[input.direction] || sourcePoints.unknown;
  $: if (!started && $diagnosticContext.noise && (
    input.noise !== $diagnosticContext.noise ||
    input.direction !== $diagnosticContext.direction ||
    input.path !== $diagnosticContext.path
  )) {
    input = {
      ...input,
      noise: $diagnosticContext.noise,
      direction: $diagnosticContext.direction,
      path: $diagnosticContext.path,
      stage: $diagnosticContext.stage || input.stage,
      room: $diagnosticContext.room || input.room,
      spaceLoss: $diagnosticContext.spaceLoss || input.spaceLoss,
      comment: $diagnosticContext.comment || input.comment
    };
    revision += 1;
    persist();
  }

  onMount(() => {
    const saved = sessionStorage.getItem('tech:v2:scenario');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { input?: ScenarioInput; step?: number; complete?: boolean };
        if (parsed.input) input = { ...emptyScenario, ...parsed.input };
        step = Math.min(6, Math.max(0, parsed.step ?? 0));
        complete = Boolean(parsed.complete);
        started = step > 0 || complete;
      } catch { /* ignore invalid persisted state */ }
    } else {
      input = {
        ...input,
        noise: $diagnosticContext.noise,
        direction: $diagnosticContext.direction,
        path: $diagnosticContext.path,
        stage: $diagnosticContext.stage,
        room: $diagnosticContext.room,
        spaceLoss: $diagnosticContext.spaceLoss,
        comment: $diagnosticContext.comment
      };
    }
    persist();
  });

  function persist() {
    diagnosticContext.set({
      noise: input.noise,
      direction: input.direction,
      path: input.path,
      stage: input.stage,
      room: input.room,
      spaceLoss: input.spaceLoss,
      comment: input.comment
    });
    sessionStorage.setItem('tech:v2:scenario', JSON.stringify({ input, step, complete }));
  }

  function answer(field: keyof ScenarioInput, value: string) {
    if (!started) { started = true; track('scenario_started'); }
    input = { ...input, [field]: value } as ScenarioInput;
    revision += 1;
    complete = false;
    if (step < 6) step += 1;
    persist();
  }

  function updateComment(value: string) {
    input = { ...input, comment: value };
    persist();
  }

  function finish() {
    complete = true;
    revision += 1;
    persist();
    track('scenario_completed', { noise: input.noise, stage: input.stage, path: input.path || 'unknown' });
  }

  function back() {
    complete = false;
    step = Math.max(0, step - 1);
    persist();
  }
</script>

<section class="scenario-v2" id="scenario" aria-labelledby="scenario-title" data-step={step + 1} data-complete={complete}>
  <div class="shell scenario-heading">
    <p class="mono">06 / МОЙ СЦЕНАРИЙ</p>
    <h2 class="display" id="scenario-title">Один вопрос.<br />Одна гипотеза за раз.</h2>
    <p>Ответы меняют маршрут проверки. Цена, толщина и обещанный результат здесь не появляются.</p>
  </div>

  <div class="shell scenario-shell">
    <div class="question-column">
      <div class="question-progress" aria-label={`Шаг ${step + 1} из 7`}>
        <span class="mono">ШАГ {String(step + 1).padStart(2, '0')} / 07</span>
        <i><b style={`width:${((step + 1) / 7) * 100}%`}></b></i>
      </div>

      {#if complete}
        <div class="question complete-card">
          <p class="mono">СЦЕНАРИЙ СОХРАНЁН</p>
          <h3>Контекст готов к полной диагностике.</h3>
          <p>Он будет перенесён в форму: шум, направление, стадия, комната, зона и приоритет.</p>
          <div class="question-actions"><button type="button" class="back" on:click={() => (complete = false)}>Изменить ответы</button><a class="button" href="/diagnostika-shuma/">Продолжить в диагностике</a></div>
        </div>
      {:else}
        <div class="question" aria-live="polite">
          <p class="mono">{stepLabels[step].toUpperCase()}</p>
          {#if step === 0}
            <h3>Что слышно?</h3>
            <div class="answers">{#each noiseProfiles as profile}<button type="button" aria-pressed={input.noise === profile.key} on:click={() => answer('noise', profile.key)}><span>{profile.short}</span><small>{profile.character}</small></button>{/each}</div>
          {:else if step === 1}
            <h3>Откуда приходит шум?</h3>
            <div class="answers compact">{#each directions as option}<button type="button" aria-pressed={input.direction === option[0]} on:click={() => answer('direction', option[0])}>{option[1]}</button>{/each}</div>
          {:else if step === 2}
            <h3>На какой стадии квартира?</h3>
            <div class="answers compact">{#each stages as option}<button type="button" aria-pressed={input.stage === option[0]} on:click={() => answer('stage', option[0])}>{option[1]}</button>{/each}</div>
          {:else if step === 3}
            <h3>Где важнее всего решить проблему?</h3>
            <div class="answers compact">{#each rooms as room}<button type="button" aria-pressed={input.room === room} on:click={() => answer('room', room)}>{room}</button>{/each}</div>
          {:else if step === 4}
            <h3>Есть подозреваемая зона?</h3>
            <p class="question-note">Необязательно знать ответ — «пока не знаю» тоже сохраняет неопределённость.</p>
            <div class="answers compact">{#each paths as option}<button type="button" aria-pressed={input.path === option[0]} on:click={() => answer('path', option[0])}>{option[1]}</button>{/each}</div>
          {:else if step === 5}
            <h3>Что важнее при выборе масштаба?</h3>
            <div class="answers compact">{#each priorities as option}<button type="button" aria-pressed={input.spaceLoss === option[0]} on:click={() => answer('spaceLoss', option[0])}>{option[1]}</button>{/each}</div>
          {:else}
            <h3>Что ещё важно знать?</h3>
            <label>Комментарий <span>необязательно</span><textarea rows="5" maxlength="2000" value={input.comment} on:input={(event) => updateComment(event.currentTarget.value)} placeholder="Например: сильнее ночью, отделка уже готова"></textarea></label>
            <button type="button" class="button finish" on:click={finish}>Собрать предварительный вывод</button>
          {/if}
          <div class="question-actions"><button type="button" class="back" disabled={step === 0} on:click={back}>← Назад</button><span class="mono">{stepLabels[step]}</span></div>
        </div>
      {/if}
    </div>

    <div class="route-model">
      <div class="model-label"><span class="mono">СЕМАНТИЧЕСКАЯ МОДЕЛЬ МАРШРУТА</span><b>{result.uncertainty}</b></div>
      <svg viewBox="0 0 600 380" role="img" aria-label={`Предварительный маршрут: ${result.hypothesis}`}>
        <g class="plan" aria-hidden="true">
          <path d="M70 38H532V342H70Z M70 154H238V38 M238 154V342 M238 250H532 M414 38V250" />
          <path class="openings" d="M124 38V58 M208 154H228 M414 112V138 M332 250H360" />
        </g>
        <circle class="source-pulse" cx={source.x} cy={source.y} r="18" aria-hidden="true" />
        <circle class="source-dot" cx={source.x} cy={source.y} r="6" aria-hidden="true" />
        {#key `${revision}-${routeKey}`}
          <path class="candidate-route" d={routePaths[routeKey]} pathLength="1" in:fade={{ duration: 160 }} out:fade={{ duration: 120 }} aria-hidden="true" />
        {/key}
        <circle class="target" cx="510" cy={routeKey === 'floor' ? 250 : routeKey === 'ventilation' ? 158 : routeKey === 'socket' ? 226 : routeKey === 'wall' ? 220 : 184} r="9" aria-hidden="true" />
        <text x="88" y="365">ИСТОЧНИК</text><text x="470" y="365">КОМНАТА</text>
      </svg>
      <div class="route-status" aria-live="polite">
        <p class="mono">РАБОЧАЯ ГИПОТЕЗА</p>
        <strong>{result.hypothesis}</strong>
        <p><span>Источник</span>{result.probableType}</p>
        <p><span>Кандидатные пути</span>{result.candidateRoutes.join(' · ')}</p>
      </div>
    </div>

    <aside class="scenario-output" aria-live="polite" aria-atomic="true">
      <p class="mono">ПРЕДВАРИТЕЛЬНЫЙ ВЫВОД</p>
      <h3>{result.probableType}</h3>
      <div><strong>Зоны осмотра</strong><ul>{#each result.inspect as item}<li>{item}</li>{/each}</ul></div>
      <div><strong>Масштаб вмешательства</strong><p>{result.scale}</p></div>
      <div class="unknown"><strong>Важные неизвестные</strong><ul>{#each result.unknowns as item}<li>{item}</li>{/each}</ul></div>
      <div><strong>Следующий шаг</strong><p>{result.next}</p></div>
    </aside>
  </div>
</section>

<style>
  .scenario-v2{padding:clamp(110px,13vw,210px) 0;background:var(--ink-900)}.scenario-heading{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;align-items:end}.scenario-heading>.mono{grid-column:1/4;color:var(--acoustic)}.scenario-heading h2{grid-column:4/13;margin:0;font-size:clamp(3rem,6vw,7rem)}.scenario-heading>p:last-child{grid-column:13/-1;margin:0;color:var(--white-64)}
  .scenario-shell{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;margin-top:clamp(68px,8vw,120px);align-items:start}.question-column{grid-column:1/7}.question-progress{display:grid;gap:13px}.question-progress>span{color:var(--acoustic)}.question-progress i{height:2px;background:var(--white-16)}.question-progress b{display:block;height:100%;background:var(--signal);transition:width 280ms ease}.question{margin-top:32px}.question>p.mono{color:var(--signal)}.question h3{margin:16px 0 28px;font-family:'Geologica',sans-serif;font-size:clamp(2.4rem,4.3vw,5rem);line-height:1;letter-spacing:-.05em}.question-note{color:var(--white-64)}.answers{display:grid;gap:8px}.answers button{display:grid;gap:4px;min-height:72px;padding:14px 16px;border:1px solid var(--white-16);border-radius:12px;background:transparent;color:var(--white);text-align:left;cursor:pointer}.answers button:hover,.answers button[aria-pressed='true']{border-color:var(--signal);background:rgba(255,101,79,.08)}.answers small{color:var(--white-64)}.answers.compact{grid-template-columns:repeat(2,1fr)}.answers.compact button{display:block;text-align:center}.question label{display:grid;gap:9px;color:var(--white-64)}.question label span{font-size:.7rem;color:var(--acoustic)}textarea{width:100%;padding:15px;border:1px solid var(--white-16);border-radius:12px;background:var(--ink-800);color:var(--white);resize:vertical}.finish{width:100%;margin-top:18px}.question-actions{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:24px}.back{min-height:44px;border:0;background:transparent;color:var(--white-64);cursor:pointer}.back:disabled{opacity:.3}.question-actions>.mono{color:var(--white-64)}.complete-card{padding:28px;border:1px solid var(--acoustic);background:rgba(108,159,150,.07)}.complete-card>p:not(.mono){color:var(--white-64)}
  .route-model{grid-column:7/13;position:sticky;top:100px;border:1px solid var(--white-16);background:var(--ink-950)}.model-label{display:flex;justify-content:space-between;gap:20px;padding:18px;border-bottom:1px solid var(--white-16)}.model-label span{color:var(--acoustic)}.model-label b{max-width:24ch;color:var(--white-64);font-size:.68rem;font-weight:400;text-align:right}.route-model svg{display:block;width:100%;height:auto}.plan path{fill:none;stroke:var(--white-16);stroke-width:2}.plan .openings{stroke:var(--paper-100);stroke-width:5}.candidate-route{fill:none;stroke:var(--signal);stroke-width:5;stroke-linecap:round;stroke-dasharray:1;animation:draw-route 720ms cubic-bezier(.22,.8,.2,1) both}.source-pulse{fill:rgba(255,101,79,.12);stroke:var(--signal)}.source-dot,.target{fill:var(--signal)}.route-model text{fill:var(--white-64);font:12px 'IBM Plex Mono',monospace;letter-spacing:.08em}.route-status{padding:22px;border-top:1px solid var(--white-16)}.route-status>.mono{color:var(--acoustic)}.route-status>strong{display:block;margin:10px 0 20px;font-size:1rem}.route-status>p:not(.mono){display:grid;grid-template-columns:120px 1fr;gap:16px;margin:0;padding:10px 0;border-top:1px solid var(--white-16);color:var(--white-64);font-size:.75rem}.route-status p span{color:var(--acoustic)}
  .scenario-output{grid-column:13/-1;padding-left:10px}.scenario-output>.mono{color:var(--acoustic)}.scenario-output h3{margin:18px 0 30px;font-family:'Geologica',sans-serif;font-size:clamp(1.4rem,2vw,2.2rem);line-height:1.08;letter-spacing:-.035em}.scenario-output>div{padding:16px 0;border-top:1px solid var(--white-16)}.scenario-output strong{font:500 .65rem 'IBM Plex Mono',monospace;text-transform:uppercase;color:var(--white-64)}.scenario-output p,.scenario-output li{color:var(--white-64);font-size:.76rem}.scenario-output ul{list-style:none;margin:9px 0 0;padding:0}.scenario-output li::before{content:'— ';color:var(--acoustic)}.scenario-output .unknown li::before{color:var(--warning)}
  @keyframes draw-route{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
  @media(max-width:1100px){.scenario-heading,.scenario-shell{grid-template-columns:repeat(8,minmax(0,1fr))}.scenario-heading>.mono{grid-column:1/3}.scenario-heading h2{grid-column:3/-1}.scenario-heading>p:last-child{grid-column:3/8;margin-top:22px}.question-column{grid-column:1/4}.route-model{grid-column:4/-1}.scenario-output{grid-column:3/8;margin-top:38px;padding:24px;border:1px solid var(--white-16)}}
  @media(max-width:767px){.scenario-heading{display:block}.scenario-heading h2{margin-top:18px;font-size:clamp(3rem,14vw,5rem)}.scenario-heading>p:last-child{margin-top:24px}.scenario-shell{display:flex;flex-direction:column;margin-top:60px}.question-column,.route-model,.scenario-output{width:100%}.question-column{order:1}.route-model{order:2;position:relative;top:auto}.scenario-output{order:3;margin:0;padding:22px;border:1px solid var(--white-16)}.answers.compact{grid-template-columns:1fr}.answers button{min-height:62px}.question h3{font-size:clamp(2.5rem,12vw,4.2rem)}.question-actions{padding-bottom:8px}.route-status>p:not(.mono){grid-template-columns:1fr}.complete-card .question-actions{display:grid}.complete-card .button{width:100%}}
  @media(prefers-reduced-motion:reduce){.candidate-route{animation:none;stroke-dashoffset:0}.question-progress b{transition:none}}
</style>
