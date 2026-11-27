<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ProjectList from '#lib/organisms/ProjectList.svelte'
	import ProjectForm from '#lib/organisms/ProjectForm.svelte'

	const { data, form } = $props()
	const { projects, clients, status, preselectedClient } = $derived(data)
</script>

<PageHeader title="Projects">
	{#snippet actions()}
		<a class="button button-primary" href="#new-project">+ New project</a>
	{/snippet}
</PageHeader>
<div data-tour="list"><ProjectList {projects} {status} /></div>
<ProjectForm
	id="new-project"
	title="New project"
	action="?/create"
	submitLabel="Create project"
	{clients}
	clientId={preselectedClient}
	{form}
/>
