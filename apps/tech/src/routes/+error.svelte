<script lang="ts">import { page } from '$app/stores';</script>
<svelte:head><title>{$page.status === 404 ? 'Страница не найдена' : 'Ошибка'} — Лаборатория тишины</title></svelte:head>
<section class="error-page shell">
  <p class="mono">СИГНАЛ / {$page.status}</p>
  <h1 class="display">{$page.status === 404 ? 'Такого маршрута нет.' : 'Сигнал прервался.'}</h1>
  <p>{$page.status === 404 ? 'Вернитесь к карте сайта или начните с описания шума.' : 'Попробуйте вернуться на главную и повторить действие.'}</p>
  <div><a class="button" href="/">На главную</a><a class="button secondary" href="/diagnostika-shuma/">Диагностика</a></div>
</section>
<style>.error-page{min-height:90svh;padding-top:28svh}.error-page>.mono{color:var(--signal)}h1{max-width:12ch;margin:24px 0;font-size:clamp(4rem,9vw,10rem)}.error-page>p:not(.mono){color:var(--white-64)}.error-page>div{display:flex;gap:12px;margin-top:36px}@media(max-width:767px){.error-page>div{flex-direction:column}}</style>
