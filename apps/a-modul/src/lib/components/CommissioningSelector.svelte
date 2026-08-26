<script lang="ts">
  import { commissioningOptions, isExactCommissioningMonth } from '$lib/state/projectContext';

  export let value = '';
  export let inputName = 'commissioning';
  export let errorId = '';
  export let invalid = false;
  export let onValueChange: (value: string) => void = () => {};

  const currentYear = new Date().getUTCFullYear();
  const years = Array.from({ length: 11 }, (_, index) => String(currentYear + index));
  const months = [
    ['01', 'Январь'], ['02', 'Февраль'], ['03', 'Март'], ['04', 'Апрель'],
    ['05', 'Май'], ['06', 'Июнь'], ['07', 'Июль'], ['08', 'Август'],
    ['09', 'Сентябрь'], ['10', 'Октябрь'], ['11', 'Ноябрь'], ['12', 'Декабрь']
  ];

  let selected = isExactCommissioningMonth(value) ? 'exact' : value;
  let exactMonth = isExactCommissioningMonth(value) ? value.slice(5, 7) : '';
  let exactYear = isExactCommissioningMonth(value) ? value.slice(0, 4) : '';
  let hiddenInput: HTMLInputElement;

  $: if (hiddenInput && hiddenInput.value !== value) {
    hiddenInput.value = value;
    hiddenInput.setAttribute('value', value);
  }

  $: if (isExactCommissioningMonth(value) && value !== `${exactYear}-${exactMonth}`) {
    selected = 'exact';
    exactYear = value.slice(0, 4);
    exactMonth = value.slice(5, 7);
  }
  $: if (value && !isExactCommissioningMonth(value) && value !== selected) selected = value;

  function commit(nextValue: string) {
    value = nextValue;
    if (hiddenInput) {
      hiddenInput.value = nextValue;
      hiddenInput.setAttribute('value', nextValue);
    }
    onValueChange(nextValue);
  }

  function select(nextValue: string) {
    selected = nextValue;
    if (nextValue === 'exact') {
      commit(exactYear && exactMonth ? `${exactYear}-${exactMonth}` : '');
      return;
    }
    commit(nextValue);
  }

  function updateExact() {
    selected = 'exact';
    commit(exactYear && exactMonth ? `${exactYear}-${exactMonth}` : '');
  }
</script>

<div class="commissioning" data-commissioning-control aria-invalid={invalid ? 'true' : 'false'} aria-describedby={errorId || undefined}>
  <input bind:this={hiddenInput} type="hidden" name={inputName} {value} />
  <div class="commissioning__options" role="group" aria-label="Планируемый ввод в эксплуатацию">
    {#each commissioningOptions as option}
      <button
        type="button"
        class:active={selected === option.value}
        aria-pressed={selected === option.value}
        onclick={() => select(option.value)}
      >{option.label}</button>
    {/each}
    <button type="button" class:active={selected === 'exact'} aria-pressed={selected === 'exact'} onclick={() => select('exact')}>Есть точная дата</button>
  </div>
  {#if selected === 'exact'}
    <div class="commissioning__exact" aria-label="Точный месяц ввода">
      <label>
        <span>Месяц</span>
        <select bind:value={exactMonth} onchange={updateExact}>
          <option value="">Выберите</option>
          {#each months as month}<option value={month[0]}>{month[1]}</option>{/each}
        </select>
      </label>
      <label>
        <span>Год</span>
        <select bind:value={exactYear} onchange={updateExact}>
          <option value="">Выберите</option>
          {#each years as year}<option value={year}>{year}</option>{/each}
        </select>
      </label>
    </div>
  {/if}
</div>
