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
>
	{#snippet actions()}
		<a class="button button-primary" href="#new-moodboard">+ New moodboard</a>
	{/snippet}
</PageHeader>

<div class="card-grid">
	<MoodboardList {boards} />
	<FormNotice {form} />
	<MoodboardForm
		id="new-moodboard"
		title="New moodboard"
		action="?/create"
		submitLabel="Create"
		{projects}
		{projectId}
	/>
</div>
