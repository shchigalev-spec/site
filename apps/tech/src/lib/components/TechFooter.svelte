<script lang="ts">
  import { track } from '$lib/analytics';
  export let phone = '';
  export let email = '';
</script>

<footer class="footer">
  <picture class="footer-plate" aria-hidden="true">
    <source media="(max-width: 960px)" srcset="/generated/tech-final-quiet-960.webp" type="image/webp" />
    <source srcset="/generated/tech-final-quiet.webp" type="image/webp" />
    <img src="/generated/tech-final-quiet.png" alt="" width="1672" height="941" loading="lazy" decoding="async" />
  </picture>
  <div class="shell footer-grid">
    <div class="footer-statement">
      <span class="mono">ТИХОЕ СОСТОЯНИЕ / 11</span>
      <p class="display">15 лет работаем с шумом и вибрацией.</p>
    </div>
    <div class="footer-action">
      <p>Сначала найдём причину шума. Потом спроектируем тишину.</p>
      <a class="button" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: 'footer' })}>Разобрать мой шум</a>
    </div>
    <nav aria-label="Разделы сайта">
      <a href="/shumoizolyatsiya-kvartiry/">Шумоизоляция квартиры</a>
      <a href="/shumoizolyatsiya-sten/">Стены</a>
      <a href="/shumoizolyatsiya-potolka/">Потолок</a>
      <a href="/shumoizolyatsiya-pola/">Пол</a>
      <a href="/cases/">Кейсы</a>
    </nav>
    <div class="contacts">
      {#if phone}<a href={`tel:${phone.replace(/[^+\d]/g, '')}`} on:click={() => track('phone_click')}>{phone}</a>{/if}
      {#if email}<a href={`mailto:${email}`} on:click={() => track('email_click')}>{email}</a>{/if}
      <a href="/privacy-policy/">Обработка персональных данных</a>
    </div>
    <p class="legal">© {new Date().getFullYear()} Лаборатория тишины. Москва.</p>
    <p class="signal-line" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></p>
  </div>
</footer>

<style>
  .footer {
    position: relative;
    min-height: 95svh;
    padding: clamp(110px, 15vw, 240px) 0 38px;
    overflow: hidden;
    isolation: isolate;
    background: var(--ink-950);
  }

  .footer-plate,
  .footer-plate img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .footer-plate { z-index: -2; }
  .footer-plate img { object-fit: cover; object-position: center; }

  .footer::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(90deg, rgba(7, 9, 8, 0.96) 0 42%, rgba(7, 9, 8, 0.3) 70%);
    pointer-events: none;
  }

  .footer::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 45%;
    background: linear-gradient(transparent, var(--ink-950));
    pointer-events: none;
  }

  .footer-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(16, minmax(0, 1fr));
    gap: 24px;
    align-items: end;
  }

  .footer-statement { grid-column: 1 / 10; }
  .footer-statement .mono { color: var(--acoustic); }
  .footer-statement p { margin: 22px 0 0; font-size: clamp(3rem, 7vw, 8rem); }
  .footer-action { grid-column: 11 / -1; padding-bottom: 20px; }
  .footer-action p { max-width: 34ch; color: var(--white-64); }
  nav { grid-column: 1 / 7; margin-top: 90px; display: flex; gap: 12px 24px; flex-wrap: wrap; font-size: 0.86rem; }
  nav a:hover, .contacts a:hover { color: var(--signal); }
  .contacts { grid-column: 10 / -1; display: flex; justify-content: flex-end; gap: 12px 24px; flex-wrap: wrap; font-size: 0.86rem; }
  .legal { grid-column: 1 / 8; margin: 45px 0 0; font-size: 0.76rem; color: var(--white-64); }
  .signal-line { grid-column: 9 / -1; display: flex; align-items: center; gap: 7px; margin: 45px 0 0; }
  .signal-line i { flex: 1; height: 1px; background: var(--white-16); }
  .signal-line i:nth-child(3) { height: 2px; background: var(--acoustic); }

  @media (max-width: 767px) {
    .footer { min-height: 100svh; padding-top: 120px; }
    .footer-plate img { object-position: 62% center; }
    .footer-grid { grid-template-columns: repeat(4, 1fr); }
    .footer-statement, .footer-action, nav, .contacts, .legal, .signal-line { grid-column: 1 / -1; }
    .footer-action { margin-top: 24px; }
    nav { margin-top: 70px; }
    .contacts { justify-content: flex-start; }
  }
</style>
