<script lang="ts">
  const steps = [
    ['01', 'Симптом', 'Фиксируем, что, где и когда слышно.'],
    ['02', 'Путь', 'Проверяем источник и маршрут энергии.'],
    ['03', 'Конструкция', 'Выбираем принципы и критические узлы.'],
    ['04', 'Расчёт', 'Определяем объём и бюджет без цены наугад.'],
    ['05', 'Монтаж', 'Работает собственная монтажная бригада.'],
    ['06', 'Проверка', 'Сопоставляем результат и согласованные критерии.']
  ];
</script>

<section class="process warm" aria-labelledby="process-title">
  <div class="shell process-grid">
    <p class="mono">МЕТОД / ДИАГНОЗ ДО СМЕТЫ</p>
    <h2 class="display" id="process-title">Смета появляется после диагноза.</h2>
    <p class="process-lead">Мы не начинаем с продажи шумоизоляции по площади. Одна и та же комната проходит шесть инженерных состояний.</p>
    <ol>
      {#each steps as step, index}
        <li style={`--step:${index}`}>
          <span class="mono">{step[0]}</span><strong>{step[1]}</strong><p>{step[2]}</p><i aria-hidden="true"></i>
        </li>
      {/each}
    </ol>
    <aside>
      <span class="mono">ПЕРВЫЙ ШАГ</span>
      <p>Бесплатная первичная диагностика → звонок менеджера → следующий коммерческий шаг: выездная диагностика.</p>
      <a class="button" href="/diagnostika-shuma/">Начать с симптома</a>
    </aside>
  </div>
</section>

<style>
  .process { min-height: 110svh; padding: clamp(110px,13vw,220px) 0; }
  .process-grid { display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:start; }
  .process-grid>.mono{grid-column:1/4;color:var(--acoustic-dark)}.process-grid>h2{grid-column:4/14;margin:0;font-size:clamp(3rem,6.2vw,7.2rem)}.process-lead{grid-column:11/-1;color:rgba(7,9,8,.62)}
  ol{grid-column:2/13;list-style:none;padding:0;margin:90px 0 0;display:grid;grid-template-columns:repeat(12,1fr);position:relative}ol::before{content:'';position:absolute;left:0;right:0;top:36px;height:1px;background:rgba(7,9,8,.18)}li{grid-column:span 2;position:relative;padding:0 18px 0 0}li>span{color:var(--acoustic-dark)}li strong{display:block;margin:42px 0 12px;font-family:'Geologica',sans-serif;font-size:clamp(1rem,1.4vw,1.4rem)}li p{font-size:.74rem;line-height:1.45;color:rgba(7,9,8,.62)}li i{position:absolute;left:0;top:30px;width:13px;height:13px;border-radius:50%;background:var(--paper-100);border:2px solid var(--signal);box-shadow:0 0 0 calc(var(--step) * .5px) rgba(255,101,79,.1)}aside{grid-column:13/-1;margin-top:90px;padding:25px;border-left:1px solid rgba(7,9,8,.22)}aside>.mono{color:var(--acoustic-dark)}aside p{color:rgba(7,9,8,.62)}aside .button{width:100%;font-size:.82rem}
  @media(max-width:900px){.process-grid{grid-template-columns:repeat(8,1fr)}.process-grid>.mono{grid-column:1/3}.process-grid>h2{grid-column:3/-1}.process-lead{grid-column:3/-1}ol{grid-column:1/-1}aside{grid-column:4/-1;margin-top:40px}}
  @media(max-width:767px){.process-grid{display:block}.process-grid>.mono{display:block;margin-bottom:20px}.process-lead{margin-top:30px}ol{display:block;margin-top:60px;border-left:1px solid rgba(7,9,8,.18)}ol::before{display:none}li{padding:0 0 28px 30px}li strong{margin:5px 0}li i{left:-7px;top:6px}aside{margin:20px 0 0}}
</style>
