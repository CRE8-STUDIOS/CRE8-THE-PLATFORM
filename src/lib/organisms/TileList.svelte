<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ tiles: { id: string, name: string, url: string, iconUrl: string | null, group_name: string | null, position: number }[] }} */
	const { tiles } = $props()
</script>

<section class="tile-list">
	<Heading>App buttons</Heading>
	<p>Links to the apps you use (Figma, Drive, Lightroom...). They show on your overview.</p>
	<ul>
		{#each tiles as { id, name, url, iconUrl, group_name, position } (id)}
			<li>
				{#if iconUrl}<img src={iconUrl} alt="" width="24" height="24" />{/if}
				<a href={url} target="_blank" rel="noopener">{name}</a>
				{#if group_name}· {group_name}{/if} · position {position}
				<ActionButton action="?/delete" label="Remove" variant="danger" fields={{ id }} />
			</li>
		{:else}
			<li>No app buttons yet.</li>
		{/each}
	</ul>
</section>
