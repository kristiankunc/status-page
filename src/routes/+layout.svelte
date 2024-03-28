<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import "$lib/styles/global.css";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Navbar />
<slot />
