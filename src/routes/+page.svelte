<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	const serviceStatuses: { serviceId: string, up: boolean }[] = [];

	for (const service of data.services) {
		const foundUnresolvedIncident = service.Incident.find(incident => incident.endAt === null);
		serviceStatuses.push({
			serviceId: service.id,
			up: !foundUnresolvedIncident
		});
	}

</script>

<div class="text-center">
	<h2>Services</h2>
	<div class="inline-grid">
		{#each data.services as service}
			<div class="grid items-center content-center grid-cols-4 space-x-4 space-y-4">
				<h3>{service.name}</h3>
				<a class="link" href={service.endpoint} target="_blank">{service.endpoint}</a>
				<a class="btn bg-picton-blue-500" href="/service/{service.id}">View status</a>
				<div class="flex justify-center items-center">
					{#if serviceStatuses.find(status => status.serviceId === service.id).up}
						<div class="bg-green-500 rounded-full w-4 h-4"></div>
					{:else}
						<div class="bg-red-500 rounded-full w-4 h-4"></div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

{#if data.isAdmin}
	<form method="POST" action="?/create" class="form">
		<h2>Create new</h2>
		<label for="name">Name</label>
		<input class="text-input" type="text" id="name" name="name" required />
		<label for="enpoint">Endpoint</label>
		<input class="text-input" type="url" id="endpoint" name="endpoint" required />
		<button class="btn bg-picton-blue-500" type="submit">Create</button>
	</form>
{/if}
