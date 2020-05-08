<script>
  export let dataSet;

  import { afterUpdate, tick } from 'svelte';
  import { spring } from 'svelte/motion';
  import { format } from 'date-fns';
  import { scaleTime, scaleLinear } from 'd3-scale';
  import { calculateChart, calculatePath, calculateArea, getScaledPoints } from './../../utils/chart.js';

  import Counter from './../Counter.svelte';

  import Area from './Area.svelte';
  import MouseIndicator from './MouseIndicator.svelte';
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';

  // INITIALIZE
  const options = {
    width: 800,
    height: 500,
    padding: { top: 20, right: 15, bottom: 20, left: 25 }
  };
  
  let svg, displayValue, displayDate = '', coords = null, mouseLeftPosition = null;

  let chart = calculateChart(dataSet, options);

  const initialPoints = chart.points.map((point) => ({ x: chart.xScale(new Date(point.x)), y: chart.yScale(0) }));
  const springPoints = spring(initialPoints, {
    stiffness: 0.1,
    damping: 0.9,
    precision: 0.1
  });

  let path = calculatePath($springPoints);
  let area = calculateArea(path, chart);

  setTimeout(() => {
    const scaledPoints = getScaledPoints(chart);
    springPoints.set(scaledPoints);
  }, 200)

  $: {
    chart = calculateChart(dataSet, options);

    const scaledPoints = getScaledPoints(chart);
    springPoints.set(scaledPoints);
  }

  $: {
    path = calculatePath($springPoints);
    area = calculateArea(path, chart);
  }

  $: {
    if(mouseLeftPosition) {
      const date = new Date(chart.xScale.invert(mouseLeftPosition));
      displayDate = format(date, "MM/dd/yyyy");
      const value = chart.points.find(el => el.x === displayDate);

      if (value) {
        displayValue = value.y;
        coords = { x: chart.xScale(new Date(value.x)), y: chart.yScale(value.y) };
      }
    }
  }

  function mousemove({ clientX }) {
    const { left } = svg.getBoundingClientRect();

    mouseLeftPosition = clientX - left;
  }
</script>


<div class="chart" bind:clientWidth={options.width} bind:clientHeight={options.height}>
  <div class="counter">
    <Counter value={displayValue} />
    <span>{displayDate}</span>
  </div>
  <div class="name"  style="color: { chart.color };">
    {dataSet.name}
  </div>

  <svg bind:this={svg} on:mousemove="{mousemove}">
    <YAxis ticks={chart.yTicks} padding={options.padding} scale={chart.yScale}/>
    <XAxis ticks={chart.xTicks} padding={options.padding} height={options.height} scale={chart.xScale}/>

    <!-- data -->
    <Area {path} {area} color={chart.color}/>

    <!-- controls -->
    {#if coords}
      <MouseIndicator {coords} height={options.height} padding={options.padding} color={chart.color}/>
    {/if}
  </svg>
</div>
  
<style>
  .buttons {
    margin-top: 30px;
    text-align: center;
  }

  .counter {
    position: absolute;
    text-align: center;
    top: 25px;
    width: 100%;
    z-index: 1000;
  }

  .name {
    position: absolute;
    bottom: 40px;
    z-index: 1000;
    font-size: 30px;
    text-transform: capitalize;
    text-align: center;
    width: 100%;
    transition: color 0.5s ease;
  }

  .chart,
  h2,
  p {
    width: 100%;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  svg {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: visible;
  }
</style>
