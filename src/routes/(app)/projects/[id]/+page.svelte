<script>
	import ProjectForm from '#lib/organisms/ProjectForm.svelte'
	import StatusForm from '#lib/organisms/StatusForm.svelte'
	import ArchiveOrDelete from '#lib/organisms/ArchiveOrDelete.svelte'

	const { data, form } = $props()
	const { project, clients, statusOptions } = $derived(data)
</script>

<ProjectForm title="Details" action="?/update" submitLabel="Save" {project} {clients} {form} />
<StatusForm status={project.status} options={statusOptions} />
<ArchiveOrDelete
	what="project"
	note="Only draft projects without a signed contract or sent factuur can be deleted. Otherwise, set the status to archived."
/>
