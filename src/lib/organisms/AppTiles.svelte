<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ tiles: { id: string, name: string, url: string, group_name: string | null }[] }} */
	const { tiles } = $props()
</script>

<section class="app-tiles">
	<Heading>My apps</Heading>
	<ul>
		{#each tiles as { id, name, url, group_name } (id)}
			<li>
				<a href={url} target="_blank" rel="noopener">{name}</a>{#if group_name}
					({group_name}){/if}
			</li>
		{:else}
			<li>No app buttons yet. <a href="/settings/tiles">Add them in settings</a></li>
		{/each}
	</ul>
</section>
