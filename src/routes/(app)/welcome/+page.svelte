<script>
	import ClockInForm from '#lib/organisms/ClockInForm.svelte'
	import Notice from '#lib/atoms/Notice.svelte'

	const { data } = $props()
	const { greeting, projects, clock } = $derived(data)
	const [partOfDay, ...name] = $derived(greeting.split(', '))
</script>

<div class="welcome">
	<p class="welcome-logo" aria-hidden="true">CRE8</p>
	<h1 class="welcome-title">
		{partOfDay}{#if name.length},<br />{name.join(', ')}{/if}
	</h1>

	{#if clock}
		<Notice>You're already clocked in.</Notice>
		<a class="button button-primary" href="/overview">Go to your overview</a>
	{:else}
		<p class="text-script">ready to clock in?</p>
		<ClockInForm {projects}>
			{#snippet secondary()}
				<a class="button button-secondary rough-edge" href="/overview">No, just checking</a>
			{/snippet}
		</ClockInForm>
	{/if}
</div>

<style>
	.welcome {
		display: grid;
		justify-items: center;
		gap: var(--space-m);
		max-inline-size: var(--size-narrow);
		text-align: center;
	}

	.welcome-logo {
		font-family: var(--font-family-display);
		font-size: var(--font-size-project);
		letter-spacing: var(--letter-spacing-display);
	}

	.welcome-title {
		font-size: var(--font-size-welcome);
	}
</style>
