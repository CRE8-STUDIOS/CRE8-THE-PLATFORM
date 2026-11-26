<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ tiles: { id: string, name: string, url: string, iconUrl: string | null, group_name: string | null, position: number }[] }} */
	const { tiles } = $props()
</script>

<section class="tile-list card rough-edge">
	<Heading>App buttons</Heading>
	<p>Links to the apps you use (Figma, Drive, Lightroom...). They show on your overview.</p>
	<ul>
		{#each tiles as { id, name, url, iconUrl, group_name, position } (id)}
			<li>
				{#if iconUrl}<img src={iconUrl} alt="" width="24" height="24" />{:else}<span
						class="avatar"
						aria-hidden="true"
					>
						{name.charAt(0)}
					</span>{/if}
				<span class="tile-list-text">
					<a href={url} target="_blank" rel="noopener">{name}</a>
					<span class="text-small text-muted">
						{#if group_name}{group_name} ·
						{/if}position {position}
					</span>
				</span>
				<span class="list-end">
					<ActionButton action="?/delete" label="Remove" variant="danger" fields={{ id }} />
				</span>
			</li>
		{:else}
			<li class="text-muted">No app buttons yet.</li>
		{/each}
	</ul>
</section>

<style>
	.tile-list-text {
		display: grid;
	}
</style>
