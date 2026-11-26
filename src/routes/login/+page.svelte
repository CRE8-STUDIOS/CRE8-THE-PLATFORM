<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'

	const { data } = $props()
	const { redirectTo, error } = $derived(data)

	const formLink = (/** @type {'freelancer' | 'client'} */ as) => {
		const params = new URLSearchParams({ as })
		if (redirectTo) params.set('redirectTo', redirectTo)
		return `/login/form?${params}`
	}
</script>

<AuthCard title="Login as" intro="choose the one that applies to you">
	{#if error}<p class="auth-message" role="alert">{error}</p>{/if}
	<a class="button button-light login-choice" href={formLink('freelancer')}>Freelancer</a>

	{#snippet bottom()}
		<a class="button button-light login-choice" href={formLink('client')}>Client</a>
	{/snippet}
</AuthCard>

<style>
	.login-choice {
		inline-size: min(100%, var(--size-choice-button));
	}
</style>
