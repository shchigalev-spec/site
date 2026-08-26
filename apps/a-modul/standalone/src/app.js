(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function changeImage(container, image, source, alt) {
    const apply = () => {
      image.src = source;
      image.alt = alt;
      container?.classList.remove('is-changing');
    };
    if (reducedMotion || !container) {
      apply();
      return;
    }
    container.classList.add('is-changing');
    window.setTimeout(apply, 150);
  }

  function setSelected(buttons, activeButton, attribute = 'aria-selected') {
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.setAttribute(attribute, String(active));
      button.tabIndex = active ? 0 : -1;
    });
  }

  function addTabKeyboard(buttons, activate) {
    buttons.forEach((button, index) => {
      button.addEventListener('keydown', (event) => {
        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        activate(buttons[nextIndex]);
        buttons[nextIndex].focus();
      });
    });
  }

  const routeData = {
    general: {
      index: '01',
      eyebrow: 'Модульные здания под ключ по России',
      title: 'Спроектируем, произведём и запустим модульный объект в вашем регионе.',
      support: 'От отдельного АБК до комплекса зданий: проектирование, производство, инженерия, доставка, монтаж и комплектация под одним договором.',
      object: 'Другой объект',
      hero: '{{GENERAL_HERO}}',
      final: '{{GENERAL_FINAL}}',
      heroAlt: 'Визуализация модульного комплекса на удалённой производственной площадке',
      finalAlt: 'Визуализация завершённого модульного комплекса с благоустроенным двором и связанными входами',
      caption: 'Визуализация состава объекта — не документальная фотография'
    },
    shift: {
      index: '02',
      eyebrow: '58 реализованных вахтовых поселков',
      title: 'Вахтовый поселок под ключ — от проекта до заселения.',
      support: 'Общежития, столовые, АБК, БПК, медпункты и инженерная инфраструктура. Рассчитываем состав, логистику и график под регион и численность персонала.',
      object: 'Вахтовый поселок',
      hero: '{{SHIFT_HERO}}',
      final: '{{SHIFT_FINAL}}',
      heroAlt: 'Визуализация состава вахтового поселка в Камчатском крае',
      finalAlt: 'Визуализация завершённого вахтового поселка с крытыми переходами и благоустроенными маршрутами',
      caption: 'Архитектурная визуализация — не фотография объекта'
    },
    office: {
      index: '03',
      eyebrow: 'Административные и рабочие пространства заводской готовности',
      title: 'Модульные офисы и АБК под задачу, численность и регион.',
      support: 'Проектируем планировку, производим модули, оснащаем инженерией, доставляем и монтируем на объекте.',
      object: 'Офис или АБК',
      hero: '{{OFFICE_HERO}}',
      final: '{{OFFICE_FINAL}}',
      heroAlt: 'Архитектурная визуализация двухэтажного АБК',
      finalAlt: 'Визуализация завершённого модульного АБК с доступным входом и благоустроенной площадкой',
      caption: 'Визуализация по открытым данным кейса — не фотография объекта'
    },
    dorm: {
      index: '04',
      eyebrow: 'Жильё для персонала на удалённых объектах',
      title: 'Модульное общежитие с инженерией, мебелью и монтажом.',
      support: 'Подбираем вместимость и планировку, учитываем климат, логистику и эксплуатацию. Один подрядчик отвечает за объект от проекта до ввода.',
      object: 'Общежитие',
      hero: '{{DORM_HERO}}',
      final: '{{DORM_FINAL}}',
      heroAlt: 'Визуализация трёх двухэтажных модульных общежитий',
      finalAlt: 'Визуализация завершённого модульного общежития с крытыми переходами и благоустроенным двором',
      caption: 'Архитектурная визуализация — не фотография объекта'
    }
  };

  let activeRoute = 'general';
  let activeHeroState = 'hero';
  const routeButtons = $$('[data-route]');
  const heroStateButtons = $$('[data-hero-state]');
  const heroVisual = $('.hero__visual');
  const heroImage = $('#route-hero-image');

  function renderRoute(routeKey) {
    activeRoute = routeKey;
    activeHeroState = 'hero';
    const route = routeData[routeKey];
    $('#hero-eyebrow').textContent = route.eyebrow;
    $('#hero-title').textContent = route.title;
    $('#hero-support').textContent = route.support;
    $('#route-index').textContent = route.index;
    $('#route-hero-caption').textContent = route.caption;
    changeImage(heroVisual, heroImage, route.hero, route.heroAlt);
    setSelected(routeButtons, routeButtons.find((button) => button.dataset.route === routeKey));
    heroStateButtons.forEach((button) => {
      const active = button.dataset.heroState === 'hero';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const leadObject = $('#offline-lead-form [name="objectType"]');
    if (leadObject) leadObject.value = route.object;
  }

  routeButtons.forEach((button) => button.addEventListener('click', () => renderRoute(button.dataset.route)));
  addTabKeyboard(routeButtons, (button) => renderRoute(button.dataset.route));

  heroStateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeHeroState = button.dataset.heroState;
      const route = routeData[activeRoute];
      heroStateButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      changeImage(heroVisual, heroImage, route[activeHeroState], activeHeroState === 'hero' ? route.heroAlt : route.finalAlt);
    });
  });

  const menuButton = $('.menu-toggle');
  const siteNavigation = $('#site-navigation');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNavigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    siteNavigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  $$('a', siteNavigation).forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  const miniBrief = $('#mini-brief');
  const briefSteps = $$('.brief-step', miniBrief);
  const briefBack = $('[data-brief-back]');
  const briefNext = $('[data-brief-next]');
  const briefError = $('.brief-error');
  const briefResult = $('.brief-result');
  let currentBriefStep = 0;

  function updateBriefStep() {
    briefSteps.forEach((step, index) => {
      const active = index === currentBriefStep;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });
    $('[data-brief-step]').textContent = String(currentBriefStep + 1).padStart(2, '0');
    $('[data-brief-progress]').style.width = `${(currentBriefStep + 1) * 25}%`;
    briefBack.hidden = currentBriefStep === 0;
    briefNext.textContent = currentBriefStep === briefSteps.length - 1 ? 'Собрать контур' : 'Следующий шаг';
    briefError.textContent = '';
  }

  function validateBriefStep() {
    const data = new FormData(miniBrief);
    if (currentBriefStep === 0 && !data.get('object')) return 'Выберите тип объекта.';
    if (currentBriefStep === 1 && !data.get('people') && !data.get('area')) return 'Укажите численность или ориентир по площади.';
    if (currentBriefStep === 2 && !data.get('region')) return 'Выберите регион проекта.';
    if (currentBriefStep === 3 && !data.get('stage')) return 'Выберите текущую стадию проекта.';
    return '';
  }

  function showBriefResult() {
    const data = new FormData(miniBrief);
    const scale = [data.get('people') ? `${data.get('people')} чел.` : '', data.get('area') ? `${data.get('area')} м²` : ''].filter(Boolean).join(' · ');
    const values = [
      ['Объект', data.get('object')],
      ['Масштаб', scale],
      ['Регион', data.get('region')],
      ['Стадия', data.get('stage')]
    ];
    $('[data-brief-summary]').replaceChildren(...values.map(([term, description]) => {
      const wrapper = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = term;
      dd.textContent = description;
      wrapper.append(dt, dd);
      return wrapper;
    }));
    miniBrief.hidden = true;
    briefResult.hidden = false;
    const leadForm = $('#offline-lead-form');
    leadForm.elements.objectType.value = data.get('object');
    leadForm.elements.region.value = data.get('region');
    leadForm.elements.scale.value = scale;
    leadForm.elements.mode.value = data.get('stage');
    briefResult.focus?.();
  }

  briefNext.addEventListener('click', () => {
    const error = validateBriefStep();
    if (error) {
      briefError.textContent = error;
      const firstControl = $('input, select', briefSteps[currentBriefStep]);
      firstControl?.focus();
      return;
    }
    if (currentBriefStep === briefSteps.length - 1) {
      showBriefResult();
      return;
    }
    currentBriefStep += 1;
    updateBriefStep();
    $('input, select', briefSteps[currentBriefStep])?.focus();
  });

  briefBack.addEventListener('click', () => {
    currentBriefStep = Math.max(0, currentBriefStep - 1);
    updateBriefStep();
  });

  $('[data-brief-restart]').addEventListener('click', () => {
    briefResult.hidden = true;
    miniBrief.hidden = false;
    currentBriefStep = 0;
    updateBriefStep();
  });

  const tenderLink = $('[data-mode-link="tender"]');
  tenderLink.addEventListener('click', () => {
    $('#offline-lead-form [name="mode"]').value = 'Идёт тендер';
  });

  const storyData = [
    { image: '{{GENERAL_EMPTY}}', title: 'Площадка', description: 'Начинаем с подготовленной площадки, границ объекта и исходных инженерных подключений.', alt: 'Визуализация подготовленной площадки для модульного объекта' },
    { image: '{{GENERAL_PARTIAL}}', title: 'Сборка', description: 'Первые модули показывают композицию, подъезды и монтажную очередность до полного замыкания объекта.', alt: 'Визуализация частично собранного модульного комплекса' },
    { image: '{{GENERAL_HERO}}', title: 'Запуск', description: 'Готовность зданий, инженерных подключений и безопасных маршрутов проверяется как единый контур.', alt: 'Визуализация готового модульного комплекса на удалённой площадке' },
    { image: '{{GENERAL_FINAL}}', title: 'Эксплуатация', description: 'Финальный контур связывает готовые здания, доступные входы и благоустроенные маршруты по площадке.', alt: 'Визуализация завершённого модульного комплекса с благоустроенным двором' }
  ];
  const storyButtons = $$('[data-story]');
  const storyImage = $('#story-image');
  function renderStory(button) {
    const index = Number(button.dataset.story);
    const item = storyData[index];
    setSelected(storyButtons, button);
    changeImage($('.story-visual'), storyImage, item.image, item.alt);
    $('#story-caption-title').textContent = item.title;
    $('#story-caption').textContent = item.description;
  }
  storyButtons.forEach((button) => button.addEventListener('click', () => renderStory(button)));
  addTabKeyboard(storyButtons, renderStory);

  const configuratorForm = $('#configurator-form');
  function updateConfigurator() {
    const data = new FormData(configuratorForm);
    const type = data.get('type');
    const people = data.get('people');
    const region = data.get('region');
    const scope = data.getAll('scope');
    $('[data-people-output]').textContent = `${people} человек`;
    $('[data-config-title]').textContent = `${type} · ${people} человек`;
    $('[data-config-note]').textContent = `Регион: ${region}. В контур включено: ${scope.length ? scope.join(', ').toLowerCase() : 'границы работ требуют уточнения'}.`;
  }
  configuratorForm.addEventListener('input', updateConfigurator);
  configuratorForm.addEventListener('change', updateConfigurator);
  $('[data-config-transfer]').addEventListener('click', () => {
    const data = new FormData(configuratorForm);
    const leadForm = $('#offline-lead-form');
    leadForm.elements.objectType.value = data.get('type');
    leadForm.elements.region.value = data.get('region');
    leadForm.elements.scale.value = `${data.get('people')} человек`;
  });

  const logisticsData = {
    road: { number: '01', title: 'Автомобильная доставка', image: '{{LOGISTICS_ROAD}}', alt: 'Визуализация автомобильной перевозки готового модуля', description: 'Проверяем габариты, ограничения дорог, точки перегрузки, подъезд к площадке и очередность машин.', checks: ['габариты и ограничения', 'подъезд и разгрузка', 'очередность партий'] },
    rail: { number: '02', title: 'Железнодорожная схема', image: '{{LOGISTICS_RAIL}}', alt: 'Визуализация железнодорожной перевозки модульных конструкций', description: 'Связываем станции отправления и назначения, перегрузку, крепление и последующее автомобильное плечо.', checks: ['станции и терминалы', 'перегрузка и крепление', 'последняя миля'] },
    sea: { number: '03', title: 'Морская доставка', image: '{{LOGISTICS_SEA}}', alt: 'Визуализация морской перевозки модулей на удалённую площадку', description: 'Учитываем портовую обработку, график выхода судов, упаковку и сухопутное плечо до площадки.', checks: ['портовая обработка', 'график судна', 'стыковка плеч маршрута'] },
    winter: { number: '04', title: 'Доставка по зимнику', image: '{{LOGISTICS_WINTER}}', alt: 'Визуализация доставки модулей по зимней дороге', description: 'Сезонное окно, готовность партии и площадки должны быть синхронизированы до начала отправки.', checks: ['сезонное окно', 'готовность партии', 'резервный сценарий'] }
  };
  const logisticsButtons = $$('[data-logistics]');
  function renderLogistics(button) {
    const item = logisticsData[button.dataset.logistics];
    setSelected(logisticsButtons, button);
    changeImage($('.logistics-layout figure'), $('#logistics-image'), item.image, item.alt);
    $('#logistics-number').textContent = item.number;
    $('#logistics-mode').textContent = item.title;
    $('#logistics-description').textContent = item.description;
    $('#logistics-checks').replaceChildren(...item.checks.map((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
  }
  logisticsButtons.forEach((button) => button.addEventListener('click', () => renderLogistics(button)));
  addTabKeyboard(logisticsButtons, renderLogistics);

  const factoryData = [
    { image: '{{FACTORY_METAL}}', title: 'Подготовка металла', alt: 'Визуализация подготовки металла для модульного производства' },
    { image: '{{FACTORY_FRAME}}', title: 'Сборка каркаса', alt: 'Визуализация сборки металлического каркаса модуля' },
    { image: '{{FACTORY_ENVELOPE}}', title: 'Тепловой контур', alt: 'Визуализация формирования ограждающего контура модуля' },
    { image: '{{FACTORY_ENGINEERING}}', title: 'Инженерные сети', alt: 'Визуализация монтажа инженерных сетей внутри модуля' },
    { image: '{{FACTORY_FINISHING}}', title: 'Внутренняя отделка', alt: 'Визуализация внутренней отделки модульного здания' },
    { image: '{{FACTORY_CONTROL}}', title: 'Контроль качества', alt: 'Визуализация заводского контроля качества готового модуля' },
    { image: '{{FACTORY_SHIPMENT}}', title: 'Подготовка к отгрузке', alt: 'Визуализация подготовки готового модуля к отгрузке' }
  ];
  const factoryButtons = $$('[data-factory]');
  function renderFactory(button) {
    const index = Number(button.dataset.factory);
    const item = factoryData[index];
    setSelected(factoryButtons, button);
    changeImage($('.factory-visual'), $('#factory-image'), item.image, item.alt);
    $('#factory-stage').textContent = `${String(index + 1).padStart(2, '0')} / 07`;
    $('#factory-caption').textContent = item.title;
  }
  factoryButtons.forEach((button) => button.addEventListener('click', () => renderFactory(button)));
  addTabKeyboard(factoryButtons, renderFactory);

  const leadForm = $('#offline-lead-form');
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = $('.offline-result');
    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      result.hidden = true;
      return;
    }
    const data = new FormData(leadForm);
    const items = [
      `Объект: ${data.get('objectType')}`,
      `Регион: ${data.get('region')}`,
      `Масштаб: ${data.get('scale') || 'уточняется'}`,
      `Стадия: ${data.get('mode')}`
    ];
    const heading = document.createElement('strong');
    heading.textContent = 'Резюме собрано локально. Данные не отправлены.';
    const note = document.createElement('span');
    note.textContent = 'Для реальной передачи исходных данных используйте рабочий сайт, телефон или e-mail компании.';
    const list = document.createElement('ul');
    items.forEach((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    });
    result.replaceChildren(heading, note, list);
    result.hidden = false;
    result.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  });

  updateBriefStep();
  updateConfigurator();
  renderRoute('general');
  document.documentElement.dataset.standalone = 'ready';
})();
