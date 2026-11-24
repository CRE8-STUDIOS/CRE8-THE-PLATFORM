<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ boards: { id: string, title: string, visible_to_client: boolean, projects: { title: string } | null }[] }} */
	const { boards } = $props()
</script>

<section class="moodboard-list">
	<Heading>Your boards</Heading>
	<ul>
		{#each boards as { id, title, visible_to_client, projects } (id)}
			<li>
				<a href="/moodboards/{id}">{title}</a>
				{#if projects}· {projects.title}{/if}
				· {visible_to_client ? 'visible to client' : 'private'}
			</li>
		{:else}
			<li>No moodboards yet.</li>
		{/each}
	</ul>
</section>
