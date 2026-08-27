<script lang="ts">
  const team = [
    {
      name: 'Скородумов Евгений Юрьевич',
      role: 'Управляющий «Ависта Модуль Инжиниринг»',
      scope: 'Общий контур проекта и управленческие решения',
      image: '/official/team-skorodumov.webp'
    },
    {
      name: 'Коренев Павел Александрович',
      role: 'Начальник отдела продаж',
      scope: 'Запрос заказчика, исходные данные и коммерческий контур',
      image: '/official/team-korenev.jpg'
    },
    {
      name: 'Тонконогов Александр Сергеевич',
      role: 'Директор по строительству',
      scope: 'Площадка, монтаж и строительный контур',
      image: '/official/team-tonkonogov.jpg'
    },
    {
      name: 'Боровик Сергей Валерьевич',
      role: 'Начальник производства',
      scope: 'Производственная последовательность и выпуск модулей',
      image: '/official/team-borovik.png'
    }
  ];
</script>

<section class="project-team chapter" id="project-team" aria-labelledby="project-team-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Ответственные лица / руководящий состав</p>
      <h2 id="project-team-title">За проектом стоят конкретные специалисты.</h2>
    </div>
    <p>Клиенту важно понимать не только процесс, но и кто отвечает за коммерческий, строительный и производственный контуры. Показываем руководителей из официального раздела команды.</p>
  </div>

  <div class="project-team__grid">
    {#each team as person, index}
      <article>
        <div class="project-team__portrait">
          <img src={person.image} width="720" height="900" alt={person.name} loading="lazy" />
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div class="project-team__copy">
          <p>{person.role}</p>
          <h3>{person.name}</h3>
          <span>{person.scope}</span>
        </div>
      </article>
    {/each}
  </div>
</section>
