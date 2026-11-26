<script>
	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import EraserWipe from '#lib/atoms/EraserWipe.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import AuthField from '#lib/molecules/AuthField.svelte'
	import AuthCard from '#lib/organisms/AuthCard.svelte'

	/** @type {{ form: { message?: string, email?: string | null, otherRole?: 'freelancer' | 'client' } | null | undefined, as: 'freelancer' | 'client', redirectTo: string, notice?: string }} */
	const { form, as, redirectTo, notice = '' } = $props()

	const error = $derived(form?.message ?? '')
	const describedby = $derived(error ? 'login-error' : undefined)
	const invalid = $derived(error ? 'true' : undefined)
	let attempts = $state(untrack(() => form?.message) ? 1 : 0)

	let erasing = $state(false)

	const duration = (/** @type {string} */ name) =>
		parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0
	const wait = (/** @type {number} */ ms) => new Promise((done) => setTimeout(done, ms))

	/** @type {import('$app/forms').SubmitFunction} */
	const leaveWithEraser = () => {
		return async ({ result, update }) => {
			if (result.type !== 'redirect') {
				await update()
				if (result.type === 'failure') attempts += 1
				return
			}

			const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
			if (!calm) {
				erasing = true
				await wait(duration('--duration-eraser'))
			}

			await goto(result.location, { invalidateAll: true })
		}
	}
</script>

<AuthCard title="Login" alarm={error ? attempts : 0} compact>
	{#if notice && !error}<p class="auth-message" role="status">{notice}</p>{/if}
	{#if error}
		<p id="login-error" class="auth-message" role="alert">
			{error}
			{#if form?.otherRole}
				<a href="/login/form?as={form.otherRole}">Log in as a {form.otherRole}</a>
			{/if}
		</p>
	{/if}

	<form id="login-form" class="login-form" method="POST" use:enhance={leaveWithEraser}>
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
			aria-invalid={invalid}
			required
		/>
	</form>
	<span class="login-balance" aria-hidden="true"></span>

	{#snippet bottom()}
		<div class="login-form">
			<AuthField
				label="Password"
				id="login-password"
				name="password"
				type="password"
				autocomplete="current-password"
				form="login-form"
				aria-describedby={describedby}
				aria-invalid={invalid}
				required
			/>
			<a class="login-forgot" href="/login/forgot">Forgot password?</a>
			<Button variant="light" form="login-form">Log in</Button>
		</div>
		{#if as === 'freelancer'}
			<p class="login-switch">New freelancer? <a href="/signup">Create an account</a></p>
		{/if}
	{/snippet}

	{#snippet after()}
		{#if as === 'client'}
			<p class="login-switch">
				Invited as a client? <a href="/portal/signup">Create your portal account</a>
			</p>
		{/if}
	{/snippet}
</AuthCard>

{#if erasing}<EraserWipe />{/if}

<style>
	.login-form {
		display: grid;
		justify-items: center;
		max-inline-size: var(--size-auth-form);
		gap: var(--space-s);
		inline-size: 100%;
	}

	.login-balance {
		block-size: calc(var(--font-size-label) * var(--line-height-body) + var(--space-2xs));
		margin-block-start: calc(var(--space-s) * -1);
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
