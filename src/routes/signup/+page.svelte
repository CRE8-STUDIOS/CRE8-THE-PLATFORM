<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'
	import CenteredPage from '#lib/organisms/CenteredPage.svelte'

	const { form } = $props()
</script>

<CenteredPage>
	<PageHeader title="Create your CRE8 account" />
	<SignupForm kind="freelancer" {form} />
</CenteredPage>
