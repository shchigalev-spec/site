<script lang="ts">
  const functions = ['Общежития', 'Столовая', 'АБК', 'БПК', 'Медпункт', 'Спорт / досуг', 'КПП', 'Инженерные модули', 'Переходы'];
  const decisions = [
    { label: 'Численность и сменность', text: 'Определяют состав жилых, бытовых и общественных функций.' },
    { label: 'Эксплуатация', text: 'Фиксируем питание, санитарные сценарии, медицину, досуг и инженерную нагрузку.' },
    { label: 'Регион и площадка', text: 'Связываем климат, маршрут, подготовку площадки и последовательность монтажа.' }
  ];
</script>

<section class="shift-logic chapter" aria-labelledby="shift-logic-title">
  <div class="chapter__heading chapter__heading--split"><div><p class="eyebrow">Посёлок как система</p><h2 id="shift-logic-title">Состав следует за людьми и режимом эксплуатации.</h2></div><p>Набор зданий не копируется из каталога: его определяют численность, сменность, бытовые сценарии, инженерия и регион.</p></div>
  <div class="shift-logic__body"><ul aria-label="Функциональный состав вахтового поселка">{#each functions as item}<li>{item}</li>{/each}</ul><dl>{#each decisions as item}<div><dt>{item.label}</dt><dd>{item.text}</dd></div>{/each}</dl></div>
</section>
