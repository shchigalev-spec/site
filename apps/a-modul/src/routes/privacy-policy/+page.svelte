<script lang="ts">
  import { publicContacts, publicSiteOrigin } from '$lib/content/facts';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';

  const canonical = `${publicSiteOrigin}/privacy-policy/`;
</script>

<svelte:head>
  <title>Политика обработки персональных данных — Ависта Модуль</title>
  <meta
    name="description"
    content="Информация об обработке данных при обращении через сайт Ависта Модуль Инжиниринг."
  />
  <link rel="canonical" href={canonical} />
  <meta name="robots" content="index,follow" />
</svelte:head>

<a class="skip-link" href="#main">К основному содержанию</a>

<SiteHeader />

<main id="main" tabindex="-1" class="policy-page">
  <header class="policy-page__intro">
    <p class="eyebrow">Обращения через сайт</p>
    <h1>Политика обработки персональных данных</h1>
    <p>
      Эта страница описывает, какие сведения могут быть получены при обращении через посадочные
      страницы «Ависта Модуль» и для чего они используются.
    </p>
  </header>

  <article class="policy-page__content">
    <section aria-labelledby="operator-title">
      <p class="mono-label">01 / Оператор и контакты</p>
      <h2 id="operator-title">К кому относится обращение</h2>
      <p>
        ООО «Ависта Модуль Инжиниринг», ИНН 5404491850, ОГРН 1135476132770.
        Вопросы об обработке данных можно направить на
        <a href={`mailto:${publicContacts.email}`}>{publicContacts.email}</a> или уточнить по телефону
        <a href={publicContacts.phoneHref}>{publicContacts.phoneDisplay}</a>.
      </p>
    </section>

    <section aria-labelledby="data-title">
      <p class="mono-label">02 / Какие данные</p>
      <h2 id="data-title">Сведения, которые передаёт посетитель</h2>
      <p>
        При заполнении формы могут обрабатываться имя, компания, телефон, электронная почта,
        параметры проекта, комментарий и приложенные пользователем файлы. Также сайт может сохранять
        технический контекст обращения: выбранный маршрут и регион, UTM-метки, yclid, источник
        перехода и стандартные данные HTTP-запроса.
      </p>
    </section>

    <section aria-labelledby="purpose-title">
      <p class="mono-label">03 / Для чего</p>
      <h2 id="purpose-title">Цели обработки</h2>
      <p>
        Данные используются, чтобы ответить на запрос, уточнить исходные данные проекта, подготовить
        предварительное коммерческое предложение, обработать приглашение в тендер или запрос по
        лизингу, а также обеспечить работу и безопасность сайта.
      </p>
    </section>

    <section aria-labelledby="handling-title">
      <p class="mono-label">04 / Как обрабатываются</p>
      <h2 id="handling-title">Передача, аналитика и хранение</h2>
      <p>
        Контактные данные поступают только после действия пользователя. Имя, телефон, электронная
        почта, компания, текст комментария и имя файла не должны передаваться в веб-аналитику.
        Технические сервисы и система приёма заявок подключаются владельцем сайта через настройки.
        Сведения хранятся не дольше, чем это необходимо для обработки обращения и выполнения
        применимых требований законодательства.
      </p>
    </section>

    <section aria-labelledby="rights-title">
      <p class="mono-label">05 / Обращение пользователя</p>
      <h2 id="rights-title">Уточнение данных и отзыв согласия</h2>
      <p>
        Пользователь может направить на <a href={`mailto:${publicContacts.email}`}>{publicContacts.email}</a>
        обращение по вопросам доступа к данным, их уточнения, прекращения обработки или отзыва
        согласия. Не отправляйте через форму документы с персональными данными, которые не нужны для
        предварительной оценки проекта.
      </p>
    </section>

    <aside aria-labelledby="approval-title">
      <p class="mono-label">Статус документа</p>
      <h2 id="approval-title">Перед промышленным запуском</h2>
      <p>
        Владелец сайта должен утвердить окончательную юридическую редакцию, включая правовые
        основания, получателей данных, сроки хранения и порядок фиксации согласия. Настоящий текст не
        заменяет такую проверку.
      </p>
    </aside>
  </article>
</main>

<SiteFooter />

<style>
  .policy-page__intro {
    display: grid;
    min-height: 33rem;
    align-content: end;
    padding: clamp(5rem, 9vw, 9rem) clamp(1.25rem, 8vw, 9rem);
    border-bottom: 1px solid var(--line-dark);
  }

  .policy-page__intro h1 { max-width: 16ch; }
  .policy-page__intro > p:last-child {
    max-width: 48rem;
    margin: 2rem 0 0;
    color: var(--warm-muted);
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    line-height: 1.6;
  }

  .policy-page__content {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0;
  }

  .policy-page__content > section,
  .policy-page__content > aside {
    min-width: 0;
    padding: clamp(3rem, 6vw, 6rem) clamp(1.25rem, 6vw, 6rem);
    border-right: 1px solid var(--line-dark);
    border-bottom: 1px solid var(--line-dark);
  }

  .policy-page__content > :nth-child(even) { border-right: 0; }
  .policy-page__content > aside { color: var(--graphite); background: var(--technical); }
  .policy-page__content .mono-label { margin: 0 0 1.25rem; color: var(--pink-accessible); }
  .policy-page__content aside .mono-label { color: var(--purple); }
  .policy-page__content h2 {
    max-width: 18ch;
    font-size: clamp(2rem, 3vw, 3.4rem);
  }
  .policy-page__content p:not(.mono-label) {
    max-width: 52rem;
    margin: 1.5rem 0 0;
    color: var(--warm-muted);
    line-height: 1.7;
  }
  .policy-page__content aside p:not(.mono-label) { color: #38333b; }

  @media (max-width: 820px) {
    .policy-page__intro { min-height: 28rem; }
    .policy-page__content { grid-template-columns: 1fr; }
    .policy-page__content > section,
    .policy-page__content > aside { border-right: 0; }
  }
</style>
