<script>
  import { spring } from 'svelte/motion';
  import { afterUpdate } from 'svelte';

  export let number;

  let size = spring(number);

  afterUpdate(() => {
    size.set(number);
  });

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
</script>

<style>
  .number {
    font-size: 30px;
  }
</style>

<div style="display: inline-block;">
  <div style="overflow: hidden; height: 35px;">
    <div style="position: relative; top: {$size * -35}px;">
      {#each numbers as num, i}
        <div class="number">{num}</div>
    {/each}
    </div>
  </div>
</div>
