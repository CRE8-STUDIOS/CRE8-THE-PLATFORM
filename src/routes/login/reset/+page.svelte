<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import PasswordInput from '#lib/atoms/PasswordInput.svelte'
	import Button from '#lib/atoms/Button.svelte'

	const { form } = $props()

	const error = $derived(form?.message ?? '')
	const errorId = $derived(error ? 'reset-error' : undefined)
</script>

<AuthCard compact title="New password">
	{#if error}<p id="reset-error" class="auth-message" role="alert">{error}</p>{/if}
	<form class="reset-form" method="POST">
		<PasswordInput
			label="New password"
			id="reset-password"
			name="password"
			autocomplete="new-password"
			minlength={8}
			aria-describedby="reset-hint"
			error={errorId}
			required
		/>
		<PasswordInput
			label="Repeat password"
			id="reset-repeat"
			name="repeat"
			autocomplete="new-password"
			minlength={8}
			aria-describedby="reset-hint"
			error={errorId}
			required
		/>
		<p id="reset-hint" class="auth-message">At least 8 characters</p>
		<Button variant="light">Save</Button>
	</form>
</AuthCard>

<style>
	.reset-form {
		display: grid;
		justify-items: center;
		max-inline-size: var(--size-auth-form);
		gap: var(--space-s);
		inline-size: 100%;
	}
</style>
