<script lang="ts">
  export let mode: 'both' | 'case' | 'seismic' = 'both';
</script>

{#if mode === 'both' || mode === 'case'}<section class="dominant-case chapter" id="case" aria-labelledby="case-title">
  <div class="dominant-case__visual">
    <picture>
      <source media="(max-width: 760px)" type="image/avif" srcset="/generated/a-modul-case-kamchatka-v2-mobile.avif" />
      <source media="(max-width: 760px)" type="image/webp" srcset="/generated/a-modul-case-kamchatka-v2-mobile.webp" />
      <source type="image/avif" srcset="/generated/a-modul-case-kamchatka-v2-desktop.avif" />
      <img src="/generated/a-modul-case-kamchatka-v2-desktop.webp" width="1920" height="1080" alt="Концептуальная визуализация удалённого зимнего модульного посёлка в Камчатском крае" loading="lazy" />
    </picture>
    <span class="visualization-label">Визуализация объекта. Факты приведены по реализованному проекту.</span>
  </div>

  <div class="dominant-case__copy">
    <p class="eyebrow">Доминирующий кейс / Камчатский край</p>
    <h2 id="case-title">Посёлок, где состав и маршрут нельзя рассматривать отдельно.</h2>
    <dl>
      <div><dt>Задача</dt><dd>Вахтовый посёлок для золоторудного проекта</dd></div>
      <div><dt>Площадь</dt><dd>2 476,36 м²</dd></div>
      <div><dt>Модульный состав</dt><dd>105 одиночных модулей с крыльцами</dd></div>
      <div><dt>Функции</dt><dd>Столовая, АБК, БПК, обсерватор, спортзал, баня и переходы</dd></div>
      <div><dt>Инженерный вызов</dt><dd>Свести разные функции и комплектацию в одном проектном контуре</dd></div>
      <div><dt>Логистика</dt><dd>Поставку связывали с выходами судов из Петропавловска-Камчатского</dd></div>
      <div><dt>Контур «Ависты»</dt><dd>Проектирование, производство, инженерная и мебельная комплектация, доставка, строительно-монтажные работы</dd></div>
      <div><dt>Период работ</dt><dd>Февраль 2022 — февраль 2023</dd></div>
    </dl>
    <a class="dominant-case__source" href="https://a-modul.ru/object/vakhtoviy-poselok-na-odnom-iz-krupneyshikh-mestorozhdeniy-zolota/" target="_blank" rel="noreferrer">Официальный кейс на a-modul.ru ↗</a>
    <a class="button button--primary" href="#project-brief">Разобрать мой проект</a>
  </div>
</section>
{/if}

{#if mode === 'both' || mode === 'seismic'}<section class="seismic-proof" id="seismic" aria-labelledby="seismic-title">
  <div class="seismic-proof__signal" aria-hidden="true">
    <svg viewBox="0 0 900 180" preserveAspectRatio="none">
      <path d="M0 95h75l18-8 12 18 16-58 18 103 22-77 18 35 24-14h78l14-9 18 27 17-91 24 139 18-72 18 18 28-11h112l17-8 17 22 13-61 19 96 24-57 23 17h180" />
    </svg>
  </div>
  <div class="seismic-proof__copy">
    <p class="eyebrow">Сейсмическое доказательство / опубликованный факт</p>
    <h2 id="seismic-title">Объекты «Ависты» на Камчатке выдержали землетрясение магнитудой 8,8 без разрушений.</h2>
    <p>Сейсмическую активность региона учитываем на этапе проектирования.</p>
    <span>Факт относится к опубликованным объектам на Камчатке и не заменяет расчёт для новой площадки.</span>
  </div>
</section>
{/if}
