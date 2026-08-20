<script lang="ts">
  import { track } from '$lib/analytics';
  const stages = [
    { label: 'Первичный разбор', title: 'Понимаем симптом и неопределённость.', text: 'Сопоставляем характер шума, направление, время и состояние квартиры. Это ещё не проект конструкции.' },
    { label: 'Что отправить', title: 'Передаёте контекст, который уже есть.', text: 'Описание, план, фото и, если есть, запись помогают подготовить уточняющие вопросы. Файлы не заменяют обследование.' },
    { label: 'На объекте', title: 'Проверяем вероятные маршруты.', text: 'Осматриваем поверхности, примыкания и проходки; измерения выбираются по задаче конкретной квартиры.' },
    { label: 'Что получите', title: 'Вывод о пути и границах решения.', text: 'Фиксируем инженерную гипотезу, зоны звукоизоляционного вмешательства, важные неизвестные и следующий обоснованный шаг.' }
  ];
  let active = 0;
</script>

<section class="diagnosis-opening" data-diagnosis-opening aria-labelledby="diagnosis-opening-title">
  <div class="shell opening-grid">
    <header><p class="mono">КАК РАБОТАЕТ ДИАГНОСТИКА</p><h2 id="diagnosis-opening-title" class="display">От сообщения о шуме — к проверяемому маршруту.</h2></header>
    <picture><source media="(max-width:960px)" srcset="/generated/tech-diagnosis-960.webp" type="image/webp"/><source srcset="/generated/tech-diagnosis.webp" type="image/webp"/><img src="/generated/tech-diagnosis.png" alt="Инженер готовит акустическое измерение в жилой комнате" width="1672" height="941" loading="lazy"/></picture>
    <div class="diagnosis-console" data-diagnosis-stage={active + 1}>
      <div class="stage-buttons" role="group" aria-label="Этапы диагностики">{#each stages as stage, index}<button type="button" aria-pressed={active === index} on:click={() => { active = index; track('diagnosis_stage', { stage: String(index + 1) }); }}><span class="mono">0{index + 1}</span>{stage.label}</button>{/each}</div>
      <div class="stage-output" aria-live="polite"><span class="mono">{stages[active].label}</span><h3>{stages[active].title}</h3><p>{stages[active].text}</p></div>
    </div>
    <aside><span class="mono">ОГРАНИЧЕНИЕ</span><p>Первичный разбор не обещает готовую звукоизоляционную конструкцию, стоимость или результат в dB. Эти выводы требуют данных об объекте.</p></aside>
    <a class="button" href="#diagnostic-form">Передать исходные данные</a>
  </div>
</section>

<style>
  .diagnosis-opening{padding:clamp(105px,14vw,220px) 0;background:var(--ink-950)}.opening-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px;align-items:start}.opening-grid header{grid-column:1/9}.opening-grid h2{font-size:clamp(3rem,5.4vw,6.4rem);margin:18px 0 55px}.opening-grid picture{grid-column:1/5;display:block;aspect-ratio:4/5;overflow:hidden}.opening-grid picture img{width:100%;height:100%;object-fit:cover;filter:saturate(.62) contrast(1.06)}.diagnosis-console{grid-column:5/-1;border:1px solid var(--white-16);padding:clamp(20px,3vw,38px)}.stage-buttons{display:grid;grid-template-columns:repeat(4,1fr)}.stage-buttons button{min-height:78px;background:transparent;border:0;border-bottom:1px solid var(--white-16);color:var(--white-48);font:500 .72rem/1.25 'Geologica',sans-serif;text-align:left;padding:8px}.stage-buttons button span{display:block;margin-bottom:10px}.stage-buttons button[aria-pressed="true"]{color:var(--paper);border-color:var(--signal)}.stage-output{padding:clamp(42px,7vw,90px) 0 20px;animation:diagnosis-reveal .42s ease-out}.stage-output>span{color:var(--signal)}.stage-output h3{font:500 clamp(2rem,3.6vw,4rem)/1 'Geologica',sans-serif;margin:14px 0 24px;max-width:14ch}.stage-output p{color:var(--white-64);max-width:56ch}.opening-grid aside{grid-column:5/9;margin-top:20px;border-left:2px solid var(--signal);padding-left:20px;color:var(--white-64)}.opening-grid aside span{color:var(--signal)}.opening-grid>.button{grid-column:9/-1;margin-top:20px}@keyframes diagnosis-reveal{from{opacity:.45;transform:translateY(8px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.stage-output{animation:none}}@media(max-width:800px){.diagnosis-opening,.opening-grid,.diagnosis-console,.stage-output{min-width:0;max-width:100%}.opening-grid{display:block}.opening-grid h2,.stage-output h3,.opening-grid aside{max-width:100%;overflow-wrap:anywhere}.opening-grid h2{margin-bottom:38px}.opening-grid picture{aspect-ratio:16/11;margin-bottom:20px}.stage-buttons{grid-template-columns:repeat(2,minmax(0,1fr))}.stage-buttons button{min-width:0;min-height:66px;overflow-wrap:anywhere}.opening-grid aside,.opening-grid>.button{margin-top:28px}.opening-grid>.button{width:100%}}
</style>
