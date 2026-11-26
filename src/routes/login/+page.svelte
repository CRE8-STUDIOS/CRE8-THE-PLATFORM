<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import Notice from '#lib/atoms/Notice.svelte'
	import LoginForm from '#lib/organisms/LoginForm.svelte'
	import CenteredPage from '#lib/organisms/CenteredPage.svelte'

	const { data, form } = $props()
	const { redirectTo, error } = $derived(data)
</script>

<CenteredPage>
	<PageHeader title="Log in to CRE8" />
	{#if error}<Notice type="error">{error}</Notice>{/if}
	<LoginForm {form} {redirectTo} />
</CenteredPage>
