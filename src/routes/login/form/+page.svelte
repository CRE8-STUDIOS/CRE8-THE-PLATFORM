<script>
	import LoginForm from '#lib/organisms/LoginForm.svelte'

	const { data, form } = $props()
	const { as, redirectTo, passwordChanged } = $derived(data)
</script>

<LoginForm
	{form}
	{as}
	{redirectTo}
	notice={passwordChanged ? 'Password changed, you can log in now.' : ''}
/>
