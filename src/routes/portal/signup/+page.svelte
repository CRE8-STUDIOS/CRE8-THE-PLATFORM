<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'

	const { form } = $props()
</script>

<AuthCard title="Portal account" intro="use the email address your freelancer invited">
	<SignupForm kind="client" {form} />
</AuthCard>
