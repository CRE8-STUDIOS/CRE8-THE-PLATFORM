<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import RequestList from '#lib/organisms/RequestList.svelte'
	import RequestForm from '#lib/organisms/RequestForm.svelte'

	const { data, form } = $props()
	const { requests, timezone } = $derived(data)
</script>

<FormNotice {form} />
<RequestList {requests} timeZone={timezone} />
<RequestForm title="New request" action="?/create" submitLabel="Add request" />
