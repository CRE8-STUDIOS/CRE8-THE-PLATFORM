<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ProjectList from '#lib/organisms/ProjectList.svelte'
	import ProjectForm from '#lib/organisms/ProjectForm.svelte'

	const { data, form } = $props()
	const { projects, clients, status, preselectedClient } = $derived(data)
</script>

<PageHeader title="Projects" />
<ProjectList {projects} {status} />
<ProjectForm
	title="New project"
	action="?/create"
	submitLabel="Create project"
	{clients}
	clientId={preselectedClient}
	{form}
/>
