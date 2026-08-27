<script lang="ts">
  const logos = [
    { name: 'Газпром', image: '/official/logo-gazprom.png' },
    { name: 'Золото Камчатки', image: '/official/logo-zoloto-kamchatki.png' },
    { name: 'ТехноНИКОЛЬ', image: '/official/logo-technonikol.png' },
    { name: 'СУЭК', image: '/official/logo-suek.png' },
    { name: 'Полюс', image: '/official/logo-polyus.png' },
    { name: 'X5 Logistic', image: '/official/logo-x5.png' }
  ];

  const reviews = [
    {
      company: 'ПАО «Газпром»',
      text: 'В опубликованном письме отмечены соблюдение сроков производства и поставки, а также соответствие модулей требованиям к качеству.'
    },
    {
      company: 'ГК «Золото Камчатки»',
      text: 'Заказчик благодарит команду за работу над вахтовым посёлком на месторождении «Бараньевское» и профессиональное выполнение задачи.'
    },
    {
      company: 'X5 Logistic',
      text: 'В письме описана реализация двух модульных офисов в Толмачёво: комплектация, заводская готовность и доставка на объект.'
    }
  ];
</script>

<section class="client-proof chapter" id="client-proof" aria-labelledby="client-proof-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Доверие заказчиков / опубликованные письма</p>
      <h2 id="client-proof-title">Что подтверждают клиенты после поставки.</h2>
    </div>
    <p>Не пересказываем рекламные обещания. Ниже — краткое содержание опубликованных благодарственных писем и эмблемы организаций, представленные в официальном разделе отзывов.</p>
  </div>

  <div class="client-proof__body">
    <ul class="client-proof__logos" aria-label="Организации из опубликованных отзывов">
      {#each logos as logo}
        <li><img src={logo.image} alt="" loading="lazy" /><span>{logo.name}</span></li>
      {/each}
    </ul>

    <div class="client-proof__reviews">
      {#each reviews as review, index}
        <article>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <p>{review.text}</p>
          <strong>{review.company}</strong>
        </article>
      {/each}
    </div>

    <div class="client-proof__footer">
      <p>Отзывы относятся к опубликованным проектам и не заменяют условия договора по новому объекту.</p>
      <a class="button button--light" href="#project-brief">Обсудить похожую задачу</a>
    </div>
  </div>
</section>
