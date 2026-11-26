<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import AuthField from '#lib/molecules/AuthField.svelte'
	import Button from '#lib/atoms/Button.svelte'

	const { data, form } = $props()

	const error = $derived(form?.message ?? '')
</script>

<AuthCard compact title="Forgot password" intro="enter your email and we send you a link">
	{#if form?.sent}
		<p class="auth-message" role="status">If this email has an account, a link is on its way.</p>
	{:else}
		{#if data.expired && !error}
			<p class="auth-message" role="alert">This link has expired. Ask for a new one below.</p>
		{/if}
		{#if error}<p id="forgot-error" class="auth-message" role="alert">{error}</p>{/if}
		<form class="forgot-form" method="POST">
			<AuthField
				label="Email"
				id="forgot-email"
				name="email"
				type="email"
				autocomplete="email"
				value={form?.email ?? ''}
				aria-describedby={error ? 'forgot-error' : undefined}
				aria-invalid={error ? 'true' : undefined}
				required
			/>
			<Button variant="light">Send link</Button>
		</form>
	{/if}
	<a class="forgot-back" href="/login">Back to login</a>
</AuthCard>

<style>
	.forgot-form {
		display: grid;
		justify-items: center;
		max-inline-size: var(--size-auth-form);
		gap: var(--space-s);
		inline-size: 100%;
	}

	.forgot-back {
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}
</style>
