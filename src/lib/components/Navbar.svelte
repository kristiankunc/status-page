<script>
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
</script>

<div class="flex justify-between items-center p-4 bg-picton-blue-50">
	<a class="title" href="/">kristn.co.uk status page</a>
	{#if $page.data.session?.user}
		<button class="btn bg-picton-blue-700" on:click={() => signOut()}>Sign out</button>
	{:else}
		<button class="btn bg-picton-blue-700" on:click={() => signIn("google")}>Sign in</button>
	{/if}
</div>
