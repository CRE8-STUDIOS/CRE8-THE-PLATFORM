<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import AccountForm from '#lib/organisms/AccountForm.svelte'

	const { data, form } = $props()
	const { account } = $derived(data)
</script>

<PageHeader title="My account" />
<FormNotice {form} />
{#if account}<AccountForm {account} />{/if}
