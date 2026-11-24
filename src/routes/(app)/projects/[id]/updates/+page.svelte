<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import UpdateForm from '#lib/organisms/UpdateForm.svelte'
	import UpdateList from '#lib/organisms/UpdateList.svelte'

	const { data, form } = $props()
	const { updates, timezone } = $derived(data)
</script>

<FormNotice {form} />
<UpdateForm />
<UpdateList {updates} timeZone={timezone} />
