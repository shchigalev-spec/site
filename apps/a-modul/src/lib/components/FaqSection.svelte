<script lang="ts">
  let { faq }: { faq: { question: string; answer: string }[] } = $props();
</script>

<section class="faq chapter" aria-labelledby="faq-title">
  <div class="chapter__heading chapter__heading--split">
    <div><p class="eyebrow">Вопросы до расчёта</p><h2 id="faq-title">Что важно зафиксировать.</h2></div>
    <p>Ответы задают границы предварительного предложения. Точные параметры определяются по исходным данным проекта.</p>
  </div>
  <div class="faq__list">
    {#each faq as item, index}
      <details open={index === 0}><summary>{item.question}</summary><p>{item.answer}</p></details>
    {/each}
  </div>
</section>
