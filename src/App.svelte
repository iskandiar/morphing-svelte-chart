<script>
	import { format } from 'date-fns'
	import { spring } from 'svelte/motion';
	import { scaleTime, scaleLinear } from 'd3-scale';
	import { amazon, apple, facebook, tesla, microsoft } from './data.js';

	const dataSets = {
		amazon: {
			data: amazon,
			color: "#ff9900"
		},
		apple: {
			data: apple,
			color: "#555555"
		},
		facebook: {
			data: facebook,
			color: "#4267B2"
		}, 
		tesla: {
			data: tesla,
			color: "#cc0000"
		},
		microsoft: {
			data: microsoft,
			color: "#7cbb00"
		}
	}

	// INITIALIZE
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 800;
	let height = 500;

	let svg;

	let points = amazon
	let data = amazon
	let color = dataSets['amazon'].color

	let coords = null

	let minX = points[0].x;
	let maxX = points[points.length - 1].x;
	let xScale = scaleLinear()
			.domain([new Date(minX), new Date(maxX)])
			.range([padding.left, width - padding.right]);

	let maxY = Math.max.apply(null, points.map(p => p.y))
	let minY = Math.min.apply(null, points.map(p => p.y))
	let yTicksInit = [0.9 * minY, minY, maxY,  maxY * 1.1]
	let xTicks = xScale.ticks(8)
	let yScale = scaleLinear()
			.domain([Math.min.apply(null, yTicksInit), Math.max.apply(null, yTicksInit)])
			.range([height - padding.bottom, padding.top]);

	const initialPoints = points.map((point) => ({ x: xScale(new Date(point.x)), y: yScale(0) }));
	const springPoints = spring(initialPoints, {
		stiffness: 0.1,
		damping: 0.9,
		precision: 0.1
	})

	$: maxY = Math.max.apply(null, points.map(p => p.y))
	$: minY = Math.min.apply(null, points.map(p => p.y))
	$: yTicks = [0.9 * minY, minY, maxY, maxY * 1.1]
	$: xTicks = xScale.ticks(8)

	$: xScale = scaleTime()
		.domain([new Date(minX), new Date(maxX)])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: minX = points[0].x;
	$: maxX = points[points.length - 1].x;
	$: path = `M${$springPoints.map(p => `${p.x},${p.y}`).join('L')}`;
	$: area = `${path}L${xScale(new Date(maxX))},${yScale(minY * 0.9)}L${xScale(new Date(minX))},${yScale(minY * 0.9)}Z`;

	setTimeout(() => {
		const scaledPoints = data.map(p => ({ x: xScale(new Date(p.x)), y: yScale(p.y) }))
		springPoints.set(scaledPoints)
	}, 200)

	function formatMobile(tick) {
		return "'" + tick % 100;
	}

	function setData(key) {
		points = dataSets[key].data
		color = dataSets[key].color

		coords = null

		setTimeout(() => {
			const scaledPoints = points.map(p => ({ x: xScale(new Date(p.x)), y: yScale(p.y) }))
			springPoints.set(scaledPoints)
		}, 0)
	}

	function mousemove(e) {
		const { top, left } = svg.getBoundingClientRect()
		const date = new Date(xScale.invert(e.clientX - left))
		const formattedDate = format(date, "MM/dd/yyyy")
		const value = points.find(el => el.x === formattedDate)

		if(!value) return // Stock exchanges are not working during weekends
		coords = { x: xScale(new Date(value.x)), y: yScale(value.y)}
	}
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg bind:this={svg} on:mousemove="{mousemove}">
		<!-- y axis -->
		<g class="axis y-axis" transform="translate(0, {padding.top})">
			{#each yTicks as tick, index}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick) - padding.bottom})">
					<line x2="100%"></line>
					<text y="-4">{(index === 1 || index ===2) ? `$${tick.toFixed(2)}` : ''}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each xTicks as tick}
				<g class="tick tick-{ tick }" transform="translate({xScale(tick)},{height})">
					<line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0"></line>
					<text y="-2">{width > 380 ? format(tick, "MM/dd") : formatMobile(tick)}</text>
				</g>
			{/each}
		</g>

		<!-- data -->
		<path class="path-area" d={area} fill={color}></path>
		<path class="path-line" d={path} stroke={color}></path>

		{#if coords}
			<line x1={coords.x} y1="0" x2={coords.x} y2={(height - padding.bottom)} style="stroke:rgb(220,220,220);stroke-width:1" />
			<circle cx={coords.x} cy={coords.y} r="5" fill={color}/>
		{/if}
	</svg>
</div>

{#each Object.keys(dataSets) as name, i}
	<button on:click={() => setData(name)}> {name} </button>
{/each}

<style>
	.chart, h2, p {
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

	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
		transition: stroke 0.5s ease;
	}

	.path-area {
		transition: fill 0.5s ease;
		opacity: 0.2;
	}
</style>


<!-- TO-DO
- vertical slider
- extarct to components
- different colors for datasets
- morphing between colors
- nice value idicator
- better dataset (exchange?)
-  -->
