<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'

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
	<Heading>Your projects</Heading>
	<NavLinks label="Filter projects" links={filters} {current} exact />
	<ul>
		{#each projects as { id, title, status: projectStatus, deadline, clients } (id)}
			<li>
				<a href="/projects/{id}">{title}</a>
				<StatusLabel status={projectStatus} />
				{#if clients}· {clients.name}{/if}
				{#if deadline}· deadline {deadline}{/if}
			</li>
		{:else}
			<li>No projects here.</li>
		{/each}
	</ul>
</section>
