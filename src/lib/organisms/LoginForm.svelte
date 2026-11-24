<script>
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'

	/** @type {{ form: { message?: string, email?: string | null } | null | undefined, redirectTo: string }} */
	const { form, redirectTo } = $props()
</script>

<section class="login-form">
	<FormNotice {form} />
	<form method="POST">
		<Input type="hidden" name="redirectTo" value={redirectTo} />
		<TextField
			label="Email"
			name="email"
			type="email"
			autocomplete="email"
			value={form?.email ?? ''}
			required
		/>
		<TextField
			label="Password"
			name="password"
			type="password"
			autocomplete="current-password"
			required
		/>
		<Button variant="primary">Log in</Button>
	</form>
	<p>New freelancer? <a href="/signup">Create your CRE8 account</a></p>
	<p>Invited as a client? <a href="/portal/signup">Create your portal account</a></p>
</section>
