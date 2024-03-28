<script lang="ts">
	import type { DayRecord } from "$lib/status-helper";

	export let weekData: DayRecord[];
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

<style>
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
