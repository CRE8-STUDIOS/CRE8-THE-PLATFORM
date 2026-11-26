<script>
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'

	/** @type {{ kind: 'freelancer' | 'client', form: { message?: string, success?: string, name?: string | null, email?: string | null, username?: string | null, display_name?: string | null } | null | undefined }} */
	const { kind, form } = $props()
</script>

<section class="signup-form card rough-edge">
	<FormNotice {form} />
	{#if !form?.success}
		<form method="POST">
			{#if kind === 'freelancer'}
				<TextField
					label="Your name"
					name="name"
					autocomplete="name"
					value={form?.name ?? ''}
					required
				/>
			{/if}
			<TextField
				label="Email"
				name="email"
				type="email"
				autocomplete="email"
				value={form?.email ?? ''}
				required
			/>
			{#if kind === 'client'}
				<TextField
					label="Username"
					name="username"
					autocomplete="username"
					value={form?.username ?? ''}
					pattern={'[A-Za-z0-9_.\\-]{3,30}'}
					hint="3 to 30 characters: letters, numbers, dots, dashes and underscores"
					required
				/>
				<TextField
					label="Your name or company"
					name="display_name"
					value={form?.display_name ?? ''}
				/>
			{/if}
			<TextField
				label="Password"
				name="password"
				type="password"
				autocomplete="new-password"
				minlength={8}
				hint="At least 8 characters"
				required
			/>
			<Button variant="primary">
				{kind === 'client' ? 'Create portal account' : 'Create account'}
			</Button>
		</form>
	{/if}
	<p class="text-small">Already have an account? <a href="/login">Log in</a></p>
</section>
