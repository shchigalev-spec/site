<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { diagnosisHref } from '$lib/navigation';
  const rows = [
    { item: 'Исходные данные и проект', module: 'не входят', launch: 'фиксируем состав и границы' },
    { item: 'Производство модулей', module: 'входит', launch: 'входит' },
    { item: 'Внутренняя инженерия', module: 'нужно уточнить', launch: 'согласуем по зданию' },
    { item: 'Комплектация и мебель', module: 'нужно уточнить', launch: 'согласуем по функции' },
    { item: 'Упаковка и доставка', module: 'не входят', launch: 'считаем по маршруту' },
    { item: 'Основание и площадка', module: 'не входят', launch: 'определяем ответственность' },
    { item: 'Монтаж и стыковка', module: 'не входят', launch: 'включаем в общий график' },
    { item: 'Пусконаладка', module: 'не входит', launch: 'уточняем по договору' }
  ];

  let section: HTMLElement;
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      trackEvent('price_scope_open');
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  });
</script>

<section bind:this={section} class="price-scope chapter" id="price-scope" aria-labelledby="price-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Полнота цены / без универсального ₽ за м²</p>
      <h2 id="price-title">Сравнивайте не цену модуля, а стоимость запуска объекта.</h2>
    </div>
    <p>Одна цифра без состава работ не показывает, кто отвечает за проект, маршрут, площадку, монтаж и готовность здания к эксплуатации.</p>
  </div>

  <div class="price-scope__matrix" role="table" aria-label="Сравнение цены модуля и стоимости запуска объекта">
    <div class="matrix__row matrix__head" role="row">
      <span role="columnheader">Контур</span><span role="columnheader">Только модуль</span><span role="columnheader">Запуск объекта</span>
    </div>
    {#each rows as row, index}
      <div class="matrix__row" role="row">
        <span role="cell"><i>{String(index + 1).padStart(2, '0')}</i>{row.item}</span>
        <span role="cell">{row.module}</span>
        <span role="cell"><strong>{row.launch}</strong></span>
      </div>
    {/each}
  </div>

  <div class="price-scope__footer">
    <div>
      <span class="mono-label">Опция финансирования</span>
      <p>Возможна поставка в лизинг.</p>
    </div>
    <a class="button button--primary" href={diagnosisHref(page.url, 'leasing', '#full-brief')} onclick={() => trackEvent('leasing_click', { placement: 'price-scope' })}>Уточнить лизинговую схему</a>
  </div>
</section>
