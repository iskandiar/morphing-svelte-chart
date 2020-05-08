<script>
  export let coords, height, padding, color;
</script>

{#if coords}
  <line x1={coords.x} y1="0" x2={coords.x} y2={(height - padding.bottom)} />
  <circle cx={coords.x} cy={coords.y} r="5" fill={color}/>
{/if}

<style>
  line {
    stroke: rgb(220,220,220);
    stroke-width: 1;
  }
</style>
