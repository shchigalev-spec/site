<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { diagnosisHref } from '$lib/navigation';
  const risks = [
    {
      title: 'Чужой проект приходится перепроверять',
      detail: 'До производства нужно подтвердить нагрузки, оси, инженерные вводы и узлы стыковки. Иначе корректировки переходят на площадку.'
    },
    {
      title: 'Границы ответственности расходятся',
      detail: 'Основание, доставка, монтаж и подключения могут оказаться между договорами — без одного ответственного за общий результат.'
    },
    {
      title: 'Несовпадение обнаруживается при монтаже',
      detail: 'Если площадка, модули и инженерия проверялись отдельно, доработка начинается в момент, когда график уже запущен.'
    },
    {
      title: 'Стартовая экономия превращается в задержку',
      detail: 'Дополнительные согласования, повторная поставка и мобилизация могут сдвинуть ввод объекта и изменить итоговый бюджет.'
    }
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
      <p class="eyebrow">Риски на стыках / до выхода в производство</p>
      <h2 id="price-title">Экономия на одном этапе может сорвать общий график.</h2>
    </div>
    <p>Когда проект, производство, доставка и монтаж разделены между участниками, недостающая работа не исчезает. Она возвращается в виде доработок и новых согласований.</p>
  </div>

  <div class="price-scope__risks" aria-label="Риски раздельной реализации проекта">
    {#each risks as risk, index}
      <article>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h3>{risk.title}</h3>
        <p>{risk.detail}</p>
      </article>
    {/each}
  </div>

  <div class="price-scope__chain" aria-label="Возможная цепочка проектного риска">
    <span class="mono-label">Цепочка риска</span>
    <p><strong>Неполные исходные данные</strong><i>→</i><strong>несогласованный стык</strong><i>→</i><strong>доработка на площадке</strong><i>→</i><strong>сдвиг запуска</strong></p>
  </div>

  <div class="price-scope__footer">
    <div>
      <span class="mono-label">До выбора схемы работ</span>
      <p>Проверим исходные данные, границы ответственности и критические стыки — до запуска производства.</p>
    </div>
    <a class="button button--primary" href={diagnosisHref(page.url, 'standard', '#project-brief')} onclick={() => trackEvent('final_cta_start', { placement: 'risk-scope' })}>Проверить риски проекта</a>
  </div>
</section>
