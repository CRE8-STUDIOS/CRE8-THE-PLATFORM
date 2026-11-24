<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import MoodboardList from '#lib/organisms/MoodboardList.svelte'
	import MoodboardForm from '#lib/organisms/MoodboardForm.svelte'

	const { data, form } = $props()
	const { boards, projects, projectId } = $derived(data)
</script>

<PageHeader
	title="Moodboards"
	back={projectId ? { href: `/projects/${projectId}`, text: 'the project' } : undefined}
/>
<MoodboardList {boards} />
<FormNotice {form} />
<MoodboardForm
	title="New moodboard"
	action="?/create"
	submitLabel="Create"
	{projects}
	{projectId}
/>
