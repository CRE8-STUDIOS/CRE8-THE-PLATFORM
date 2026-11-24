<script>
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'

	/**
	 * @type {{
	 *   project: { title: string, status: string, deadline: string | null, clients: { id: string, name: string } | null },
	 *   tabs: { href: string, text: string }[],
	 *   current: string
	 * }}
	 */
	const { project, tabs, current } = $props()
</script>

<div class="project-header">
	<PageHeader title={project.title} back={{ href: '/projects', text: 'Projects' }} />
	<p>
		<StatusLabel status={project.status} />
		{#if project.clients}· Client: <a href="/clients/{project.clients.id}">
				{project.clients.name}
			</a>{/if}
		{#if project.deadline}· Deadline: {project.deadline}{/if}
	</p>
	<NavLinks label="Project sections" links={tabs} {current} exact />
</div>
