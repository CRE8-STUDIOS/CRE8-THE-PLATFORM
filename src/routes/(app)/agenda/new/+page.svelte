<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import AgendaItemForm from '#lib/organisms/AgendaItemForm.svelte'

	const { data, form } = $props()
</script>

<FormNotice {form} />
<AgendaItemForm
	title="Add to agenda"
	action=""
	submitLabel="Add"
	projects={data.projects}
	timeZone={data.timezone}
/>
