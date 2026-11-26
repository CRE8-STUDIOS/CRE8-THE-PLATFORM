<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'

	const { form } = $props()
</script>

<AuthCard title="Create account">
	<SignupForm kind="freelancer" {form} />
</AuthCard>
