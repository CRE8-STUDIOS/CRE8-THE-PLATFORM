<script>
	import Button from '#lib/atoms/Button.svelte'
	import AuthField from '#lib/molecules/AuthField.svelte'

	/** @type {{ kind: 'freelancer' | 'client', form: { message?: string, success?: string, email?: string | null } | null | undefined }} */
	const { kind, form } = $props()

	const error = $derived(form?.message ?? '')
	const describedby = $derived(error ? 'signup-error' : undefined)
	const invalid = $derived(error ? 'true' : undefined)
</script>

{#if error}<p id="signup-error" class="auth-message" role="alert">{error}</p>{/if}

{#if form?.success}
	<p class="auth-message" role="status">{form.success}</p>
{:else}
	<form class="signup-form" method="POST">
		<AuthField
			label="Email"
			id="signup-email"
			name="email"
			type="email"
			autocomplete="email"
			value={form?.email ?? ''}
			aria-describedby={describedby}
			aria-invalid={invalid}
			required
		/>
		<AuthField
			label="Password"
			id="signup-password"
			name="password"
			type="password"
			autocomplete="new-password"
			minlength={8}
			hint="At least 8 characters"
			aria-describedby={describedby}
			aria-invalid={invalid}
			required
		/>
		<Button variant="light">
			{kind === 'client' ? 'Create portal account' : 'Create account'}
		</Button>
	</form>
{/if}

<p class="signup-switch">
	Already have an account? <a href="/login/form?as={kind}">Log in</a>
</p>

<style>
	.signup-form {
		display: grid;
		justify-items: center;
		max-inline-size: var(--size-auth-form);
		gap: var(--space-s);
		inline-size: 100%;
	}

	.signup-switch {
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}
</style>
