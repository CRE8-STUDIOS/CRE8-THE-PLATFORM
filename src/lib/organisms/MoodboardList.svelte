<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ProjectCard from '#lib/molecules/ProjectCard.svelte'

	/** @type {{ boards: { id: string, title: string, visible_to_client: boolean, projects: { title: string } | null }[] }} */
	const { boards } = $props()
</script>

<section class="moodboard-list span-full">
	<div class="visually-hidden"><Heading>Your boards</Heading></div>
	{#if boards.length}
		<ul class="card-grid moodboard-list-grid">
			{#each boards as { id, title, visible_to_client, projects } (id)}
				<li>
					<ProjectCard
						href="/moodboards/{id}"
						{title}
						meta={[projects?.title, visible_to_client ? 'visible to client' : 'private']}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="empty-state">No moodboards yet.</p>
	{/if}
</section>

<style>
	.moodboard-list-grid {
		--grid-min: var(--size-grid-m);
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-min)), 1fr));
		align-items: stretch;
		padding: 0;
		list-style: none;
	}
</style>
