<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'
	import ProjectCard from '#lib/molecules/ProjectCard.svelte'

	/**
	 * @type {{
	 *   projects: { id: string, title: string, status: string, deadline: string | null, clients: { name: string } | null }[],
	 *   status: string | null
	 * }}
	 */
	const { projects, status } = $props()

	const filters = [
		{ href: '/projects', text: 'All open' },
		{ href: '/projects?status=draft', text: 'Draft' },
		{ href: '/projects?status=active', text: 'Active' },
		{ href: '/projects?status=done', text: 'Done' },
		{ href: '/projects?status=archived', text: 'Archived' }
	]
	const current = $derived(status ? `/projects?status=${status}` : '/projects')
</script>

<section class="project-list">
	<div class="visually-hidden"><Heading>Your projects</Heading></div>
	<NavLinks label="Filter projects" links={filters} {current} exact />
	{#if projects.length}
		<ul class="card-grid project-list-grid">
			{#each projects as { id, title, status: projectStatus, deadline, clients } (id)}
				<li>
					<ProjectCard
						href="/projects/{id}"
						{title}
						status={projectStatus}
						meta={[clients?.name, deadline ? `deadline ${deadline}` : null]}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="empty-state">No projects here.</p>
	{/if}
</section>

<style>
	.project-list {
		display: grid;
		gap: var(--space-m);
	}

	.project-list-grid {
		--grid-min: var(--size-grid-l);
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-min)), 1fr));
		align-items: stretch;
		padding: 0;
		list-style: none;
	}
</style>
