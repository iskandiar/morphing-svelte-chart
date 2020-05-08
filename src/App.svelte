<script>
	import Chart from './components/chart/Chart.svelte'

	import { amazon, apple, facebook, tesla, microsoft } from './data.js';

	const dataSets = {
		amazon: {
			name: 'Amazon',
			data: amazon,
			color: "#ff9900"
		},
		apple: {
			name: 'Apple',
			data: apple,
			color: "#555555"
		},
		facebook: {
			name: 'Facebook',
			data: facebook,
			color: "#4267B2"
		}, 
		tesla: {
			name: 'Tesla',
			data: tesla,
			color: "#cc0000"
		},
		microsoft: {
			name: 'Microsoft',
			data: microsoft,
			color: "#7cbb00"
		}
	}

	let activeDataSet = dataSets['amazon']

	function setData(key) {
		activeDataSet = dataSets[key]
	}
</script>

<Chart dataSet={activeDataSet} />

<div class="buttons">
	{#each Object.keys(dataSets) as name, i}
		<button on:click={() => setData(name)}> {name} </button>
	{/each}
</div>

<style>
	.buttons {
		margin-top: 30px;
		text-align: center;
	}
</style>
