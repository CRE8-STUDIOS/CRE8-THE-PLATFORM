<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import AppTile from '#lib/molecules/AppTile.svelte'

	/** @type {{ tiles: { id: string, name: string, url: string, group_name: string | null }[] }} */
	const { tiles } = $props()
</script>

<section class="app-tiles">
	<Heading>My apps</Heading>
	{#if tiles.length}
		<ul class="app-tiles-grid">
			{#each tiles as { id, name, url, group_name } (id)}
				<li><AppTile {name} href={url} group={group_name} external /></li>
			{/each}
		</ul>
	{:else}
		<p class="empty-state">
			No app buttons yet. <a href="/settings/tiles">Add them in settings</a>
		</p>
	{/if}
</section>

<style>
	.app-tiles {
		display: grid;
		gap: var(--space-m);
	}

	.app-tiles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--size-grid-tile), 1fr));
		gap: var(--space-s);
		padding: 0;
		list-style: none;
	}
</style>
