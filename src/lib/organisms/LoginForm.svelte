<script>
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import AuthField from '#lib/molecules/AuthField.svelte'

	/** @type {{ form: { message?: string, email?: string | null, otherRole?: 'freelancer' | 'client' } | null | undefined, as: 'freelancer' | 'client', redirectTo: string, notice?: string }} */
	const { form, as, redirectTo, notice = '' } = $props()

	const error = $derived(form?.message ?? '')
	const describedby = $derived(error ? 'login-error' : undefined)
</script>

{#if notice && !error}<p class="auth-message" role="status">{notice}</p>{/if}
{#if error}
	<p id="login-error" class="auth-message" role="alert">
		{error}
		{#if form?.otherRole}
			<a href="/login/form?as={form.otherRole}">Log in as a {form.otherRole}</a>
		{/if}
	</p>
{/if}

<form class="login-form" method="POST">
	<Input type="hidden" name="redirectTo" value={redirectTo} />
	<Input type="hidden" name="as" value={as} />
	<AuthField
		label="Email"
		id="login-email"
		name="email"
		type="email"
		autocomplete="email"
		value={form?.email ?? ''}
		aria-describedby={describedby}
		aria-invalid={error ? 'true' : undefined}
		required
	/>
	<AuthField
		label="Password"
		id="login-password"
		name="password"
		type="password"
		autocomplete="current-password"
		aria-describedby={describedby}
		aria-invalid={error ? 'true' : undefined}
		required
	/>
	<a class="login-forgot" href="/login/forgot">Forgot password?</a>
	<Button variant="light">Log in</Button>
</form>

{#if as === 'freelancer'}
	<p class="login-switch">New freelancer? <a href="/signup">Create an account</a></p>
{/if}

<style>
	.login-form {
		display: grid;
		justify-items: center;
		gap: var(--space-s);
		inline-size: 100%;
	}

	.login-forgot {
		justify-self: end;
		margin-block-start: calc(var(--space-xs) * -1);
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}

	.login-switch {
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}
</style>
