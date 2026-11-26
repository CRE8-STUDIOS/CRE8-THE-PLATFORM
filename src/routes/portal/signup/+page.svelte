<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'
	import CenteredPage from '#lib/organisms/CenteredPage.svelte'

	const { form } = $props()
</script>

<CenteredPage>
	<PageHeader
		title="Client portal: create your account"
		intro="Use the email address your freelancer invited."
	/>
	<SignupForm kind="client" {form} />
</CenteredPage>
