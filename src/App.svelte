<script>
	import { spring } from 'svelte/motion';
	import { scaleLinear } from 'd3-scale';
	import {data1, data2} from './data.js';

	// INITIALIZE
	const xTicks = [1980, 1990, 2000, 2010];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	let points = data1

	let xScale = scaleLinear()
			.domain([1979, 2016])
			.range([padding.left, width - padding.right]);

	let maxY = Math.max.apply(null, points.map(p => p.y))
	let yTicksInit = [0, 0.4 * maxY, 0.8 * maxY, maxY * 1.2]
	let yScale = scaleLinear()
			.domain([Math.min.apply(null, yTicksInit), Math.max.apply(null, yTicksInit)])
			.range([height - padding.bottom, padding.top]);

	const initialPoints = points.map((point) => ({ x: xScale(point.x), y: yScale(0) }));
	const springPoints = spring(initialPoints, {
		stiffness: 0.1,
		damping: 0.9,
		precision: 0.1
	})

	$: maxY = Math.max.apply(null, points.map(p => p.y))
	$: yTicks = [0, 0.4 * maxY, 0.8 * maxY, maxY * 1.2]

	$: xScale = scaleLinear()
		.domain([minX, maxX])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: minX = points[0].x;
	$: maxX = points[points.length - 1].x;
	$: path = `M${$springPoints.map(p => `${p.x},${p.y}`).join('L')}`;
	$: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

	setTimeout(() => {
		const scaledPoints = data1.map(p => ({ x: xScale(p.x), y: yScale(p.y) }))
		springPoints.set(scaledPoints)
	}, 1000)

	function formatMobile(tick) {
		return "'" + tick % 100;
	}

	function setData1() {
		points = data1

		setTimeout(() => {
			const scaledPoints = data1.map(p => ({ x: xScale(p.x), y: yScale(p.y) }))
			springPoints.set(scaledPoints)
		}, 0)
	}

	function setData2() {
		points = data2
		setTimeout(() => {
			const scaledPoints = data2.map(p => ({ x: xScale(p.x), y: yScale(p.y) }))
			springPoints.set(scaledPoints)
		}, 0)
	}
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<!-- y axis -->
		<g class="axis y-axis" transform="translate(0, {padding.top})">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick) - padding.bottom})">
					<line x2="100%"></line>
					<text y="-4">{tick}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each xTicks as tick}
				<g class="tick tick-{ tick }" transform="translate({xScale(tick)},{height})">
					<line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0"></line>
					<text y="-2">{width > 380 ? tick : formatMobile(tick)}</text>
				</g>
			{/each}
		</g>

		<!-- data -->
		<path class="path-area" d={area}></path>
		<path class="path-line" d={path}></path>
	</svg>
</div>

<button on:click={setData1}>Dataset 1</button>
<button on:click={setData2}>Dataset 2</button>

<style>
	.chart, h2, p {
		width: 100%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: visible;
	}

	.tick {
		font-size: .725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #aaa;
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

	.path-line {
		fill: none;
		stroke: rgb(0,100,100);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}

	.path-area {
		fill: rgba(0,100,100,0.2);
	}
</style>
