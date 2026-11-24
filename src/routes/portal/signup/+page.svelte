<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'

	const { form } = $props()
</script>

<PageHeader
	title="Client portal: create your account"
	intro="Use the email address your freelancer invited."
/>
<SignupForm kind="client" {form} />
