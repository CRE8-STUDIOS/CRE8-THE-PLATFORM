<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import AgendaItemForm from '#lib/organisms/AgendaItemForm.svelte'

	const { data, form } = $props()
</script>

<PageHeader
	title="Edit {data.item.title}"
	back={{ href: `/agenda/${data.item.id}`, text: 'Details' }}
/>
<FormNotice {form} />
<AgendaItemForm
	title="Details"
	action=""
	submitLabel="Save"
	item={data.item}
	projects={data.projects}
	timeZone={data.timezone}
/>
