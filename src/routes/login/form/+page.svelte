<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import LoginForm from '#lib/organisms/LoginForm.svelte'

	const { data, form } = $props()
	const { as, redirectTo, passwordChanged } = $derived(data)
</script>

<AuthCard compact title="Login">
	<LoginForm
		{form}
		{as}
		{redirectTo}
		notice={passwordChanged ? 'Password changed, you can log in now.' : ''}
	/>

	{#snippet after()}
		{#if as === 'client'}
			<p class="login-after">
				Invited as a client? <a href="/portal/signup">Create your portal account</a>
			</p>
		{/if}
	{/snippet}
</AuthCard>

<style>
	.login-after {
		text-transform: uppercase;
	}
</style>
