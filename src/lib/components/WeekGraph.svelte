<script lang="ts">
		import type { DayRecord } from "$lib/status-helper";
		import type { Record } from "@prisma/client";
		import * as d3 from 'd3';
		import { onMount } from "svelte";
	
		export let weekData: DayRecord[];
		export let records: Record[];
	
		let containerElement: HTMLDivElement;

		
		const maxDimensions = {
			width: 800,
			height: 400
		}

		const minDimensions = {
			width: 400,
			height: 200
		}

		// Ensure records array is not empty before mapping
		const allPings = records.length > 0 ? records.map(record => record.ping) : [];
		
		onMount(() => {
			const margin = { top: 10, right: 30, bottom: 30, left: 60 };
			let width = window.innerWidth - margin.left - margin.right;
			let height = window.innerHeight / 5 - margin.top - margin.bottom;


			if (width > maxDimensions.width) {
				width = maxDimensions.width;
			} else if (width < minDimensions.width) {
				width = minDimensions.width;
			}

			if (height > maxDimensions.height) {
				height = maxDimensions.height;
			} else if (height < minDimensions.height) {
				height = minDimensions.height;
			}

			const svg = d3.select(containerElement)
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", `translate(${margin.left},${margin.top})`);
		
			const x = d3.scaleTime()
				.domain([d3.timeDay.offset(weekData[0].date, -1), weekData[weekData.length - 1].date])
				.range([0, width]);
		
			svg.append("g")
				.attr("transform", `translate(0,${height})`)
				.call(d3.axisBottom(x).ticks(d3.timeDay.every(1)))
				.attr("color", "black")
				.selectAll("text")
				.style("font-family", '"Roboto", sans-serif');
		
			const y = d3.scaleLinear()
				.domain([d3.min(allPings), d3.max(allPings)])
				.range([height, 0]);
		
			svg.append("g")
				.call(d3.axisLeft(y).ticks(5))
				.attr("color", "black")
				.selectAll("text")
				.style("font-family", '"Roboto", sans-serif');
		
			const line = d3.line<Record>()
				.x(d => x(new Date(d.createdAt)))
				.y(d => y(d.ping))
				.curve(d3.curveBasis);
		
			svg.append("path")
				.datum(records)
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-width", 1.5)
				.attr("d", line);
		
		});
</script>
    

<div class="week-container">
	{#each weekData as day}
		<div class="day-container">
			<div class="ping-box" style="background-color: {day.color.getRGB()}">
				<p>{day.averagePing}ms</p>
			</div>
			<p>{day.date.toLocaleDateString()}</p>
		</div>
	{/each}
</div>
<div class="graph-container">
	<div bind:this={containerElement}></div>
</div>

<style>
	.graph-container {
		display: flex;
		justify-content: center;

	}
	.week-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		text-align: center;
		margin: 20px 0;
	}

	.day-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 10px;
	}

	.ping-box {
		width: 100px;
		height: 100px;
		border-radius: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.ping-box p {
		padding: 3px;
		background-color: aliceblue;
		border-radius: 10%;
	}
</style>
