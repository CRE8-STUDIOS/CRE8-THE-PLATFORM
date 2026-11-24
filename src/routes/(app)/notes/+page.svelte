<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import NoteForm from '#lib/organisms/NoteForm.svelte'
	import NoteList from '#lib/organisms/NoteList.svelte'

	const { data, form } = $props()
	const { notes, projects, projectId } = $derived(data)
</script>

<PageHeader
	title="Notes"
	intro="Notes are private: clients never see them."
	back={projectId ? { href: `/projects/${projectId}`, text: 'the project' } : undefined}
/>
<FormNotice {form} />
<NoteForm {projects} {projectId} />
<NoteList {notes} />
