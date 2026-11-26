<script>
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'

	/**
	 * @type {{
	 *   project: { id: string, title: string, status: string, deadline: string | null, clients: { id: string, name: string } | null },
	 *   tabs: { href: string, text: string }[],
	 *   current: string
	 * }}
	 */
	const { project, tabs, current } = $props()
</script>

<div class="project-header">
	<PageHeader title={project.title} back={{ href: '/projects', text: 'all projects' }}>
		{#snippet meta()}
			<StatusLabel status={project.status} />
			{#if project.clients}<span>
					Client: <a href="/clients/{project.clients.id}">{project.clients.name}</a>
				</span>{/if}
			{#if project.deadline}<span>Deadline: {project.deadline}</span>{/if}
		{/snippet}
		{#snippet actions()}
			<a
				class="button button-secondary rough-edge"
				href="/projects/{project.id}/requests#new-request"
			>
				+ Add request
			</a>
		{/snippet}
	</PageHeader>
	<NavLinks label="Project sections" links={tabs} {current} exact />
</div>

<style>
	.project-header {
		display: grid;
		gap: var(--space-m);
	}
</style>
