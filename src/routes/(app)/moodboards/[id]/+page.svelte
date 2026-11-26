<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import MoodboardForm from '#lib/organisms/MoodboardForm.svelte'
	import MoodboardItems from '#lib/organisms/MoodboardItems.svelte'
	import MoodboardItemForm from '#lib/organisms/MoodboardItemForm.svelte'
	import ArchiveOrDelete from '#lib/organisms/ArchiveOrDelete.svelte'

	const { data, form } = $props()
	const { board, items, projects } = $derived(data)
</script>

<PageHeader title={board.title} back={{ href: '/moodboards', text: 'Moodboards' }} />
<div class="card-grid">
	<FormNotice {form} />
	<MoodboardItems {items} editable />
	<MoodboardForm title="Board settings" action="?/update" submitLabel="Save" {board} {projects} />
	<MoodboardItemForm />
	<ArchiveOrDelete what="moodboard" note="Deleting a board also deletes its images." />
</div>
