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
	<div class="login-choice">
		<a class="button button-light" href={formLink('freelancer')}>Freelancer</a>
		<a class="button button-light" href={formLink('client')}>Client</a>
	</div>
</AuthCard>

<style>
	.login-choice {
		display: grid;
		gap: var(--space-xs);
		inline-size: min(100%, var(--size-choice-button));
		margin-block-start: var(--space-xs);
	}
</style>
