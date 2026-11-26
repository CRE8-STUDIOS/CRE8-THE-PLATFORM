<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'

	const { form } = $props()
</script>

<AuthCard compact title="Create account">
	<SignupForm kind="freelancer" {form} />
</AuthCard>
