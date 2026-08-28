<script lang="ts">
  const logos = [
    { name: 'Газпром', image: '/official/logo-gazprom.png' },
    { name: 'Золото Камчатки', image: '/official/logo-zoloto-kamchatki.png' },
    { name: 'ТехноНИКОЛЬ', image: '/official/logo-technonikol.png' },
    { name: 'СУЭК', image: '/official/logo-suek.png' },
    { name: 'Полюс', image: '/official/logo-polyus.png' },
    { name: 'X5 Logistic', image: '/official/logo-x5.png' }
  ];

</script>

<section class="client-proof chapter" id="client-proof" aria-labelledby="client-proof-title">
  <div class="chapter__heading">
    <p class="eyebrow">Опубликованные заказчики</p>
    <h2 id="client-proof-title">Нам доверяют.</h2>
  </div>

  <div class="client-proof__body">
    <ul class="client-proof__logos" aria-label="Организации из опубликованных отзывов">
      {#each logos as logo}
        <li><img src={logo.image} alt={logo.name} loading="lazy" /></li>
      {/each}
    </ul>
  </div>
</section>
