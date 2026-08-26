<script lang="ts">
  const steps = [
    'Проверим основные исходные данные',
    'Уточним недостающую информацию',
    'Подберём релевантный аналог',
    'Подготовим предварительное коммерческое предложение',
    'Согласуем следующий инженерный шаг'
  ];
</script>

<section class="proposal-process chapter" aria-labelledby="proposal-title">
  <div class="chapter__heading chapter__heading--split">
    <div><p class="eyebrow">После отправки / без чёрного ящика</p><h2 id="proposal-title">Что получит заказчик после заявки.</h2></div>
    <p>Предварительное КП — в течение 1 рабочего дня после получения основных исходных данных.</p>
  </div>
  <ol>{#each steps as step, index}<li><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>{/each}</ol>
</section>
