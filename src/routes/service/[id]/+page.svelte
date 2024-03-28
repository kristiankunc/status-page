<script lang="ts">
	import type { PageData } from "./$types";
	import { StatusHelper } from "$lib/status-helper";
	import WeekGraph from "$lib/components/WeekGraph.svelte";

	export let data: PageData;
	const weekData = StatusHelper.weekAvg(data.records);
</script>

<div>
	<div class="flex flex-col justify-center items-center gap-y-3">
		<h1>{data.service.name}</h1>
		<a class="link" href={data.service.endpoint} target="_blank">{data.service.endpoint}</a>
	</div>

	<WeekGraph {weekData} />

	<div class="flex flex-col justify-center items-center gap-y-3">
		<h2>Incidents</h2>
		{#each data.incidents as incident}
			<div>
				<p>{incident.title}</p>
				<p>Start - {incident.startAt.toDateString()}</p>
				<p>Resolved - {incident.endAt ? incident.endAt.toDateString() : "/"}</p>
				<h3>Updates</h3>
				{#each incident.IncidentComment as comment}
					<h4>{comment.createdAt.toTimeString()}</h4>
					<p>{comment.content}</p>
				{/each}
				{#if data.isAdmin}
					<form method="POST" action="?/comment" onsubmit="return confirm('Confirm');">
						<input type="hidden" name="incidentId" value={incident.id} />
						<textarea name="content" required></textarea>
						<button>Comment</button>
					</form>

					<form method="POST" action="?/resolve" onsubmit="return confirm('Confirm');">
						<input type="hidden" name="incidentId" value={incident.id} />
						<button>Resolve</button>
					</form>
				{/if}
			</div>
		{/each}
	</div>

	{#if data.isAdmin}
		<div class="flex flex-col text-center justify-center gap-y-3">
			<h2>Admin</h2>
			<h3>Edit</h3>
			<form class="form" method="POST" action="?/edit" onsubmit="return confirm('Confirm');">
				<label for="name">Name</label>
				<input
					class="text-input"
					type="text"
					id="name"
					name="name"
					required
					value={data.service.name}
				/>
				<label for="enpoint">Endpoint</label>
				<input
					class="text-input"
					type="url"
					id="endpoint"
					name="endpoint"
					required
					value={data.service.endpoint}
				/>
				<button class="btn bg-picton-blue-500">Edit</button>
			</form>

			<h3>Delete service</h3>
			<form class="form" method="POST" action="?/delete" onsubmit="return confirm('Confirm');">
				<button class="btn bg-picton-blue-800">Delete</button>
			</form>

			<h3>Trigger Incident</h3>
			<form class="form" method="POST" action="?/incident" onsubmit="return confirm('Confirm');">
				<label for="title">Title</label>
				<input class="text-input" type="text" id="title" name="title" />
				<button class="btn bg-picton-blue-500">Trigger Incident</button>
			</form>
		</div>
	{/if}
</div>
