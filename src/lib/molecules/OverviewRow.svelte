<script>
	/**
	 * One row in an overview card: a title, a quiet line under it, and a
	 * short state on the right. A link when it has an href.
	 * @type {{ href?: string | null, title: string, line?: string | null, end?: string | null, strong?: boolean }}
	 */
	const { href = null, title, line = null, end = null, strong = false } = $props()
</script>

<li class="overview-row" class:strong>
	<svelte:element this={href ? 'a' : 'div'} class="overview-row-text" {href}>
		<span class="overview-row-title">{title}</span>
		{#if line}<span class="overview-row-line">{line}</span>{/if}
	</svelte:element>
	{#if end}<span class="overview-row-end">{end}</span>{/if}
</li>

<style>
	.overview-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
		padding-block: var(--space-xs);
		border-block-end: var(--line-quiet);
	}

	.overview-row-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs, 0.125rem);
		min-inline-size: 0;
		color: var(--color-text);
		text-decoration: none;
	}

	a.overview-row-text:hover .overview-row-title {
		text-decoration: underline;
	}

	.overview-row-title {
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
	}

	.overview-row-line {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}

	.overview-row-end {
		flex: none;
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.strong .overview-row-title,
	.strong .overview-row-end {
		font-weight: 800;
	}
</style>
