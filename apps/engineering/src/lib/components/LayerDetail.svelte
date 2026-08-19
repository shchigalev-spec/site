<script lang="ts">
  import { track } from '$lib/analytics';

  const details = {
    wall: { label: 'Стена', axis: 'x', note: 'Проверяем периметр, проходки и жёсткие связи со смежными конструкциями.' },
    ceiling: { label: 'Потолок', axis: 'y', note: 'Смотрим связь подвесной части с перекрытием и верхними примыканиями стен.' },
    floor: { label: 'Пол', axis: 'y', note: 'Контролируем развязку слоя и отсутствие жёсткого контакта по периметру.' }
  } as const;

  type DetailKey = keyof typeof details;
  let selected: DetailKey = 'wall';
  let expanded = false;

  function choose(value: DetailKey) {
    selected = value;
    expanded = true;
    track('path_selected', { detail: value });
  }
</script>

<div class="layer-detail">
  <div class="layer-tabs" role="tablist" aria-label="Выбрать узел конструкции">
    {#each Object.entries(details) as [key, item]}
      <button type="button" role="tab" aria-selected={selected === key} on:click={() => choose(key as DetailKey)}>{item.label}</button>
    {/each}
  </div>
  <button type="button" class:expanded class:axis-y={details[selected].axis === 'y'} class="layer-stage" aria-pressed={expanded} on:click={() => (expanded = !expanded)}>
    <span class="layer layer-1"><i>масса</i></span>
    <span class="layer layer-2"><i>развязка</i></span>
    <span class="layer layer-3"><i>поглощение</i></span>
    <span class="layer layer-4"><i>герметичный контур</i></span>
    <span class="rigid-bridge"><i>жёсткий мост</i></span>
    <span class="bridge-path" aria-hidden="true"></span>
    <b>{expanded ? 'Собрать узел' : 'Развести слои'}</b>
  </button>
  <div class="layer-note">
    <span>Узел / {details[selected].label}</span>
    <p>{details[selected].note}</p>
    <strong>Один жёсткий мост может обойти рабочие слои.</strong>
  </div>
</div>
