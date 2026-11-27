<script>
	import AuthCard from '#lib/organisms/AuthCard.svelte'
	import PencilUnderline from '#lib/atoms/PencilUnderline.svelte'

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
	<a
		class="button button-light login-choice login-choice-first has-pencil"
		href={formLink('freelancer')}
	>
		Freelancer<PencilUnderline />
	</a>

	{#snippet bottom()}
		<a class="button button-light login-choice has-pencil" href={formLink('client')}>
			Client<PencilUnderline />
		</a>
	{/snippet}
</AuthCard>

<style>
	.login-choice {
		inline-size: min(100%, var(--size-choice-button));
	}

	.login-choice:hover {
		--rough-edge-background: var(--color-surface);
	}

	.login-choice-first {
		margin-block-start: var(--space-m);
	}
</style>
