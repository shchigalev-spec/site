<script lang="ts">
  import { publicContacts } from '$lib/content/facts';
  import { trackEvent } from '$lib/analytics';
</script>

<footer class="site-footer">
  <img src="/brand/avista-logo-white.svg" width="68" height="84" alt="" aria-hidden="true" />
  <p>Проектируем, производим и запускаем модульные объекты по России.</p>
  <a href={publicContacts.phoneHref} onclick={() => trackEvent('phone_click', { placement: 'footer' })}>{publicContacts.phoneDisplay}</a>
  <a href={`mailto:${publicContacts.email}`} onclick={() => trackEvent('email_click', { placement: 'footer' })}>{publicContacts.email}</a>
  <a href="/privacy-policy/">Политика конфиденциальности</a>
</footer>
