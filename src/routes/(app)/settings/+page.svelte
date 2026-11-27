<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import AssistantForm from '#lib/organisms/AssistantForm.svelte'
	import BusinessForm from '#lib/organisms/BusinessForm.svelte'

	const { data, form } = $props()
	const { assistant, business, user } = $derived(data)
</script>

<FormNotice {form} />
{#if business}<BusinessForm {business} email={user?.email ?? ''} />{/if}
<AssistantForm {assistant} />
