<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import BusinessForm from '#lib/organisms/BusinessForm.svelte'

	const { data, form } = $props()
	const { business, user } = $derived(data)
</script>

<FormNotice {form} />
{#if business}<BusinessForm {business} email={user?.email ?? ''} />{/if}
