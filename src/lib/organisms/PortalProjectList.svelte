<script>
	import ProjectCard from '#lib/molecules/ProjectCard.svelte'

	/** @type {{ projects: { project_id: string, title: string, status: string, deadline: string | null, freelancer_name: string | null }[] }} */
	const { projects } = $props()
</script>

<section class="portal-project-list">
	{#if projects.length}
		<ul class="card-grid portal-project-list-grid">
			{#each projects as { project_id, title, status, deadline, freelancer_name } (project_id)}
				<li>
					<ProjectCard
						href="/portal/{project_id}"
						{title}
						{status}
						meta={[
							`with ${freelancer_name ?? 'your freelancer'}`,
							deadline ? `deadline ${deadline}` : null
						]}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="empty-state">
			No projects yet. When a freelancer invites this email address, the project shows up here (make
			sure your email is confirmed).
		</p>
	{/if}
</section>

<style>
	.portal-project-list-grid {
		--grid-min: var(--size-grid-l);
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-min)), 1fr));
		align-items: stretch;
		padding: 0;
		list-style: none;
	}
</style>
