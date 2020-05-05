<script>
  import { spring } from 'svelte/motion';

  import CounterNumber from './CounterNumber.svelte';
  import CounterText from './CounterText.svelte';

  export let value;

  let total = [];
  let fract = [];

  $: {
    if (value) {
      const split = value.toString().split(".")
      total = split[0] ? split[0].split("").map((digit, idx) => ({ val: parseInt(digit), key: `t-${split[0].length - idx}` })) : []
      fract = split[1] ? split[1].split("").map((digit, idx) => ({ val: parseInt(digit), key: `f-${idx}` })) : []
    }
  }
</script>

<style>
  .number {
    font-size: 30px;
  }
</style>

<div>
  {#if value}
    {#each total as digit (digit.key)}
      <CounterNumber number={digit.val} />
    {/each}
    <CounterText value=","/>
    {#each fract as digit (digit.key)}
      <CounterNumber number={digit.val} />
    {/each}
    <CounterText value="USD" />
  {/if}
</div>
