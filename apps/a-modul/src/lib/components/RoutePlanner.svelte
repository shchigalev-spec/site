<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  import { commitProjectTransfer, setCapacity, setCustomCapacity, setObjectType, setProjectZones } from '$lib/state/projectContext';

  export let kind: 'office' | 'dorm';
  const office = {
    eyebrow: 'Рабочий сценарий / без выдуманной площади',
    title: 'Свяжите число рабочих мест с функциями помещений.',
    support: 'Точная площадь появляется после планировочного сценария и требований к инженерии — этот выбор не подменяет расчёт.',
    scales: ['50', '100', '300', 'Другое'],
    scaleLabel: 'Рабочие места',
    zones: ['Рабочие места', 'Переговорные', 'Санитарные зоны', 'Серверная / электрощитовая', 'Бытовые помещения', 'Входная группа'],
    next: 'Уточним режим работы, связи помещений, инженерную нагрузку и площадку.'
  };
  const dorm = {
    eyebrow: 'Вместимость / эксплуатационный сценарий',
    title: 'Свяжите численность с проживанием и бытовыми функциями.',
    support: 'Не рассчитываем размеры комнат без проекта: фиксируем вместимость, сценарий расселения и обязательные зоны.',
    scales: ['100', '300', '500', 'Другое'],
    scaleLabel: 'Человек',
    zones: ['Жилые блоки', 'Санитарные блоки', 'Душевые', 'Бытовые помещения', 'Мебель', 'Инженерные помещения'],
    next: 'Уточним расселение, сменность, климат, инженерную нагрузку и логистику.'
  };
  function configFor(value: typeof kind) {
    return value === 'office' ? office : dorm;
  }

  $: config = configFor(kind);
  let scale = kind === 'office' ? '50' : '100';
  let zones = [...configFor(kind).zones];
  let started = false;

  function start() {
    if (started) return;
    started = true;
    trackEvent('configurator_start', { route_planner: kind });
  }

  function chooseScale(value: string) {
    start();
    scale = value;
    if (value === 'Другое') setCustomCapacity('');
    else setCapacity(value);
    trackEvent('capacity_select', { value, metric: kind === 'office' ? 'workplaces' : 'people' });
  }

  function toggle(zone: string) {
    start();
    zones = zones.includes(zone) ? zones.filter((item) => item !== zone) : [...zones, zone];
    setProjectZones(zones);
  }

  function complete() {
    setObjectType(kind === 'office' ? 'abk' : 'dorm');
    if (scale === 'Другое') setCustomCapacity('');
    else setCapacity(scale);
    setProjectZones(zones);
    commitProjectTransfer();
    trackEvent('configurator_complete', { route_planner: kind, zone_count: zones.length });
  }
</script>

<section class="route-planner chapter" id="route-planner" aria-labelledby="route-planner-title">
  <div class="chapter__heading chapter__heading--split"><div><p class="eyebrow">{config.eyebrow}</p><h2 id="route-planner-title">{config.title}</h2></div><p>{config.support}</p></div>
  <div class="route-planner__workspace">
    <div class="route-planner__controls">
      <fieldset><legend>01 / {config.scaleLabel}</legend><div class="choice-grid choice-grid--capacity">{#each config.scales as item}<button type="button" class:active={scale === item} aria-pressed={scale === item} onclick={() => chooseScale(item)}>{item}</button>{/each}</div></fieldset>
      <fieldset><legend>02 / Функции</legend><div class="zone-grid">{#each config.zones as zone}<label class:active={zones.includes(zone)}><input type="checkbox" checked={zones.includes(zone)} onchange={() => toggle(zone)} /><span>{zone}</span></label>{/each}</div></fieldset>
    </div>
    <aside class="route-planner__output" aria-live="polite">
      <p class="mono-label">Предварительный контур</p><h3>{scale === 'Другое' ? `${config.scaleLabel}: нужно уточнить` : `${scale} · ${config.scaleLabel.toLowerCase()}`}</h3>
      <div><span>Выбранные функции</span><p>{zones.length ? zones.join(' · ') : 'Функциональный состав нужно уточнить.'}</p></div>
      <div><span>Следующий расчёт</span><p>{config.next}</p></div>
      <p class="route-planner__guard">Предварительную площадь не публикуем без проверенных правил планировки.</p>
      <a class="button button--primary" href="#full-brief" onclick={complete}>Передать сценарий в полную заявку</a>
    </aside>
  </div>
</section>
