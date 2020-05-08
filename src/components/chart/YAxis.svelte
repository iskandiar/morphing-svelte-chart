<script>
  export let ticks, scale, padding;
</script>

<g class="axis y-axis" transform="translate(0, {padding.top})">
  {#if ticks}
    {#each ticks as tick, index}
      <g class="tick tick-{tick}" transform="translate(0, {scale(tick) - padding.bottom})">
        <line x2="100%"></line>
        <text y="-4">{(index === 1 || index ===2) ? `$${tick.toFixed(2)}` : ''}</text>
      </g>
    {/each}
  {/if}
</g>

<style>
  .tick {
    font-size: .725em;
    font-weight: 200;
  }

  .tick line {
    stroke: #e6e6e6;
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #666;
    text-anchor: start;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }

  .x-axis .tick text {
    text-anchor: middle;
  }
</style>
