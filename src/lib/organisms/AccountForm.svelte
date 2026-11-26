<script>
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'

	/** @type {{ account: { username: string, display_name: string | null, email: string } }} */
	const { account } = $props()
</script>

<section class="account-form card rough-edge">
	<p>Email: {account.email}</p>
	<form method="POST" action="?/save">
		<TextField
			label="Username"
			name="username"
			value={account.username}
			autocomplete="username"
			required
		/>
		<TextField label="Name or company" name="display_name" value={account.display_name ?? ''} />
		<Button variant="primary">Save</Button>
	</form>
</section>
