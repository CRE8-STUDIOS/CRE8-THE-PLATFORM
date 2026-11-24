<script>
	import { page } from '$app/state'
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import AgendaItemForm from '#lib/organisms/AgendaItemForm.svelte'
	import Checklist from '#lib/organisms/Checklist.svelte'
	import PeopleList from '#lib/organisms/PeopleList.svelte'
	import ArchiveOrDelete from '#lib/organisms/ArchiveOrDelete.svelte'

	const { data, form } = $props()
	const { item, checklist, people, projects, canStart, timezone } = $derived(data)
</script>

<PageHeader title={item.title} back={{ href: '/agenda', text: 'Agenda' }} />
<FormNotice {form} />
{#if canStart}
	<ActionButton
		action="/clock?/in"
		label="Start this block (clock in)"
		variant="primary"
		fields={{
			agenda_item_id: item.id,
			project_id: item.project_id,
			started_by: 'manual',
			redirectTo: page.url.pathname
		}}
	/>
{/if}
<AgendaItemForm
	title="Details"
	action="?/update"
	submitLabel="Save"
	{item}
	{projects}
	timeZone={timezone}
/>
<Checklist items={checklist} />
<PeopleList {people} />
<ArchiveOrDelete what="agenda item" />
