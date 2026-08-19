<script lang="ts">
  import { noises } from '$lib/content';
  import { track } from '$lib/analytics';

  let noise = noises[0].id;
  let direction = 'сверху';
  let stage = 'new';
  let room = 'спальня';
  let area = '';
  let space = 'нужно обсудить';
  let comment = '';
  let completed = false;
  let started = false;

  $: selectedNoise = noises.find((item) => item.id === noise) ?? noises[0];
  $: stageLabel = stage === 'new' ? 'новостройка до ремонта' : stage === 'progress' ? 'ремонт идёт' : 'готовая квартира';
  $: scale = stage === 'finished' ? 'локальная или поэтапная — после проверки границ вмешательства' : area ? 'в пределах отмеченной зоны и связанных примыканий' : 'определяется после обследования маршрута';
  $: href = `/diagnostika-shuma/?noise=${encodeURIComponent(selectedNoise.title)}&direction=${encodeURIComponent(direction)}&stage=${encodeURIComponent(stageLabel)}&room=${encodeURIComponent(room)}&area=${encodeURIComponent(area)}&space=${encodeURIComponent(space)}&comment=${encodeURIComponent(comment)}`;

  function begin() {
    if (!started) {
      started = true;
      track('scenario_started');
    }
  }

  function finish() {
    completed = true;
    track('scenario_completed', { noise, direction, stage, room });
  }
</script>

<section class="brief-builder" id="brief" on:change={begin}>
  <div class="brief-main">
    <div class="section-label">09 / Предварительный сценарий</div>
    <h2>Соберите исходные данные для инженера.</h2>
    <p class="lead">Это не калькулятор цены. Результат покажет, что стоит проверить и какие неизвестные остаются.</p>

    <div class="brief-question">
      <label for="brief-noise"><span>01</span> Что слышно чаще всего?</label>
      <select id="brief-noise" bind:value={noise} on:change={() => track('noise_selected', { noise })}>
        {#each noises as item}<option value={item.id}>{item.title}</option>{/each}
      </select>
    </div>
    <div class="brief-question">
      <label for="brief-direction"><span>02</span> Предполагаемое направление</label>
      <select id="brief-direction" bind:value={direction} on:change={() => track('path_selected', { direction })}>
        <option>сверху</option><option>сбоку</option><option>снизу</option><option>с улицы</option><option>не понимаю</option>
      </select>
    </div>
    <div class="brief-question">
      <label for="brief-stage"><span>03</span> Этап квартиры</label>
      <select id="brief-stage" bind:value={stage} on:change={() => track('renovation_stage_selected', { stage })}>
        <option value="new">новостройка до ремонта</option><option value="progress">ремонт идёт</option><option value="finished">готовая квартира</option>
      </select>
    </div>
    <div class="brief-question pair">
      <div><label for="brief-room"><span>04</span> Комната</label><input id="brief-room" bind:value={room} /></div>
      <div><label for="brief-area"><span>05</span> Проблемная площадь, если известна</label><input id="brief-area" bind:value={area} placeholder="Например, одна стена" /></div>
    </div>
    <div class="brief-question">
      <label for="brief-space"><span>06</span> Допустимая потеря пространства</label>
      <select id="brief-space" bind:value={space}><option>минимальная</option><option>готов обсуждать</option><option>нужно обсудить</option></select>
    </div>
    <div class="brief-question">
      <label for="brief-comment"><span>07</span> Что ещё важно</label>
      <textarea id="brief-comment" bind:value={comment} rows="3" placeholder="Когда слышно, что уже пробовали, что нельзя демонтировать"></textarea>
    </div>
    <button type="button" class="primary-button" on:click={finish}>Сформировать предварительный сценарий</button>
  </div>

  <aside class="brief-summary" aria-live="polite">
    <span>Исходные данные</span>
    <dl>
      <div><dt>Симптом</dt><dd>{selectedNoise.title}</dd></div>
      <div><dt>Направление</dt><dd>{direction}</dd></div>
      <div><dt>Этап</dt><dd>{stageLabel}</dd></div>
      <div><dt>Комната</dt><dd>{room || 'не указана'}</dd></div>
      <div><dt>Пространство</dt><dd>{space}</dd></div>
    </dl>
    {#if completed}
      <div class="brief-output">
        <strong>Предварительный сценарий, не проект и не смета.</strong>
        <p><b>Вероятный тип:</b> {selectedNoise.source}.</p>
        <p><b>Проверить:</b> {selectedNoise.inspect.join(', ')}.</p>
        <p><b>Масштаб:</b> {scale}.</p>
        <p><b>Неизвестно:</b> фактический состав конструкций, обходные пути и условия измерения.</p>
        <a class="primary-button" href={href} on:click={() => track('diagnostic_start', { source: 'scenario' })}>Передать вводные на диагностику</a>
      </div>
    {:else}
      <p class="summary-note">Заполните вводные — здесь появятся зоны проверки и следующий шаг.</p>
    {/if}
  </aside>
</section>
