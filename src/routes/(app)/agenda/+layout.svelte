<script>
	import { page } from '$app/state'
	import AgendaTabs from '#lib/molecules/AgendaTabs.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'

	const { children } = $props()
</script>

<div class="agenda">
	<div class="agenda-bar">
		<AgendaTabs current={page.url.pathname} />
		<OutlineButton href="/agenda/new" aria-label="Add to agenda">
			<svg class="agenda-add-icon" viewBox="0 0 14 14" aria-hidden="true">
				<path d="M7 1v12M1 7h12" />
			</svg>
			Add
		</OutlineButton>
	</div>
	{@render children()}
</div>

<style>
	.agenda {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		min-inline-size: 0;
	}

	.agenda-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.agenda-add-icon {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}
</style>
