<script lang="ts">
  import { buildScenario, emptyScenario, type ScenarioInput } from '$lib/scenario';
  import { noiseProfiles } from '$lib/data/site';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';

  let input: ScenarioInput = { ...emptyScenario };
  let started = false;
  let completed = false;
  $: result = buildScenario(input);
  $: completion = [input.noise, input.direction, input.stage, input.room, input.path, input.spaceLoss].filter(Boolean).length;

  function changed() {
    if (!started) { started = true; track('scenario_started'); }
    diagnosticContext.set({
      noise: input.noise,
      direction: input.direction,
      path: input.path,
      stage: input.stage,
      room: input.room,
      spaceLoss: input.spaceLoss,
      comment: input.comment
    });
    if (completion >= 5 && !completed) { completed = true; track('scenario_completed', { noise: input.noise, stage: input.stage }); }
  }
</script>

<section class="scenario" id="scenario" aria-labelledby="scenario-title">
  <div class="shell section-head">
    <p class="mono">МОЙ СЦЕНАРИЙ / 07</p>
    <h2 class="display" id="scenario-title">Соберите гипотезу. Не выдуманную цену.</h2>
    <p>Ответ меняет зоны проверки и неизвестные, но не подменяет выездную диагностику.</p>
  </div>

  <div class="shell lab-grid">
    <form class="scenario-controls" on:change={changed} on:input={changed}>
      <label>Основной шум
        <select bind:value={input.noise}>
          <option value="">Выберите симптом</option>
          {#each noiseProfiles as profile}<option value={profile.key}>{profile.short}</option>{/each}
        </select>
      </label>
      <label>Вероятное направление
        <select bind:value={input.direction}>
          <option value="">Выберите направление</option><option value="above">сверху</option><option value="side">сбоку</option><option value="below">снизу</option><option value="facade">с улицы</option><option value="unknown">не уверен</option>
        </select>
      </label>
      <label>Стадия объекта
        <select bind:value={input.stage}>
          <option value="">Выберите стадию</option><option value="new-build">новостройка до ремонта</option><option value="renovation">ремонт идёт</option><option value="finished">готовая квартира</option>
        </select>
      </label>
      <label>Комната
        <select bind:value={input.room}>
          <option value="">Выберите комнату</option><option>спальня</option><option>гостиная</option><option>детская</option><option>кабинет</option><option>вся квартира</option>
        </select>
      </label>
      <label>Проблемная зона
        <select bind:value={input.path}>
          <option value="">Пока неизвестна</option><option value="ceiling">потолок</option><option value="wall">стена</option><option value="floor">пол</option><option value="socket">розетки</option><option value="ventilation">вентиляция</option><option value="junction">примыкания</option>
        </select>
      </label>
      <label>Допустимая потеря пространства
        <select bind:value={input.spaceLoss}>
          <option value="">Нужно обсудить</option><option value="minimum">минимальная</option><option value="balanced">ищем баланс</option><option value="result">приоритет — результат</option>
        </select>
      </label>
      <label class="comment">Комментарий
        <textarea bind:value={input.comment} rows="3" placeholder="Например: шум сильнее ночью, ремонт уже закончен"></textarea>
      </label>
    </form>

    <div class="lab-visual" aria-hidden="true">
      <div class="lab-room"><i></i><i></i><i></i><b></b></div>
      <div class="lab-route" class:active={Boolean(input.path)}></div>
      <span class="mono">КАЛИБРОВКА {completion} / 6</span>
    </div>

    <aside class="scenario-output" aria-live="polite">
      <div class="output-progress"><i style={`width:${completion / 6 * 100}%`}></i></div>
      <span class="mono">ПРЕДВАРИТЕЛЬНЫЙ ВЫВОД</span>
      <h3>{result.probableType}</h3>
      <div class="output-block"><strong>Зоны для проверки</strong><ul>{#each result.inspect as item}<li>{item}</li>{/each}</ul></div>
      <div class="output-block"><strong>Масштаб</strong><p>{result.scale}</p></div>
      <div class="output-block unknown"><strong>Пока неизвестно</strong><ul>{#each result.unknowns as item}<li>{item}</li>{/each}</ul></div>
      <p class="next">{result.next}</p>
      <a class="button" href="#diagnostic-form">Продолжить в диагностике</a>
    </aside>
  </div>
</section>

<style>
  .scenario { padding: clamp(120px,14vw,240px) 0; background: var(--ink-900); }
  .lab-grid { display: grid; grid-template-columns: repeat(16,1fr); gap: 24px; margin-top: 90px; align-items: start; }
  .scenario-controls { grid-column: 1 / 6; display: grid; gap: 16px; }
  label { display: grid; gap: 8px; color: var(--white-64); font-size: .78rem; }
  select, textarea { width: 100%; min-height: 50px; padding: 12px 14px; border: 1px solid var(--white-16); border-radius: 12px; background: var(--ink-800); color: var(--white); }
  textarea { resize: vertical; }
  .lab-visual { grid-column: 6 / 12; position: sticky; top: 120px; min-height: 620px; display: grid; place-items: center; overflow: hidden; border-inline: 1px solid var(--white-16); }
  .lab-visual > .mono { position: absolute; left: 20px; bottom: 20px; color: var(--acoustic); }
  .lab-room { width: 72%; aspect-ratio: 1; position: relative; border: 1px solid var(--white-16); transform: perspective(900px) rotateX(58deg) rotateZ(-31deg); background: rgba(108,159,150,.06); }
  .lab-room i { position: absolute; border: 1px solid var(--white-16); }
  .lab-room i:nth-child(1) { inset: 8% 51% 52% 8%; } .lab-room i:nth-child(2) { inset: 8% 8% 40% 52%; } .lab-room i:nth-child(3) { inset: 60% 8% 8% 8%; }
  .lab-room b { position: absolute; left: 38%; top: 40%; width: 28%; height: 28%; border: 1px dashed var(--warning); }
  .lab-route { position: absolute; width: 58%; height: 2px; transform: rotate(-24deg); background: repeating-linear-gradient(90deg,var(--white-16) 0 8px,transparent 8px 16px); }
  .lab-route.active { background: linear-gradient(90deg,var(--signal),var(--acoustic)); box-shadow: 0 0 20px rgba(255,101,79,.4); }
  .scenario-output { grid-column: 12 / -1; padding: 26px; border: 1px solid var(--white-16); border-radius: 24px; background: rgba(7,9,8,.64); }
  .output-progress { height: 2px; background: var(--white-16); margin-bottom: 28px; } .output-progress i { display: block; height: 100%; background: var(--signal); transition: width 300ms ease; }
  .scenario-output > .mono { color: var(--acoustic); }
  .scenario-output h3 { margin: 22px 0 32px; font-family: 'Geologica',sans-serif; font-size: clamp(1.5rem,2.2vw,2.6rem); line-height: 1.05; letter-spacing: -.04em; }
  .output-block { padding: 17px 0; border-top: 1px solid var(--white-16); }
  .output-block strong { font: 500 .65rem/1.3 'IBM Plex Mono',monospace; text-transform: uppercase; color: var(--white-64); }
  .output-block ul { list-style: none; padding: 0; margin: 10px 0 0; }
  .output-block li, .output-block p { font-size: .82rem; color: var(--white-64); }
  .output-block li::before { content: '— '; color: var(--acoustic); }
  .unknown li::before { content: '·· '; color: var(--warning); }
  .next { font-size: .78rem; color: var(--white-64); }
  .scenario-output .button { width: 100%; margin-top: 14px; font-size: .82rem; }
  @media (max-width: 1000px) { .lab-grid { grid-template-columns: repeat(8,1fr); } .scenario-controls { grid-column: 1 / 4; } .lab-visual { grid-column: 4 / -1; } .scenario-output { grid-column: 3 / 8; margin-top: -70px; position: relative; z-index: 2; } }
  @media (max-width: 767px) { .lab-grid { display: flex; flex-direction: column; } .scenario-controls { width: 100%; } .lab-visual { position: relative; top: auto; width: 100%; min-height: 420px; order: -1; } .scenario-output { width: 100%; margin: 0; } }
</style>
