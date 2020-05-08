<script>
  export let path, area, color;
</script>

<path class="area" d={area} fill={color}></path>
<path class="line" d={path} stroke={color}></path>

<style>
  .line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
    transition: stroke 0.5s ease;
  }

  .area {
    transition: fill 0.5s ease;
    opacity: 0.2;
  }
</style>
