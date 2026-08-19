<script lang="ts">import { page } from '$app/stores';</script>

<svelte:head>
  <title>Обработка персональных данных — Лаборатория тишины</title>
  <meta name="description" content="Статус обработки данных в форме диагностики Лаборатории тишины." />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href={`${$page.url.origin}/privacy-policy/`} />
</svelte:head>

<article class="privacy shell">
  <p class="mono">ПРАВОВАЯ ИНФОРМАЦИЯ</p>
  <h1 class="display">Обработка персональных данных</h1>
  <p class="lead">Сайт работает как локальный прототип. До публикации утверждённой политики не передавайте через форму реальные персональные данные и файлы.</p>
  <section><h2>Что подготовлено технически</h2><p>Форма принимает описание шума и объекта, имя, телефон, необязательный email и добровольно приложенные материалы. Успешная отправка показывается только после подтверждения сервера.</p></section>
  <section><h2>Назначение формы</h2><p>Связаться по обращению, уточнить инженерную задачу и согласовать следующий шаг диагностики. Запись с телефона используется только как контекст и не заменяет профессиональный замер.</p></section>
  <section><h2>Условие публикации</h2><p>Обработка реальных обращений должна быть включена только вместе с утверждённой политикой, реквизитами оператора, сроками хранения, правилами работы с вложениями и каналом отзыва согласия.</p></section>
  <a class="button" href="/diagnostika-shuma/">Вернуться к диагностике</a>
</article>

<style>.privacy{padding-top:clamp(160px,20vw,280px);padding-bottom:clamp(100px,12vw,200px)}.privacy>.mono{color:var(--acoustic)}h1{max-width:13ch;margin:25px 0;font-size:clamp(3.5rem,7vw,8rem)}.privacy>.lead{margin:40px 0 90px}section{max-width:780px;margin-left:25%;padding:32px 0;border-top:1px solid var(--white-16)}section h2{font-family:'Geologica',sans-serif;font-size:clamp(1.6rem,2.4vw,2.8rem)}section p{color:var(--white-64)}.button{margin:60px 0 0 25%}@media(max-width:767px){section,.button{margin-left:0}}</style>
