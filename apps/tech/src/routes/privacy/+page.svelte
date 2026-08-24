<script lang="ts">
  import { page } from '$app/stores';
  import { stableSiteUrl } from '$lib/metadata';
</script>
<svelte:head><title>Обработка персональных данных — Лаборатория тишины</title><meta name="description" content="Информация об обработке данных, передаваемых через форму диагностики." /><link rel="canonical" href={stableSiteUrl($page.url)} /></svelte:head>

<article class="privacy shell">
  <p class="mono">ПРАВОВАЯ ИНФОРМАЦИЯ</p>
  <h1 class="display">Обработка персональных данных</h1>
  <p class="lead">Эта страница описывает техническую основу формы. Реквизиты оператора, сроки хранения и финальная юридическая редакция должны быть утверждены владельцем сайта до публикации.</p>
  <section><h2>Какие данные передаются</h2><p>Имя, телефон, необязательный email, описание шума и объекта, а также файлы, которые пользователь приложил добровольно.</p></section>
  <section><h2>Для чего</h2><p>Чтобы связаться по заявке, уточнить задачу и согласовать следующий шаг диагностики.</p></section>
  <section><h2>Файлы</h2><p>План, фото, видео и аудиозаписи используются как контекст задачи. Запись с телефона не заменяет профессиональный замер.</p></section>
  <section><h2>Передача данных</h2><p>Форма подготовлена для передачи заявки в CRM Bitrix. Без подтверждения сервера интерфейс не показывает успешную отправку.</p></section>
  <a class="button" href="/diagnostika-shuma/">Вернуться к диагностике</a>
</article>

<style>.privacy{padding-top:clamp(160px,20vw,280px);padding-bottom:clamp(100px,12vw,200px)}.privacy>.mono{color:var(--acoustic)}h1{max-width:13ch;margin:25px 0;font-size:clamp(3.5rem,7vw,8rem)}.privacy>.lead{margin:40px 0 90px}section{max-width:780px;margin-left:25%;padding:32px 0;border-top:1px solid var(--white-16)}section h2{font-family:'Geologica',sans-serif;font-size:clamp(1.6rem,2.4vw,2.8rem)}section p{color:var(--white-64)}.button{margin:60px 0 0 25%}@media(max-width:767px){section,.button{margin-left:0}}</style>
