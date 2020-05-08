<script>
  export let ticks, scale, padding, height;

  import { format } from 'date-fns'
</script>

<g class="axis x-axis">
  {#each ticks as tick}
    <g class="tick tick-{ tick }" transform="translate({scale(tick)},{height})">
      <line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0"></line>
      <text y="-2">{format(tick, "MM/dd")}</text>
    </g>
  {/each}
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
