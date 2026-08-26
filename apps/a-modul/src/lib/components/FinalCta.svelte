<script lang="ts">
  import { page } from '$app/state';
  import { trackEvent } from '$lib/analytics';
  import { diagnosisHref } from '$lib/navigation';
</script>

<section class="final-cta" aria-labelledby="final-cta-title">
  <picture>
    <source media="(max-width: 760px)" type="image/avif" srcset="/generated/a-modul-final-cta-v2-mobile.avif" />
    <source media="(max-width: 760px)" type="image/webp" srcset="/generated/a-modul-final-cta-v2-mobile.webp" />
    <source type="image/avif" srcset="/generated/a-modul-final-cta-v2-desktop.avif" />
    <img src="/generated/a-modul-final-cta-v2-desktop.webp" width="1920" height="1080" alt="Концептуальная визуализация работающего модульного комплекса в зимнем северном регионе" loading="lazy" />
  </picture>
  <div class="final-cta__shade"></div>
  <div class="final-cta__copy">
    <p class="eyebrow">Следующий инженерный шаг</p>
    <h2 id="final-cta-title">Зафиксируем исходные данные и соберём контур вашего объекта.</h2>
    <p>Сопоставим задачу с опубликованным аналогом, проверим логистику и состав исходных данных для коммерческого предложения.</p>
    <div class="final-cta__actions">
      <div>
        <a class="button button--primary" href={diagnosisHref(page.url, 'standard')} onclick={() => trackEvent('final_cta_start', { mode: 'standard' })}>Получить КП за 1 рабочий день</a>
        <span>После получения основных исходных данных.</span>
      </div>
      <a class="button button--light" href={diagnosisHref(page.url, 'tender')} onclick={() => trackEvent('final_cta_start', { mode: 'tender' })}>Пригласить в тендер</a>
    </div>
    <span class="visualization-label">Концептуальная визуализация объекта — не фотография реализованного проекта</span>
  </div>
</section>
