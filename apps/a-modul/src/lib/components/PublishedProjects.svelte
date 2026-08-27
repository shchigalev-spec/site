<script lang="ts">
  const projects = [
    {
      title: 'Вахтовый поселок для ГРК «Амикан» на Ведугинском месторождении',
      category: 'Вахтовый посёлок',
      context: 'Удалённая производственная площадка',
      image: '/official/project-amikan.png'
    },
    {
      title: 'Модульный авиавокзал для ООО «АК „Орлан“» в Хабаровском крае',
      category: 'Инфраструктура',
      context: 'Хабаровский край',
      image: '/official/project-orlan.png'
    },
    {
      title: 'Модульные столовая и двухэтажное общежитие «под ключ»',
      category: 'Комплексный объект',
      context: 'Столовая + проживание',
      image: '/official/project-dorm-canteen.jpg'
    },
    {
      title: 'Модульная столовая полного цикла на 200 мест для вахтового поселка',
      category: 'Социальная инфраструктура',
      context: '200 мест',
      image: '/official/project-canteen-200.jpg'
    }
  ];
</script>

<section class="published-projects chapter" id="published-projects" aria-labelledby="published-projects-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Опубликованные объекты / официальные материалы</p>
      <h2 id="published-projects-title">Не абстрактные сценарии. Проекты из открытого портфолио.</h2>
    </div>
    <p>Показываем разные типы задач: удалённый поселок, транспортную инфраструктуру, общежитие и столовую. Названия и изображения взяты из опубликованного портфолио «Ависта Модуль».</p>
  </div>

  <div class="published-projects__grid">
    {#each projects as project, index}
      <article class:published-projects__card--lead={index === 0} class="published-projects__card">
        <img src={project.image} width="1200" height="800" alt={project.title} loading="lazy" />
        <div class="published-projects__copy">
          <p><span>{String(index + 1).padStart(2, '0')}</span>{project.category}</p>
          <h3>{project.title}</h3>
          <strong>{project.context}</strong>
        </div>
      </article>
    {/each}
  </div>
</section>
