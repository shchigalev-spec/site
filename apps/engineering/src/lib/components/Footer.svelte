<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { track } from '$lib/analytics';

  const phone = env.PUBLIC_SITE_PHONE || '';
  const email = env.PUBLIC_SITE_EMAIL || '';
  $: phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : '';
</script>

<footer class="site-footer">
  <div class="footer-brand">Лаборатория тишины</div>
  <div class="footer-index">
    <a href="/shumoizolyatsiya-kvartiry/">Шумоизоляция квартиры</a>
    <a href="/shumoizolyatsiya-sten/">Стены</a>
    <a href="/shumoizolyatsiya-potolka/">Потолок</a>
    <a href="/shumoizolyatsiya-pola/">Пол</a>
    <a href="/cases/">Результаты</a>
    <a href="/privacy-policy/">Конфиденциальность</a>
  </div>
  <div class="footer-contacts">
    {#if phone}<a href={phoneHref} on:click={() => track('phone_click', { source: 'footer' })}>{phone}</a>{/if}
    {#if email}<a href={`mailto:${email}`} on:click={() => track('email_click', { source: 'footer' })}>{email}</a>{/if}
    <a class="text-link" href="/diagnostika-shuma/">Записаться на диагностику</a>
  </div>
  <div class="footer-meta">Москва · Инженерная шумоизоляция квартир и домов</div>
</footer>
